/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS public.player (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    group_id uuid,
    user_id uuid,
    name character varying,
    tank boolean DEFAULT false NOT NULL,
    healer boolean DEFAULT false NOT NULL,
    dps boolean DEFAULT false NOT NULL,
    locked boolean DEFAULT false NOT NULL,
    in_the_roll boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.player ADD CONSTRAINT player_pk PRIMARY KEY (id);

CREATE UNIQUE INDEX player_id_uindex ON public.player USING btree (id);

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.player FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

ALTER TABLE ONLY public.player 
ADD CONSTRAINT player_user_id_fk 
FOREIGN KEY (user_id) 
REFERENCES public.user(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.player 
ADD CONSTRAINT group_id_fk 
FOREIGN KEY (group_id) 
REFERENCES public.group(id) ON DELETE CASCADE;