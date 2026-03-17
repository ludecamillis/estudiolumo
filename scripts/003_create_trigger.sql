-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, plan, created_at)
  values (
    new.id,
    new.email,
    'free',
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Create trigger for new users
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
