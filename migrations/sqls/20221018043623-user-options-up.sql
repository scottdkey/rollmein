/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS public.user_options (
    user_id uuid NOT NULL,
    theme character varying DEFAULT 'dark'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE ONLY public.user_options ADD CONSTRAINT useroptions_pk PRIMARY KEY (user_id);

CREATE UNIQUE INDEX useroptions_userid_uindex ON public.user_options USING btree (user_id);

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.user_options FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

ALTER TABLE ONLY public.user_options ADD CONSTRAINT useroptions_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;