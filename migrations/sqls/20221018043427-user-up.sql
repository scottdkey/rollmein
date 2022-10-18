/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS public.user (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    firebase_id VARCHAR UNIQUE NOT NULL,
    google_id VARCHAR UNIQUE,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE ONLY public.user ADD CONSTRAINT user_id_key UNIQUE (id);

ALTER TABLE ONLY public.user ADD CONSTRAINT user_pk PRIMARY KEY (id);

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.user FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();