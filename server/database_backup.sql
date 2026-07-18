--
-- PostgreSQL database dump
--

\restrict gQVpViv7oz7bSiiTlth7oJ1Mu0bovBfkftw7m4SwrorBlYFl1bTjUqQDKdpvJw5

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

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

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'STUDENT',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: claimed_challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.claimed_challenges (
    id text NOT NULL,
    "userId" text NOT NULL,
    "challengeId" text NOT NULL
);


ALTER TABLE public.claimed_challenges OWNER TO postgres;

--
-- Name: completed_lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.completed_lessons (
    id text NOT NULL,
    "userId" text NOT NULL,
    "moduleId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.completed_lessons OWNER TO postgres;

--
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modules (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    topics text[],
    "order" integer DEFAULT 0 NOT NULL,
    lesson jsonb NOT NULL
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- Name: quiz_scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz_scores (
    id text NOT NULL,
    "userId" text NOT NULL,
    "moduleId" text NOT NULL,
    correct integer NOT NULL,
    total integer NOT NULL,
    pct integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.quiz_scores OWNER TO postgres;

--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quizzes (
    id text NOT NULL,
    "moduleId" text NOT NULL,
    question text NOT NULL,
    options text[],
    answer integer NOT NULL,
    explanation text NOT NULL,
    difficulty text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.quizzes OWNER TO postgres;

--
-- Name: scenario_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scenario_results (
    id text NOT NULL,
    "userId" text NOT NULL,
    "scenarioId" text NOT NULL,
    "choiceIndex" integer NOT NULL,
    quality integer NOT NULL
);


ALTER TABLE public.scenario_results OWNER TO postgres;

--
-- Name: scenarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scenarios (
    id text NOT NULL,
    slug text NOT NULL,
    theme text NOT NULL,
    situation text NOT NULL,
    choices jsonb NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.scenarios OWNER TO postgres;

--
-- Name: sim_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sim_events (
    id text NOT NULL,
    slug text NOT NULL,
    theme text NOT NULL,
    icon text NOT NULL,
    text text NOT NULL,
    choices jsonb NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.sim_events OWNER TO postgres;

--
-- Name: simulation_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.simulation_results (
    id text NOT NULL,
    "userId" text NOT NULL,
    balance integer NOT NULL,
    saving integer NOT NULL,
    "avgQuality" double precision NOT NULL,
    pct integer NOT NULL,
    passed boolean NOT NULL,
    "choicesLog" jsonb
);


ALTER TABLE public.simulation_results OWNER TO postgres;

--
-- Name: user_badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_badges (
    id text NOT NULL,
    "userId" text NOT NULL,
    "badgeId" text NOT NULL
);


ALTER TABLE public.user_badges OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'STUDENT'::public."Role" NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    streak integer DEFAULT 1 NOT NULL,
    "lastLoginDay" text,
    "todayLessons" integer DEFAULT 0 NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: claimed_challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.claimed_challenges (id, "userId", "challengeId") FROM stdin;
21c81e9d-1342-45a2-856e-428d0b6e021a	acb4c259-35af-44ff-a41b-8f066e5798fa	c1
9ad7d48b-bbcb-49ce-9528-304aa046debd	7687a75f-4a80-4176-bdf9-9b0ad29bbac1	c2
\.


--
-- Data for Name: completed_lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.completed_lessons (id, "userId", "moduleId", "createdAt") FROM stdin;
a9491d22-8afc-424e-bdd0-a3da36948a4a	7687a75f-4a80-4176-bdf9-9b0ad29bbac1	8e2eb727-8a2a-4fae-b05c-db928262a3f9	2026-07-03 08:24:13.323
fce6715f-2d8f-4aff-b853-cccd68512c65	7687a75f-4a80-4176-bdf9-9b0ad29bbac1	f895241b-58bc-4684-97af-1cc55c55b355	2026-07-03 08:24:15.948
069e0f0a-4675-4933-8ec4-861330c372ac	acb4c259-35af-44ff-a41b-8f066e5798fa	8e2eb727-8a2a-4fae-b05c-db928262a3f9	2026-07-03 08:26:57.391
293e3478-140e-4a2b-9d97-e3c9e62d0dab	acb4c259-35af-44ff-a41b-8f066e5798fa	f895241b-58bc-4684-97af-1cc55c55b355	2026-07-03 08:27:14.422
5517126b-3a5d-4de6-af0d-0958f1b13d1f	acb4c259-35af-44ff-a41b-8f066e5798fa	55488721-a8bf-4dd6-868f-3c6522fca5e4	2026-07-03 11:52:41.988
60513d26-c2eb-478b-8eec-c30a4b3c5681	acb4c259-35af-44ff-a41b-8f066e5798fa	cf295e27-f4ac-4247-918a-8df47561781d	2026-07-03 11:52:45.134
22eaad9e-37d8-495b-a4e8-9093f7b9d7e0	0a42f481-ce02-4871-8f5f-405d6ae16e8f	8e2eb727-8a2a-4fae-b05c-db928262a3f9	2026-07-11 04:59:56.017
7fcdaa72-04d1-424c-8325-c792db4cf7b0	0a42f481-ce02-4871-8f5f-405d6ae16e8f	f6676a51-e9ed-4293-9e49-c3fa62933d09	2026-07-11 05:04:26.927
1e67165a-349c-41c5-b3a1-4d1beca969df	0a42f481-ce02-4871-8f5f-405d6ae16e8f	f895241b-58bc-4684-97af-1cc55c55b355	2026-07-11 05:09:36.169
af068b7c-bea1-42f1-812b-cfe319098b02	0a42f481-ce02-4871-8f5f-405d6ae16e8f	42925138-c169-4ba7-ae40-4f0e20773f95	2026-07-11 05:15:19.387
c47334fc-1972-44ef-a0ea-396741caf1d3	0a42f481-ce02-4871-8f5f-405d6ae16e8f	55488721-a8bf-4dd6-868f-3c6522fca5e4	2026-07-11 05:17:16.843
f4f2515f-75ee-4487-9144-86418873f9fa	0a42f481-ce02-4871-8f5f-405d6ae16e8f	cf295e27-f4ac-4247-918a-8df47561781d	2026-07-11 05:22:42.083
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modules (id, slug, title, topics, "order", lesson) FROM stdin;
8e2eb727-8a2a-4fae-b05c-db928262a3f9	m1	Fintech Basics	{"Definisi Fintech","Jenis Fintech",Ekosistem,"Manfaat & Risiko"}	1	{"intro": "Fintech (financial technology) adalah pemanfaatan teknologi untuk menghadirkan layanan keuangan. Modul ini membangun fondasi: apa itu fintech, jenis-jenisnya, siapa pemainnya, serta manfaat dan risikonya.", "example": {"body": "Aplikasi A menyimpan saldo dan memindai QR untuk bayar di warung (pembayaran/e-wallet). Aplikasi B mempertemukan Anda dengan investor yang mendanai pinjaman Anda (lending/P2P). Aplikasi C menyusun portofolio reksa dana otomatis sesuai profil risiko (wealthtech/robo-advisor). Mengenali kategori membantu Anda menilai risiko sebelum memakai.", "title": "Contoh penerapan — mengenali jenis fintech"}, "sections": [{"b": "Fintech adalah layanan keuangan yang dihantarkan melalui teknologi — mencakup pembayaran, pinjaman, investasi, hingga asuransi. Batasnya bukan 'perusahaan teknologi' melainkan 'layanan keuangan berbasis teknologi'.", "h": "Definisi Fintech"}, {"b": "Kategori utama: pembayaran (e-wallet, transfer), lending (termasuk peer-to-peer), wealthtech (investasi digital, robo-advisor), insurtech (asuransi), dan regtech (kepatuhan). Memahami kategori membantu menilai risiko tiap layanan.", "h": "Jenis Fintech"}, {"b": "Ekosistem fintech menghubungkan penyedia, bank, regulator (di Indonesia: OJK dan Bank Indonesia sesuai ranahnya), dan konsumen. Interoperabilitas (mis. QRIS) membuat sistem berbeda dapat bekerja sama.", "h": "Ekosistem"}, {"b": "Manfaat utama: inklusi keuangan, biaya lebih rendah, kemudahan akses. Risiko: penipuan, keterlilitan utang, dan penyalahgunaan data. Keberadaan izin adalah salah satu sinyal paling jelas pembeda penyedia aman dari yang berbahaya.", "h": "Manfaat & Risiko"}], "takeaways": ["Fintech = layanan keuangan yang dihantarkan melalui teknologi.", "Kategori utama: payment, lending, wealthtech, insurtech, regtech.", "Regulator di Indonesia: OJK dan Bank Indonesia sesuai ranahnya.", "Cek status izin sebelum memakai layanan apa pun."]}
f895241b-58bc-4684-97af-1cc55c55b355	m2	Digital Payment & E-Wallet	{E-wallet,QRIS,"Mobile Banking","Keamanan Transaksi"}	2	{"intro": "Pembayaran digital memindahkan nilai tanpa uang tunai. Kemudahannya tinggi, tetapi taruhan keamanannya juga tinggi.", "example": {"body": "Pesan berbunyi: 'Akun terkunci. Kirim OTP dan transfer Rp50.000 untuk verifikasi.' Dua tanda bahaya: lembaga sah tidak pernah meminta OTP, dan tidak pernah meminta Anda mengirim uang untuk 'memverifikasi' diri.", "title": "Contoh penerapan — mengenali penipuan pembayaran"}, "sections": [{"b": "E-wallet menyimpan saldo digital untuk pembayaran dan transfer. Saldo tersimpan ('float') hanya seaman penyedia yang menyimpannya, sehingga memakai penyedia berizin penting.", "h": "E-wallet"}, {"b": "QRIS (Quick Response Code Indonesian Standard) memungkinkan satu kode QR dibayar oleh banyak aplikasi dan bank berbeda.", "h": "QRIS"}, {"b": "Mobile banking membawa kendali penuh atas rekening ke ponsel. Kemudahan ini memusatkan risiko pada perangkat.", "h": "Mobile Banking"}, {"b": "Kebiasaan inti: jangan pernah membagikan OTP — bank tidak pernah memintanya; aktifkan notifikasi transaksi; hindari transaksi lewat Wi-Fi publik tak tepercaya.", "h": "Keamanan Transaksi"}], "takeaways": ["QRIS menstandarkan QR sehingga satu kode berlaku lintas penyedia.", "Jangan pernah membagikan OTP; bank tidak pernah memintanya.", "Verifikasi keaslian aplikasi; gunakan 2FA/biometrik.", "Aktifkan notifikasi untuk mendeteksi transaksi tak sah."]}
f6676a51-e9ed-4293-9e49-c3fa62933d09	m3	Budgeting & Personal Finance	{Penganggaran,Menabung,"Dana Darurat",Perencanaan}	3	{"intro": "Mengelola keuangan pribadi adalah fondasi sebelum memakai produk fintech apa pun.", "example": {"body": "Mahasiswa berpenghasilan Rp3.000.000/bulan. Dengan 50/30/20: ~Rp1.500.000 kebutuhan, ~Rp900.000 keinginan, ~Rp600.000 tabungan/utang.", "title": "Contoh penerapan — menerapkan 50/30/20"}, "sections": [{"b": "Anggaran adalah rencana mengalokasikan penghasilan ke kebutuhan, keinginan, dan tabungan. Kerangka awal umum: 50/30/20.", "h": "Penganggaran"}, {"b": "Kebiasaan ampuh adalah 'membayar diri sendiri lebih dahulu': otomatiskan transfer ke tabungan begitu penghasilan diterima.", "h": "Menabung"}, {"b": "Dana darurat adalah tabungan likuid yang menutup sekitar 3–6 bulan pengeluaran pokok.", "h": "Dana Darurat"}, {"b": "Tujuan efektif bersifat SMART: Spesifik, Terukur, Dapat dicapai, Relevan, Berbatas waktu.", "h": "Perencanaan"}], "takeaways": ["Anggaran mengalokasikan penghasilan dengan sengaja.", "Otomatiskan tabungan ('bayar diri sendiri dulu').", "Bangun dana darurat 3–6 bulan sebelum berinvestasi.", "Pantau kekayaan bersih untuk melihat kemajuan nyata."]}
42925138-c169-4ba7-ae40-4f0e20773f95	m4	Fintech Lending / Pinjaman Online	{"P2P Lending","Pinjol Legal vs Ilegal","Bunga & Biaya","Risiko Utang"}	4	{"intro": "Fintech lending (pinjaman online) memperluas akses kredit, tetapi membawa risiko nyata.", "example": {"body": "Pinjaman Rp1.000.000 dengan bunga 0,8%/hari selama 30 hari = bunga Rp240.000 (24%). Total bayar Rp1.240.000.", "title": "Contoh penerapan — menghitung total biaya pinjaman"}, "sections": [{"b": "P2P lending mempertemukan peminjam dan pemberi pinjaman tanpa bank perantara.", "h": "P2P Lending"}, {"b": "Pinjol legal terdaftar di OJK; pinjol ilegal sering menawarkan 'cair tanpa syarat' dan menyalahgunakan data.", "h": "Pinjol Legal vs Ilegal"}, {"b": "Pahami total biaya pinjaman termasuk bunga, biaya admin, dan denda keterlambatan.", "h": "Bunga & Biaya"}, {"b": "Pola 'gali lubang tutup lubang' memperbesar total utang secara eksponensial.", "h": "Risiko Utang"}], "takeaways": ["Selalu cek status legalitas pinjol di OJK.", "Hitung total biaya pinjaman sebelum mengambil.", "Jangan gunakan pinjaman baru untuk menutup pinjaman lama.", "Pinjam hanya untuk kebutuhan mendesak, bukan keinginan."]}
55488721-a8bf-4dd6-868f-3c6522fca5e4	m5	Digital Financial Security	{Phishing,"Social Engineering","Autentikasi 2FA","Perlindungan Data"}	5	{"intro": "Keamanan keuangan digital melindungi aset dan identitas Anda dari ancaman siber.", "example": {"body": "Email dari 'bank' meminta klik tautan dan masukkan PIN. Bank asli tidak pernah meminta kredensial lewat email.", "title": "Contoh penerapan — mengenali phishing"}, "sections": [{"b": "Phishing menipu pengguna agar mengungkapkan kredensial melalui pesan/situs palsu.", "h": "Phishing"}, {"b": "Serangan yang memanipulasi psikologi untuk mengakses informasi.", "h": "Social Engineering"}, {"b": "2FA meminta bukti identitas kedua selain sandi, melindungi meski sandi bocor.", "h": "Autentikasi 2FA"}, {"b": "Minimalisasi data: bagikan hanya yang perlu. Hindari transaksi di Wi-Fi publik.", "h": "Perlindungan Data"}], "takeaways": ["Jangan klik tautan mencurigakan; verifikasi lewat saluran resmi.", "Aktifkan 2FA pada semua akun keuangan.", "Terapkan minimalisasi data: bagikan hanya yang perlu.", "Hindari transaksi di Wi-Fi publik; perbarui perangkat lunak."]}
cf295e27-f4ac-4247-918a-8df47561781d	m6	Consumer Protection	{"Hak Konsumen","Penyelesaian Sengketa",Transparansi,Pengaduan}	6	{"intro": "Perlindungan konsumen memastikan pengguna layanan keuangan digital diperlakukan adil.", "example": {"body": "Seorang pengguna dikenai biaya yang tidak dijelaskan di awal. Langkahnya: kumpulkan bukti, ajukan keluhan tertulis ke penyedia, bila tak selesai teruskan ke OJK.", "title": "Contoh penerapan — menggunakan hak konsumen"}, "sections": [{"b": "Konsumen berhak atas informasi yang jelas dan jujur, perlakuan adil, kerahasiaan data, serta akses terhadap penyelesaian keluhan.", "h": "Hak Konsumen"}, {"b": "Sebelum menyetujui produk, konsumen berhak tahu biaya total, bunga, denda, dan ketentuan.", "h": "Transparansi"}, {"b": "Jika dirugikan, konsumen dapat mengadu ke penyedia, lalu ke kanal pengaduan resmi (OJK).", "h": "Pengaduan"}, {"b": "Sengketa dapat diselesaikan melalui mediasi atau lembaga alternatif penyelesaian sengketa.", "h": "Penyelesaian Sengketa"}], "takeaways": ["Konsumen berhak atas informasi jujur, perlakuan adil, dan kerahasiaan data.", "Ketahui total biaya & ketentuan sebelum menyetujui produk.", "Simpan bukti; adukan ke penyedia lalu kanal resmi (OJK).", "Sengketa dapat diselesaikan via mediasi sebelum jalur hukum."]}
\.


--
-- Data for Name: quiz_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_scores (id, "userId", "moduleId", correct, total, pct, "createdAt") FROM stdin;
ad6bdb74-f07c-4690-83fb-60389b7cdf85	7687a75f-4a80-4176-bdf9-9b0ad29bbac1	f895241b-58bc-4684-97af-1cc55c55b355	10	10	100	2026-07-03 08:24:53.283
80c75f35-f389-452f-a8cc-95578439596b	acb4c259-35af-44ff-a41b-8f066e5798fa	8e2eb727-8a2a-4fae-b05c-db928262a3f9	3	10	30	2026-07-03 08:27:09.35
391be41f-959a-41af-93c6-17e47ff8b948	acb4c259-35af-44ff-a41b-8f066e5798fa	cf295e27-f4ac-4247-918a-8df47561781d	4	10	40	2026-07-03 11:52:59.853
69f64044-b9a2-421b-bfd6-025e891bb922	0a42f481-ce02-4871-8f5f-405d6ae16e8f	8e2eb727-8a2a-4fae-b05c-db928262a3f9	8	10	80	2026-07-11 05:03:46.592
a4f21b78-a535-457a-b85f-862f0cbf13a9	0a42f481-ce02-4871-8f5f-405d6ae16e8f	f895241b-58bc-4684-97af-1cc55c55b355	10	10	100	2026-07-11 05:14:15.014
fede8bb5-c72e-4be4-aeb2-d357e2100e1e	0a42f481-ce02-4871-8f5f-405d6ae16e8f	42925138-c169-4ba7-ae40-4f0e20773f95	8	10	80	2026-07-11 05:17:07.506
59c96aed-42f2-441e-980f-dd5e5911eebf	0a42f481-ce02-4871-8f5f-405d6ae16e8f	55488721-a8bf-4dd6-868f-3c6522fca5e4	9	10	90	2026-07-11 05:19:19.275
a35e8379-a288-46ed-8320-bb63314cd430	0a42f481-ce02-4871-8f5f-405d6ae16e8f	f6676a51-e9ed-4293-9e49-c3fa62933d09	7	10	70	2026-07-11 05:22:02.068
b189ab75-0059-4624-9fe1-181d2876eb44	0a42f481-ce02-4871-8f5f-405d6ae16e8f	cf295e27-f4ac-4247-918a-8df47561781d	10	10	100	2026-07-11 05:25:59.975
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quizzes (id, "moduleId", question, options, answer, explanation, difficulty, "order") FROM stdin;
4b28195a-9554-411f-b875-0c6d7dafc83e	8e2eb727-8a2a-4fae-b05c-db928262a3f9	Fintech paling tepat didefinisikan sebagai:	{"Perusahaan media sosial","Layanan keuangan yang dihantarkan melalui teknologi","Toko gawai elektronik","Jenis mata uang"}	1	Fintech adalah layanan keuangan berbasis teknologi, bukan sekadar perusahaan teknologi.	mudah	0
c9f746b1-5cf1-4a4e-b738-304b8bb023b1	8e2eb727-8a2a-4fae-b05c-db928262a3f9	Manakah yang termasuk kategori fintech pembayaran?	{E-wallet,"Konstruksi gedung",Restoran,"Agen perjalanan"}	0	E-wallet adalah contoh fintech kategori pembayaran.	mudah	1
e717888e-132c-49c8-bd45-963954ec9187	8e2eb727-8a2a-4fae-b05c-db928262a3f9	Robo-advisor termasuk kategori fintech:	{Insurtech,Wealthtech,Regtech,Pembayaran}	1	Robo-advisor mengotomatiskan investasi, termasuk wealthtech.	sedang	2
2da8b6c1-b6ad-4313-9517-fbfbe61bf7e9	8e2eb727-8a2a-4fae-b05c-db928262a3f9	Di Indonesia, pengawasan sistem pembayaran terutama menjadi ranah:	{"Bursa Efek","Bank Indonesia","Kementerian Perdagangan","Lembaga internasional"}	1	Aspek sistem pembayaran terutama menjadi ranah Bank Indonesia.	sedang	3
a0873f0f-f8eb-4434-a183-5eb3ae385fcc	8e2eb727-8a2a-4fae-b05c-db928262a3f9	Manfaat utama fintech bagi masyarakat luas adalah:	{"Menambah birokrasi","Inklusi keuangan bagi yang kurang terlayani bank","Memperlambat transaksi","Menaikkan biaya"}	1	Fintech dapat menjangkau populasi yang kurang terlayani perbankan tradisional.	mudah	4
d93d89ae-3ff8-451d-9959-bf63787ff119	8e2eb727-8a2a-4fae-b05c-db928262a3f9	QRIS memungkinkan:	{"Satu kode QR dibayar lintas aplikasi/bank berbeda","Bunga dijamin","Pinjaman tanpa bunga","Transfer anonim"}	0	QRIS menstandarkan QR sehingga satu kode berlaku lintas penyedia.	sedang	5
c615f968-5b1b-4e85-ba66-bd211df1749c	8e2eb727-8a2a-4fae-b05c-db928262a3f9	Regtech adalah teknologi yang membantu:	{"Menambang kripto","Perusahaan memenuhi kepatuhan dan regulasi","Mendaftarkan domain","Mempercepat game"}	1	Regtech mengotomatiskan kepatuhan, pelaporan, dan pemantauan risiko.	sulit	6
2588ea72-f470-4b57-a293-d77d886d1f64	8e2eb727-8a2a-4fae-b05c-db928262a3f9	Sinyal paling jelas pembeda penyedia fintech aman dari berbahaya adalah:	{"Warna aplikasi","Status izin/legalitas","Jumlah iklan","Ukuran file aplikasi"}	1	Status izin adalah sinyal kunci legalitas dan keamanan penyedia.	sedang	7
c817bb4b-2efd-44d9-914a-21877bb7e8b0	8e2eb727-8a2a-4fae-b05c-db928262a3f9	Insurtech menerapkan teknologi pada bidang:	{Asuransi,Pertambangan,Konstruksi,"Pertanian saja"}	0	Insurtech membaharui cara asuransi dirancang dan dihantarkan.	mudah	8
17aa70cd-2098-4ef4-9776-8fc5fdd13a57	8e2eb727-8a2a-4fae-b05c-db928262a3f9	Interoperabilitas dalam ekosistem fintech berarti:	{"Hanya satu penyedia boleh beroperasi","Sistem/penyedia berbeda dapat bekerja sama","Wajib memakai uang tunai","Tiap toko butuh kode berbeda"}	1	Interoperabilitas memungkinkan penyedia berbeda saling bertransaksi dengan mulus.	sulit	9
e2772f6b-3783-45f2-8e94-4a24cce1aaf2	f895241b-58bc-4684-97af-1cc55c55b355	QRIS di Indonesia terutama menstandarkan:	{"Suku bunga","Pembayaran kode QR lintas penyedia","Perdagangan saham","Persetujuan pinjaman"}	1	QRIS menyatukan pembayaran QR lintas penyedia.	mudah	0
a224a96b-a2e4-4705-9d12-37b7a346dff0	f895241b-58bc-4684-97af-1cc55c55b355	E-wallet adalah:	{"Dompet kulit fisik","Akun digital penyimpan dana untuk transaksi elektronik","Sejenis pinjaman","Skor kredit"}	1	E-wallet menyimpan saldo digital untuk pembayaran dan transfer.	mudah	1
46e20afe-9383-44bf-9f30-eaebb2fa7d76	f895241b-58bc-4684-97af-1cc55c55b355	Praktik yang PALING meningkatkan keamanan mobile banking:	{"Membagikan OTP ke petugas","PIN unik kuat + biometrik/2FA","Menyimpan sandi di catatan publik","Transaksi via Wi-Fi publik"}	1	Autentikasi kuat dan 2FA melindungi akses.	sedang	2
0cf54fcc-4aa6-4fa0-9485-9e9024151098	f895241b-58bc-4684-97af-1cc55c55b355	OTP seharusnya:	{"Dibagikan bila diminta","Dirahasiakan, tidak diungkap ke pihak ketiga","Diumumkan publik","Dipakai ulang tiap login"}	1	OTP mengautentikasi Anda; mengungkapkannya berarti menyerahkan akses.	mudah	3
fdeed21c-0372-487f-bfe3-acbc0737dd0b	f895241b-58bc-4684-97af-1cc55c55b355	Saldo 'float' e-wallet berisiko jika:	{"Anda aktifkan 2FA","Penyedia tidak berizin dan bangkrut","Anda cek saldo sering","Anda pakai QRIS"}	1	Penyedia tak diatur membawa risiko atas dana tersimpan.	sulit	4
9f489f8c-ab7b-46c2-bc66-b9fe8235a935	f895241b-58bc-4684-97af-1cc55c55b355	Pembayaran nirsentuh/NFC bekerja dengan:	{"Mengirim tunai lewat pos","Komunikasi nirkabel jarak dekat perangkat-terminal","Menelepon bank","Sidik jari di ATM"}	1	NFC memungkinkan bayar-tempel pada jarak beberapa sentimeter.	sedang	5
0f959765-7ad2-4479-a73a-5f068fd90785	f895241b-58bc-4684-97af-1cc55c55b355	Tanda bahaya saat pembayaran digital:	{"Pedagang menampilkan QRIS resmi","Diminta transfer ke rekening pribadi 'untuk verifikasi'","Struk dikirim ke aplikasi","Notifikasi transaksi"}	1	Verifikasi sah tidak pernah meminta transfer ke rekening pribadi.	sedang	6
cbe446af-94a9-4f71-a590-b2dc66b6ca5c	f895241b-58bc-4684-97af-1cc55c55b355	Notifikasi transaksi berharga karena:	{"Menambah biaya","Memungkinkan deteksi cepat aktivitas tak sah","Memperlambat bayar","Mengganti sandi"}	1	Notifikasi real-time memunculkan penipuan cepat.	mudah	7
6ac279e2-cd77-412f-97cc-6facd90bfa75	f895241b-58bc-4684-97af-1cc55c55b355	Sebelum mengunduh aplikasi perbankan, verifikasi:	{"Skema warna","Penerbit & sumber resmi","Jumlah iklan","Hanya ukuran file"}	1	Verifikasi penerbit mencegah aplikasi palsu/berbahaya.	sedang	8
204e0aed-7fb9-4e7f-a3ca-80067c985645	f895241b-58bc-4684-97af-1cc55c55b355	Wi-Fi publik berisiko untuk perbankan karena:	{"Selalu lebih cepat","Lalu lintas bisa disadap di jaringan tak aman","Memblokir semua aplikasi","Mengenkripsi otomatis"}	1	Jaringan tak aman memungkinkan penyadapan.	sulit	9
a8608f1b-1daf-45b1-a3c3-b53d137f7725	f6676a51-e9ed-4293-9e49-c3fa62933d09	Tujuan utama anggaran pribadi:	{"Menghapus semua pengeluaran","Merencanakan alokasi penghasilan","Menambah utang","Menghindari bank"}	1	Anggaran mengalokasikan penghasilan dengan sengaja.	mudah	0
dadbaf7b-3768-4fd3-9a32-da55904962ec	f6676a51-e9ed-4293-9e49-c3fa62933d09	Aturan 50/30/20 mengalokasikan 20% untuk:	{Keinginan,Kebutuhan,"Tabungan & pelunasan utang",Hiburan}	2	20% untuk tabungan/pelunasan utang.	mudah	1
95cfdbb7-fb70-4526-ab79-67962e79dd54	42925138-c169-4ba7-ae40-4f0e20773f95	Bunga 0,8%/hari selama 30 hari setara:	{"0,8% total","24% total","8% total","80% total"}	1	0,8% × 30 hari = 24%.	sedang	2
f2d3143b-968f-4b2b-89e2-0e7cecc613ff	f6676a51-e9ed-4293-9e49-c3fa62933d09	Dana darurat paling tepat adalah:	{"Uang di saham","Tabungan likuid 3–6 bulan pengeluaran pokok","Limit kartu kredit","Tabungan pensiun"}	1	Dana darurat harus likuid dan menutup biaya pokok.	sedang	2
7aef0138-adba-4fed-a852-8afb8273e0f7	f6676a51-e9ed-4293-9e49-c3fa62933d09	'Kebutuhan', bukan 'keinginan':	{"Langganan streaming","Tempat tinggal","Gawai baru","Makan di luar"}	1	Tempat tinggal bersifat pokok.	mudah	3
5f80b200-f80d-49fb-b522-366b9fb584ae	f6676a51-e9ed-4293-9e49-c3fa62933d09	'Membayar diri sendiri dulu' berarti:	{"Belanja diri sebelum tagihan","Menabung otomatis sebelum belanja diskresioner","Ambil uang muka gaji","Beli barang mewah dulu"}	1	Memprioritaskan menabung dengan otomatisasi.	sedang	4
74b33ebe-317c-48f7-a102-2a5fae3a8e1c	f6676a51-e9ed-4293-9e49-c3fa62933d09	Bunga majemuk berarti bunga atas:	{"Hanya pokok","Pokok + bunga terakumulasi sebelumnya","Inflasi saja","Biaya bank"}	1	Bunga atas bunga mempercepat pertumbuhan.	sedang	5
48717078-4de2-40cd-87b9-4eb542c5ad30	f6676a51-e9ed-4293-9e49-c3fa62933d09	'T' dalam tujuan SMART berarti:	{Berisiko,"Berbatas waktu (Time-bound)","Bebas pajak","Tak terbatas"}	1	T = Time-bound, ada batas waktu.	mudah	6
a9b80b98-d67e-4304-8051-49ed432ae495	f6676a51-e9ed-4293-9e49-c3fa62933d09	Inflasi gaya hidup adalah:	{"Naiknya harga toko","Naiknya pengeluaran saat penghasilan naik, menggerus tabungan","Perubahan bunga","Pelemahan mata uang"}	1	Pengeluaran tumbuh mengikuti penghasilan.	sulit	7
3dee3ebd-6b63-43a3-a35a-6c99028f8228	f6676a51-e9ed-4293-9e49-c3fa62933d09	Alat terbaik melacak pengeluaran harian otomatis:	{"Buku kertas saja","Aplikasi pencatat terhubung rekening",Kalkulator,Obligasi}	1	Aplikasi terhubung mencatat transaksi otomatis.	mudah	8
57714841-def4-47f1-90c0-9589adc7e941	f6676a51-e9ed-4293-9e49-c3fa62933d09	Kekayaan bersih dihitung sebagai:	{"Penghasilan - pengeluaran","Aset - liabilitas","Tabungan + gaji","Total pengeluaran tahunan"}	1	Kekayaan bersih = yang dimiliki - yang diutangkan.	sedang	9
54876bb8-d111-4936-b337-d7f879cd0dce	42925138-c169-4ba7-ae40-4f0e20773f95	P2P lending berarti:	{"Pinjaman dari pemerintah","Peminjam & pemberi pinjaman terhubung langsung tanpa bank","Deposito bank","Kartu kredit"}	1	P2P mempertemukan peminjam-pemberi pinjaman langsung.	mudah	0
e795910a-7c54-434c-bb29-de967efa25bd	42925138-c169-4ba7-ae40-4f0e20773f95	Pinjol ilegal biasanya:	{"Terdaftar di OJK","Menawarkan 'cair tanpa syarat' & minta akses kontak","Bunga rendah","Diawasi pemerintah"}	1	Pinjol ilegal menjebak dengan kemudahan palsu.	mudah	1
e6d34c39-1654-4cc7-a425-d5611c1ba079	42925138-c169-4ba7-ae40-4f0e20773f95	Jika tidak mampu membayar pinjol legal:	{"Diam saja","Hubungi penyedia untuk negosiasi restrukturisasi","Pinjam lagi dari pinjol lain","Blokir nomor mereka"}	1	Komunikasi dan negosiasi lebih baik daripada menghindari.	sulit	9
9918197b-8712-4268-95ba-942aedc89d39	55488721-a8bf-4dd6-868f-3c6522fca5e4	Phishing adalah upaya untuk:	{"Menaikkan skor kredit","Mengelabui agar mengungkapkan kredensial/data pribadi","Menaikkan bunga","Memasang antivirus"}	1	Phishing menipu pengguna agar menyerahkan informasi sensitif.	mudah	0
c45976f1-c7f9-4fbe-93d5-d87d2d9c0555	55488721-a8bf-4dd6-868f-3c6522fca5e4	Tanda bahaya phishing klasik:	{"Pesan teman soal makan siang","Desakan meminta sandi/OTP lewat tautan","Mutasi bulanan di aplikasi","Pemberitahuan libur bank"}	1	Desakan + permintaan kredensial lewat tautan adalah ciri phishing.	mudah	1
f9bad7a0-9e51-4e74-8710-2a29039edf1b	55488721-a8bf-4dd6-868f-3c6522fca5e4	2FA melindungi dengan:	{"Meminta bukti identitas kedua selain sandi","Menghapus kebutuhan sandi","Membagikan data luas","Menonaktifkan notifikasi"}	0	2FA menambah faktor kedua.	sedang	2
a5ffeeb7-b836-4c8e-907c-21be941d8a75	55488721-a8bf-4dd6-868f-3c6522fca5e4	Jika 'bank' menelepon meminta PIN & OTP lengkap, Anda:	{"Memberikannya segera","Menolak & hubungi bank lewat saluran resmi","Mengumumkan daring","Mengirim lewat email"}	1	Bank tidak pernah meminta PIN/OTP lengkap.	mudah	3
e006f93e-1f6c-43a9-b614-bb295a46e4d8	55488721-a8bf-4dd6-868f-3c6522fca5e4	Kata sandi kuat adalah:	{"Tanggal lahir","Panjang, unik, tak dipakai ulang",'123456',"Nama hewan peliharaan"}	1	Panjang, unik, tak dipakai ulang mengalahkan serangan umum.	mudah	4
f525004a-931a-451a-8bfe-0b8fba0692f9	55488721-a8bf-4dd6-868f-3c6522fca5e4	'Smishing' adalah phishing lewat:	{Email,SMS,Telepon,Faks}	1	Smishing dihantarkan melalui SMS.	sedang	5
9394f23a-071b-4c53-bb05-bbff91c83370	55488721-a8bf-4dd6-868f-3c6522fca5e4	Skema Ponzi membayar dengan:	{"Keuntungan nyata","Uang investor baru untuk investor lama","Hibah pemerintah","Bunga bank"}	1	Ponzi membayar investor lama dari setoran baru sampai runtuh.	sulit	6
7a0f4676-e47d-41fc-a708-4d1dd5f87f0d	55488721-a8bf-4dd6-868f-3c6522fca5e4	Minimalisasi data berarti:	{"Mengumpulkan sebanyak mungkin","Berbagi/mengumpulkan hanya yang perlu","Hapus semua akun","Tidak mengenkripsi"}	1	Minimalisasi membatasi eksposur data.	sulit	7
4ca0a5eb-b603-4583-b974-45690dfb64a9	55488721-a8bf-4dd6-868f-3c6522fca5e4	Wi-Fi publik berisiko karena:	{"Selalu lebih cepat","Lalu lintas bisa disadap di jaringan tak aman","Memblokir aplikasi","Mengenkripsi otomatis"}	1	Jaringan tak aman memungkinkan penyadapan.	sedang	8
51f5a54e-300d-4beb-8457-ee2603839f9b	55488721-a8bf-4dd6-868f-3c6522fca5e4	Tawaran 'imbal hasil tinggi dijamin tanpa risiko' adalah:	{"Peluang bagus","Tanda kuat penipuan","Selalu sah","Dijamin pemerintah"}	1	Imbal hasil tinggi dijamin tanpa risiko adalah tanda bahaya.	mudah	9
75616817-63fc-41c0-b97e-9bc9921cedf2	cf295e27-f4ac-4247-918a-8df47561781d	Penyelesaian sengketa sebaiknya diupayakan melalui:	{"Langsung jalur hukum","Mediasi/lembaga alternatif sebelum jalur hukum","Tidak diselesaikan","Balas dendam"}	1	Mediasi/alternatif diupayakan sebelum jalur hukum.	sulit	6
cc328b07-fcc7-4eeb-8d5e-557fe7375aef	cf295e27-f4ac-4247-918a-8df47561781d	Kerahasiaan data konsumen berarti penyedia harus:	{"Menjual data ke pihak lain","Melindungi dan tidak menyalahgunakan data","Mengumumkan data publik","Mengabaikan keamanan"}	1	Penyedia wajib melindungi data konsumen.	sedang	7
eef61631-8da3-4def-bfe7-df49ada167a0	cf295e27-f4ac-4247-918a-8df47561781d	Transparansi biaya adalah:	{"Kebaikan opsional penyedia","Hak konsumen","Hal yang tidak penting","Hanya untuk nasabah besar"}	1	Transparansi adalah hak, bukan kemurahan penyedia.	mudah	8
2ae3721d-c3e4-45be-bc46-52c3bc836028	42925138-c169-4ba7-ae40-4f0e20773f95	'Gali lubang tutup lubang' berarti:	{"Menabung rutin","Meminjam untuk membayar pinjaman lain","Investasi diversifikasi","Membayar tepat waktu"}	1	Pola ini memperbesar total utang.	mudah	3
888bdbe7-9e66-4eec-adf7-c7d82d90b9ff	42925138-c169-4ba7-ae40-4f0e20773f95	Sebelum meminjam, yang HARUS dihitung:	{"Warna aplikasi","Total biaya termasuk bunga & biaya admin","Jumlah unduhan","Rating aplikasi saja"}	1	Total biaya menunjukkan beban sebenarnya.	sedang	4
a1c2f3d4-0ce7-495e-94cb-f821a0204d3c	42925138-c169-4ba7-ae40-4f0e20773f95	Tanda pinjol legal:	{"Iklan di media sosial","Terdaftar/berizin di OJK","Cair 5 menit","Tanpa syarat"}	1	Status OJK adalah penanda utama legalitas.	mudah	5
8c796617-d476-4243-a2d9-84fe6ea079be	42925138-c169-4ba7-ae40-4f0e20773f95	Risiko terbesar pinjaman konsumtif:	{"Bunga rendah","Keterlilitan utang berlebihan","Meningkatkan tabungan","Menambah aset"}	1	Pinjaman konsumtif tanpa perencanaan menjerat utang.	sedang	6
1af15895-c6f8-4d0d-a781-4de7058e677e	42925138-c169-4ba7-ae40-4f0e20773f95	Denda keterlambatan pinjol berfungsi:	{"Mengurangi utang","Menambah beban total pinjaman","Menghapus bunga","Memberi diskon"}	1	Denda memperbesar total yang harus dibayar.	sedang	7
83af36bc-6820-4f40-ac79-cf7bc1e66670	42925138-c169-4ba7-ae40-4f0e20773f95	Pinjaman sebaiknya diambil untuk:	{"Beli gawai impian","Kebutuhan mendesak yang terencana","Ikut tren","Investasi bodong"}	1	Pinjaman untuk kebutuhan mendesak dengan perhitungan matang.	sulit	8
8c7c2b25-a27f-49d3-a9ab-eec86ac01421	cf295e27-f4ac-4247-918a-8df47561781d	Hak dasar konsumen layanan keuangan meliputi:	{"Tidak berhak apa pun","Informasi jujur, perlakuan adil, kerahasiaan data","Hanya hak komplain","Hanya potongan harga"}	1	Konsumen berhak atas informasi jujur, perlakuan adil, dan kerahasiaan data.	mudah	0
74ffdfe6-4874-4fcf-b706-6cbb61cbd75e	cf295e27-f4ac-4247-918a-8df47561781d	Sebelum menyetujui produk keuangan, konsumen berhak tahu:	{"Warna logo","Total biaya, bunga, denda, ketentuan","Jumlah karyawan","Lokasi kantor saja"}	1	Transparansi biaya dan ketentuan adalah hak konsumen.	mudah	1
88bada38-f88f-4544-b783-3380565e415b	cf295e27-f4ac-4247-918a-8df47561781d	Tanda bahaya terkait transparansi:	{"Biaya dijelaskan di awal","Biaya disembunyikan & tekanan untuk segera setuju","Ada ringkasan ketentuan","Ada nomor layanan resmi"}	1	Menyembunyikan biaya dan menekan adalah tanda bahaya.	sedang	2
f3d98d94-f065-4249-983d-bbed082bc2a6	cf295e27-f4ac-4247-918a-8df47561781d	Langkah pertama bila dirugikan penyedia:	{"Diam saja","Mengadu ke penyedia dengan bukti, lalu kanal resmi","Menyebar di media sosial tanpa bukti","Berhenti memakai semua aplikasi"}	1	Adukan ke penyedia dahulu, lalu kanal resmi, dengan bukti.	sedang	3
e29a7fbe-d825-4fd4-801d-d3f0ea164911	cf295e27-f4ac-4247-918a-8df47561781d	Yang penting disimpan sebagai bukti sengketa:	{"Tidak ada","Tangkapan layar, perjanjian, riwayat transaksi","Hanya nama aplikasi","Hanya rating"}	1	Dokumentasi memperkuat posisi konsumen.	mudah	4
cc5818a3-f64a-4fdb-a887-62dd23c37c31	cf295e27-f4ac-4247-918a-8df47561781d	Di Indonesia, pengaduan layanan keuangan dapat diteruskan melalui:	{"Tidak ada lembaga","Mekanisme melalui OJK","Hanya kepolisian","Hanya media massa"}	1	Tersedia mekanisme pengaduan melalui OJK.	sedang	5
0a3ddf88-8de1-45d7-a300-df0d0618bd06	cf295e27-f4ac-4247-918a-8df47561781d	Perlindungan konsumen pada akhirnya bertujuan:	{"Menghambat industri","Memastikan perlakuan adil & menjaga kepercayaan","Menaikkan biaya","Mengurangi pilihan"}	1	Tujuannya perlakuan adil dan menjaga kepercayaan sistem.	sedang	9
\.


--
-- Data for Name: scenario_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scenario_results (id, "userId", "scenarioId", "choiceIndex", quality) FROM stdin;
1dbb4afd-05af-4311-992a-fc91f6eae2d9	0a42f481-ce02-4871-8f5f-405d6ae16e8f	6bcb7ee7-713a-43d6-a3f0-73bf64bdff0a	0	0
3b73b644-c954-4b90-9e6b-835b04506994	0a42f481-ce02-4871-8f5f-405d6ae16e8f	9b208ab0-49c5-44ac-9ccd-80165f78e1fb	1	2
31be574c-220a-4fb6-836e-287711462f31	0a42f481-ce02-4871-8f5f-405d6ae16e8f	c9284279-9712-434f-8121-d6d090965b63	1	2
32f51c0b-64ee-4da0-b9e6-c2b9717a81c3	0a42f481-ce02-4871-8f5f-405d6ae16e8f	de18d362-0eb8-4e62-b1cc-97751b43ef83	1	2
2997a4fd-43b3-4272-859c-224b0355aa5f	0a42f481-ce02-4871-8f5f-405d6ae16e8f	01dbab49-3447-4420-8aed-52224583823f	2	1
d8725c5f-32e5-47c3-bd8b-a046193f07d5	0a42f481-ce02-4871-8f5f-405d6ae16e8f	9a8d2806-5142-4fcf-a47a-164dc861d845	1	2
8ac92077-d1f7-40ec-87d4-4ba1f16971cf	0a42f481-ce02-4871-8f5f-405d6ae16e8f	2f0e97f2-57a5-47cf-81ee-17e4cf4a721c	1	2
f75f77a3-2f72-4e7e-87a9-cdedc89aa032	0a42f481-ce02-4871-8f5f-405d6ae16e8f	23b1eae3-7723-4a19-9325-330d5179a27a	1	2
\.


--
-- Data for Name: scenarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scenarios (id, slug, theme, situation, choices, "order") FROM stdin;
6bcb7ee7-713a-43d6-a3f0-73bf64bdff0a	s1	Pinjaman Online	Anda butuh Rp2.000.000 mendesak. Sebuah iklan menawarkan 'cair 5 menit, tanpa syarat, cukup kirim KTP dan izinkan akses kontak'. Apa yang Anda lakukan?	[{"t": "Langsung daftar, uang lebih penting sekarang", "outcome": "Aplikasi ternyata pinjol ilegal. Bunga membengkak dan kontak Anda dihubungi untuk intimidasi saat telat bayar.", "quality": 0}, {"t": "Cek dulu status legalitasnya di OJK sebelum memutuskan", "outcome": "Anda menemukan aplikasi itu tidak terdaftar. Anda menghindarinya dan mencari alternatif resmi.", "quality": 2}, {"t": "Tanya teman yang pernah pakai, ikut saja kalau dia aman", "outcome": "Pengalaman satu orang bukan jaminan legalitas.", "quality": 1}]	1
01dbab49-3447-4420-8aed-52224583823f	s2	Investasi Bodong	Seorang kenalan mengajak investasi 'dijamin untung 15% per bulan, tanpa risiko' asal Anda juga mengajak dua orang lain. Sikap Anda?	[{"t": "Ikut, untungnya besar dan ada yang sudah dapat", "outcome": "Ini ciri skema Ponzi/piramida. Skema runtuh dan dana Anda hilang.", "quality": 0}, {"t": "Tolak — 'untung tinggi dijamin tanpa risiko' itu tidak ada", "outcome": "Anda mengenali tanda bahaya klasik penipuan.", "quality": 2}, {"t": "Coba dengan uang kecil dulu untuk lihat hasilnya", "outcome": "Skema sengaja membayar di awal untuk memancing setoran lebih besar.", "quality": 1}]	2
9b208ab0-49c5-44ac-9ccd-80165f78e1fb	s3	Phishing	Anda menerima SMS: 'Akun bank Anda diblokir. Klik tautan ini dan masukkan PIN serta OTP untuk mengaktifkan kembali.' Tindakan Anda?	[{"t": "Klik tautan dan masukkan data agar akun aktif lagi", "outcome": "Tautan adalah situs palsu. Kredensial Anda dicuri.", "quality": 0}, {"t": "Abaikan SMS, buka aplikasi resmi/hubungi call center bank", "outcome": "Anda memverifikasi lewat saluran resmi — ternyata tidak ada pemblokiran.", "quality": 2}, {"t": "Klik tautan untuk lihat dulu, tapi tidak isi data", "outcome": "Mengklik tautan mencurigakan tetap berisiko.", "quality": 1}]	3
c9284279-9712-434f-8121-d6d090965b63	s4	QRIS Palsu	Di sebuah toko, kasir menempelkan stiker QR baru di atas QRIS resmi. Nama penerima yang muncul bukan nama toko. Apa yang Anda lakukan?	[{"t": "Tetap bayar, mungkin itu rekening pemilik", "outcome": "Dana masuk ke rekening penipu.", "quality": 0}, {"t": "Batalkan, konfirmasi ke kasir karena nama penerima tak sesuai", "outcome": "Anda menyadari ketidaksesuaian dan menghindari penipuan.", "quality": 2}, {"t": "Bayar tunai saja tanpa menanyakan apa pun", "outcome": "Anda terhindar, tetapi penipuan dibiarkan.", "quality": 1}]	4
de18d362-0eb8-4e62-b1cc-97751b43ef83	s5	Anggaran	Gaji pertama Anda Rp4.000.000 baru masuk. Ada diskon gawai impian Rp3.500.000 hari ini saja. Anda belum punya dana darurat. Keputusan Anda?	[{"t": "Beli sekarang, mumpung diskon besar", "outcome": "Anda kehabisan dana untuk kebutuhan.", "quality": 0}, {"t": "Tahan, sisihkan untuk kebutuhan & mulai dana darurat dulu", "outcome": "Anda menerapkan prioritas keuangan yang sehat.", "quality": 2}, {"t": "Beli versi lebih murah dengan setengah uang", "outcome": "Lebih baik, tetapi membeli keinginan sebelum dana darurat tetap berisiko.", "quality": 1}]	5
9a8d2806-5142-4fcf-a47a-164dc861d845	s6	Perlindungan Konsumen	Anda dikenai biaya tersembunyi pada layanan keuangan digital yang tidak dijelaskan saat mendaftar. Langkah Anda?	[{"t": "Diamkan saja, jumlahnya kecil", "outcome": "Hak Anda terabaikan.", "quality": 0}, {"t": "Kumpulkan bukti, ajukan keluhan ke penyedia, lalu kanal resmi", "outcome": "Anda menggunakan hak konsumen dengan benar.", "quality": 2}, {"t": "Marah-marah di media sosial tanpa bukti", "outcome": "Keluhan tanpa dokumentasi lemah.", "quality": 1}]	6
2f0e97f2-57a5-47cf-81ee-17e4cf4a721c	s7	Keamanan Akun	Sebuah aplikasi baru meminta izin akses ke kontak, galeri, lokasi, dan mikrofon padahal fungsinya hanya pencatat keuangan. Sikap Anda?	[{"t": "Setujui semua agar aplikasi cepat jalan", "outcome": "Anda memberi akses berlebihan.", "quality": 0}, {"t": "Tolak izin yang tak relevan dengan fungsi aplikasi", "outcome": "Anda menerapkan minimalisasi data.", "quality": 2}, {"t": "Setujui sebagian, tapi tidak yakin yang mana penting", "outcome": "Lebih baik, tetapi risiko tetap ada.", "quality": 1}]	7
23b1eae3-7723-4a19-9325-330d5179a27a	s8	Fintech Lending	Anda sudah punya satu cicilan pinjol. Datang tawaran pinjol lain untuk 'menutup' cicilan pertama dengan tenor lebih panjang. Keputusan Anda?	[{"t": "Ambil, supaya cicilan bulanan lebih ringan", "outcome": "Anda masuk pola 'gali lubang tutup lubang'.", "quality": 0}, {"t": "Hentikan menambah utang, susun rencana pelunasan yang realistis", "outcome": "Anda memutus rantai utang.", "quality": 2}, {"t": "Ambil tapi berjanji ini yang terakhir", "outcome": "Niat baik tanpa rencana konkret jarang berhasil.", "quality": 1}]	8
\.


--
-- Data for Name: sim_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sim_events (id, slug, theme, icon, text, choices, "order") FROM stdin;
1b763c65-1f1c-409f-864d-42cbefc1eb9b	e1	Anggaran Awal	📊	Uang bulanan Rp3.000.000 baru masuk. Apa langkah pertama Anda?	[{"t": "Sisihkan Rp600.000 untuk tabungan dulu, baru atur sisanya", "dSaving": 600000, "outcome": "Bijak — 'membayar diri sendiri dulu' mengamankan tabungan.", "quality": 2, "dBalance": 0}, {"t": "Belanja dulu sesuai keinginan, sisanya baru ditabung", "dSaving": 0, "outcome": "Berisiko — menabung dari 'sisa' sering berakhir tanpa tabungan.", "quality": 0, "dBalance": 0}, {"t": "Tabung setengahnya, Rp1.500.000", "dSaving": 1500000, "outcome": "Niat baik, tetapi terlalu ketat bisa membuat kehabisan.", "quality": 1, "dBalance": 0}]	1
ff534538-3a46-47e3-8999-7714b5b24c42	e2	Pinjaman Online	💸	Muncul iklan: 'Pinjaman cair 5 menit tanpa syarat, cukup izinkan akses kontak'. Anda sedang ingin membeli gawai baru.	[{"t": "Abaikan — ini ciri pinjol ilegal dan saya tidak butuh utang untuk keinginan", "dSaving": 0, "outcome": "Tepat. Anda menghindari jebakan utang berbunga tinggi.", "quality": 2, "dBalance": 0}, {"t": "Ambil pinjaman untuk beli gawai sekarang", "dSaving": 0, "outcome": "Bunga dan biaya tersembunyi menggerus saldo Anda.", "quality": 0, "dBalance": -500000}, {"t": "Ambil pinjaman kecil saja untuk coba-coba", "dSaving": 0, "outcome": "Meski kecil, Anda kini terikat pinjol berisiko.", "quality": 0, "dBalance": -200000}]	2
a7254009-24a3-4408-9e00-01cf4be8e9dc	e3	Penipuan Pembayaran	🎣	SMS: 'Selamat! Anda menang undian Rp10.000.000. Bayar pajak Rp300.000 dulu ke rekening ini untuk mencairkan.'	[{"t": "Abaikan — undian sah tidak meminta bayar di muka", "dSaving": 0, "outcome": "Benar. 'Bayar dulu untuk dapat hadiah' adalah ciri penipuan.", "quality": 2, "dBalance": 0}, {"t": "Bayar Rp300.000, hadiahnya jauh lebih besar", "dSaving": 0, "outcome": "Uang Anda hilang dan hadiah tidak pernah ada.", "quality": 0, "dBalance": -300000}, {"t": "Balas untuk menanyakan detail undian", "dSaving": 0, "outcome": "Membalas menandakan nomor Anda aktif.", "quality": 1, "dBalance": 0}]	3
f7716290-e051-4313-97be-39078ceafd9c	e4	Keamanan Akun	🔐	Sebuah aplikasi keuangan baru meminta Anda membuat kata sandi dan menawarkan login lebih cepat tanpa verifikasi tambahan.	[{"t": "Pakai kata sandi unik & aktifkan autentikasi dua faktor (2FA)", "dSaving": 0, "outcome": "Aman. 2FA membuat akun tetap terlindungi.", "quality": 2, "dBalance": 0}, {"t": "Pakai kata sandi yang sama dengan akun lain agar mudah diingat", "dSaving": 0, "outcome": "Berisiko — bila satu akun bobol, semua terancam.", "quality": 0, "dBalance": 0}, {"t": "Lewati 2FA supaya login lebih cepat", "dSaving": 0, "outcome": "Kurang aman.", "quality": 1, "dBalance": 0}]	4
d4831bdf-fd6b-42ad-b38a-32f3ed883388	e5	Investasi	📈	Anda punya tabungan Rp600.000 lebih. Seorang teman menawarkan 'investasi untung 20% per bulan dijamin tanpa risiko'.	[{"t": "Tolak; pelajari produk investasi resmi yang sesuai profil risiko", "dSaving": 0, "outcome": "Tepat. 'Untung tinggi dijamin tanpa risiko' tidak ada.", "quality": 2, "dBalance": 0}, {"t": "Masukkan semua tabungan, mumpung untung besar", "dSaving": -600000, "outcome": "Skema runtuh dan tabungan Anda hilang.", "quality": 0, "dBalance": 0}, {"t": "Coba dengan setengah tabungan saja", "dSaving": -300000, "outcome": "Tetap rugi.", "quality": 0, "dBalance": 0}]	5
78d1a5f2-b979-425e-bfa1-cf1977a8b3a0	e6	Perlindungan Konsumen	⚖️	Di akhir bulan Anda menyadari ada potongan biaya Rp50.000 yang tak pernah dijelaskan oleh sebuah layanan.	[{"t": "Kumpulkan bukti, ajukan keluhan resmi ke penyedia; bila buntu, ke OJK", "dSaving": 0, "outcome": "Tepat. Anda menggunakan hak konsumen.", "quality": 2, "dBalance": 50000}, {"t": "Biarkan saja, jumlahnya kecil", "dSaving": 0, "outcome": "Hak Anda terlepas.", "quality": 1, "dBalance": 0}, {"t": "Tutup akun dan pindah tanpa mengadu", "dSaving": 0, "outcome": "Anda menghindar, tetapi tidak menyelesaikan masalah.", "quality": 1, "dBalance": 0}]	6
\.


--
-- Data for Name: simulation_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.simulation_results (id, "userId", balance, saving, "avgQuality", pct, passed, "choicesLog") FROM stdin;
acb07d03-8ad0-47a1-9a16-ebb79b4da5ab	0a42f481-ce02-4871-8f5f-405d6ae16e8f	3050000	1500000	1.83	92	t	[{"dSaving": 1500000, "eventId": "1b763c65-1f1c-409f-864d-42cbefc1eb9b", "quality": 1, "dBalance": 0, "eventSlug": "e1", "choiceIndex": 2}, {"dSaving": 0, "eventId": "ff534538-3a46-47e3-8999-7714b5b24c42", "quality": 2, "dBalance": 0, "eventSlug": "e2", "choiceIndex": 0}, {"dSaving": 0, "eventId": "a7254009-24a3-4408-9e00-01cf4be8e9dc", "quality": 2, "dBalance": 0, "eventSlug": "e3", "choiceIndex": 0}, {"dSaving": 0, "eventId": "f7716290-e051-4313-97be-39078ceafd9c", "quality": 2, "dBalance": 0, "eventSlug": "e4", "choiceIndex": 0}, {"dSaving": 0, "eventId": "d4831bdf-fd6b-42ad-b38a-32f3ed883388", "quality": 2, "dBalance": 0, "eventSlug": "e5", "choiceIndex": 0}, {"dSaving": 0, "eventId": "78d1a5f2-b979-425e-bfa1-cf1977a8b3a0", "quality": 2, "dBalance": 50000, "eventSlug": "e6", "choiceIndex": 0}]
\.


--
-- Data for Name: user_badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_badges (id, "userId", "badgeId") FROM stdin;
7997d0b4-28a1-4da7-bab6-439761c59c54	7687a75f-4a80-4176-bdf9-9b0ad29bbac1	explorer
472ad9fd-f3c1-4e61-84ea-54ea15d5010b	7687a75f-4a80-4176-bdf9-9b0ad29bbac1	perfect
5f51550e-c6bf-4874-8f3d-5e65a66c4ea1	acb4c259-35af-44ff-a41b-8f066e5798fa	explorer
d50c7745-5ff1-407f-8a1f-46802b34e85a	0a42f481-ce02-4871-8f5f-405d6ae16e8f	explorer
4ec44d89-31f6-4f4a-b336-2a90b9b92cba	0a42f481-ce02-4871-8f5f-405d6ae16e8f	perfect
3300f78a-cb1a-4063-8d58-14b7760b18ee	0a42f481-ce02-4871-8f5f-405d6ae16e8f	borrower
f10d3c08-f369-46c2-93e3-19564832bacf	0a42f481-ce02-4871-8f5f-405d6ae16e8f	guardian
bbf4697c-e154-48cf-ab0c-3c41de2c7f90	0a42f481-ce02-4871-8f5f-405d6ae16e8f	saver
4e470f45-756d-4c75-af35-1210bc27eec0	0a42f481-ce02-4871-8f5f-405d6ae16e8f	advocate
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, name, password, role, points, streak, "lastLoginDay", "todayLessons", "joinedAt", "updatedAt") FROM stdin;
47aecf38-0346-435d-b75b-47acc9e8868d	ayu@student.ac.id	Ayu P.	$2b$10$Eh7crNBgPGE2lvu6X/OXXubdVZ1rulozNQQ51FYocSRUgXKQSAa9W	STUDENT	1240	1	\N	0	2026-07-03 07:57:48.594	2026-07-03 07:57:48.594
7579fada-6576-4b79-b1e7-39b5b3f6ba49	budi@student.ac.id	Budi S.	$2b$10$Eh7crNBgPGE2lvu6X/OXXubdVZ1rulozNQQ51FYocSRUgXKQSAa9W	STUDENT	980	1	\N	0	2026-07-03 07:57:48.597	2026-07-03 07:57:48.597
30f1cba0-b623-4142-b72b-727e68e4050c	citra@student.ac.id	Citra W.	$2b$10$Eh7crNBgPGE2lvu6X/OXXubdVZ1rulozNQQ51FYocSRUgXKQSAa9W	STUDENT	760	1	\N	0	2026-07-03 07:57:48.599	2026-07-03 07:57:48.599
a9bf6e40-cb59-4046-85ea-140fcfb4b630	dewi@student.ac.id	Dewi R.	$2b$10$Eh7crNBgPGE2lvu6X/OXXubdVZ1rulozNQQ51FYocSRUgXKQSAa9W	STUDENT	540	1	\N	0	2026-07-03 07:57:48.601	2026-07-03 07:57:48.601
0e250180-ed4b-4f22-8373-efe23ab95412	eko@student.ac.id	Eko H.	$2b$10$Eh7crNBgPGE2lvu6X/OXXubdVZ1rulozNQQ51FYocSRUgXKQSAa9W	STUDENT	410	1	\N	0	2026-07-03 07:57:48.602	2026-07-03 07:57:48.602
f33a6a8d-d226-4965-a723-b84a3bb0fdce	fitri@student.ac.id	Fitri N.	$2b$10$Eh7crNBgPGE2lvu6X/OXXubdVZ1rulozNQQ51FYocSRUgXKQSAa9W	STUDENT	300	1	\N	0	2026-07-03 07:57:48.604	2026-07-03 07:57:48.604
0a42f481-ce02-4871-8f5f-405d6ae16e8f	hidayatrulli@gmail.com	Rulli Hidayat	$2b$10$DySC.GXuGI8WKGs6BAa1Fu182JfMznXsiFFA1TL6cUwOHhr/9TTkq	STUDENT	1220	1	\N	6	2026-07-11 04:59:04.823	2026-07-11 05:31:13.91
acb4c259-35af-44ff-a41b-8f066e5798fa	willdan@gmail.com	willdan	$2b$10$rVKZAusPPkQFOvEvI/J82e.2Skn5lGMAzsvXeyE/uGoKB/GW2cCPi	STUDENT	285	1	Fri Jul 03 2026	4	2026-07-03 07:58:08.139	2026-07-03 11:52:59.856
bd3f29bf-fa8f-42ed-b5b1-56c74ffc1664	admin@digifinquest.ac.id	Admin DigiFin	$2b$10$OxpTodJQ3shIugBdNkANbOSj6XlOds17E/Rnaala/43Fsz3AEP4G2	ADMIN	40	1	Wed Jul 08 2026	0	2026-07-03 07:57:48.481	2026-07-08 02:39:55.423
7687a75f-4a80-4176-bdf9-9b0ad29bbac1	destria.kurnianti@gmail.com	Destria Kurnianti	$2b$10$W6Dyb.u15k1ulRVuDx9MWuRhp/I1CIrShwDqdjODcEX8Hy6j/7fFi	STUDENT	290	1	Wed Jul 08 2026	0	2026-07-03 08:23:58.708	2026-07-08 04:28:11.752
\.


--
-- Name: claimed_challenges claimed_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claimed_challenges
    ADD CONSTRAINT claimed_challenges_pkey PRIMARY KEY (id);


--
-- Name: completed_lessons completed_lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_lessons
    ADD CONSTRAINT completed_lessons_pkey PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: quiz_scores quiz_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_scores
    ADD CONSTRAINT quiz_scores_pkey PRIMARY KEY (id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- Name: scenario_results scenario_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenario_results
    ADD CONSTRAINT scenario_results_pkey PRIMARY KEY (id);


--
-- Name: scenarios scenarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenarios
    ADD CONSTRAINT scenarios_pkey PRIMARY KEY (id);


--
-- Name: sim_events sim_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sim_events
    ADD CONSTRAINT sim_events_pkey PRIMARY KEY (id);


--
-- Name: simulation_results simulation_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulation_results
    ADD CONSTRAINT simulation_results_pkey PRIMARY KEY (id);


--
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: claimed_challenges_userId_challengeId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "claimed_challenges_userId_challengeId_key" ON public.claimed_challenges USING btree ("userId", "challengeId");


--
-- Name: completed_lessons_userId_moduleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "completed_lessons_userId_moduleId_key" ON public.completed_lessons USING btree ("userId", "moduleId");


--
-- Name: modules_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX modules_slug_key ON public.modules USING btree (slug);


--
-- Name: quiz_scores_userId_moduleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "quiz_scores_userId_moduleId_key" ON public.quiz_scores USING btree ("userId", "moduleId");


--
-- Name: scenario_results_userId_scenarioId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "scenario_results_userId_scenarioId_key" ON public.scenario_results USING btree ("userId", "scenarioId");


--
-- Name: scenarios_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX scenarios_slug_key ON public.scenarios USING btree (slug);


--
-- Name: sim_events_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sim_events_slug_key ON public.sim_events USING btree (slug);


--
-- Name: simulation_results_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "simulation_results_userId_key" ON public.simulation_results USING btree ("userId");


--
-- Name: user_badges_userId_badgeId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON public.user_badges USING btree ("userId", "badgeId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: claimed_challenges claimed_challenges_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claimed_challenges
    ADD CONSTRAINT "claimed_challenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: completed_lessons completed_lessons_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_lessons
    ADD CONSTRAINT "completed_lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public.modules(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: completed_lessons completed_lessons_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_lessons
    ADD CONSTRAINT "completed_lessons_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quiz_scores quiz_scores_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_scores
    ADD CONSTRAINT "quiz_scores_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public.modules(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quiz_scores quiz_scores_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_scores
    ADD CONSTRAINT "quiz_scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quizzes quizzes_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT "quizzes_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public.modules(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: scenario_results scenario_results_scenarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenario_results
    ADD CONSTRAINT "scenario_results_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES public.scenarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: scenario_results scenario_results_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenario_results
    ADD CONSTRAINT "scenario_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: simulation_results simulation_results_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulation_results
    ADD CONSTRAINT "simulation_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_badges user_badges_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict gQVpViv7oz7bSiiTlth7oJ1Mu0bovBfkftw7m4SwrorBlYFl1bTjUqQDKdpvJw5

