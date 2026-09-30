"""TCP port scanner — FAQAT ruxsat berilgan manzillar uchun.

Begona serverlarni egasining ruxsatisiz skanerlash qonunga zid.
scanme.nmap.org — Nmap loyihasi mashq uchun ochiq qoldirgan server.
"""
import socket
from concurrent.futures import ThreadPoolExecutor

from .errors import ToolError

ALLOWED_HOSTS = {"127.0.0.1", "localhost", "scanme.nmap.org"}

COMMON_PORTS = {
    21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS", 80: "HTTP", 110: "POP3",
    135: "MS-RPC", 139: "NetBIOS", 143: "IMAP", 443: "HTTPS", 445: "SMB", 993: "IMAPS",
    995: "POP3S", 1433: "MSSQL", 3306: "MySQL", 3389: "RDP", 5000: "Flask/UPnP",
    5432: "PostgreSQL", 5900: "VNC", 6379: "Redis", 8000: "HTTP-alt", 8080: "HTTP-proxy",
    8443: "HTTPS-alt", 9200: "Elasticsearch", 27017: "MongoDB", 31337: "Elite",
}

# Xavfli portlar: qiymat — frontend tarjima qiladigan izoh kaliti
RISKY = {23: "telnet", 21: "ftp", 445: "smb", 3389: "rdp", 6379: "redis", 27017: "mongodb", 5900: "vnc"}


def _check(host: str, port: int, timeout: float) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(timeout)
        return s.connect_ex((host, port)) == 0


def scan(host: str, ports=None, timeout: float = 0.7) -> dict:
    host = host.strip().lower()
    if host not in ALLOWED_HOSTS:
        raise ToolError("scan_forbidden", 403, hosts=", ".join(sorted(ALLOWED_HOSTS)))
    ports = sorted(set(ports or COMMON_PORTS))[:100]
    try:
        ip = socket.gethostbyname(host)
    except socket.gaierror:
        raise ToolError("dns_failed", 502)

    with ThreadPoolExecutor(max_workers=50) as ex:
        results = list(ex.map(lambda p: (p, _check(ip, p, timeout)), ports))

    open_ports = [
        {"port": p, "service": COMMON_PORTS.get(p, "?"), "warning": RISKY.get(p)}
        for p, is_open in results if is_open
    ]
    return {"host": host, "ip": ip, "scanned": len(ports), "open": open_ports}
