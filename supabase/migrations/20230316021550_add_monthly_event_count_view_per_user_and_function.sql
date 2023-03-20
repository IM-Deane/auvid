set check_function_bodies = off;

create or replace view "public"."events_per_user_current_month" as  SELECT events.profile_id,
    count(*) AS event_count
   FROM events
  WHERE (events.created_at >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone))
  GROUP BY events.profile_id;


CREATE OR REPLACE FUNCTION public.get_current_month_event_count()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    event_count_to_return INTEGER;
BEGIN
    SELECT event_count
    INTO event_count_to_return
    FROM events_per_user_current_month
    WHERE events_per_user_current_month.profile_id = auth.uid();
    
    RETURN event_count_to_return;
END;
$function$
;


create policy "Give users access to own folder 1qipc1_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'notes'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1qipc1_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'notes'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1qipc1_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'notes'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1qipc1_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'notes'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



