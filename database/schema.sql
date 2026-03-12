--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

-- Started on 2026-03-12 22:27:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 234 (class 1259 OID 17799)
-- Name: alert_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alert_subscriptions (
    id integer NOT NULL,
    user_id integer,
    latitude double precision,
    longitude double precision,
    radius_km integer,
    category character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.alert_subscriptions OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17798)
-- Name: alert_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alert_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alert_subscriptions_id_seq OWNER TO postgres;

--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 233
-- Name: alert_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alert_subscriptions_id_seq OWNED BY public.alert_subscriptions.id;


--
-- TOC entry 232 (class 1259 OID 17786)
-- Name: alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerts (
    id integer NOT NULL,
    incident_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.alerts OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17785)
-- Name: alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerts_id_seq OWNER TO postgres;

--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 231
-- Name: alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;


--
-- TOC entry 222 (class 1259 OID 17690)
-- Name: checkpoint_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checkpoint_status_history (
    id integer NOT NULL,
    checkpoint_id integer,
    status character varying(50),
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    changed_by integer
);


ALTER TABLE public.checkpoint_status_history OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17689)
-- Name: checkpoint_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.checkpoint_status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.checkpoint_status_history_id_seq OWNER TO postgres;

--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 221
-- Name: checkpoint_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.checkpoint_status_history_id_seq OWNED BY public.checkpoint_status_history.id;


--
-- TOC entry 220 (class 1259 OID 17681)
-- Name: checkpoints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checkpoints (
    id integer NOT NULL,
    name character varying(150),
    latitude double precision,
    longitude double precision,
    current_status character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.checkpoints OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17680)
-- Name: checkpoints_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.checkpoints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.checkpoints_id_seq OWNER TO postgres;

--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 219
-- Name: checkpoints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.checkpoints_id_seq OWNED BY public.checkpoints.id;


--
-- TOC entry 238 (class 1259 OID 17832)
-- Name: external_api_cache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.external_api_cache (
    id integer NOT NULL,
    provider_name character varying(100),
    request_hash text,
    response_data jsonb,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.external_api_cache OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17831)
-- Name: external_api_cache_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.external_api_cache_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.external_api_cache_id_seq OWNER TO postgres;

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 237
-- Name: external_api_cache_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.external_api_cache_id_seq OWNED BY public.external_api_cache.id;


--
-- TOC entry 224 (class 1259 OID 17708)
-- Name: incidents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incidents (
    id integer NOT NULL,
    title character varying(200),
    category character varying(50),
    description text,
    severity character varying(20),
    status character varying(20),
    latitude double precision,
    longitude double precision,
    checkpoint_id integer,
    created_by integer,
    verified_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    closed_at timestamp without time zone
);


ALTER TABLE public.incidents OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17707)
-- Name: incidents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.incidents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incidents_id_seq OWNER TO postgres;

--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 223
-- Name: incidents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.incidents_id_seq OWNED BY public.incidents.id;


--
-- TOC entry 230 (class 1259 OID 17771)
-- Name: moderation_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.moderation_logs (
    id integer NOT NULL,
    event_type character varying(20),
    event_id integer,
    performed_by integer,
    action character varying(50),
    reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.moderation_logs OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17770)
-- Name: moderation_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.moderation_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.moderation_logs_id_seq OWNER TO postgres;

--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 229
-- Name: moderation_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.moderation_logs_id_seq OWNED BY public.moderation_logs.id;


--
-- TOC entry 236 (class 1259 OID 17812)
-- Name: report_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report_comments (
    id integer NOT NULL,
    report_id integer,
    user_id integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.report_comments OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17811)
-- Name: report_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.report_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.report_comments_id_seq OWNER TO postgres;

--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 235
-- Name: report_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.report_comments_id_seq OWNED BY public.report_comments.id;


--
-- TOC entry 228 (class 1259 OID 17750)
-- Name: report_votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report_votes (
    id integer NOT NULL,
    report_id integer,
    user_id integer,
    vote character varying(10),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.report_votes OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17749)
-- Name: report_votes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.report_votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.report_votes_id_seq OWNER TO postgres;

--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 227
-- Name: report_votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.report_votes_id_seq OWNED BY public.report_votes.id;


--
-- TOC entry 226 (class 1259 OID 17734)
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    user_id integer,
    title character varying(200),
    latitude double precision,
    longitude double precision,
    category character varying(50),
    description text,
    status character varying(20),
    confidence_score integer,
    duplicate_of integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17733)
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_id_seq OWNER TO postgres;

--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 225
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- TOC entry 218 (class 1259 OID 17665)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(150),
    password text,
    is_active boolean DEFAULT true,
    is_authorized boolean DEFAULT false,
    role character varying(20),
    confidence_score integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17664)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4768 (class 2604 OID 17802)
-- Name: alert_subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alert_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.alert_subscriptions_id_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 17789)
-- Name: alerts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);


