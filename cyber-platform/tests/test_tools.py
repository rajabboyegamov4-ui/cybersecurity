import os
import sys

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app  # noqa: E402
from tools import encoding, hashing, password, port_scanner, url_analyzer  # noqa: E402
from tools.errors import ToolError  # noqa: E402


@pytest.fixture
def client():
    app.config["TESTING"] = True
    return app.test_client()


# ---------- Parol ----------
def test_common_password_is_very_weak():
    r = password.analyze("password")
    assert r["score"] == 0
    assert {"key": "common"} in r["issues"]


def test_strong_password():
    r = password.analyze("T0g'-Olma!Daryo#2x9Kp")
    assert r["score"] >= 3


# ---------- Hash ----------
def test_md5_generation():
    assert hashing.generate("password")["md5"] == "5f4dcc3b5aa765d61d8327deb882cf99"


def test_identify_md5_and_bcrypt():
    assert "MD5" in hashing.identify("5f4dcc3b5aa765d61d8327deb882cf99")["candidates"]
    bc = "$2b$12$" + "a" * 53
    assert hashing.identify(bc)["candidates"] == ["bcrypt"]


# ---------- Kodlash ----------
@pytest.mark.parametrize("mode", encoding.MODES)
def test_roundtrip(mode):
    text = "Salom, Dunyo! O'zbekiston 2026"
    assert encoding.decode(encoding.encode(text, mode), mode) == text


def test_bad_binary():
    with pytest.raises(ToolError):
        encoding.decode("0102", "binary")


# ---------- URL ----------
def test_phishing_url_high():
    r = url_analyzer.analyze("http://paypa1-login.secure-verify.xyz/account/verify")
    assert r["level"] == "high"
    assert any(f["key"] == "lookalike" for f in r["findings"])


def test_clean_url_low():
    r = url_analyzer.analyze("https://github.com/")
    assert r["level"] == "low"


def test_ip_url():
    r = url_analyzer.analyze("http://192.168.1.5/login")
    assert any(f["key"] == "ip" for f in r["findings"])


# ---------- Port scanner ----------
def test_scanner_blocks_other_hosts():
    with pytest.raises(ToolError) as e:
        port_scanner.scan("google.com")
    assert e.value.key == "scan_forbidden"


def test_scanner_localhost():
    r = port_scanner.scan("127.0.0.1", ports=[1, 2], timeout=0.2)
    assert r["scanned"] == 2


# ---------- API ----------
def test_hub_page(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "Content-Security-Policy" in r.headers


def test_toolkit_page(client):
    r = client.get("/toolkit")
    assert r.status_code == 200


def test_api_password(client):
    r = client.post("/api/password", json={"password": "qwerty"})
    assert r.get_json()["score"] == 0


def test_api_scan_forbidden(client):
    r = client.post("/api/scan", json={"host": "8.8.8.8"})
    assert r.status_code == 403
    assert r.get_json()["error"] == "scan_forbidden"


def test_api_headers_ssrf_blocked(client):
    r = client.post("/api/headers", json={"url": "http://127.0.0.1:5000"})
    assert r.status_code == 403
    assert r.get_json()["error"] == "ssrf_blocked"


def test_api_rejects_non_string(client):
    r = client.post("/api/url", json={"url": 123})
    assert r.status_code == 400
    assert r.get_json() == {"error": "not_string", "params": {"field": "url"}}


def test_hash_note_keys():
    assert hashing.identify("5f4dcc3b5aa765d61d8327deb882cf99")["note"] == "weak"
    assert hashing.identify("zzz")["note"] == "unknown"


def test_toolkit_links_internal(client):
    assert b'href="/darslik"' in client.get("/toolkit").data


def test_config_js(client):
    r = client.get("/config.js")
    assert r.status_code == 200
    assert b"CYBER_CONFIG" in r.data
