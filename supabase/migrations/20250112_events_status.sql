-- Add status and url columns to events table if they don't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'events' and column_name = 'status') then
        alter table events add column status text default 'pending';
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'events' and column_name = 'url') then
        alter table events add column url text;
    end if;
end $$;
