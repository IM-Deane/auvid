set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_transcription_event(
  event_description text,
  event_meta json,
  event_type public.transcription_type
)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
  new_event_id uuid;
BEGIN
  INSERT INTO public.events
  (
    description,
    profile_id,
    metadata
    )
  VALUES
  (
    event_description,
    auth.uid(),
    event_meta
    )
  returning id into new_event_id;

  -- now create transcription event
  INSERT INTO public.transcriptions
  (
    event_id,
    type
  )
  VALUES (
    new_event_id,
    event_type
  );

  return new_event_id;
END;$function$
;


CREATE OR REPLACE FUNCTION public.handle_new_note_event(
  event_description text,
  event_meta json,
  event_type public.note_action_type,
  note_has_summary boolean
)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
  new_event_id uuid;
BEGIN
  INSERT INTO public.events
  (
    description,
    profile_id,
    metadata
    )
  VALUES
  (
    event_description,
    auth.uid(),
    event_meta
    )
  returning id into new_event_id;

  -- now create note event
  INSERT INTO public.notes
  (
    event_id,
    type,
    has_summary
  )
  VALUES
  (
    new_event_id,
    event_type,
    note_has_summary
  );

  return new_event_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_summary_event(
  event_description text,
  event_meta json
)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
  new_event_id uuid;
BEGIN
  INSERT INTO public.events
  (
    description,
    profile_id,
    metadata
    )
  VALUES
  (
    event_description,
    auth.uid(),
    event_meta
    )
  returning id into new_event_id;

  -- now create summary event
  INSERT INTO public.summaries
  (
    event_id
  )
  VALUES
  (
    new_event_id
  );

  return new_event_id;
END;$function$
;