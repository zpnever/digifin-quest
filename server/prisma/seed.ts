import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- SEED ADMIN USER ---
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@digifinquest.ac.id" },
    update: {},
    create: {
      email: "admin@digifinquest.ac.id",
      name: "Admin DigiFin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user seeded");

  // --- SEED SAMPLE STUDENTS ---
  const studentPassword = await bcrypt.hash("student123", 10);
  const peers = [
    { name: "Ayu P.", email: "ayu@student.ac.id", points: 1240 },
    { name: "Budi S.", email: "budi@student.ac.id", points: 980 },
    { name: "Citra W.", email: "citra@student.ac.id", points: 760 },
    { name: "Dewi R.", email: "dewi@student.ac.id", points: 540 },
    { name: "Eko H.", email: "eko@student.ac.id", points: 410 },
    { name: "Fitri N.", email: "fitri@student.ac.id", points: 300 },
  ];

  for (const p of peers) {
    await prisma.user.upsert({
      where: { email: p.email },
      update: { points: p.points },
      create: {
        email: p.email,
        name: p.name,
        password: studentPassword,
        role: "STUDENT",
        points: p.points,
      },
    });
  }
  console.log("✅ Sample students seeded");

  // --- SEED MODULES ---
  // Delete existing modules to re-seed cleanly
  await prisma.quiz.deleteMany();
  await prisma.module.deleteMany();

  const modulesData = [
    {
      slug: "m1",
      title: "Fintech Basics",
      topics: ["Definisi Fintech", "Jenis Fintech", "Ekosistem", "Manfaat & Risiko"],
      order: 1,
      lesson: {
        intro: "Fintech (financial technology) adalah pemanfaatan teknologi untuk menghadirkan layanan keuangan. Modul ini membangun fondasi: apa itu fintech, jenis-jenisnya, siapa pemainnya, serta manfaat dan risikonya.",
        sections: [
          { h: "Definisi Fintech", b: "Fintech adalah layanan keuangan yang dihantarkan melalui teknologi — mencakup pembayaran, pinjaman, investasi, hingga asuransi. Batasnya bukan 'perusahaan teknologi' melainkan 'layanan keuangan berbasis teknologi'." },
          { h: "Jenis Fintech", b: "Kategori utama: pembayaran (e-wallet, transfer), lending (termasuk peer-to-peer), wealthtech (investasi digital, robo-advisor), insurtech (asuransi), dan regtech (kepatuhan). Memahami kategori membantu menilai risiko tiap layanan." },
          { h: "Ekosistem", b: "Ekosistem fintech menghubungkan penyedia, bank, regulator (di Indonesia: OJK dan Bank Indonesia sesuai ranahnya), dan konsumen. Interoperabilitas (mis. QRIS) membuat sistem berbeda dapat bekerja sama." },
          { h: "Manfaat & Risiko", b: "Manfaat utama: inklusi keuangan, biaya lebih rendah, kemudahan akses. Risiko: penipuan, keterlilitan utang, dan penyalahgunaan data. Keberadaan izin adalah salah satu sinyal paling jelas pembeda penyedia aman dari yang berbahaya." },
        ],
        example: {
          title: "Contoh penerapan — mengenali jenis fintech",
          body: "Aplikasi A menyimpan saldo dan memindai QR untuk bayar di warung (pembayaran/e-wallet). Aplikasi B mempertemukan Anda dengan investor yang mendanai pinjaman Anda (lending/P2P). Aplikasi C menyusun portofolio reksa dana otomatis sesuai profil risiko (wealthtech/robo-advisor). Mengenali kategori membantu Anda menilai risiko sebelum memakai.",
        },
        takeaways: [
          "Fintech = layanan keuangan yang dihantarkan melalui teknologi.",
          "Kategori utama: payment, lending, wealthtech, insurtech, regtech.",
          "Regulator di Indonesia: OJK dan Bank Indonesia sesuai ranahnya.",
          "Cek status izin sebelum memakai layanan apa pun.",
        ],
      },
      quizzes: [
        { question: "Fintech paling tepat didefinisikan sebagai:", options: ["Perusahaan media sosial", "Layanan keuangan yang dihantarkan melalui teknologi", "Toko gawai elektronik", "Jenis mata uang"], answer: 1, explanation: "Fintech adalah layanan keuangan berbasis teknologi, bukan sekadar perusahaan teknologi.", difficulty: "mudah" },
        { question: "Manakah yang termasuk kategori fintech pembayaran?", options: ["E-wallet", "Konstruksi gedung", "Restoran", "Agen perjalanan"], answer: 0, explanation: "E-wallet adalah contoh fintech kategori pembayaran.", difficulty: "mudah" },
        { question: "Robo-advisor termasuk kategori fintech:", options: ["Insurtech", "Wealthtech", "Regtech", "Pembayaran"], answer: 1, explanation: "Robo-advisor mengotomatiskan investasi, termasuk wealthtech.", difficulty: "sedang" },
        { question: "Di Indonesia, pengawasan sistem pembayaran terutama menjadi ranah:", options: ["Bursa Efek", "Bank Indonesia", "Kementerian Perdagangan", "Lembaga internasional"], answer: 1, explanation: "Aspek sistem pembayaran terutama menjadi ranah Bank Indonesia.", difficulty: "sedang" },
        { question: "Manfaat utama fintech bagi masyarakat luas adalah:", options: ["Menambah birokrasi", "Inklusi keuangan bagi yang kurang terlayani bank", "Memperlambat transaksi", "Menaikkan biaya"], answer: 1, explanation: "Fintech dapat menjangkau populasi yang kurang terlayani perbankan tradisional.", difficulty: "mudah" },
        { question: "QRIS memungkinkan:", options: ["Satu kode QR dibayar lintas aplikasi/bank berbeda", "Bunga dijamin", "Pinjaman tanpa bunga", "Transfer anonim"], answer: 0, explanation: "QRIS menstandarkan QR sehingga satu kode berlaku lintas penyedia.", difficulty: "sedang" },
        { question: "Regtech adalah teknologi yang membantu:", options: ["Menambang kripto", "Perusahaan memenuhi kepatuhan dan regulasi", "Mendaftarkan domain", "Mempercepat game"], answer: 1, explanation: "Regtech mengotomatiskan kepatuhan, pelaporan, dan pemantauan risiko.", difficulty: "sulit" },
        { question: "Sinyal paling jelas pembeda penyedia fintech aman dari berbahaya adalah:", options: ["Warna aplikasi", "Status izin/legalitas", "Jumlah iklan", "Ukuran file aplikasi"], answer: 1, explanation: "Status izin adalah sinyal kunci legalitas dan keamanan penyedia.", difficulty: "sedang" },
        { question: "Insurtech menerapkan teknologi pada bidang:", options: ["Asuransi", "Pertambangan", "Konstruksi", "Pertanian saja"], answer: 0, explanation: "Insurtech membaharui cara asuransi dirancang dan dihantarkan.", difficulty: "mudah" },
        { question: "Interoperabilitas dalam ekosistem fintech berarti:", options: ["Hanya satu penyedia boleh beroperasi", "Sistem/penyedia berbeda dapat bekerja sama", "Wajib memakai uang tunai", "Tiap toko butuh kode berbeda"], answer: 1, explanation: "Interoperabilitas memungkinkan penyedia berbeda saling bertransaksi dengan mulus.", difficulty: "sulit" },
      ],
    },
    {
      slug: "m2",
      title: "Digital Payment & E-Wallet",
      topics: ["E-wallet", "QRIS", "Mobile Banking", "Keamanan Transaksi"],
      order: 2,
      lesson: {
        intro: "Pembayaran digital memindahkan nilai tanpa uang tunai. Kemudahannya tinggi, tetapi taruhan keamanannya juga tinggi.",
        sections: [
          { h: "E-wallet", b: "E-wallet menyimpan saldo digital untuk pembayaran dan transfer. Saldo tersimpan ('float') hanya seaman penyedia yang menyimpannya, sehingga memakai penyedia berizin penting." },
          { h: "QRIS", b: "QRIS (Quick Response Code Indonesian Standard) memungkinkan satu kode QR dibayar oleh banyak aplikasi dan bank berbeda." },
          { h: "Mobile Banking", b: "Mobile banking membawa kendali penuh atas rekening ke ponsel. Kemudahan ini memusatkan risiko pada perangkat." },
          { h: "Keamanan Transaksi", b: "Kebiasaan inti: jangan pernah membagikan OTP — bank tidak pernah memintanya; aktifkan notifikasi transaksi; hindari transaksi lewat Wi-Fi publik tak tepercaya." },
        ],
        example: {
          title: "Contoh penerapan — mengenali penipuan pembayaran",
          body: "Pesan berbunyi: 'Akun terkunci. Kirim OTP dan transfer Rp50.000 untuk verifikasi.' Dua tanda bahaya: lembaga sah tidak pernah meminta OTP, dan tidak pernah meminta Anda mengirim uang untuk 'memverifikasi' diri.",
        },
        takeaways: [
          "QRIS menstandarkan QR sehingga satu kode berlaku lintas penyedia.",
          "Jangan pernah membagikan OTP; bank tidak pernah memintanya.",
          "Verifikasi keaslian aplikasi; gunakan 2FA/biometrik.",
          "Aktifkan notifikasi untuk mendeteksi transaksi tak sah.",
        ],
      },
      quizzes: [
        { question: "QRIS di Indonesia terutama menstandarkan:", options: ["Suku bunga", "Pembayaran kode QR lintas penyedia", "Perdagangan saham", "Persetujuan pinjaman"], answer: 1, explanation: "QRIS menyatukan pembayaran QR lintas penyedia.", difficulty: "mudah" },
        { question: "E-wallet adalah:", options: ["Dompet kulit fisik", "Akun digital penyimpan dana untuk transaksi elektronik", "Sejenis pinjaman", "Skor kredit"], answer: 1, explanation: "E-wallet menyimpan saldo digital untuk pembayaran dan transfer.", difficulty: "mudah" },
        { question: "Praktik yang PALING meningkatkan keamanan mobile banking:", options: ["Membagikan OTP ke petugas", "PIN unik kuat + biometrik/2FA", "Menyimpan sandi di catatan publik", "Transaksi via Wi-Fi publik"], answer: 1, explanation: "Autentikasi kuat dan 2FA melindungi akses.", difficulty: "sedang" },
        { question: "OTP seharusnya:", options: ["Dibagikan bila diminta", "Dirahasiakan, tidak diungkap ke pihak ketiga", "Diumumkan publik", "Dipakai ulang tiap login"], answer: 1, explanation: "OTP mengautentikasi Anda; mengungkapkannya berarti menyerahkan akses.", difficulty: "mudah" },
        { question: "Saldo 'float' e-wallet berisiko jika:", options: ["Anda aktifkan 2FA", "Penyedia tidak berizin dan bangkrut", "Anda cek saldo sering", "Anda pakai QRIS"], answer: 1, explanation: "Penyedia tak diatur membawa risiko atas dana tersimpan.", difficulty: "sulit" },
        { question: "Pembayaran nirsentuh/NFC bekerja dengan:", options: ["Mengirim tunai lewat pos", "Komunikasi nirkabel jarak dekat perangkat-terminal", "Menelepon bank", "Sidik jari di ATM"], answer: 1, explanation: "NFC memungkinkan bayar-tempel pada jarak beberapa sentimeter.", difficulty: "sedang" },
        { question: "Tanda bahaya saat pembayaran digital:", options: ["Pedagang menampilkan QRIS resmi", "Diminta transfer ke rekening pribadi 'untuk verifikasi'", "Struk dikirim ke aplikasi", "Notifikasi transaksi"], answer: 1, explanation: "Verifikasi sah tidak pernah meminta transfer ke rekening pribadi.", difficulty: "sedang" },
        { question: "Notifikasi transaksi berharga karena:", options: ["Menambah biaya", "Memungkinkan deteksi cepat aktivitas tak sah", "Memperlambat bayar", "Mengganti sandi"], answer: 1, explanation: "Notifikasi real-time memunculkan penipuan cepat.", difficulty: "mudah" },
        { question: "Sebelum mengunduh aplikasi perbankan, verifikasi:", options: ["Skema warna", "Penerbit & sumber resmi", "Jumlah iklan", "Hanya ukuran file"], answer: 1, explanation: "Verifikasi penerbit mencegah aplikasi palsu/berbahaya.", difficulty: "sedang" },
        { question: "Wi-Fi publik berisiko untuk perbankan karena:", options: ["Selalu lebih cepat", "Lalu lintas bisa disadap di jaringan tak aman", "Memblokir semua aplikasi", "Mengenkripsi otomatis"], answer: 1, explanation: "Jaringan tak aman memungkinkan penyadapan.", difficulty: "sulit" },
      ],
    },
    {
      slug: "m3",
      title: "Budgeting & Personal Finance",
      topics: ["Penganggaran", "Menabung", "Dana Darurat", "Perencanaan"],
      order: 3,
      lesson: {
        intro: "Mengelola keuangan pribadi adalah fondasi sebelum memakai produk fintech apa pun.",
        sections: [
          { h: "Penganggaran", b: "Anggaran adalah rencana mengalokasikan penghasilan ke kebutuhan, keinginan, dan tabungan. Kerangka awal umum: 50/30/20." },
          { h: "Menabung", b: "Kebiasaan ampuh adalah 'membayar diri sendiri lebih dahulu': otomatiskan transfer ke tabungan begitu penghasilan diterima." },
          { h: "Dana Darurat", b: "Dana darurat adalah tabungan likuid yang menutup sekitar 3–6 bulan pengeluaran pokok." },
          { h: "Perencanaan", b: "Tujuan efektif bersifat SMART: Spesifik, Terukur, Dapat dicapai, Relevan, Berbatas waktu." },
        ],
        example: {
          title: "Contoh penerapan — menerapkan 50/30/20",
          body: "Mahasiswa berpenghasilan Rp3.000.000/bulan. Dengan 50/30/20: ~Rp1.500.000 kebutuhan, ~Rp900.000 keinginan, ~Rp600.000 tabungan/utang.",
        },
        takeaways: [
          "Anggaran mengalokasikan penghasilan dengan sengaja.",
          "Otomatiskan tabungan ('bayar diri sendiri dulu').",
          "Bangun dana darurat 3–6 bulan sebelum berinvestasi.",
          "Pantau kekayaan bersih untuk melihat kemajuan nyata.",
        ],
      },
      quizzes: [
        { question: "Tujuan utama anggaran pribadi:", options: ["Menghapus semua pengeluaran", "Merencanakan alokasi penghasilan", "Menambah utang", "Menghindari bank"], answer: 1, explanation: "Anggaran mengalokasikan penghasilan dengan sengaja.", difficulty: "mudah" },
        { question: "Aturan 50/30/20 mengalokasikan 20% untuk:", options: ["Keinginan", "Kebutuhan", "Tabungan & pelunasan utang", "Hiburan"], answer: 2, explanation: "20% untuk tabungan/pelunasan utang.", difficulty: "mudah" },
        { question: "Dana darurat paling tepat adalah:", options: ["Uang di saham", "Tabungan likuid 3–6 bulan pengeluaran pokok", "Limit kartu kredit", "Tabungan pensiun"], answer: 1, explanation: "Dana darurat harus likuid dan menutup biaya pokok.", difficulty: "sedang" },
        { question: "'Kebutuhan', bukan 'keinginan':", options: ["Langganan streaming", "Tempat tinggal", "Gawai baru", "Makan di luar"], answer: 1, explanation: "Tempat tinggal bersifat pokok.", difficulty: "mudah" },
        { question: "'Membayar diri sendiri dulu' berarti:", options: ["Belanja diri sebelum tagihan", "Menabung otomatis sebelum belanja diskresioner", "Ambil uang muka gaji", "Beli barang mewah dulu"], answer: 1, explanation: "Memprioritaskan menabung dengan otomatisasi.", difficulty: "sedang" },
        { question: "Bunga majemuk berarti bunga atas:", options: ["Hanya pokok", "Pokok + bunga terakumulasi sebelumnya", "Inflasi saja", "Biaya bank"], answer: 1, explanation: "Bunga atas bunga mempercepat pertumbuhan.", difficulty: "sedang" },
        { question: "'T' dalam tujuan SMART berarti:", options: ["Berisiko", "Berbatas waktu (Time-bound)", "Bebas pajak", "Tak terbatas"], answer: 1, explanation: "T = Time-bound, ada batas waktu.", difficulty: "mudah" },
        { question: "Inflasi gaya hidup adalah:", options: ["Naiknya harga toko", "Naiknya pengeluaran saat penghasilan naik, menggerus tabungan", "Perubahan bunga", "Pelemahan mata uang"], answer: 1, explanation: "Pengeluaran tumbuh mengikuti penghasilan.", difficulty: "sulit" },
        { question: "Alat terbaik melacak pengeluaran harian otomatis:", options: ["Buku kertas saja", "Aplikasi pencatat terhubung rekening", "Kalkulator", "Obligasi"], answer: 1, explanation: "Aplikasi terhubung mencatat transaksi otomatis.", difficulty: "mudah" },
        { question: "Kekayaan bersih dihitung sebagai:", options: ["Penghasilan - pengeluaran", "Aset - liabilitas", "Tabungan + gaji", "Total pengeluaran tahunan"], answer: 1, explanation: "Kekayaan bersih = yang dimiliki - yang diutangkan.", difficulty: "sedang" },
      ],
    },
    {
      slug: "m4",
      title: "Fintech Lending / Pinjaman Online",
      topics: ["P2P Lending", "Pinjol Legal vs Ilegal", "Bunga & Biaya", "Risiko Utang"],
      order: 4,
      lesson: {
        intro: "Fintech lending (pinjaman online) memperluas akses kredit, tetapi membawa risiko nyata.",
        sections: [
          { h: "P2P Lending", b: "P2P lending mempertemukan peminjam dan pemberi pinjaman tanpa bank perantara." },
          { h: "Pinjol Legal vs Ilegal", b: "Pinjol legal terdaftar di OJK; pinjol ilegal sering menawarkan 'cair tanpa syarat' dan menyalahgunakan data." },
          { h: "Bunga & Biaya", b: "Pahami total biaya pinjaman termasuk bunga, biaya admin, dan denda keterlambatan." },
          { h: "Risiko Utang", b: "Pola 'gali lubang tutup lubang' memperbesar total utang secara eksponensial." },
        ],
        example: {
          title: "Contoh penerapan — menghitung total biaya pinjaman",
          body: "Pinjaman Rp1.000.000 dengan bunga 0,8%/hari selama 30 hari = bunga Rp240.000 (24%). Total bayar Rp1.240.000.",
        },
        takeaways: [
          "Selalu cek status legalitas pinjol di OJK.",
          "Hitung total biaya pinjaman sebelum mengambil.",
          "Jangan gunakan pinjaman baru untuk menutup pinjaman lama.",
          "Pinjam hanya untuk kebutuhan mendesak, bukan keinginan.",
        ],
      },
      quizzes: [
        { question: "P2P lending berarti:", options: ["Pinjaman dari pemerintah", "Peminjam & pemberi pinjaman terhubung langsung tanpa bank", "Deposito bank", "Kartu kredit"], answer: 1, explanation: "P2P mempertemukan peminjam-pemberi pinjaman langsung.", difficulty: "mudah" },
        { question: "Pinjol ilegal biasanya:", options: ["Terdaftar di OJK", "Menawarkan 'cair tanpa syarat' & minta akses kontak", "Bunga rendah", "Diawasi pemerintah"], answer: 1, explanation: "Pinjol ilegal menjebak dengan kemudahan palsu.", difficulty: "mudah" },
        { question: "Bunga 0,8%/hari selama 30 hari setara:", options: ["0,8% total", "24% total", "8% total", "80% total"], answer: 1, explanation: "0,8% × 30 hari = 24%.", difficulty: "sedang" },
        { question: "'Gali lubang tutup lubang' berarti:", options: ["Menabung rutin", "Meminjam untuk membayar pinjaman lain", "Investasi diversifikasi", "Membayar tepat waktu"], answer: 1, explanation: "Pola ini memperbesar total utang.", difficulty: "mudah" },
        { question: "Sebelum meminjam, yang HARUS dihitung:", options: ["Warna aplikasi", "Total biaya termasuk bunga & biaya admin", "Jumlah unduhan", "Rating aplikasi saja"], answer: 1, explanation: "Total biaya menunjukkan beban sebenarnya.", difficulty: "sedang" },
        { question: "Tanda pinjol legal:", options: ["Iklan di media sosial", "Terdaftar/berizin di OJK", "Cair 5 menit", "Tanpa syarat"], answer: 1, explanation: "Status OJK adalah penanda utama legalitas.", difficulty: "mudah" },
        { question: "Risiko terbesar pinjaman konsumtif:", options: ["Bunga rendah", "Keterlilitan utang berlebihan", "Meningkatkan tabungan", "Menambah aset"], answer: 1, explanation: "Pinjaman konsumtif tanpa perencanaan menjerat utang.", difficulty: "sedang" },
        { question: "Denda keterlambatan pinjol berfungsi:", options: ["Mengurangi utang", "Menambah beban total pinjaman", "Menghapus bunga", "Memberi diskon"], answer: 1, explanation: "Denda memperbesar total yang harus dibayar.", difficulty: "sedang" },
        { question: "Pinjaman sebaiknya diambil untuk:", options: ["Beli gawai impian", "Kebutuhan mendesak yang terencana", "Ikut tren", "Investasi bodong"], answer: 1, explanation: "Pinjaman untuk kebutuhan mendesak dengan perhitungan matang.", difficulty: "sulit" },
        { question: "Jika tidak mampu membayar pinjol legal:", options: ["Diam saja", "Hubungi penyedia untuk negosiasi restrukturisasi", "Pinjam lagi dari pinjol lain", "Blokir nomor mereka"], answer: 1, explanation: "Komunikasi dan negosiasi lebih baik daripada menghindari.", difficulty: "sulit" },
      ],
    },
    {
      slug: "m5",
      title: "Digital Financial Security",
      topics: ["Phishing", "Social Engineering", "Autentikasi 2FA", "Perlindungan Data"],
      order: 5,
      lesson: {
        intro: "Keamanan keuangan digital melindungi aset dan identitas Anda dari ancaman siber.",
        sections: [
          { h: "Phishing", b: "Phishing menipu pengguna agar mengungkapkan kredensial melalui pesan/situs palsu." },
          { h: "Social Engineering", b: "Serangan yang memanipulasi psikologi untuk mengakses informasi." },
          { h: "Autentikasi 2FA", b: "2FA meminta bukti identitas kedua selain sandi, melindungi meski sandi bocor." },
          { h: "Perlindungan Data", b: "Minimalisasi data: bagikan hanya yang perlu. Hindari transaksi di Wi-Fi publik." },
        ],
        example: {
          title: "Contoh penerapan — mengenali phishing",
          body: "Email dari 'bank' meminta klik tautan dan masukkan PIN. Bank asli tidak pernah meminta kredensial lewat email.",
        },
        takeaways: [
          "Jangan klik tautan mencurigakan; verifikasi lewat saluran resmi.",
          "Aktifkan 2FA pada semua akun keuangan.",
          "Terapkan minimalisasi data: bagikan hanya yang perlu.",
          "Hindari transaksi di Wi-Fi publik; perbarui perangkat lunak.",
        ],
      },
      quizzes: [
        { question: "Phishing adalah upaya untuk:", options: ["Menaikkan skor kredit", "Mengelabui agar mengungkapkan kredensial/data pribadi", "Menaikkan bunga", "Memasang antivirus"], answer: 1, explanation: "Phishing menipu pengguna agar menyerahkan informasi sensitif.", difficulty: "mudah" },
        { question: "Tanda bahaya phishing klasik:", options: ["Pesan teman soal makan siang", "Desakan meminta sandi/OTP lewat tautan", "Mutasi bulanan di aplikasi", "Pemberitahuan libur bank"], answer: 1, explanation: "Desakan + permintaan kredensial lewat tautan adalah ciri phishing.", difficulty: "mudah" },
        { question: "2FA melindungi dengan:", options: ["Meminta bukti identitas kedua selain sandi", "Menghapus kebutuhan sandi", "Membagikan data luas", "Menonaktifkan notifikasi"], answer: 0, explanation: "2FA menambah faktor kedua.", difficulty: "sedang" },
        { question: "Jika 'bank' menelepon meminta PIN & OTP lengkap, Anda:", options: ["Memberikannya segera", "Menolak & hubungi bank lewat saluran resmi", "Mengumumkan daring", "Mengirim lewat email"], answer: 1, explanation: "Bank tidak pernah meminta PIN/OTP lengkap.", difficulty: "mudah" },
        { question: "Kata sandi kuat adalah:", options: ["Tanggal lahir", "Panjang, unik, tak dipakai ulang", "'123456'", "Nama hewan peliharaan"], answer: 1, explanation: "Panjang, unik, tak dipakai ulang mengalahkan serangan umum.", difficulty: "mudah" },
        { question: "'Smishing' adalah phishing lewat:", options: ["Email", "SMS", "Telepon", "Faks"], answer: 1, explanation: "Smishing dihantarkan melalui SMS.", difficulty: "sedang" },
        { question: "Skema Ponzi membayar dengan:", options: ["Keuntungan nyata", "Uang investor baru untuk investor lama", "Hibah pemerintah", "Bunga bank"], answer: 1, explanation: "Ponzi membayar investor lama dari setoran baru sampai runtuh.", difficulty: "sulit" },
        { question: "Minimalisasi data berarti:", options: ["Mengumpulkan sebanyak mungkin", "Berbagi/mengumpulkan hanya yang perlu", "Hapus semua akun", "Tidak mengenkripsi"], answer: 1, explanation: "Minimalisasi membatasi eksposur data.", difficulty: "sulit" },
        { question: "Wi-Fi publik berisiko karena:", options: ["Selalu lebih cepat", "Lalu lintas bisa disadap di jaringan tak aman", "Memblokir aplikasi", "Mengenkripsi otomatis"], answer: 1, explanation: "Jaringan tak aman memungkinkan penyadapan.", difficulty: "sedang" },
        { question: "Tawaran 'imbal hasil tinggi dijamin tanpa risiko' adalah:", options: ["Peluang bagus", "Tanda kuat penipuan", "Selalu sah", "Dijamin pemerintah"], answer: 1, explanation: "Imbal hasil tinggi dijamin tanpa risiko adalah tanda bahaya.", difficulty: "mudah" },
      ],
    },
    {
      slug: "m6",
      title: "Consumer Protection",
      topics: ["Hak Konsumen", "Penyelesaian Sengketa", "Transparansi", "Pengaduan"],
      order: 6,
      lesson: {
        intro: "Perlindungan konsumen memastikan pengguna layanan keuangan digital diperlakukan adil.",
        sections: [
          { h: "Hak Konsumen", b: "Konsumen berhak atas informasi yang jelas dan jujur, perlakuan adil, kerahasiaan data, serta akses terhadap penyelesaian keluhan." },
          { h: "Transparansi", b: "Sebelum menyetujui produk, konsumen berhak tahu biaya total, bunga, denda, dan ketentuan." },
          { h: "Pengaduan", b: "Jika dirugikan, konsumen dapat mengadu ke penyedia, lalu ke kanal pengaduan resmi (OJK)." },
          { h: "Penyelesaian Sengketa", b: "Sengketa dapat diselesaikan melalui mediasi atau lembaga alternatif penyelesaian sengketa." },
        ],
        example: {
          title: "Contoh penerapan — menggunakan hak konsumen",
          body: "Seorang pengguna dikenai biaya yang tidak dijelaskan di awal. Langkahnya: kumpulkan bukti, ajukan keluhan tertulis ke penyedia, bila tak selesai teruskan ke OJK.",
        },
        takeaways: [
          "Konsumen berhak atas informasi jujur, perlakuan adil, dan kerahasiaan data.",
          "Ketahui total biaya & ketentuan sebelum menyetujui produk.",
          "Simpan bukti; adukan ke penyedia lalu kanal resmi (OJK).",
          "Sengketa dapat diselesaikan via mediasi sebelum jalur hukum.",
        ],
      },
      quizzes: [
        { question: "Hak dasar konsumen layanan keuangan meliputi:", options: ["Tidak berhak apa pun", "Informasi jujur, perlakuan adil, kerahasiaan data", "Hanya hak komplain", "Hanya potongan harga"], answer: 1, explanation: "Konsumen berhak atas informasi jujur, perlakuan adil, dan kerahasiaan data.", difficulty: "mudah" },
        { question: "Sebelum menyetujui produk keuangan, konsumen berhak tahu:", options: ["Warna logo", "Total biaya, bunga, denda, ketentuan", "Jumlah karyawan", "Lokasi kantor saja"], answer: 1, explanation: "Transparansi biaya dan ketentuan adalah hak konsumen.", difficulty: "mudah" },
        { question: "Tanda bahaya terkait transparansi:", options: ["Biaya dijelaskan di awal", "Biaya disembunyikan & tekanan untuk segera setuju", "Ada ringkasan ketentuan", "Ada nomor layanan resmi"], answer: 1, explanation: "Menyembunyikan biaya dan menekan adalah tanda bahaya.", difficulty: "sedang" },
        { question: "Langkah pertama bila dirugikan penyedia:", options: ["Diam saja", "Mengadu ke penyedia dengan bukti, lalu kanal resmi", "Menyebar di media sosial tanpa bukti", "Berhenti memakai semua aplikasi"], answer: 1, explanation: "Adukan ke penyedia dahulu, lalu kanal resmi, dengan bukti.", difficulty: "sedang" },
        { question: "Yang penting disimpan sebagai bukti sengketa:", options: ["Tidak ada", "Tangkapan layar, perjanjian, riwayat transaksi", "Hanya nama aplikasi", "Hanya rating"], answer: 1, explanation: "Dokumentasi memperkuat posisi konsumen.", difficulty: "mudah" },
        { question: "Di Indonesia, pengaduan layanan keuangan dapat diteruskan melalui:", options: ["Tidak ada lembaga", "Mekanisme melalui OJK", "Hanya kepolisian", "Hanya media massa"], answer: 1, explanation: "Tersedia mekanisme pengaduan melalui OJK.", difficulty: "sedang" },
        { question: "Penyelesaian sengketa sebaiknya diupayakan melalui:", options: ["Langsung jalur hukum", "Mediasi/lembaga alternatif sebelum jalur hukum", "Tidak diselesaikan", "Balas dendam"], answer: 1, explanation: "Mediasi/alternatif diupayakan sebelum jalur hukum.", difficulty: "sulit" },
        { question: "Kerahasiaan data konsumen berarti penyedia harus:", options: ["Menjual data ke pihak lain", "Melindungi dan tidak menyalahgunakan data", "Mengumumkan data publik", "Mengabaikan keamanan"], answer: 1, explanation: "Penyedia wajib melindungi data konsumen.", difficulty: "sedang" },
        { question: "Transparansi biaya adalah:", options: ["Kebaikan opsional penyedia", "Hak konsumen", "Hal yang tidak penting", "Hanya untuk nasabah besar"], answer: 1, explanation: "Transparansi adalah hak, bukan kemurahan penyedia.", difficulty: "mudah" },
        { question: "Perlindungan konsumen pada akhirnya bertujuan:", options: ["Menghambat industri", "Memastikan perlakuan adil & menjaga kepercayaan", "Menaikkan biaya", "Mengurangi pilihan"], answer: 1, explanation: "Tujuannya perlakuan adil dan menjaga kepercayaan sistem.", difficulty: "sedang" },
      ],
    },
  ];

  for (const mod of modulesData) {
    const { quizzes, ...moduleData } = mod;
    const createdModule = await prisma.module.create({ data: moduleData });

    for (let i = 0; i < quizzes.length; i++) {
      await prisma.quiz.create({
        data: {
          moduleId: createdModule.id,
          ...quizzes[i],
          order: i,
        },
      });
    }
  }
  console.log("✅ Modules & quizzes seeded (6 modules, 60 quizzes)");

  // --- SEED SCENARIOS ---
  await prisma.scenario.deleteMany();
  const scenarios = [
    { slug: "s1", theme: "Pinjaman Online", situation: "Anda butuh Rp2.000.000 mendesak. Sebuah iklan menawarkan 'cair 5 menit, tanpa syarat, cukup kirim KTP dan izinkan akses kontak'. Apa yang Anda lakukan?", choices: [{ t: "Langsung daftar, uang lebih penting sekarang", quality: 0, outcome: "Aplikasi ternyata pinjol ilegal. Bunga membengkak dan kontak Anda dihubungi untuk intimidasi saat telat bayar." }, { t: "Cek dulu status legalitasnya di OJK sebelum memutuskan", quality: 2, outcome: "Anda menemukan aplikasi itu tidak terdaftar. Anda menghindarinya dan mencari alternatif resmi." }, { t: "Tanya teman yang pernah pakai, ikut saja kalau dia aman", quality: 1, outcome: "Pengalaman satu orang bukan jaminan legalitas." }], order: 1 },
    { slug: "s2", theme: "Investasi Bodong", situation: "Seorang kenalan mengajak investasi 'dijamin untung 15% per bulan, tanpa risiko' asal Anda juga mengajak dua orang lain. Sikap Anda?", choices: [{ t: "Ikut, untungnya besar dan ada yang sudah dapat", quality: 0, outcome: "Ini ciri skema Ponzi/piramida. Skema runtuh dan dana Anda hilang." }, { t: "Tolak — 'untung tinggi dijamin tanpa risiko' itu tidak ada", quality: 2, outcome: "Anda mengenali tanda bahaya klasik penipuan." }, { t: "Coba dengan uang kecil dulu untuk lihat hasilnya", quality: 1, outcome: "Skema sengaja membayar di awal untuk memancing setoran lebih besar." }], order: 2 },
    { slug: "s3", theme: "Phishing", situation: "Anda menerima SMS: 'Akun bank Anda diblokir. Klik tautan ini dan masukkan PIN serta OTP untuk mengaktifkan kembali.' Tindakan Anda?", choices: [{ t: "Klik tautan dan masukkan data agar akun aktif lagi", quality: 0, outcome: "Tautan adalah situs palsu. Kredensial Anda dicuri." }, { t: "Abaikan SMS, buka aplikasi resmi/hubungi call center bank", quality: 2, outcome: "Anda memverifikasi lewat saluran resmi — ternyata tidak ada pemblokiran." }, { t: "Klik tautan untuk lihat dulu, tapi tidak isi data", quality: 1, outcome: "Mengklik tautan mencurigakan tetap berisiko." }], order: 3 },
    { slug: "s4", theme: "QRIS Palsu", situation: "Di sebuah toko, kasir menempelkan stiker QR baru di atas QRIS resmi. Nama penerima yang muncul bukan nama toko. Apa yang Anda lakukan?", choices: [{ t: "Tetap bayar, mungkin itu rekening pemilik", quality: 0, outcome: "Dana masuk ke rekening penipu." }, { t: "Batalkan, konfirmasi ke kasir karena nama penerima tak sesuai", quality: 2, outcome: "Anda menyadari ketidaksesuaian dan menghindari penipuan." }, { t: "Bayar tunai saja tanpa menanyakan apa pun", quality: 1, outcome: "Anda terhindar, tetapi penipuan dibiarkan." }], order: 4 },
    { slug: "s5", theme: "Anggaran", situation: "Gaji pertama Anda Rp4.000.000 baru masuk. Ada diskon gawai impian Rp3.500.000 hari ini saja. Anda belum punya dana darurat. Keputusan Anda?", choices: [{ t: "Beli sekarang, mumpung diskon besar", quality: 0, outcome: "Anda kehabisan dana untuk kebutuhan." }, { t: "Tahan, sisihkan untuk kebutuhan & mulai dana darurat dulu", quality: 2, outcome: "Anda menerapkan prioritas keuangan yang sehat." }, { t: "Beli versi lebih murah dengan setengah uang", quality: 1, outcome: "Lebih baik, tetapi membeli keinginan sebelum dana darurat tetap berisiko." }], order: 5 },
    { slug: "s6", theme: "Perlindungan Konsumen", situation: "Anda dikenai biaya tersembunyi pada layanan keuangan digital yang tidak dijelaskan saat mendaftar. Langkah Anda?", choices: [{ t: "Diamkan saja, jumlahnya kecil", quality: 0, outcome: "Hak Anda terabaikan." }, { t: "Kumpulkan bukti, ajukan keluhan ke penyedia, lalu kanal resmi", quality: 2, outcome: "Anda menggunakan hak konsumen dengan benar." }, { t: "Marah-marah di media sosial tanpa bukti", quality: 1, outcome: "Keluhan tanpa dokumentasi lemah." }], order: 6 },
    { slug: "s7", theme: "Keamanan Akun", situation: "Sebuah aplikasi baru meminta izin akses ke kontak, galeri, lokasi, dan mikrofon padahal fungsinya hanya pencatat keuangan. Sikap Anda?", choices: [{ t: "Setujui semua agar aplikasi cepat jalan", quality: 0, outcome: "Anda memberi akses berlebihan." }, { t: "Tolak izin yang tak relevan dengan fungsi aplikasi", quality: 2, outcome: "Anda menerapkan minimalisasi data." }, { t: "Setujui sebagian, tapi tidak yakin yang mana penting", quality: 1, outcome: "Lebih baik, tetapi risiko tetap ada." }], order: 7 },
    { slug: "s8", theme: "Fintech Lending", situation: "Anda sudah punya satu cicilan pinjol. Datang tawaran pinjol lain untuk 'menutup' cicilan pertama dengan tenor lebih panjang. Keputusan Anda?", choices: [{ t: "Ambil, supaya cicilan bulanan lebih ringan", quality: 0, outcome: "Anda masuk pola 'gali lubang tutup lubang'." }, { t: "Hentikan menambah utang, susun rencana pelunasan yang realistis", quality: 2, outcome: "Anda memutus rantai utang." }, { t: "Ambil tapi berjanji ini yang terakhir", quality: 1, outcome: "Niat baik tanpa rencana konkret jarang berhasil." }], order: 8 },
  ];

  for (const sc of scenarios) {
    await prisma.scenario.create({ data: sc });
  }
  console.log("✅ Scenarios seeded (8 scenarios)");

  // --- SEED SIM EVENTS ---
  await prisma.simEvent.deleteMany();
  const simEvents = [
    { slug: "e1", theme: "Anggaran Awal", icon: "📊", text: "Uang bulanan Rp3.000.000 baru masuk. Apa langkah pertama Anda?", choices: [{ t: "Sisihkan Rp600.000 untuk tabungan dulu, baru atur sisanya", quality: 2, dBalance: 0, dSaving: 600000, outcome: "Bijak — 'membayar diri sendiri dulu' mengamankan tabungan." }, { t: "Belanja dulu sesuai keinginan, sisanya baru ditabung", quality: 0, dBalance: 0, dSaving: 0, outcome: "Berisiko — menabung dari 'sisa' sering berakhir tanpa tabungan." }, { t: "Tabung setengahnya, Rp1.500.000", quality: 1, dBalance: 0, dSaving: 1500000, outcome: "Niat baik, tetapi terlalu ketat bisa membuat kehabisan." }], order: 1 },
    { slug: "e2", theme: "Pinjaman Online", icon: "💸", text: "Muncul iklan: 'Pinjaman cair 5 menit tanpa syarat, cukup izinkan akses kontak'. Anda sedang ingin membeli gawai baru.", choices: [{ t: "Abaikan — ini ciri pinjol ilegal dan saya tidak butuh utang untuk keinginan", quality: 2, dBalance: 0, dSaving: 0, outcome: "Tepat. Anda menghindari jebakan utang berbunga tinggi." }, { t: "Ambil pinjaman untuk beli gawai sekarang", quality: 0, dBalance: -500000, dSaving: 0, outcome: "Bunga dan biaya tersembunyi menggerus saldo Anda." }, { t: "Ambil pinjaman kecil saja untuk coba-coba", quality: 0, dBalance: -200000, dSaving: 0, outcome: "Meski kecil, Anda kini terikat pinjol berisiko." }], order: 2 },
    { slug: "e3", theme: "Penipuan Pembayaran", icon: "🎣", text: "SMS: 'Selamat! Anda menang undian Rp10.000.000. Bayar pajak Rp300.000 dulu ke rekening ini untuk mencairkan.'", choices: [{ t: "Abaikan — undian sah tidak meminta bayar di muka", quality: 2, dBalance: 0, dSaving: 0, outcome: "Benar. 'Bayar dulu untuk dapat hadiah' adalah ciri penipuan." }, { t: "Bayar Rp300.000, hadiahnya jauh lebih besar", quality: 0, dBalance: -300000, dSaving: 0, outcome: "Uang Anda hilang dan hadiah tidak pernah ada." }, { t: "Balas untuk menanyakan detail undian", quality: 1, dBalance: 0, dSaving: 0, outcome: "Membalas menandakan nomor Anda aktif." }], order: 3 },
    { slug: "e4", theme: "Keamanan Akun", icon: "🔐", text: "Sebuah aplikasi keuangan baru meminta Anda membuat kata sandi dan menawarkan login lebih cepat tanpa verifikasi tambahan.", choices: [{ t: "Pakai kata sandi unik & aktifkan autentikasi dua faktor (2FA)", quality: 2, dBalance: 0, dSaving: 0, outcome: "Aman. 2FA membuat akun tetap terlindungi." }, { t: "Pakai kata sandi yang sama dengan akun lain agar mudah diingat", quality: 0, dBalance: 0, dSaving: 0, outcome: "Berisiko — bila satu akun bobol, semua terancam." }, { t: "Lewati 2FA supaya login lebih cepat", quality: 1, dBalance: 0, dSaving: 0, outcome: "Kurang aman." }], order: 4 },
    { slug: "e5", theme: "Investasi", icon: "📈", text: "Anda punya tabungan Rp600.000 lebih. Seorang teman menawarkan 'investasi untung 20% per bulan dijamin tanpa risiko'.", choices: [{ t: "Tolak; pelajari produk investasi resmi yang sesuai profil risiko", quality: 2, dBalance: 0, dSaving: 0, outcome: "Tepat. 'Untung tinggi dijamin tanpa risiko' tidak ada." }, { t: "Masukkan semua tabungan, mumpung untung besar", quality: 0, dBalance: 0, dSaving: -600000, outcome: "Skema runtuh dan tabungan Anda hilang." }, { t: "Coba dengan setengah tabungan saja", quality: 0, dBalance: 0, dSaving: -300000, outcome: "Tetap rugi." }], order: 5 },
    { slug: "e6", theme: "Perlindungan Konsumen", icon: "⚖️", text: "Di akhir bulan Anda menyadari ada potongan biaya Rp50.000 yang tak pernah dijelaskan oleh sebuah layanan.", choices: [{ t: "Kumpulkan bukti, ajukan keluhan resmi ke penyedia; bila buntu, ke OJK", quality: 2, dBalance: 50000, dSaving: 0, outcome: "Tepat. Anda menggunakan hak konsumen." }, { t: "Biarkan saja, jumlahnya kecil", quality: 1, dBalance: 0, dSaving: 0, outcome: "Hak Anda terlepas." }, { t: "Tutup akun dan pindah tanpa mengadu", quality: 1, dBalance: 0, dSaving: 0, outcome: "Anda menghindar, tetapi tidak menyelesaikan masalah." }], order: 6 },
  ];

  for (const ev of simEvents) {
    await prisma.simEvent.create({ data: ev });
  }
  console.log("✅ Simulation events seeded (6 events)");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
