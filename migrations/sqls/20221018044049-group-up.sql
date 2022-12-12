CREATE TABLE IF NOT EXISTS public.group (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    user_id uuid NOT NULL,
    relations jsonb,
    roll_type character varying DEFAULT 'ffa'::character varying NOT NULL,
    lock_after_out boolean DEFAULT false NOT NULL,
    members_can_update boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE ONLY public.group 
ADD CONSTRAINT group_pk PRIMARY KEY (id);


CREATE UNIQUE INDEX group_id_uindex 
ON public.group USING btree (id);

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON public.group 
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

ALTER TABLE ONLY public.group 
ADD CONSTRAINT group_user_id_fk 
FOREIGN KEY (user_id) 
REFERENCES public."user"(id) ON DELETE CASCADE;









