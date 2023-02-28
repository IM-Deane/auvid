--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: events; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "events";


ALTER SCHEMA "events" OWNER TO "postgres";

--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA "public" OWNER TO "postgres";

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- Name: note_action_type; Type: TYPE; Schema: events; Owner: postgres
--

CREATE TYPE "events"."note_action_type" AS ENUM (
    'uploaded',
    'downloaded',
    'deleted',
    'updated'
);


ALTER TYPE "events"."note_action_type" OWNER TO "postgres";

--
-- Name: transcription_type; Type: TYPE; Schema: events; Owner: postgres
--

CREATE TYPE "events"."transcription_type" AS ENUM (
    'audio',
    'video',
    'meeting'
);


ALTER TYPE "events"."transcription_type" OWNER TO "postgres";

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, first_name, last_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'first_name', new.   raw_user_meta_data->>'last_name',
   new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: events; Type: TABLE; Schema: events; Owner: postgres
--

CREATE TABLE "events"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(6) with time zone,
    "description" "text",
    "profile_id" "uuid" NOT NULL,
    "metadata" "jsonb"
);


ALTER TABLE "events"."events" OWNER TO "postgres";

--
-- Name: notes; Type: TABLE; Schema: events; Owner: postgres
--

CREATE TABLE "events"."notes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "has_summary" boolean DEFAULT false NOT NULL,
    "type" "events"."note_action_type" DEFAULT 'uploaded'::"events"."note_action_type" NOT NULL,
    "event_id" "uuid" NOT NULL
);


ALTER TABLE "events"."notes" OWNER TO "postgres";

--
-- Name: summaries; Type: TABLE; Schema: events; Owner: postgres
--

CREATE TABLE "events"."summaries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL
);


ALTER TABLE "events"."summaries" OWNER TO "postgres";

--
-- Name: transcriptions; Type: TABLE; Schema: events; Owner: postgres
--

CREATE TABLE "events"."transcriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "type" "events"."transcription_type" DEFAULT 'audio'::"events"."transcription_type" NOT NULL
);


ALTER TABLE "events"."transcriptions" OWNER TO "postgres";

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "avatar_url" "text",
    "first_name" "text",
    "last_name" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";

--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: events; Owner: postgres
--

ALTER TABLE ONLY "events"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: events; Owner: postgres
--

ALTER TABLE ONLY "events"."notes"
    ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");


--
-- Name: summaries summaries_pkey; Type: CONSTRAINT; Schema: events; Owner: postgres
--

ALTER TABLE ONLY "events"."summaries"
    ADD CONSTRAINT "summaries_pkey" PRIMARY KEY ("id");


--
-- Name: transcriptions transcriptions_pkey; Type: CONSTRAINT; Schema: events; Owner: postgres
--

ALTER TABLE ONLY "events"."transcriptions"
    ADD CONSTRAINT "transcriptions_pkey" PRIMARY KEY ("id");


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");


--
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");


--
-- Name: events events_profile_id_fkey; Type: FK CONSTRAINT; Schema: events; Owner: postgres
--

ALTER TABLE ONLY "events"."events"
    ADD CONSTRAINT "events_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: notes notes_event_id_fkey; Type: FK CONSTRAINT; Schema: events; Owner: postgres
--

ALTER TABLE ONLY "events"."notes"
    ADD CONSTRAINT "notes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"."events"("id") ON DELETE CASCADE;


--
-- Name: summaries summaries_event_id_fkey; Type: FK CONSTRAINT; Schema: events; Owner: postgres
--

ALTER TABLE ONLY "events"."summaries"
    ADD CONSTRAINT "summaries_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"."events"("id") ON DELETE CASCADE;


--
-- Name: transcriptions transcriptions_event_id_fkey; Type: FK CONSTRAINT; Schema: events; Owner: postgres
--

ALTER TABLE ONLY "events"."transcriptions"
    ADD CONSTRAINT "transcriptions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"."events"("id") ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: events; Type: ROW SECURITY; Schema: events; Owner: postgres
