-- Add preferences column to profiles table
alter table profiles
add column preferences jsonb default '{}'::jsonb;

-- Update RLS policies to include preferences access
create policy "Users can update their own preferences." on profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Create function to get user preferences
create or replace function get_user_preferences(user_id uuid)
returns jsonb
language plpgsql
security definer
as $$
begin
  return (
    select preferences
    from profiles
    where id = user_id
  );
end;
$$;

-- Create function to update user preferences
create or replace function update_user_preferences(user_id uuid, new_preferences jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  updated_preferences jsonb;
begin
  update profiles
  set preferences = new_preferences,
      updated_at = now()
  where id = user_id
  returning preferences into updated_preferences;

  return updated_preferences;
end;
$$;

-- Add validation trigger for preferences
create or replace function validate_preferences()
returns trigger
language plpgsql
as $$
begin
  -- Ensure preferences is an object
  if not jsonb_typeof(new.preferences) = 'object' then
    raise exception 'preferences must be a JSON object';
  end if;

  -- Validate theme preference
  if new.preferences ? 'theme' and not new.preferences->>'theme' in ('light', 'dark', 'system') then
    raise exception 'invalid theme preference';
  end if;

  -- Validate language preference (ISO 639-1 codes)
  if new.preferences ? 'language' and length(new.preferences->>'language') != 2 then
    raise exception 'invalid language code';
  end if;

  -- Validate email notification settings
  if new.preferences ? 'emailNotifications' and not jsonb_typeof(new.preferences->'emailNotifications') = 'object' then
    raise exception 'emailNotifications must be an object';
  end if;

  -- Validate privacy settings
  if new.preferences ? 'privacy' and not jsonb_typeof(new.preferences->'privacy') = 'object' then
    raise exception 'privacy settings must be an object';
  end if;

  -- Validate display preferences
  if new.preferences ? 'display' and not jsonb_typeof(new.preferences->'display') = 'object' then
    raise exception 'display settings must be an object';
  end if;

  return new;
end;
$$;

create trigger validate_preferences_trigger
  before insert or update on profiles
  for each row
  execute function validate_preferences();

-- Add indexes for commonly accessed preferences
create index idx_profiles_theme on profiles ((preferences->>'theme'));
create index idx_profiles_language on profiles ((preferences->>'language'));