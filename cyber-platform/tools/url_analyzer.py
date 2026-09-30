"""URL'ni phishing belgilari bo'yicha tahlil qilish (saytga kirmasdan, faqat matn tahlili)."""
import ipaddress
import re
from urllib.parse import urlparse

SUSPICIOUS_TLDS = {"zip", "mov", "xyz", "top", "tk", "ml", "ga", "cf", "gq", "click", "country", "work", "loan", "rest"}
SHORTENERS = {"bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly", "ow.ly", "rb.gy", "shorturl.at"}
BAIT_WORDS = ["login", "verify", "secure", "account", "update", "bank", "confirm", "password",
              "wallet", "signin", "bonus", "prize", "free", "gift", "click", "payme", "click-uz"]
BRANDS = ["paypal", "google", "apple", "microsoft", "facebook", "instagram", "telegram",
          "payme", "uzcard", "humo", "kapitalbank", "click", "netflix", "amazon"]


def analyze(url: str) -> dict:
    url = url.strip()
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", url):
        url = "http://" + url
    p = urlparse(url)
    host = (p.hostname or "").lower()
    findings = []  # (og'irlik, kalit, parametrlar)

    if not host:
        return {"url": url, "host": "", "scheme": p.scheme, "risk": 0, "level": "unknown",
                "findings": [{"weight": 0, "key": "no_host", "params": {}}]}

    def add(weight, key, **params):
        findings.append((weight, key, params))

    try:
        ipaddress.ip_address(host)
        add(25, "ip")
    except ValueError:
        pass

    if p.scheme != "https":
        add(10, "no_https")
    if "@" in p.netloc:
        add(25, "at")
    if host.startswith("xn--") or ".xn--" in host:
        add(25, "punycode")
    if len(url) > 90:
        add(10, "long", n=len(url))
    if host.count(".") >= 4:
        add(15, "subdomains")
    if host.count("-") >= 3:
        add(10, "hyphens")
    tld = host.rsplit(".", 1)[-1]
    if tld in SUSPICIOUS_TLDS:
        add(15, "tld", tld=tld)
    if host in SHORTENERS:
        add(15, "shortener")
    if p.port and p.port not in (80, 443):
        add(10, "port", port=p.port)

    lookalike = host.translate(str.maketrans("01345", "oleas")).replace("rn", "m")
    for brand in BRANDS:
        if brand in lookalike and brand not in host:
            add(30, "lookalike", brand=brand)
            break

    path_q = (p.path + "?" + p.query).lower()
    baits = [w for w in BAIT_WORDS if w in path_q or w in host]
    if baits:
        add(min(5 * len(baits), 20), "bait", words=", ".join(baits))

    registered = ".".join(host.split(".")[-2:])
    for brand in BRANDS:
        if brand in host and not registered.startswith(brand + "."):
            add(25, "brand", brand=brand, domain=registered)
            break

    risk = min(sum(w for w, _, _ in findings), 100)
    level = "low" if risk < 25 else "mid" if risk < 55 else "high"
    findings.sort(key=lambda f: f[0], reverse=True)
    return {
        "url": url, "host": host, "scheme": p.scheme, "risk": risk, "level": level,
        "findings": [{"weight": w, "key": k, "params": prm} for w, k, prm in findings],
    }
