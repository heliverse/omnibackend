create db omnifi


   CREATE table users( id serial Unique,
    balance double precision NOT NULL,
    firstname character varying(100)  NOT NULL,
    lastname character varying(100) NOT NULL,
    password character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    authentication_key character varying(100) NOT NULL,
    last_transactions_time timestamp without time zone,
    status boolean NOT NULL,
    role_type character varying(200)  NOT NULL,
    interest double precision NOT NULL,
    is_confirmed boolean,
    CONSTRAINT users_pkey PRIMARY KEY (id, email),
    CONSTRAINT users_id_key UNIQUE (id));

   
CREATE TABLE transactions(
    id serial Unique,
    amount double precision NOT NULL,
    user_id integer NOT NULL,
    status character varying(100)  NOT NULL,
    created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transaction_type character varying(100) NOT NULL,
    CONSTRAINT transactions_pkey PRIMARY KEY (id),
    CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);