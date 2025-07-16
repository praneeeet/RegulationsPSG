--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-06-02 23:23:09

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
-- TOC entry 219 (class 1259 OID 16426)
-- Name: Course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Course" (
    course_id character varying(10) NOT NULL,
    dept_id character varying(10) NOT NULL,
    name character varying(255) NOT NULL,
    year date
);


ALTER TABLE public."Course" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16405)
-- Name: Department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Department" (
    department_id character varying(10) NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public."Department" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16525)
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    submission_id bigint NOT NULL,
    reviewed_by character varying(10) NOT NULL,
    status character varying(50) NOT NULL,
    remarks text,
    last_review timestamp without time zone,
    review_id bigint NOT NULL,
    CONSTRAINT "Review_status" CHECK (((status)::text = ANY ((ARRAY['Approved'::character varying, 'Rollback'::character varying])::text[])))
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16451)
-- Name: Semester; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Semester" (
    semester_id character varying(10) NOT NULL,
    course_id character varying(10) NOT NULL,
    semester_num integer NOT NULL,
    dept_id character varying(10) NOT NULL,
    CONSTRAINT "Semester_semnum" CHECK (((semester_num >= 1) AND (semester_num <= 10)))
);


ALTER TABLE public."Semester" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16462)
-- Name: Subject; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subject" (
    subject_id character varying(10) NOT NULL,
    sem_id character varying(10) NOT NULL,
    name character varying(255) NOT NULL,
    subject_code character varying(10) NOT NULL
);


ALTER TABLE public."Subject" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16493)
-- Name: Submission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Submission" (
    submission_id bigint NOT NULL,
    user_id character varying(10) NOT NULL,
    course_id character varying(10) NOT NULL,
    status character varying(50) NOT NULL,
    last_edit timestamp without time zone NOT NULL,
    remarks text DEFAULT now(),
    pdf_url text,
    dept_id character varying(10) NOT NULL,
    CONSTRAINT "Submission_status" CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Approved'::character varying, 'Rolled Back'::character varying])::text[])))
);


ALTER TABLE public."Submission" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16388)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    user_id character varying(15) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    dept_id character varying(10)
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 4947 (class 0 OID 16426)
-- Dependencies: 219
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Course" (course_id, dept_id, name, year) FROM stdin;
\.


--
-- TOC entry 4946 (class 0 OID 16405)
-- Dependencies: 218
-- Data for Name: Department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Department" (department_id, name) FROM stdin;
\.


--
-- TOC entry 4951 (class 0 OID 16525)
-- Dependencies: 223
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (submission_id, reviewed_by, status, remarks, last_review, review_id) FROM stdin;
\.


--
-- TOC entry 4948 (class 0 OID 16451)
-- Dependencies: 220
-- Data for Name: Semester; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Semester" (semester_id, course_id, semester_num, dept_id) FROM stdin;
\.


--
-- TOC entry 4949 (class 0 OID 16462)
-- Dependencies: 221
-- Data for Name: Subject; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subject" (subject_id, sem_id, name, subject_code) FROM stdin;
\.


--
-- TOC entry 4950 (class 0 OID 16493)
-- Dependencies: 222
-- Data for Name: Submission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Submission" (submission_id, user_id, course_id, status, last_edit, remarks, pdf_url, dept_id) FROM stdin;
\.


--
-- TOC entry 4945 (class 0 OID 16388)
-- Dependencies: 217
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (user_id, name, email, role, dept_id) FROM stdin;
\.


--
-- TOC entry 4780 (class 2606 OID 16432)
-- Name: Course Course_nameuniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_nameuniq" UNIQUE NULLS NOT DISTINCT (name) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4782 (class 2606 OID 16430)
-- Name: Course Course_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pk" PRIMARY KEY (course_id, dept_id);


--
-- TOC entry 4776 (class 2606 OID 16409)
-- Name: Department Department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Department"
    ADD CONSTRAINT "Department_pkey" PRIMARY KEY (department_id);


--
-- TOC entry 4778 (class 2606 OID 16411)
-- Name: Department Dept_nameuniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Department"
    ADD CONSTRAINT "Dept_nameuniq" UNIQUE NULLS NOT DISTINCT (name) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4791 (class 2606 OID 16569)
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (review_id);


--
-- TOC entry 4784 (class 2606 OID 16470)
-- Name: Semester Semester_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Semester"
    ADD CONSTRAINT "Semester_pk" PRIMARY KEY (semester_id);


--
-- TOC entry 4786 (class 2606 OID 16472)
-- Name: Subject Subject_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_pk" PRIMARY KEY (subject_id, subject_code);


--
-- TOC entry 4789 (class 2606 OID 16501)
-- Name: Submission Submission_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_pk" PRIMARY KEY (submission_id);


--
-- TOC entry 4771 (class 2606 OID 16396)
-- Name: User User_emailuniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_emailuniq" UNIQUE NULLS NOT DISTINCT (email) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4766 (class 2606 OID 16398)
-- Name: User User_role; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public."User"
    ADD CONSTRAINT "User_role" CHECK (((role)::text = ANY ((ARRAY['Program_Coordinator'::character varying, 'HOD'::character varying, 'Dean'::character varying, 'Principal'::character varying, 'Admin'::character varying])::text[]))) NOT VALID;


--
-- TOC entry 4773 (class 2606 OID 16394)
-- Name: User Users_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "Users_pk" PRIMARY KEY (user_id);


--
-- TOC entry 4787 (class 1259 OID 16478)
-- Name: fki_Subject_semfk; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_Subject_semfk" ON public."Subject" USING btree (sem_id);


--
-- TOC entry 4774 (class 1259 OID 16425)
-- Name: fki_User_deptfk; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_User_deptfk" ON public."User" USING btree (dept_id);


--
-- TOC entry 4793 (class 2606 OID 16434)
-- Name: Course Course_deptfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_deptfk" FOREIGN KEY (dept_id) REFERENCES public."Department"(department_id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4798 (class 2606 OID 16538)
-- Name: Review Review_subfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_subfk" FOREIGN KEY (submission_id) REFERENCES public."Submission"(submission_id) MATCH FULL ON UPDATE CASCADE ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4799 (class 2606 OID 16533)
-- Name: Review Review_userfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_userfk" FOREIGN KEY (reviewed_by) REFERENCES public."User"(user_id) MATCH FULL ON UPDATE CASCADE ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4794 (class 2606 OID 16563)
-- Name: Semester Semester_coursefk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Semester"
    ADD CONSTRAINT "Semester_coursefk" FOREIGN KEY (course_id, dept_id) REFERENCES public."Course"(course_id, dept_id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4795 (class 2606 OID 16558)
-- Name: Subject Subject_semfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_semfk" FOREIGN KEY (sem_id) REFERENCES public."Semester"(semester_id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4796 (class 2606 OID 16543)
-- Name: Submission Submission_coursefk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_coursefk" FOREIGN KEY (course_id, dept_id) REFERENCES public."Course"(course_id, dept_id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED NOT VALID;


--
-- TOC entry 4797 (class 2606 OID 16548)
-- Name: Submission Submission_userfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_userfk" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) MATCH FULL ON UPDATE CASCADE ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4792 (class 2606 OID 16553)
-- Name: User User_deptfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_deptfk" FOREIGN KEY (dept_id) REFERENCES public."Department"(department_id) MATCH FULL ON UPDATE CASCADE ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;


-- Completed on 2025-06-02 23:23:11

--
-- PostgreSQL database dump complete
--