--
-- TOC entry 4754 (class 2604 OID 17693)
-- Name: checkpoint_status_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkpoint_status_history ALTER COLUMN id SET DEFAULT nextval('public.checkpoint_status_history_id_seq'::regclass);


--
-- TOC entry 4751 (class 2604 OID 17684)
-- Name: checkpoints id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkpoints ALTER COLUMN id SET DEFAULT nextval('public.checkpoints_id_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 17835)
-- Name: external_api_cache id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.external_api_cache ALTER COLUMN id SET DEFAULT nextval('public.external_api_cache_id_seq'::regclass);


--
-- TOC entry 4756 (class 2604 OID 17711)
-- Name: incidents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents ALTER COLUMN id SET DEFAULT nextval('public.incidents_id_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 17774)
-- Name: moderation_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation_logs ALTER COLUMN id SET DEFAULT nextval('public.moderation_logs_id_seq'::regclass);


--
-- TOC entry 4770 (class 2604 OID 17815)
-- Name: report_comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_comments ALTER COLUMN id SET DEFAULT nextval('public.report_comments_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 17753)
-- Name: report_votes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_votes ALTER COLUMN id SET DEFAULT nextval('public.report_votes_id_seq'::regclass);


--
-- TOC entry 4759 (class 2604 OID 17737)
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- TOC entry 4745 (class 2604 OID 17668)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4795 (class 2606 OID 17805)
-- Name: alert_subscriptions alert_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alert_subscriptions
    ADD CONSTRAINT alert_subscriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 4793 (class 2606 OID 17792)
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- TOC entry 4781 (class 2606 OID 17696)
-- Name: checkpoint_status_history checkpoint_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkpoint_status_history
    ADD CONSTRAINT checkpoint_status_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 17688)
-- Name: checkpoints checkpoints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkpoints
    ADD CONSTRAINT checkpoints_pkey PRIMARY KEY (id);


--
-- TOC entry 4799 (class 2606 OID 17840)
-- Name: external_api_cache external_api_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.external_api_cache
    ADD CONSTRAINT external_api_cache_pkey PRIMARY KEY (id);


--
-- TOC entry 4783 (class 2606 OID 17717)
-- Name: incidents incidents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 17779)
-- Name: moderation_logs moderation_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation_logs
    ADD CONSTRAINT moderation_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4797 (class 2606 OID 17820)
-- Name: report_comments report_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_comments
    ADD CONSTRAINT report_comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 17756)
-- Name: report_votes report_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_votes
    ADD CONSTRAINT report_votes_pkey PRIMARY KEY (id);


--
-- TOC entry 4789 (class 2606 OID 17758)
-- Name: report_votes report_votes_report_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_votes
    ADD CONSTRAINT report_votes_report_id_user_id_key UNIQUE (report_id, user_id);


--
-- TOC entry 4785 (class 2606 OID 17743)
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- TOC entry 4775 (class 2606 OID 17679)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4777 (class 2606 OID 17677)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 17806)
-- Name: alert_subscriptions alert_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alert_subscriptions
    ADD CONSTRAINT alert_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4809 (class 2606 OID 17793)
-- Name: alerts alerts_incident_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_incident_id_fkey FOREIGN KEY (incident_id) REFERENCES public.incidents(id);


--
-- TOC entry 4800 (class 2606 OID 17702)
-- Name: checkpoint_status_history checkpoint_status_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkpoint_status_history
    ADD CONSTRAINT checkpoint_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id);


--
-- TOC entry 4801 (class 2606 OID 17697)
-- Name: checkpoint_status_history checkpoint_status_history_checkpoint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkpoint_status_history
    ADD CONSTRAINT checkpoint_status_history_checkpoint_id_fkey FOREIGN KEY (checkpoint_id) REFERENCES public.checkpoints(id);


--
-- TOC entry 4802 (class 2606 OID 17718)
-- Name: incidents incidents_checkpoint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_checkpoint_id_fkey FOREIGN KEY (checkpoint_id) REFERENCES public.checkpoints(id);


--
-- TOC entry 4803 (class 2606 OID 17723)
-- Name: incidents incidents_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4804 (class 2606 OID 17728)
-- Name: incidents incidents_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id);


--
-- TOC entry 4808 (class 2606 OID 17780)
-- Name: moderation_logs moderation_logs_performed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation_logs
    ADD CONSTRAINT moderation_logs_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.users(id);


--
-- TOC entry 4811 (class 2606 OID 17821)
-- Name: report_comments report_comments_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_comments
    ADD CONSTRAINT report_comments_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id);


--
-- TOC entry 4812 (class 2606 OID 17826)
-- Name: report_comments report_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_comments
    ADD CONSTRAINT report_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4806 (class 2606 OID 17759)
-- Name: report_votes report_votes_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_votes
    ADD CONSTRAINT report_votes_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id);


--
-- TOC entry 4807 (class 2606 OID 17764)
-- Name: report_votes report_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_votes
    ADD CONSTRAINT report_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4805 (class 2606 OID 17744)
-- Name: reports reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-03-12 22:27:09

--
-- PostgreSQL database dump complete
--

