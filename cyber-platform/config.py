"""Muhit sozlamalari. Maxfiy qiymatlar .env faylidan (repozitoriyga tushmaydi)."""
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv ixtiyoriy; muhit o'zgaruvchilari to'g'ridan-to'g'ri berilishi ham mumkin

# Publishable (anon) kalit — frontendga chiqishi mumkin, RLS bilan himoyalangan.
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
