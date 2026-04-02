-- Run this script in the Supabase SQL Editor.

-- 1. Create a table for widget configurations
create table public.widget_configs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  -- Safe public identifier for CDN embed scripts — does NOT expose user_id
  public_token text unique default encode(gen_random_bytes(16), 'hex'),
  assistant_name text not null default 'Sales Agent',
  welcome_message text not null default 'Hey! Can I help you find what you''re looking for?',
  personality text not null default 'friendly and helpful',
  primary_color text not null default '#6366f1',
  allow_topics text not null default 'products, pricing, shipping, returns',
  provider text not null default 'groq',
  max_discount int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- 2. Setup Row Level Security (RLS)
alter table public.widget_configs enable row level security;

-- Users can only read their own configs
create policy "Users can view own widget config"
  on public.widget_configs for select
  using ( auth.uid() = user_id );

-- Users can insert their own config
create policy "Users can insert own widget config"
  on public.widget_configs for insert
  with check ( auth.uid() = user_id );

-- Users can update their own config
create policy "Users can update own widget config"
  on public.widget_configs for update
  using ( auth.uid() = user_id );

-- ⚠️ DO NOT add a "public can view all" policy here.
-- The embed widget reads config via /api/widget?token=pub_xxx (server-side lookup using service role).
-- This keeps all user data private while still serving the embed script securely.

-- 3. Performance indexes
create index idx_widget_configs_user_id on public.widget_configs(user_id);
create index idx_widget_configs_public_token on public.widget_configs(public_token);

-- 4. Create metrics tracking table
create table public.store_metrics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  total_revenue numeric(10,2) not null default 0.00,
  active_sessions int not null default 0,
  abandoned_carts_recovered int not null default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

alter table public.store_metrics enable row level security;

create policy "Users can view own store metrics"
  on public.store_metrics for select
  using ( auth.uid() = user_id );

create policy "Users can insert own store metrics"
  on public.store_metrics for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own store metrics"
  on public.store_metrics for update
  using ( auth.uid() = user_id );

create index idx_store_metrics_user_id on public.store_metrics(user_id);

-- 5. Create conversations log table
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  session_id text not null,
  message_count int not null default 0,
  status text not null default 'active', -- active, resolved, dropped
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.conversations enable row level security;

create policy "Users can view own conversations"
  on public.conversations for select
  using ( auth.uid() = user_id );

create index idx_conversations_user_id on public.conversations(user_id);
create index idx_conversations_created_at on public.conversations(created_at desc);

-- 6. Audit log table for security visibility
create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  action text not null,      -- e.g. 'widget.update', 'chat.request', 'auth.signin'
  metadata jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.audit_logs enable row level security;

create policy "Users can view own audit logs"
  on public.audit_logs for select
  using ( auth.uid() = user_id );

create index idx_audit_logs_user_id on public.audit_logs(user_id, created_at desc);

