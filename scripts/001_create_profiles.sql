-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  plan text default 'free' check (plan in ('free', 'pro')),
  prompts_used_this_month integer default 0,
  month_reset_date timestamp with time zone default now(),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Create saved_prompts table
create table if not exists public.saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  prompt_en text not null,
  prompt_pt text,
  style text,
  character text,
  action text,
  setting text,
  lighting text,
  composition text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for saved_prompts
alter table public.saved_prompts enable row level security;

-- RLS policies for saved_prompts
create policy "prompts_select_own" on public.saved_prompts for select using (auth.uid() = user_id);
create policy "prompts_insert_own" on public.saved_prompts for insert with check (auth.uid() = user_id);
create policy "prompts_update_own" on public.saved_prompts for update using (auth.uid() = user_id);
create policy "prompts_delete_own" on public.saved_prompts for delete using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists idx_saved_prompts_user_id on public.saved_prompts(user_id);
create index if not exists idx_saved_prompts_created_at on public.saved_prompts(created_at desc);
