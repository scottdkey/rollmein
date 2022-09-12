--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Debian 14.4-1.pgdg110+1)
-- Dumped by pg_dump version 14.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    players uuid[],
    members uuid[],
    roll_type character varying DEFAULT 'ffa'::character varying NOT NULL,
    lock_after_out boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.player_group OWNER TO postgres;

--
-- Data for Name: group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player_group (id, user_id, players, members, roll_type, lock_after_out, created_at, updated_at) FROM stdin;
\.


--
-- Name: group group_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_group
    ADD CONSTRAINT group_pk PRIMARY KEY (user_id);


--
-- Name: group_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX group_id_uindex ON public.player_group USING btree (id);


--
-- Name: group set_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.player_group FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: group group_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_group
    ADD CONSTRAINT group_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