--

ALTER TABLE "events"."events" ENABLE ROW LEVEL SECURITY;

--
-- Name: notes; Type: ROW SECURITY; Schema: events; Owner: postgres
--

ALTER TABLE "events"."notes" ENABLE ROW LEVEL SECURITY;

--
-- Name: summaries; Type: ROW SECURITY; Schema: events; Owner: postgres
--

ALTER TABLE "events"."summaries" ENABLE ROW LEVEL SECURITY;

--
-- Name: transcriptions; Type: ROW SECURITY; Schema: events; Owner: postgres
--

ALTER TABLE "events"."transcriptions" ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles Public profiles are viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);


--
-- Name: profiles Users can insert their own profile.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));


--
-- Name: profiles Users can update own profile.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));


--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA "pgsodium_masks"; Type: ACL; Schema: -; Owner: supabase_admin
--

REVOKE ALL ON SCHEMA "pgsodium_masks" FROM "supabase_admin";
GRANT ALL ON SCHEMA "pgsodium_masks" TO "postgres";


--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


--
-- Name: FUNCTION "algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea", "text"[], "text"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "dashboard_user";


--
-- Name: FUNCTION "crypt"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "dearmor"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_bytes"(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_uuid"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "dashboard_user";


--
-- Name: FUNCTION "pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_key_id"("bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "sign"("payload" "json", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "try_cast_double"("inp" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_decode"("data" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_encode"("data" "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1mc"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v3"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v4"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v5"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_nil"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_dns"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_oid"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_url"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_x500"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "dashboard_user";


--
-- Name: FUNCTION "verify"("token" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "comment_directive"("comment_" "text"); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "service_role";


--
-- Name: FUNCTION "exception"("message" "text"); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "service_role";


--
-- Name: FUNCTION "get_schema_version"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "service_role";


--
-- Name: FUNCTION "increment_schema_version"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "service_role";


--
-- Name: TABLE "key"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON TABLE "pgsodium"."key" FROM "supabase_admin";
GRANT ALL ON TABLE "pgsodium"."key" TO "postgres";


--
-- Name: TABLE "valid_key"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON TABLE "pgsodium"."valid_key" FROM "supabase_admin";
GRANT ALL ON TABLE "pgsodium"."valid_key" TO "postgres";


--
-- Name: FUNCTION "crypto_aead_det_decrypt"("ciphertext" "bytea", "additional" "bytea", "key" "bytea", "nonce" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_det_decrypt"("ciphertext" "bytea", "additional" "bytea", "key" "bytea", "nonce" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_decrypt"("ciphertext" "bytea", "additional" "bytea", "key" "bytea", "nonce" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea"); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea") TO "service_role";


--
-- Name: FUNCTION "crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key" "bytea", "nonce" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key" "bytea", "nonce" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key" "bytea", "nonce" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea"); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea") TO "service_role";


--
-- Name: FUNCTION "crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_aead_det_keygen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_det_keygen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_keygen"() TO "service_role";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_keygen"() TO "postgres";


--
-- Name: FUNCTION "crypto_aead_det_noncegen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_det_noncegen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_noncegen"() TO "postgres";


--
-- Name: FUNCTION "crypto_aead_ietf_decrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_decrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_decrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_aead_ietf_decrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_decrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_decrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_aead_ietf_encrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_encrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_encrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_aead_ietf_encrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_encrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_encrypt"("message" "bytea", "additional" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_aead_ietf_keygen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_keygen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_keygen"() TO "postgres";


--
-- Name: FUNCTION "crypto_aead_ietf_noncegen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_noncegen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_ietf_noncegen"() TO "postgres";


--
-- Name: FUNCTION "crypto_auth"("message" "bytea", "key" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth"("message" "bytea", "key" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth"("message" "bytea", "key" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_auth"("message" "bytea", "key_id" bigint, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth"("message" "bytea", "key_id" bigint, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth"("message" "bytea", "key_id" bigint, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_auth_hmacsha256"("message" "bytea", "secret" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha256"("message" "bytea", "secret" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha256"("message" "bytea", "secret" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_auth_hmacsha256"("message" "bytea", "key_id" bigint, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha256"("message" "bytea", "key_id" bigint, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha256"("message" "bytea", "key_id" bigint, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_auth_hmacsha256_keygen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha256_keygen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha256_keygen"() TO "postgres";


--
-- Name: FUNCTION "crypto_auth_hmacsha256_verify"("hash" "bytea", "message" "bytea", "secret" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha256_verify"("hash" "bytea", "message" "bytea", "secret" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha256_verify"("hash" "bytea", "message" "bytea", "secret" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_auth_hmacsha256_verify"("hash" "bytea", "message" "bytea", "key_id" bigint, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha256_verify"("hash" "bytea", "message" "bytea", "key_id" bigint, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha256_verify"("hash" "bytea", "message" "bytea", "key_id" bigint, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_auth_hmacsha512"("message" "bytea", "secret" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha512"("message" "bytea", "secret" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha512"("message" "bytea", "secret" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_auth_hmacsha512"("message" "bytea", "key_id" bigint, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha512"("message" "bytea", "key_id" bigint, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha512"("message" "bytea", "key_id" bigint, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_auth_hmacsha512_verify"("hash" "bytea", "message" "bytea", "secret" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha512_verify"("hash" "bytea", "message" "bytea", "secret" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha512_verify"("hash" "bytea", "message" "bytea", "secret" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_auth_hmacsha512_verify"("hash" "bytea", "message" "bytea", "key_id" bigint, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha512_verify"("hash" "bytea", "message" "bytea", "key_id" bigint, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_hmacsha512_verify"("hash" "bytea", "message" "bytea", "key_id" bigint, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_auth_keygen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_keygen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_keygen"() TO "postgres";


--
-- Name: FUNCTION "crypto_auth_verify"("mac" "bytea", "message" "bytea", "key" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_verify"("mac" "bytea", "message" "bytea", "key" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_verify"("mac" "bytea", "message" "bytea", "key" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_auth_verify"("mac" "bytea", "message" "bytea", "key_id" bigint, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_auth_verify"("mac" "bytea", "message" "bytea", "key_id" bigint, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_auth_verify"("mac" "bytea", "message" "bytea", "key_id" bigint, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_box"("message" "bytea", "nonce" "bytea", "public" "bytea", "secret" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_box"("message" "bytea", "nonce" "bytea", "public" "bytea", "secret" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_box"("message" "bytea", "nonce" "bytea", "public" "bytea", "secret" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_box_new_keypair"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_box_new_keypair"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_box_new_keypair"() TO "postgres";


--
-- Name: FUNCTION "crypto_box_noncegen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_box_noncegen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_box_noncegen"() TO "postgres";


--
-- Name: FUNCTION "crypto_box_open"("ciphertext" "bytea", "nonce" "bytea", "public" "bytea", "secret" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_box_open"("ciphertext" "bytea", "nonce" "bytea", "public" "bytea", "secret" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_box_open"("ciphertext" "bytea", "nonce" "bytea", "public" "bytea", "secret" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_box_seed_new_keypair"("seed" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_box_seed_new_keypair"("seed" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_box_seed_new_keypair"("seed" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_generichash"("message" "bytea", "key" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_generichash"("message" "bytea", "key" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_generichash"("message" "bytea", "key" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_generichash_keygen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_generichash_keygen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_generichash_keygen"() TO "postgres";


--
-- Name: FUNCTION "crypto_kdf_derive_from_key"("subkey_size" bigint, "subkey_id" bigint, "context" "bytea", "primary_key" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_kdf_derive_from_key"("subkey_size" bigint, "subkey_id" bigint, "context" "bytea", "primary_key" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_kdf_derive_from_key"("subkey_size" bigint, "subkey_id" bigint, "context" "bytea", "primary_key" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_kdf_keygen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_kdf_keygen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_kdf_keygen"() TO "postgres";


--
-- Name: FUNCTION "crypto_kx_new_keypair"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_kx_new_keypair"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_kx_new_keypair"() TO "postgres";


--
-- Name: FUNCTION "crypto_kx_new_seed"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_kx_new_seed"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_kx_new_seed"() TO "postgres";


--
-- Name: FUNCTION "crypto_kx_seed_new_keypair"("seed" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_kx_seed_new_keypair"("seed" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_kx_seed_new_keypair"("seed" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_secretbox"("message" "bytea", "nonce" "bytea", "key" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_secretbox"("message" "bytea", "nonce" "bytea", "key" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_secretbox"("message" "bytea", "nonce" "bytea", "key" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_secretbox"("message" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_secretbox"("message" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_secretbox"("message" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_secretbox_keygen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_secretbox_keygen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_secretbox_keygen"() TO "postgres";


--
-- Name: FUNCTION "crypto_secretbox_noncegen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_secretbox_noncegen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_secretbox_noncegen"() TO "postgres";


--
-- Name: FUNCTION "crypto_secretbox_open"("ciphertext" "bytea", "nonce" "bytea", "key" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_secretbox_open"("ciphertext" "bytea", "nonce" "bytea", "key" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_secretbox_open"("ciphertext" "bytea", "nonce" "bytea", "key" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_secretbox_open"("message" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_secretbox_open"("message" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_secretbox_open"("message" "bytea", "nonce" "bytea", "key_id" bigint, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_shorthash"("message" "bytea", "key" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_shorthash"("message" "bytea", "key" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_shorthash"("message" "bytea", "key" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_shorthash_keygen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_shorthash_keygen"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_shorthash_keygen"() TO "postgres";


--
-- Name: FUNCTION "crypto_sign_final_create"("state" "bytea", "key" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_sign_final_create"("state" "bytea", "key" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_sign_final_create"("state" "bytea", "key" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_sign_final_verify"("state" "bytea", "signature" "bytea", "key" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_sign_final_verify"("state" "bytea", "signature" "bytea", "key" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_sign_final_verify"("state" "bytea", "signature" "bytea", "key" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_sign_init"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_sign_init"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_sign_init"() TO "postgres";


--
-- Name: FUNCTION "crypto_sign_new_keypair"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_sign_new_keypair"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_sign_new_keypair"() TO "postgres";


--
-- Name: FUNCTION "crypto_sign_update"("state" "bytea", "message" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_sign_update"("state" "bytea", "message" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_sign_update"("state" "bytea", "message" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_sign_update_agg1"("state" "bytea", "message" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_sign_update_agg1"("state" "bytea", "message" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_sign_update_agg1"("state" "bytea", "message" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_sign_update_agg2"("cur_state" "bytea", "initial_state" "bytea", "message" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_sign_update_agg2"("cur_state" "bytea", "initial_state" "bytea", "message" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_sign_update_agg2"("cur_state" "bytea", "initial_state" "bytea", "message" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_signcrypt_new_keypair"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_signcrypt_new_keypair"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_signcrypt_new_keypair"() TO "postgres";


--
-- Name: FUNCTION "crypto_signcrypt_sign_after"("state" "bytea", "sender_sk" "bytea", "ciphertext" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_signcrypt_sign_after"("state" "bytea", "sender_sk" "bytea", "ciphertext" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_signcrypt_sign_after"("state" "bytea", "sender_sk" "bytea", "ciphertext" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_signcrypt_sign_before"("sender" "bytea", "recipient" "bytea", "sender_sk" "bytea", "recipient_pk" "bytea", "additional" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_signcrypt_sign_before"("sender" "bytea", "recipient" "bytea", "sender_sk" "bytea", "recipient_pk" "bytea", "additional" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_signcrypt_sign_before"("sender" "bytea", "recipient" "bytea", "sender_sk" "bytea", "recipient_pk" "bytea", "additional" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_signcrypt_verify_after"("state" "bytea", "signature" "bytea", "sender_pk" "bytea", "ciphertext" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_signcrypt_verify_after"("state" "bytea", "signature" "bytea", "sender_pk" "bytea", "ciphertext" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_signcrypt_verify_after"("state" "bytea", "signature" "bytea", "sender_pk" "bytea", "ciphertext" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_signcrypt_verify_before"("signature" "bytea", "sender" "bytea", "recipient" "bytea", "additional" "bytea", "sender_pk" "bytea", "recipient_sk" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_signcrypt_verify_before"("signature" "bytea", "sender" "bytea", "recipient" "bytea", "additional" "bytea", "sender_pk" "bytea", "recipient_sk" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_signcrypt_verify_before"("signature" "bytea", "sender" "bytea", "recipient" "bytea", "additional" "bytea", "sender_pk" "bytea", "recipient_sk" "bytea") TO "postgres";


--
-- Name: FUNCTION "crypto_signcrypt_verify_public"("signature" "bytea", "sender" "bytea", "recipient" "bytea", "additional" "bytea", "sender_pk" "bytea", "ciphertext" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."crypto_signcrypt_verify_public"("signature" "bytea", "sender" "bytea", "recipient" "bytea", "additional" "bytea", "sender_pk" "bytea", "ciphertext" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."crypto_signcrypt_verify_public"("signature" "bytea", "sender" "bytea", "recipient" "bytea", "additional" "bytea", "sender_pk" "bytea", "ciphertext" "bytea") TO "postgres";


--
-- Name: FUNCTION "derive_key"("key_id" bigint, "key_len" integer, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."derive_key"("key_id" bigint, "key_len" integer, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."derive_key"("key_id" bigint, "key_len" integer, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "pgsodium_derive"("key_id" bigint, "key_len" integer, "context" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."pgsodium_derive"("key_id" bigint, "key_len" integer, "context" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."pgsodium_derive"("key_id" bigint, "key_len" integer, "context" "bytea") TO "postgres";


--
-- Name: FUNCTION "randombytes_buf"("size" integer); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."randombytes_buf"("size" integer) FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."randombytes_buf"("size" integer) TO "postgres";


--
-- Name: FUNCTION "randombytes_buf_deterministic"("size" integer, "seed" "bytea"); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."randombytes_buf_deterministic"("size" integer, "seed" "bytea") FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."randombytes_buf_deterministic"("size" integer, "seed" "bytea") TO "postgres";


--
-- Name: FUNCTION "randombytes_new_seed"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."randombytes_new_seed"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."randombytes_new_seed"() TO "postgres";


--
-- Name: FUNCTION "randombytes_random"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."randombytes_random"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."randombytes_random"() TO "postgres";


--
-- Name: FUNCTION "randombytes_uniform"("upper_bound" integer); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgsodium"."randombytes_uniform"("upper_bound" integer) FROM "supabase_admin";
GRANT ALL ON FUNCTION "pgsodium"."randombytes_uniform"("upper_bound" integer) TO "postgres";


--
-- Name: FUNCTION "handle_new_user"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


--
-- Name: TABLE "pg_stat_statements"; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";


--
-- Name: TABLE "pg_stat_statements_info"; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "dashboard_user";


--
-- Name: SEQUENCE "seq_schema_version"; Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "postgres";
GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "anon";
GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "authenticated";
GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "service_role";


--
-- Name: TABLE "decrypted_key"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE "pgsodium"."decrypted_key" TO "pgsodium_keyholder";


--
-- Name: SEQUENCE "key_key_id_seq"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

REVOKE ALL ON SEQUENCE "pgsodium"."key_key_id_seq" FROM "supabase_admin";
GRANT ALL ON SEQUENCE "pgsodium"."key_key_id_seq" TO "postgres";


--
-- Name: TABLE "masking_rule"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE "pgsodium"."masking_rule" TO "pgsodium_keyholder";


--
-- Name: TABLE "mask_columns"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE "pgsodium"."mask_columns" TO "pgsodium_keyholder";


--
-- Name: TABLE "profiles"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- PostgreSQL database dump complete
--

RESET ALL;
