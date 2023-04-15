CREATE TABLE IF NOT EXISTS public.user (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    username VARCHAR(20) default NULL,
    email VARCHAR(30) NOT NULL,
    google_id VARCHAR(40) UNIQUE,
    apple_id VARCHAR(40) UNIQUE,
    github_id VARCHAR(40) UNIQUE,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE ONLY public.user ADD CONSTRAINT user_id_key UNIQUE (id);

ALTER TABLE ONLY public.user ADD CONSTRAINT user_pk PRIMARY KEY (id);

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.user FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();