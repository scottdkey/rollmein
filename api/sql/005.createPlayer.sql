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
-- Name: player; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    group_id uuid NOT NULL,
    user_id uuid,
    name character varying,
    tank boolean DEFAULT true NOT NULL,
    healer boolean DEFAULT true NOT NULL,
    dps boolean DEFAULT true,
    locked boolean DEFAULT false NOT NULL,
    in_the_roll boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.player OWNER TO postgres;

--
-- Data for Name: player; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player (id, group_id, user_id, name, tank, healer, dps, locked, in_the_roll, created_at, updated_at) FROM stdin;
\.


--
-- Name: player player_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pk PRIMARY KEY (id);


--
-- Name: player_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX player_id_uindex ON public.player USING btree (id);


--
-- Name: player set_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.player FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: player player_group_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_group_id_fk FOREIGN KEY (group_id) REFERENCES public.player_group(id) ON DELETE CASCADE;


--
-- Name: player player_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_user_id_fk FOREIGN KEY (user_id) REFERENCES public.user(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

