"""Cyber Platform — bitta full-stack dastur.

Sahifalar:
  /          → Hub (bosh sahifa)
  /toolkit   → Xavfsizlik vositalari (Flask backend + Supabase tarix)
  /darslik   → Kiber Darslik (10 dars, lab, seyf, daraja)
  /tahlil    → Karyera va tahlil

Auth va tarix Supabase orqali (frontend, RLS bilan). Server maxfiy kalit saqlamaydi —
faqat publishable (anon) kalitni /config.js orqali beradi; u RLS bilan himoyalangan.

Ishga tushirish:
  pip install -r requirements.txt
  cp .env.example .env   # va Supabase qiymatlarini kiriting
  python app.py
"""
import time
from collections import defaultdict, deque
from functools import wraps

from flask import Flask, Response, jsonify, render_template, request

from config import SUPABASE_ANON_KEY, SUPABASE_URL
from tools import encoding, hashing, headers, password, port_scanner, url_analyzer
from tools.errors import ToolError

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 64 * 1024  # 64 KB — katta so'rovlardan himoya

# ---------- Oddiy rate limit (IP bo'yicha, daqiqasiga) ----------
_hits = defaultdict(deque)


def rate_limit(per_minute: int):
    def deco(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            key = (fn.__name__, request.remote_addr)
            now = time.time()
            q = _hits[key]
            while q and now - q[0] > 60:
                q.popleft()
            if len(q) >= per_minute:
                return jsonify(error="rate_limited", params={}), 429
            q.append(now)
            return fn(*args, **kwargs)
        return wrapper
    return deco


def body(field: str, max_len: int = 2000) -> str:
    data = request.get_json(silent=True) or {}
    value = data.get(field, "")
    if not isinstance(value, str):
        raise ToolError("not_string", field=field)
    if len(value) > max_len:
        raise ToolError("too_long", field=field, max=max_len)
    return value


@app.after_request
def security_headers(resp):
    resp.headers["X-Content-Type-Options"] = "nosniff"
    resp.headers["X-Frame-Options"] = "DENY"
    resp.headers["Referrer-Policy"] = "no-referrer"
    # CSP: Supabase (auth/DB) va supabase-js (CDN) uchun ruxsat, qolgani o'zimizniki
    resp.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' data: https://fonts.gstatic.com; "
        "img-src 'self' data:; "
        "connect-src 'self' " + (SUPABASE_URL or "") + " https://*.supabase.co"
    )
    resp.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return resp


@app.errorhandler(ToolError)
def tool_error(e):
    return jsonify(e.to_dict()), e.status


# ---------- Sahifalar ----------
@app.get("/")
def hub():
    return render_template("hub.html")


@app.get("/toolkit")
def toolkit():
    return render_template("toolkit.html")


@app.get("/darslik")
def darslik():
    return app.send_static_file("darslik.html")


@app.get("/tahlil")
def tahlil():
    return app.send_static_file("tahlil.html")


@app.get("/config.js")
def config_js():
    # Publishable kalit frontendga chiqishi mumkin (RLS bilan himoyalangan).
    js = (
        "window.CYBER_CONFIG = {"
        f"supabaseUrl: {SUPABASE_URL!r}, "
        f"supabaseKey: {SUPABASE_ANON_KEY!r}, "
        f"enabled: {str(bool(SUPABASE_URL and SUPABASE_ANON_KEY)).lower()}"
        "};"
    )
    return Response(js, mimetype="application/javascript")


# ---------- Vositalar API (tilga bog'liq emas: kalit qaytaradi) ----------
@app.post("/api/password")
@rate_limit(120)
def api_password():
    return jsonify(password.analyze(body("password", 256)))


@app.post("/api/hash/generate")
@rate_limit(60)
def api_hash_generate():
    return jsonify(hashing.generate(body("text", 10000)))


@app.post("/api/hash/identify")
@rate_limit(60)
def api_hash_identify():
    return jsonify(hashing.identify(body("hash", 500)))


@app.post("/api/encode")
@rate_limit(60)
def api_encode():
    text, mode, action = body("text", 10000), body("mode", 20), body("action", 10)
    if mode not in encoding.MODES:
        raise ToolError("unknown_mode")
    fn = encoding.encode if action == "encode" else encoding.decode
    return jsonify(result=fn(text, mode))


@app.post("/api/url")
@rate_limit(60)
def api_url():
    return jsonify(url_analyzer.analyze(body("url", 2000)))


@app.post("/api/scan")
@rate_limit(5)
def api_scan():
    return jsonify(port_scanner.scan(body("host", 100)))


@app.post("/api/headers")
@rate_limit(10)
def api_headers():
    try:
        return jsonify(headers.check(body("url", 500)))
    except headers.requests.RequestException:
        return jsonify(error="connect_failed", params={}), 502


@app.get("/api/meta")
def api_meta():
    return jsonify(scan_hosts=sorted(port_scanner.ALLOWED_HOSTS))


if __name__ == "__main__":
    # debug=False: prod uchun xavfsiz (debug ochiq qolsa masofadan kod bajarish xavfi bor)
    app.run(host="127.0.0.1", port=5000, debug=False)
