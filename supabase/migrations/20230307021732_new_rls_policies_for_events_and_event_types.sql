create policy "Authenticated users can insert events"
on "public"."events"
as permissive
for insert
to authenticated
with check (true);


create policy "Users can view their own events"
on "public"."events"
as permissive
for select
to public
using ((auth.uid() = profile_id));


create policy "Authenticated users can insert note events"
on "public"."notes"
as permissive
for insert
to authenticated
with check (true);


create policy "Users can view their own note events"
on "public"."notes"
as permissive
for select
to public
using ((auth.uid() = ( SELECT events.profile_id
   FROM events
  WHERE (events.id = notes.event_id))));


create policy "Authenticated users can insert summary events"
on "public"."summaries"
as permissive
for insert
to authenticated
with check (true);


create policy "Users can view their own summary events"
on "public"."summaries"
as permissive
for select
to public
using ((auth.uid() = ( SELECT events.profile_id
   FROM events
  WHERE (events.id = summaries.event_id))));


create policy "Authenticated users can insert transcription events"
on "public"."transcriptions"
as permissive
for insert
to authenticated
with check (true);


create policy "Users can view their own transcription events"
on "public"."transcriptions"
as permissive
for select
to public
using ((auth.uid() = ( SELECT events.profile_id
   FROM events
  WHERE (events.id = transcriptions.event_id))));



