"""Saytning HTTP xavfsizlik sarlavhalarini (security headers) tekshirish."""
import ipaddress
import socket
from urllib.parse import urljoin, urlparse

import requests

from .errors import ToolError

# Tekshiriladigan sarlavhalar. "Nima uchun" izohini frontend tanlangan tilda ko'rsatadi.
CHECKS = [
    "Strict-Transport-Security",
    "Content-Security-Policy",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
]
LEAKY = ["Server", "X-Powered-By", "X-AspNet-Version"]


def _is_private(host: str) -> bool:
    """SSRF'dan himoya: ichki tarmoq manzillariga so'rov yubormaymiz."""
    try:
        for info in socket.getaddrinfo(host, None):
            ip = ipaddress.ip_address(info[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                return True
    except socket.gaierror:
        raise ToolError("dns_failed", 502)
    return False


def check(url: str) -> dict:
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    # Redirectlarni qo'lda kuzatamiz: har bir yangi manzil ham tekshiriladi
    for _ in range(6):
        host = urlparse(url).hostname
        if not host:
            raise ToolError("bad_url")
        if _is_private(host):
            raise ToolError("ssrf_blocked", 403)
        r = requests.get(url, timeout=8, allow_redirects=False, stream=True,
                         headers={"User-Agent": "CyberToolkit/1.0 (learning project)"})
        r.close()
        if r.is_redirect and "Location" in r.headers:
            url = urljoin(url, r.headers["Location"])
            continue
        break
    else:
        raise ToolError("too_many_redirects")

    present = [{"header": h, "value": r.headers[h]} for h in CHECKS if h in r.headers]
    missing = [{"header": h} for h in CHECKS if h not in r.headers]
    leaks = [{"header": h, "value": r.headers[h]} for h in LEAKY if h in r.headers]
    score = round(len(present) / len(CHECKS) * 100)
    grade = "A" if score >= 85 else "B" if score >= 65 else "C" if score >= 45 else "D" if score >= 25 else "F"

    return {
        "final_url": url, "status": r.status_code, "https": url.startswith("https://"),
        "score": score, "grade": grade, "present": present, "missing": missing, "leaks": leaks,
    }
