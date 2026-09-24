-- ============================================================================
-- CarbonTrail — application RPC functions (run this in the Supabase SQL editor)
-- ============================================================================
-- Prereq check: the app is already pointed at THIS project (hoqmaxqnxlmjrhekqpgw)
-- via project envs. The DB schema was compiled from the project spec + live RPC
-- probes, so it should match. If ANY column name below differs from your actual
-- schema, adjust it FIRST — the functions will error loudly otherwise.
--
-- Assumed columns (verify in Table Editor):
--   profiles(id, username, full_name, avatar_url, bio, level, xp, streak,
--            longest_streak, weekly_carbon_budget, created_at, updated_at)
--   carbon_factors(id, activity_type, category, carbon_kg, carbon_saved_kg)
--   activity_logs(user_id, category, activity_type, description, carbon_kg,
--                 carbon_saved_kg, activity_date, metadata, created_at)
--   missions(title, description, mission_type, target_value, xp_reward,
--            carbon_reward, period, start_date, end_date, is_active, icon, badge_icon)
--   user_missions(user_id, mission_id, progress, completed, completed_at, xp_claimed)
--   community_goals(id, title, description, target_value, current_value, unit,
--                   start_date, end_date, is_active)
--   friendships(sender_id, receiver_id, status, created_at)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0) Auto-create a profile row when a new auth user registers
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, username, full_name, level, xp, streak, longest_streak, weekly_carbon_budget
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', null),
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    1,
    0,
    0,
    0,
    30
  );
  return new;
end;
$$;

