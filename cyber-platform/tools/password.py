"""Parol kuchini tahlil qilish: entropiya, zaif naqshlar va taxminiy buzish vaqti.

Natijadagi matnlar kalit ko'rinishida qaytadi (masalan "no_upper"),
frontend ularni tanlangan tilga (uz/ru/en) tarjima qiladi.
"""
import math
import re

COMMON = {
    "123456", "123456789", "12345678", "password", "qwerty", "111111", "123123",
    "abc123", "password1", "1234567", "qwerty123", "iloveyou", "admin", "welcome",
    "000000", "1q2w3e4r", "parol", "parol123", "salom", "salom123", "uzbekistan",
    "toshkent", "letmein", "monkey", "dragon", "football", "qwertyuiop",
}
KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890"]
GUESSES_PER_SEC = 1e10  # oflayn hujum, zamonaviy GPU, tez hash


def _charset_size(pw: str) -> int:
    size = 0
    if re.search(r"[a-z]", pw):
        size += 26
    if re.search(r"[A-Z]", pw):
        size += 26
    if re.search(r"\d", pw):
        size += 10
    if re.search(r"[^A-Za-z0-9]", pw):
        size += 33
    return size


def analyze(pw: str) -> dict:
    if not pw:
        return {"score": 0, "length": 0, "entropy": 0, "crack_seconds": 0, "issues": [{"key": "empty"}]}

    issues = []
    lower = pw.lower()
    if len(pw) < 8:
        issues.append({"key": "short8"})
    elif len(pw) < 12:
        issues.append({"key": "short12"})
    if not re.search(r"[A-Z]", pw):
        issues.append({"key": "no_upper"})
    if not re.search(r"[a-z]", pw):
        issues.append({"key": "no_lower"})
    if not re.search(r"\d", pw):
        issues.append({"key": "no_digit"})
    if not re.search(r"[^A-Za-z0-9]", pw):
        issues.append({"key": "no_symbol"})
    if re.search(r"(.)\1{2,}", pw):
        issues.append({"key": "repeat"})

    penalty = 0
    if lower in COMMON:
        issues.append({"key": "common"})
        penalty = 100
    for row in KEYBOARD_ROWS:
        for i in range(len(row) - 3):
            if row[i:i + 4] in lower:
                issues.append({"key": "keyboard", "pat": row[i:i + 4]})
                penalty += 10
                break
    if re.search(r"(19|20)\d{2}", pw):
        issues.append({"key": "year"})
        penalty += 5

    entropy = len(pw) * math.log2(_charset_size(pw) or 1)
    effective = max(entropy - penalty, 0)
    seconds = (2 ** effective) / GUESSES_PER_SEC / 2
    score = 0 if effective < 28 else 1 if effective < 40 else 2 if effective < 60 else 3 if effective < 80 else 4

    return {
        "score": score,  # 0..4 → frontend: Juda zaif … Kuchli
        "length": len(pw),
        "entropy": round(effective, 1),
        "crack_seconds": seconds,
        "issues": issues,
    }
