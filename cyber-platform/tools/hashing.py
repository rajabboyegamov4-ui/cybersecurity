"""Hash yaratish va hash turini aniqlash."""
import hashlib
import re

ALGORITHMS = ["md5", "sha1", "sha224", "sha256", "sha384", "sha512", "sha3_256", "blake2b"]

HEX_LENGTHS = {
    32: ["MD5", "NTLM", "MD4"],
    40: ["SHA-1", "RIPEMD-160"],
    56: ["SHA-224", "SHA3-224"],
    64: ["SHA-256", "SHA3-256", "BLAKE2s"],
    96: ["SHA-384", "SHA3-384"],
    128: ["SHA-512", "SHA3-512", "BLAKE2b"],
}

PREFIXES = [
    (r"^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$", "bcrypt"),
    (r"^\$argon2(id|i|d)\$", "Argon2"),
    (r"^\$6\$", "SHA-512 crypt"),
    (r"^\$5\$", "SHA-256 crypt"),
    (r"^\$1\$", "MD5 crypt"),
    (r"^\$y\$", "yescrypt"),
    (r"^pbkdf2_sha256\$", "PBKDF2-SHA256"),
]

WEAK = {"MD5", "SHA-1", "NTLM", "MD4", "MD5 crypt"}
SLOW = {"bcrypt", "Argon2", "yescrypt", "SHA-512 crypt", "PBKDF2-SHA256"}


def generate(text: str) -> dict:
    data = text.encode("utf-8")
    return {alg: hashlib.new(alg, data).hexdigest() for alg in ALGORITHMS}


def identify(value: str) -> dict:
    value = value.strip()
    candidates = [name for pattern, name in PREFIXES if re.match(pattern, value)]
    if not candidates and re.fullmatch(r"[0-9a-fA-F]+", value):
        candidates = HEX_LENGTHS.get(len(value), [])

    if not candidates:
        note = "unknown"
    elif candidates[0] in WEAK:
        note = "weak"
    elif candidates[0] in SLOW:
        note = "slow"
    else:
        note = "integrity"
    return {"input_length": len(value), "candidates": candidates, "note": note}