do $$
begin
  if to_regprocedure('public.handle_new_user()') is not null
     and not exists (
       select 1 from pg_trigger
       where tgname = 'on_auth_user_created' and tgrelid = 'auth.users'::regclass
     ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  end if;
end;
$$;

-- Safety: keep the function callable only by authenticated users
revoke execute on function public.handle_new_user() from public, anon;
grant execute on function public.handle_new_user() to authenticated;

-- ----------------------------------------------------------------------------
-- 9) update_my_profile — edit your own profile (server-side, RLS-safe)
-- ----------------------------------------------------------------------------
create or replace function public.update_my_profile(
  p_username text default null,
  p_full_name text default null,
  p_avatar_url text default null,
  p_bio text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.profiles;
begin
  update public.profiles
     set username     = coalesce(p_username, username),
         full_name    = coalesce(p_full_name, full_name),
         avatar_url   = coalesce(p_avatar_url, avatar_url),
         bio          = coalesce(p_bio, bio),
         updated_at   = now()
   where id = auth.uid()
   returning * into v_row;

  if v_row.id is null then
    insert into public.profiles (
      id, username, full_name, avatar_url, bio,
      level, xp, streak, longest_streak, weekly_carbon_budget
    )
    values (
      auth.uid(), p_username, p_full_name, p_avatar_url, p_bio,
      1, 0, 0, 0, 30
    )
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

revoke execute on function public.update_my_profile(text, text, text, text) from public, anon;
grant execute on function public.update_my_profile(text, text, text, text) to authenticated;

-- ----------------------------------------------------------------------------
-- Helpers shared by mission progress + logging
-- ----------------------------------------------------------------------------
create or replace function public.period_start(p_period text)
returns timestamptz
language sql
immutable
as $$
  select case p_period
    when 'daily'   then date_trunc('day', now())
    when 'weekly'  then date_trunc('week', now())
    when 'monthly' then date_trunc('month', now())
    else null
  end;
$$;

create or replace function public.recalc_mission(p_uid uuid, p_mission_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  m public.missions%rowtype;
  v_start timestamptz;
  v_progress numeric := 0;
  v_prev_completed boolean := false;
begin
  select * into m from public.missions where id = p_mission_id;
  if m.id is null then
    raise exception 'Mission % does not exist', p_mission_id;
  end if;

  v_start := public.period_start(m.period);

  case m.mission_type
    when 'activity_count' then
      select count(*) into v_progress
        from public.activity_logs
       where user_id = p_uid
         and (v_start is null or created_at >= v_start);
    when 'carbon_reduction' then
      select coalesce(sum(carbon_saved_kg), 0) into v_progress
        from public.activity_logs
       where user_id = p_uid
         and (v_start is null or created_at >= v_start);
    when 'streak' then
      select coalesce(streak, 0) into v_progress
        from public.profiles where id = p_uid;
    else
      v_progress := 0;
  end case;

  select coalesce(completed, false) into v_prev_completed
    from public.user_missions
   where user_id = p_uid and mission_id = p_mission_id;

  insert into public.user_missions (user_id, mission_id, progress, completed, completed_at, xp_claimed)
  values (p_uid, p_mission_id, v_progress, v_progress >= m.target_value,
          case when v_progress >= m.target_value then now() else null end, false)
  on conflict do nothing;

  update public.user_missions
     set progress     = v_progress,
         completed    = v_progress >= m.target_value,
         completed_at = case
            when v_progress >= m.target_value and not v_prev_completed then now()
            else completed_at
         end
   where user_id = p_uid and mission_id = p_mission_id;

  return true;
end;
$$;

create or replace function public.recalc_all_missions(p_uid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  m record;
begin
  for m in select id from public.missions where is_active loop
    perform public.recalc_mission(p_uid, m.id);
  end loop;
end;
$$;

revoke execute on function public.period_start(text), public.recalc_mission(uuid, uuid), public.recalc_all_missions(uuid) from public, anon;
grant execute on function public.period_start(text), public.recalc_mission(uuid, uuid), public.recalc_all_missions(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- 2) update_mission_progress — recompute a mission from real logs (never trust
--    client-supplied progress)
-- ----------------------------------------------------------------------------
create or replace function public.update_mission_progress(p_mission_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return public.recalc_mission(auth.uid(), p_mission_id);
end;
$$;

revoke execute on function public.update_mission_progress(uuid) from public, anon;
grant execute on function public.update_mission_progress(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- 1) log_carbon_activity — the heart of quick logging. Looks up the factor,
--    inserts the log, then recomputes all the user's active missions.
-- ----------------------------------------------------------------------------
create or replace function public.log_carbon_activity(
  p_category text,
  p_activity_type text,
  p_description text default null,
  p_metadata jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  f public.carbon_factors%rowtype;
  v_log public.activity_logs;
begin
  select * into f
    from public.carbon_factors
   where lower(activity_type) = lower(p_activity_type)
   limit 1;

  if f.activity_type is null then
    raise exception 'No carbon factor found for activity_type "%". Seed public.carbon_factors first.', p_activity_type;
  end if;

  insert into public.activity_logs (
    user_id, category, activity_type, description,
    carbon_kg, carbon_saved_kg, activity_date, metadata, created_at
  )
  values (
    auth.uid(), p_category, p_activity_type, p_description,
    coalesce(f.carbon_kg, 0), coalesce(f.carbon_saved_kg, 0),
    now(), p_metadata, now()
  )
  returning * into v_log;

  perform public.recalc_all_missions(auth.uid());

  return to_jsonb(v_log);
end;
$$;

revoke execute on function public.log_carbon_activity(text, text, text, jsonb) from public, anon;
grant execute on function public.log_carbon_activity(text, text, text, jsonb) to authenticated;

-- ----------------------------------------------------------------------------
-- 3) claim_mission_xp — validate completion then award XP + level up
-- ----------------------------------------------------------------------------
create or replace function public.claim_mission_xp(p_mission_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_xp integer;
begin
  if exists (
    select 1 from public.missions m
    join public.user_missions um on um.mission_id = m.id
    where um.user_id = auth.uid()
      and um.mission_id = p_mission_id
      and um.completed
      and um.xp_claimed
  ) then
    raise exception 'XP already claimed for this mission';
  end if;

  if not exists (
    select 1 from public.user_missions
    where user_id = auth.uid() and mission_id = p_mission_id and completed
  ) then
    raise exception 'Mission is not completed yet';
  end if;

  select xp_reward into v_xp from public.missions where id = p_mission_id;

  update public.profiles
     set xp       = xp + v_xp,
         level    = 1 + floor((xp + v_xp) / 500),
         updated_at = now()
   where id = auth.uid();

  update public.user_missions
     set xp_claimed = true
   where user_id = auth.uid() and mission_id = p_mission_id;

  return jsonb_build_object('claimed_xp', v_xp, 'mission_id', p_mission_id);
end;
$$;

revoke execute on function public.claim_mission_xp(uuid) from public, anon;
grant execute on function public.claim_mission_xp(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- 4) Community reads
-- ----------------------------------------------------------------------------
create or replace function public.get_community_goals()
returns table (
  id uuid,
  title text,
  description text,
  target_value numeric,
  current_value numeric,
  unit text,
  end_date timestamptz,
  is_active boolean
)
language sql
security definer
set search_path = public
as $$
  select g.id, g.title, g.description, g.target_value,
         coalesce(g.current_value, 0) as current_value,
         coalesce(g.unit, '') as unit, g.end_date, coalesce(g.is_active, true)
    from public.community_goals g
   order by g.is_active desc, g.end_date asc nulls last;
$$;

create or replace function public.get_community_leaderboard()
returns table (
  id uuid,
  username text,
  full_name text,
  carbon_saved_kg numeric
)
language sql
security definer
set search_path = public
as $$
  select p.id, p.username, p.full_name,
         coalesce(sum(l.carbon_saved_kg), 0) as carbon_saved_kg
    from public.profiles p
    left join public.activity_logs l on l.user_id = p.id
   group by p.id
   order by carbon_saved_kg desc
   limit 20;
$$;

create or replace function public.get_community_activity()
returns table (
  id uuid,
  username text,
  full_name text,
  category text,
  activity_type text,
  description text,
  carbon_kg numeric,
  carbon_saved_kg numeric,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select l.id, p.username, p.full_name, l.category, l.activity_type,
         l.description, l.carbon_kg, l.carbon_saved_kg, l.created_at
    from public.activity_logs l
    join public.profiles p on p.id = l.user_id
   order by l.created_at desc
   limit 25;
$$;

revoke execute on function
  public.get_community_goals(),
  public.get_community_leaderboard(),
  public.get_community_activity()
from public, anon;
grant execute on function
  public.get_community_goals(),
  public.get_community_leaderboard(),
  public.get_community_activity()
to authenticated;

-- ----------------------------------------------------------------------------
-- 7/8) Friendships
-- ----------------------------------------------------------------------------
create or replace function public.send_friend_request(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id = auth.uid() then
    raise exception 'You cannot add yourself as a friend';
  end if;
  insert into public.friendships (sender_id, receiver_id, status)
  values (auth.uid(), p_user_id, 'pending')
  on conflict do nothing;
end;
$$;

create or replace function public.accept_friend_request(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.friendships
     set status = 'accepted'
   where receiver_id = auth.uid()
     and sender_id = p_user_id
     and status = 'pending';
end;
$$;

revoke execute on function public.send_friend_request(uuid), public.accept_friend_request(uuid) from public, anon;
grant execute on function public.send_friend_request(uuid), public.accept_friend_request(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- Optional seed: carbon factors (only inserted if the table is EMPTY)
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from public.carbon_factors limit 1) then
    insert into public.carbon_factors (activity_type, category, carbon_kg, carbon_saved_kg)
    values
      ('car',          'transport', 2.31, 0),
      ('motorcycle',   'transport', 0.88, 0),
      ('bus',          'transport', 0.55, 0),
      ('bicycle',      'transport', 0,    1.80),
      ('walking',      'transport', 0,    1.20),
      ('beef',         'food',      6.00, 0),
      ('chicken',      'food',      2.50, 0),
      ('vegetarian',   'food',      0,    1.20),
      ('vegan',        'food',      0,    2.00),
      ('air conditioning', 'home',  1.50, 0),
      ('LED',          'home',      0,    0.60);
  end if;
end;
$$;