-- Make start_time nullable for unscheduled tasks
alter table public.events alter column start_time drop not null;
