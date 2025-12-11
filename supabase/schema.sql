-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  full_name text,
  university text,
  major text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- NOTES
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'Untitled',
  content jsonb, -- TipTap JSON content
  folder text default 'General',
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.notes enable row level security;

create policy "Users can crud own notes" on public.notes
  for all using (auth.uid() = user_id);


-- EVENTS (Schedule)
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  is_all_day boolean default false,
  type text check (type in ('class', 'task', 'exam', 'deadline')),
  course text,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.events enable row level security;

create policy "Users can crud own events" on public.events
  for all using (auth.uid() = user_id);


-- RESOURCES (Vault)
create table public.resources (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  type text check (type in ('link', 'file')),
  url text, -- For links or storage path
  course text,
  meta text, -- e.g. "YouTube", "2.4 MB"
  image_url text, -- OG image or thumbnail
  tag_label text,
  tag_color text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.resources enable row level security;

create policy "Users can crud own resources" on public.resources
  for all using (auth.uid() = user_id);


-- CHATS (AI Lab)
create table public.chats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'New Chat',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.chats enable row level security;

create policy "Users can crud own chats" on public.chats
  for all using (auth.uid() = user_id);

create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('user', 'assistant')),
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.messages enable row level security;

create policy "Users can crud own messages" on public.messages
  for all using (auth.uid() = user_id);


-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('vault_files', 'vault_files', false)
on conflict (id) do nothing;

-- Storage Policies (Avatars)
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );
  
create policy "Users can update their own avatar"
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'avatars' );

-- Storage Policies (Vault Files - Private)
create policy "Users can view own vault files"
  on storage.objects for select
  using ( bucket_id = 'vault_files' and auth.uid() = owner );

create policy "Users can upload vault files"
  on storage.objects for insert
  with check ( bucket_id = 'vault_files' and auth.uid() = owner );

create policy "Users can delete own vault files"
  on storage.objects for delete
  using ( bucket_id = 'vault_files' and auth.uid() = owner );
