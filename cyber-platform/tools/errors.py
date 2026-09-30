"""Tilga bog'liq bo'lmagan xato: backend kalit qaytaradi, frontend uni tanlangan tilga tarjima qiladi."""


class ToolError(Exception):
    def __init__(self, key: str, status: int = 400, **params):
        super().__init__(key)
        self.key = key
        self.status = status
        self.params = params

    def to_dict(self):
        return {"error": self.key, "params": self.params}
