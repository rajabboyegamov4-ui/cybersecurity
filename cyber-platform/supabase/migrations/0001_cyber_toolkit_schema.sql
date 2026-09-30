-- ============================================================
-- Cyber Platform — Supabase schema
-- profiles, tool_history, progress + Row Level Security
-- Yangi loyihada qayta yaratish: Supabase SQL Editor'da shu faylni ishga tushiring.
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  created_at timestamptz not null default now()
);

-- Xavfsizlik-vositalari tarixi.
-- DIQQAT: hech qachon haqiqiy maxfiy ma'lumot (masalan parolning o'zi) saqlanmaydi —
-- faqat maxfiy bo'lmagan qisqacha xulosa.
create table if not exists public.tool_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  tool text not null check (tool in ('password','hash','encode','url','scan','headers')),
  title text,
  summary text,
  meta jsonb,
  created_at timestamptz not null default now()
);
create index if not exists tool_history_user_time on public.tool_history(user_id, created_at desc);

-- Kiber Darslik holatini (streak, badges, CTF, darslar) bulutda saqlash (ixtiyoriy).
create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ============ Row Level Security ============
alter table public.profiles enable row level security;
alter table public.tool_history enable row level security;
alter table public.progress enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "history_select_own" on public.tool_history for select using (auth.uid() = user_id);
create policy "history_insert_own" on public.tool_history for insert with check (auth.uid() = user_id);
create policy "history_delete_own" on public.tool_history for delete using (auth.uid() = user_id);

create policy "progress_select_own" on public.progress for select using (auth.uid() = user_id);
create policy "progress_insert_own" on public.progress for insert with check (auth.uid() = user_id);
create policy "progress_update_own" on public.progress for update using (auth.uid() = user_id);

-- ============ Ro'yxatdan o'tganda profil avtomatik yaratiladi ============
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger funksiyasi API orqali chaqirilmasligi kerak — faqat trigger ishlatadi.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
