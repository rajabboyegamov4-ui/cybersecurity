"""Kodlash / dekodlash: Base64, Hex, URL, ROT13, Binary."""
import base64
import binascii
import codecs
import urllib.parse

from .errors import ToolError

MODES = ["base64", "hex", "url", "rot13", "binary"]


def encode(text: str, mode: str) -> str:
    if mode == "base64":
        return base64.b64encode(text.encode()).decode()
    if mode == "hex":
        return text.encode().hex()
    if mode == "url":
        return urllib.parse.quote(text, safe="")
    if mode == "rot13":
        return codecs.encode(text, "rot_13")
    if mode == "binary":
        return " ".join(f"{b:08b}" for b in text.encode())
    raise ToolError("unknown_mode")


def decode(text: str, mode: str) -> str:
    text = text.strip()
    try:
        if mode == "base64":
            padded = text + "=" * (-len(text) % 4)
            return base64.b64decode(padded, validate=False).decode("utf-8", errors="replace")
        if mode == "hex":
            return bytes.fromhex(text.replace(" ", "")).decode("utf-8", errors="replace")
        if mode == "url":
            return urllib.parse.unquote(text)
        if mode == "rot13":
            return codecs.decode(text, "rot_13")
        if mode == "binary":
            bits = text.replace(" ", "")
            if len(bits) % 8 or set(bits) - {"0", "1"}:
                raise ValueError
            return bytes(int(bits[i:i + 8], 2) for i in range(0, len(bits), 8)).decode("utf-8", errors="replace")
    except (binascii.Error, ValueError):
        raise ToolError("bad_format", mode=mode)
    raise ToolError("unknown_mode")
