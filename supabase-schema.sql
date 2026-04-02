-- Run this script in the Supabase SQL Editor.

-- 1. Create a table for widget configurations
create table public.widget_configs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  assistant_name text not null default 'Sales Agent',
  welcome_message text not null default 'Hey! Can I help you find what you''re looking for?',
  personality text not null default 'friendly and helpful',
  primary_color text not null default '#6366f1',
  allow_topics text not null default 'products, pricing, shipping, returns',
  provider text not null default 'groq',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure one config per user for now (or make it many-to-one if you want multiple widgets)
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

-- 3. (Optional) Make config publicly readable if you want the CDN embedding script to read it directly without auth
-- In production, you might create an RPC or a secondary secure way to retrieve this by a public token,
-- but for simplicity you can allow public read using the ID:
create policy "Public can view widget configs"
  on public.widget_configs for select
  using ( true );

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
