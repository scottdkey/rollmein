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
-- Name: user_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_options (
    user_id uuid NOT NULL,
    theme character varying DEFAULT 'dark'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_options OWNER TO postgres;

--
-- Data for Name: user_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_options (user_id, theme, created_at, updated_at) FROM stdin;
\.


--
-- Name: user_options useroptions_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_options
    ADD CONSTRAINT useroptions_pk PRIMARY KEY (user_id);


--
-- Name: useroptions_userid_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX useroptions_userid_uindex ON public.user_options USING btree (user_id);


--
-- Name: user_options set_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.user_options FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: user_options useroptions_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_options
    ADD CONSTRAINT useroptions_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--