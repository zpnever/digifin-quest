// @ts-nocheck
// Generated from src/App.tsx content constants.
export const MODULES = [
  {
    id: "m1",
    title: "Fintech Basics",
    topics: ["Definisi Fintech", "Jenis Fintech", "Ekosistem", "Manfaat & Risiko"],
    lesson: {
      intro:
        "Fintech (financial technology) adalah pemanfaatan teknologi untuk menghadirkan layanan keuangan. Modul ini membangun fondasi: apa itu fintech, jenis-jenisnya, siapa pemainnya, serta manfaat dan risikonya.",
      sections: [
        { h: "Definisi Fintech", b: "Fintech adalah layanan keuangan yang dihantarkan melalui teknologi — mencakup pembayaran, pinjaman, investasi, hingga asuransi. Batasnya bukan 'perusahaan teknologi' melainkan 'layanan keuangan berbasis teknologi'." },
        { h: "Jenis Fintech", b: "Kategori utama: pembayaran (e-wallet, transfer), lending (termasuk peer-to-peer), wealthtech (investasi digital, robo-advisor), insurtech (asuransi), dan regtech (kepatuhan). Memahami kategori membantu menilai risiko tiap layanan." },
        { h: "Ekosistem", b: "Ekosistem fintech menghubungkan penyedia, bank, regulator (di Indonesia: OJK dan Bank Indonesia sesuai ranahnya), dan konsumen. Interoperabilitas (mis. QRIS) membuat sistem berbeda dapat bekerja sama. [Verifikasi peran regulator terkini dengan OJK/BI.]" },
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
    quiz: [
      { q: "Fintech paling tepat didefinisikan sebagai:", options: ["Perusahaan media sosial", "Layanan keuangan yang dihantarkan melalui teknologi", "Toko gawai elektronik", "Jenis mata uang"], answer: 1, explanation: "Fintech adalah layanan keuangan berbasis teknologi, bukan sekadar perusahaan teknologi.", difficulty: "mudah" },
      { q: "Manakah yang termasuk kategori fintech pembayaran?", options: ["E-wallet", "Konstruksi gedung", "Restoran", "Agen perjalanan"], answer: 0, explanation: "E-wallet adalah contoh fintech kategori pembayaran.", difficulty: "mudah" },
      { q: "Robo-advisor termasuk kategori fintech:", options: ["Insurtech", "Wealthtech", "Regtech", "Pembayaran"], answer: 1, explanation: "Robo-advisor mengotomatiskan investasi, termasuk wealthtech.", difficulty: "sedang" },
      { q: "Di Indonesia, pengawasan sistem pembayaran terutama menjadi ranah:", options: ["Bursa Efek", "Bank Indonesia", "Kementerian Perdagangan", "Lembaga internasional"], answer: 1, explanation: "Aspek sistem pembayaran terutama menjadi ranah Bank Indonesia. (Verifikasi pembagian terkini.)", difficulty: "sedang" },
      { q: "Manfaat utama fintech bagi masyarakat luas adalah:", options: ["Menambah birokrasi", "Inklusi keuangan bagi yang kurang terlayani bank", "Memperlambat transaksi", "Menaikkan biaya"], answer: 1, explanation: "Fintech dapat menjangkau populasi yang kurang terlayani perbankan tradisional.", difficulty: "mudah" },
      { q: "QRIS memungkinkan:", options: ["Satu kode QR dibayar lintas aplikasi/bank berbeda", "Bunga dijamin", "Pinjaman tanpa bunga", "Transfer anonim"], answer: 0, explanation: "QRIS menstandarkan QR sehingga satu kode berlaku lintas penyedia. [Verifikasi aturan terkini dengan BI.]", difficulty: "sedang" },
      { q: "Regtech adalah teknologi yang membantu:", options: ["Menambang kripto", "Perusahaan memenuhi kepatuhan dan regulasi", "Mendaftarkan domain", "Mempercepat game"], answer: 1, explanation: "Regtech mengotomatiskan kepatuhan, pelaporan, dan pemantauan risiko.", difficulty: "sulit" },
      { q: "Sinyal paling jelas pembeda penyedia fintech aman dari berbahaya adalah:", options: ["Warna aplikasi", "Status izin/legalitas", "Jumlah iklan", "Ukuran file aplikasi"], answer: 1, explanation: "Status izin adalah sinyal kunci legalitas dan keamanan penyedia.", difficulty: "sedang" },
      { q: "Insurtech menerapkan teknologi pada bidang:", options: ["Asuransi", "Pertambangan", "Konstruksi", "Pertanian saja"], answer: 0, explanation: "Insurtech membaharui cara asuransi dirancang dan dihantarkan.", difficulty: "mudah" },
      { q: "Interoperabilitas dalam ekosistem fintech berarti:", options: ["Hanya satu penyedia boleh beroperasi", "Sistem/penyedia berbeda dapat bekerja sama", "Wajib memakai uang tunai", "Tiap toko butuh kode berbeda"], answer: 1, explanation: "Interoperabilitas memungkinkan penyedia berbeda saling bertransaksi dengan mulus.", difficulty: "sulit" },
    ],
  },
  {
    id: "m2",
    title: "Digital Payment & E-Wallet",
    topics: ["E-wallet", "QRIS", "Mobile Banking", "Keamanan Transaksi"],
    lesson: {
      intro:
        "Pembayaran digital memindahkan nilai tanpa uang tunai. Kemudahannya tinggi, tetapi taruhan keamanannya juga tinggi. Catatan: aturan QRIS dan perizinan e-wallet di Indonesia berubah dari waktu ke waktu — verifikasi dengan sumber Bank Indonesia/OJK terkini sebelum diajarkan sebagai fakta.",
      sections: [
        { h: "E-wallet", b: "E-wallet menyimpan saldo digital untuk pembayaran dan transfer. Saldo tersimpan ('float') hanya seaman penyedia yang menyimpannya, sehingga memakai penyedia berizin penting. E-wallet praktis untuk transaksi kecil, tetapi bukan pengganti rekening bank." },
        { h: "QRIS", b: "QRIS (Quick Response Code Indonesian Standard) memungkinkan satu kode QR dibayar oleh banyak aplikasi dan bank berbeda — menyelesaikan masalah pedagang yang dahulu butuh kode terpisah per penyedia. [Verifikasi aturan QRIS terkini dengan Bank Indonesia.]" },
        { h: "Mobile Banking", b: "Mobile banking membawa kendali penuh atas rekening ke ponsel. Kemudahan ini memusatkan risiko pada perangkat, sehingga keaslian aplikasi (pasang dari sumber resmi), PIN kuat, dan login biometrik/dua faktor menjadi esensial." },
        { h: "Keamanan Transaksi", b: "Kebiasaan inti: jangan pernah membagikan OTP — bank tidak pernah memintanya; aktifkan notifikasi transaksi; hindari transaksi lewat Wi-Fi publik tak tepercaya; dan curigai permintaan transfer ke 'rekening pribadi untuk verifikasi'." },
      ],
      example: {
        title: "Contoh penerapan — mengenali penipuan pembayaran",
        body: "Pesan berbunyi: 'Akun terkunci. Kirim OTP dan transfer Rp50.000 untuk verifikasi.' Dua tanda bahaya: lembaga sah tidak pernah meminta OTP, dan tidak pernah meminta Anda mengirim uang untuk 'memverifikasi' diri. Tindakan benar: abaikan dan hubungi bank lewat saluran resmi.",
      },
      takeaways: [
        "QRIS menstandarkan QR sehingga satu kode berlaku lintas penyedia.",
        "Jangan pernah membagikan OTP; bank tidak pernah memintanya.",
        "Verifikasi keaslian aplikasi; gunakan 2FA/biometrik.",
        "Aktifkan notifikasi untuk mendeteksi transaksi tak sah.",
      ],
    },
    quiz: [
      { q: "QRIS di Indonesia terutama menstandarkan:", options: ["Suku bunga", "Pembayaran kode QR lintas penyedia", "Perdagangan saham", "Persetujuan pinjaman"], answer: 1, explanation: "QRIS menyatukan pembayaran QR lintas penyedia.", difficulty: "mudah" },
      { q: "E-wallet adalah:", options: ["Dompet kulit fisik", "Akun digital penyimpan dana untuk transaksi elektronik", "Sejenis pinjaman", "Skor kredit"], answer: 1, explanation: "E-wallet menyimpan saldo digital untuk pembayaran dan transfer.", difficulty: "mudah" },
      { q: "Praktik yang PALING meningkatkan keamanan mobile banking:", options: ["Membagikan OTP ke petugas", "PIN unik kuat + biometrik/2FA", "Menyimpan sandi di catatan publik", "Transaksi via Wi-Fi publik"], answer: 1, explanation: "Autentikasi kuat dan 2FA melindungi akses; OTP tak boleh dibagikan.", difficulty: "sedang" },
      { q: "OTP seharusnya:", options: ["Dibagikan bila diminta", "Dirahasiakan, tidak diungkap ke pihak ketiga", "Diumumkan publik", "Dipakai ulang tiap login"], answer: 1, explanation: "OTP mengautentikasi Anda; mengungkapkannya berarti menyerahkan akses.", difficulty: "mudah" },
      { q: "Saldo 'float' e-wallet berisiko jika:", options: ["Anda aktifkan 2FA", "Penyedia tidak berizin dan bangkrut", "Anda cek saldo sering", "Anda pakai QRIS"], answer: 1, explanation: "Penyedia tak diatur membawa risiko atas dana tersimpan.", difficulty: "sulit" },
      { q: "Pembayaran nirsentuh/NFC bekerja dengan:", options: ["Mengirim tunai lewat pos", "Komunikasi nirkabel jarak dekat perangkat-terminal", "Menelepon bank", "Sidik jari di ATM"], answer: 1, explanation: "NFC memungkinkan bayar-tempel pada jarak beberapa sentimeter.", difficulty: "sedang" },
      { q: "Tanda bahaya saat pembayaran digital:", options: ["Pedagang menampilkan QRIS resmi", "Diminta transfer ke rekening pribadi 'untuk verifikasi'", "Struk dikirim ke aplikasi", "Notifikasi transaksi"], answer: 1, explanation: "Verifikasi sah tidak pernah meminta transfer ke rekening pribadi.", difficulty: "sedang" },
      { q: "Notifikasi transaksi berharga karena:", options: ["Menambah biaya", "Memungkinkan deteksi cepat aktivitas tak sah", "Memperlambat bayar", "Mengganti sandi"], answer: 1, explanation: "Notifikasi real-time memunculkan penipuan cepat.", difficulty: "mudah" },
      { q: "Sebelum mengunduh aplikasi perbankan, verifikasi:", options: ["Skema warna", "Penerbit & sumber resmi", "Jumlah iklan", "Hanya ukuran file"], answer: 1, explanation: "Verifikasi penerbit mencegah aplikasi palsu/berbahaya.", difficulty: "sedang" },
      { q: "Wi-Fi publik berisiko untuk perbankan karena:", options: ["Selalu lebih cepat", "Lalu lintas bisa disadap di jaringan tak aman", "Memblokir semua aplikasi", "Mengenkripsi otomatis"], answer: 1, explanation: "Jaringan tak aman memungkinkan penyadapan.", difficulty: "sulit" },
    ],
  },
  {
    id: "m3",
    title: "Budgeting & Personal Finance",
    topics: ["Penganggaran", "Menabung", "Dana Darurat", "Perencanaan"],
    lesson: {
      intro:
        "Mengelola keuangan pribadi adalah fondasi sebelum memakai produk fintech apa pun. Modul ini membahas penganggaran, menabung, dana darurat, dan perencanaan tujuan.",
      sections: [
        { h: "Penganggaran", b: "Anggaran adalah rencana mengalokasikan penghasilan ke kebutuhan, keinginan, dan tabungan — bukan larangan belanja. Kerangka awal umum: 50/30/20 (50% kebutuhan, 30% keinginan, 20% tabungan/utang). Sesuaikan, bukan kaku." },
        { h: "Menabung", b: "Kebiasaan ampuh adalah 'membayar diri sendiri lebih dahulu': otomatiskan transfer ke tabungan begitu penghasilan diterima, sebelum belanja lain. Ini mengalahkan godaan." },
        { h: "Dana Darurat", b: "Dana darurat adalah tabungan likuid yang menutup sekitar 3–6 bulan pengeluaran pokok, disimpan di tempat aman dan mudah diakses — bukan diinvestasikan pada aset bergejolak. Ia prioritas sebelum investasi." },
        { h: "Perencanaan", b: "Tujuan efektif bersifat SMART: Spesifik, Terukur, Dapat dicapai, Relevan, Berbatas waktu. Memantau kekayaan bersih (aset dikurangi liabilitas) menunjukkan apakah posisi keuangan membaik." },
      ],
      example: {
        title: "Contoh penerapan — menerapkan 50/30/20",
        body: "Mahasiswa berpenghasilan Rp3.000.000/bulan setelah pajak. Dengan 50/30/20: ~Rp1.500.000 kebutuhan, ~Rp900.000 keinginan, ~Rp600.000 tabungan/utang. Jika kos saja Rp1.400.000, kebutuhan jadi sempit — sinyal memangkas keinginan atau menambah penghasilan, bukan memotong tabungan dulu.",
      },
      takeaways: [
        "Anggaran mengalokasikan penghasilan dengan sengaja.",
        "Otomatiskan tabungan ('bayar diri sendiri dulu').",
        "Bangun dana darurat 3–6 bulan sebelum berinvestasi.",
        "Pantau kekayaan bersih untuk melihat kemajuan nyata.",
      ],
    },
    quiz: [
      { q: "Tujuan utama anggaran pribadi:", options: ["Menghapus semua pengeluaran", "Merencanakan alokasi penghasilan", "Menambah utang", "Menghindari bank"], answer: 1, explanation: "Anggaran mengalokasikan penghasilan dengan sengaja.", difficulty: "mudah" },
      { q: "Aturan 50/30/20 mengalokasikan 20% untuk:", options: ["Keinginan", "Kebutuhan", "Tabungan & pelunasan utang", "Hiburan"], answer: 2, explanation: "20% untuk tabungan/pelunasan utang.", difficulty: "mudah" },
      { q: "Dana darurat paling tepat adalah:", options: ["Uang di saham", "Tabungan likuid 3–6 bulan pengeluaran pokok", "Limit kartu kredit", "Tabungan pensiun"], answer: 1, explanation: "Dana darurat harus likuid dan menutup biaya pokok.", difficulty: "sedang" },
      { q: "'Kebutuhan', bukan 'keinginan':", options: ["Langganan streaming", "Tempat tinggal", "Gawai baru", "Makan di luar"], answer: 1, explanation: "Tempat tinggal bersifat pokok.", difficulty: "mudah" },
      { q: "'Membayar diri sendiri dulu' berarti:", options: ["Belanja diri sebelum tagihan", "Menabung otomatis sebelum belanja diskresioner", "Ambil uang muka gaji", "Beli barang mewah dulu"], answer: 1, explanation: "Memprioritaskan menabung dengan otomatisasi.", difficulty: "sedang" },
      { q: "Bunga majemuk berarti bunga atas:", options: ["Hanya pokok", "Pokok + bunga terakumulasi sebelumnya", "Inflasi saja", "Biaya bank"], answer: 1, explanation: "Bunga atas bunga mempercepat pertumbuhan.", difficulty: "sedang" },
      { q: "'T' dalam tujuan SMART berarti:", options: ["Berisiko", "Berbatas waktu (Time-bound)", "Bebas pajak", "Tak terbatas"], answer: 1, explanation: "T = Time-bound, ada batas waktu.", difficulty: "mudah" },
      { q: "Inflasi gaya hidup adalah:", options: ["Naiknya harga toko", "Naiknya pengeluaran saat penghasilan naik, menggerus tabungan", "Perubahan bunga", "Pelemahan mata uang"], answer: 1, explanation: "Pengeluaran tumbuh mengikuti penghasilan, manfaat menabung hilang.", difficulty: "sulit" },
      { q: "Alat terbaik melacak pengeluaran harian otomatis:", options: ["Buku kertas saja", "Aplikasi pencatat terhubung rekening", "Kalkulator", "Obligasi"], answer: 1, explanation: "Aplikasi terhubung mencatat transaksi otomatis.", difficulty: "mudah" },
      { q: "Kekayaan bersih dihitung sebagai:", options: ["Penghasilan - pengeluaran", "Aset - liabilitas", "Tabungan + gaji", "Total pengeluaran tahunan"], answer: 1, explanation: "Kekayaan bersih = yang dimiliki - yang diutangkan.", difficulty: "sedang" },
    ],
  },
  {
    id: "m4",
    title: "Fintech Lending / Pinjaman Online",
    topics: ["P2P Lending", "Pinjol Legal vs Ilegal", "Bunga & Biaya", "Risiko Utang"],
    lesson: {
      intro:
        "Fintech lending (pinjaman online) memperluas akses kredit, tetapi membawa risiko nyata: pinjol ilegal, bunga mencekik, dan penyalahgunaan data. Modul ini mengajarkan cara mengenali dan menghindarinya. [Verifikasi daftar legal dan aturan terkini dengan OJK.]",
      sections: [
        { h: "P2P Lending", b: "Peer-to-peer lending mempertemukan peminjam dengan pemberi pinjaman (individu/institusi), sering di luar bank tradisional. Modelnya sah jika penyelenggaranya berizin." },
        { h: "Pinjol Legal vs Ilegal", b: "Pinjol legal terdaftar/berizin di OJK, transparan soal bunga, dan meminta izin akses terbatas. Pinjol ilegal menyembunyikan bunga, menuntut akses kontak/galeri, dan melakukan intimidasi. Selalu cek status di OJK sebelum meminjam. [Verifikasi cara cek terkini dengan OJK.]" },
        { h: "Bunga & Biaya", b: "Perhatikan total biaya, bukan hanya nominal pinjaman: bunga, biaya layanan, denda keterlambatan. Bunga harian yang tampak kecil bisa sangat besar secara tahunan. Baca ketentuan sebelum menyetujui." },
        { h: "Risiko Utang", b: "Risiko utama: keterlilitan utang (gali lubang tutup lubang), tekanan psikologis dari penagihan, dan kebocoran data pribadi. Pinjam hanya untuk kebutuhan produktif/mendesak dan dalam kemampuan bayar." },
      ],
      example: {
        title: "Contoh penerapan — pinjol legal vs ilegal",
        body: "Aplikasi A terdaftar di OJK, menampilkan bunga jelas, minta izin akses terbatas. Aplikasi B tak terdaftar, sembunyikan bunga hingga disetujui, minta akses seluruh kontak. Aplikasi B menunjukkan pola pinjol ilegal — akses kontak dipakai untuk intimidasi. Status izin dan transparansi adalah penentunya.",
      },
      takeaways: [
        "Selalu cek status izin pinjol di OJK sebelum meminjam.",
        "Pinjol ilegal menyembunyikan bunga dan menuntut akses data berlebihan.",
        "Hitung total biaya: bunga + layanan + denda, bukan hanya nominal.",
        "Pinjam hanya dalam kemampuan bayar; hindari gali-lubang-tutup-lubang.",
      ],
    },
    quiz: [
      { q: "P2P lending terutama:", options: ["Mencetak uang", "Mempertemukan peminjam dengan pemberi pinjaman", "Menerbitkan obligasi pemerintah", "Menetapkan bunga bank sentral"], answer: 1, explanation: "P2P mempertemukan peminjam dan pemberi pinjaman.", difficulty: "mudah" },
      { q: "Ciri utama pinjol ILEGAL:", options: ["Terdaftar di OJK", "Menyembunyikan bunga & menuntut akses data berlebihan", "Bunga transparan", "Izin akses terbatas"], answer: 1, explanation: "Pinjol ilegal menyembunyikan biaya dan menyalahgunakan data.", difficulty: "mudah" },
      { q: "Sebelum meminjam dari aplikasi pinjol, langkah pertama:", options: ["Langsung setuju", "Cek status izin/legalitas di OJK", "Bagikan KTP ke grup", "Pinjam sebanyak mungkin"], answer: 1, explanation: "Verifikasi legalitas di OJK lebih dulu. [Verifikasi cara cek terkini.]", difficulty: "sedang" },
      { q: "Yang harus dihitung selain nominal pinjaman:", options: ["Warna aplikasi", "Total biaya: bunga, layanan, denda", "Jumlah unduhan", "Rating bintang saja"], answer: 1, explanation: "Total biaya menentukan beban sebenarnya.", difficulty: "sedang" },
      { q: "Bunga harian yang tampak kecil:", options: ["Selalu murah", "Bisa sangat besar secara tahunan", "Tidak berpengaruh", "Dijamin pemerintah"], answer: 1, explanation: "Bunga harian berakumulasi besar secara tahunan.", difficulty: "sulit" },
      { q: "Pinjol ilegal sering menuntut akses ke:", options: ["Hanya kamera untuk KYC", "Seluruh kontak dan galeri untuk intimidasi", "Tidak ada izin apa pun", "Hanya lokasi kasar"], answer: 1, explanation: "Akses kontak/galeri dipakai untuk menekan peminjam.", difficulty: "sedang" },
      { q: "'Gali lubang tutup lubang' menggambarkan:", options: ["Strategi menabung", "Meminjam baru untuk bayar utang lama hingga terlilit", "Investasi aman", "Pelunasan cepat"], answer: 1, explanation: "Pola ini memperparah keterlilitan utang.", difficulty: "sulit" },
      { q: "Prinsip aman dalam berutang:", options: ["Pinjam sebanyak mungkin", "Pinjam hanya dalam kemampuan bayar", "Abaikan ketentuan", "Pilih bunga tertinggi"], answer: 1, explanation: "Pinjam sesuai kemampuan bayar mengurangi risiko.", difficulty: "mudah" },
      { q: "Pinjol legal umumnya:", options: ["Menyembunyikan identitas penyelenggara", "Terdaftar/berizin dan transparan", "Menolak memberi ketentuan", "Tidak punya alamat"], answer: 1, explanation: "Legalitas dan transparansi adalah ciri pinjol sah.", difficulty: "mudah" },
      { q: "Risiko non-finansial dari pinjol ilegal:", options: ["Tidak ada", "Tekanan psikologis & kebocoran data pribadi", "Bunga lebih rendah", "Asuransi gratis"], answer: 1, explanation: "Intimidasi penagihan dan penyalahgunaan data adalah risiko nyata.", difficulty: "sedang" },
    ],
  },
  {
    id: "m5",
    title: "Digital Financial Security",
    topics: ["Phishing", "Keamanan Akun", "Privasi Data", "Keamanan Siber"],
    lesson: {
      intro:
        "Keamanan finansial digital adalah inti pertahanan pengguna. Sebagian besar serangan memanfaatkan psikologi — desakan, ketakutan, keserakahan — lebih dari teknologi. Pertahanan terkuat: kebiasaan skeptis + kebersihan keamanan dasar.",
      sections: [
        { h: "Phishing", b: "Phishing mengelabui Anda agar mengungkapkan kredensial, biasanya lewat pesan berisi desakan dan tautan. Variannya: smishing (SMS) dan vishing (telepon). Polanya: desakan + permintaan data sensitif. Lembaga sah tidak pernah meminta OTP." },
        { h: "Keamanan Akun", b: "Gunakan kata sandi panjang, unik, tidak dipakai ulang; aktifkan autentikasi dua faktor (2FA) sehingga sandi yang dicuri saja tidak cukup; jangan pernah membagikan OTP." },
        { h: "Privasi Data", b: "Privasi data adalah mengendalikan siapa yang melihat informasi Anda. Prinsip minimalisasi data — hanya berbagi yang perlu — membatasi kerusakan akibat kebocoran. Cermati izin yang Anda berikan ke aplikasi." },
        { h: "Keamanan Siber", b: "Perbarui perangkat lunak, hindari Wi-Fi publik tak tepercaya untuk transaksi (lalu lintas bisa disadap), dan waspadai tautan/lampiran mencurigakan. Kebersihan dasar memperkecil permukaan serangan." },
      ],
      example: {
        title: "Contoh penerapan — uji 'imbal hasil dijamin'",
        body: "Grup daring menjanjikan 'untung 20%/bulan dijamin, tanpa risiko, cukup ajak dua teman'. Tiga tanda bahaya: imbal hasil tinggi dijamin, klaim tanpa risiko, dan ketergantungan rekrutmen (struktur Ponzi/piramida). Respons benar: tolak dan laporkan.",
      },
      takeaways: [
        "Phishing = desakan + permintaan data sensitif; jangan bagikan OTP.",
        "Pakai sandi unik + 2FA untuk mengamankan akun.",
        "Terapkan minimalisasi data: bagikan hanya yang perlu.",
        "Hindari transaksi di Wi-Fi publik; perbarui perangkat lunak.",
      ],
    },
    quiz: [
      { q: "Phishing adalah upaya untuk:", options: ["Menaikkan skor kredit", "Mengelabui agar mengungkapkan kredensial/data pribadi", "Menaikkan bunga", "Memasang antivirus"], answer: 1, explanation: "Phishing menipu pengguna agar menyerahkan informasi sensitif.", difficulty: "mudah" },
      { q: "Tanda bahaya phishing klasik:", options: ["Pesan teman soal makan siang", "Desakan meminta sandi/OTP lewat tautan", "Mutasi bulanan di aplikasi", "Pemberitahuan libur bank"], answer: 1, explanation: "Desakan + permintaan kredensial lewat tautan adalah ciri phishing.", difficulty: "mudah" },
      { q: "2FA melindungi dengan:", options: ["Meminta bukti identitas kedua selain sandi", "Menghapus kebutuhan sandi", "Membagikan data luas", "Menonaktifkan notifikasi"], answer: 0, explanation: "2FA menambah faktor kedua; sandi dicuri saja tak cukup.", difficulty: "sedang" },
      { q: "Jika 'bank' menelepon meminta PIN & OTP lengkap, Anda:", options: ["Memberikannya segera", "Menolak & hubungi bank lewat saluran resmi", "Mengumumkan daring", "Mengirim lewat email"], answer: 1, explanation: "Bank tidak pernah meminta PIN/OTP lengkap.", difficulty: "mudah" },
      { q: "Kata sandi kuat adalah:", options: ["Tanggal lahir", "Panjang, unik, tak dipakai ulang", "'123456'", "Nama hewan peliharaan"], answer: 1, explanation: "Panjang, unik, tak dipakai ulang mengalahkan serangan umum.", difficulty: "mudah" },
      { q: "'Smishing' adalah phishing lewat:", options: ["Email", "SMS", "Telepon", "Faks"], answer: 1, explanation: "Smishing dihantarkan melalui SMS.", difficulty: "sedang" },
      { q: "Skema Ponzi membayar dengan:", options: ["Keuntungan nyata", "Uang investor baru untuk investor lama", "Hibah pemerintah", "Bunga bank"], answer: 1, explanation: "Ponzi membayar investor lama dari setoran baru sampai runtuh.", difficulty: "sulit" },
      { q: "Minimalisasi data berarti:", options: ["Mengumpulkan sebanyak mungkin", "Berbagi/mengumpulkan hanya yang perlu", "Hapus semua akun", "Tidak mengenkripsi"], answer: 1, explanation: "Minimalisasi membatasi eksposur data.", difficulty: "sulit" },
      { q: "Wi-Fi publik berisiko karena:", options: ["Selalu lebih cepat", "Lalu lintas bisa disadap di jaringan tak aman", "Memblokir aplikasi", "Mengenkripsi otomatis"], answer: 1, explanation: "Jaringan tak aman memungkinkan penyadapan.", difficulty: "sedang" },
      { q: "Tawaran 'imbal hasil tinggi dijamin tanpa risiko' adalah:", options: ["Peluang bagus", "Tanda kuat penipuan", "Selalu sah", "Dijamin pemerintah"], answer: 1, explanation: "Imbal hasil tinggi dijamin tanpa risiko adalah tanda bahaya.", difficulty: "mudah" },
    ],
  },
  {
    id: "m6",
    title: "Consumer Protection",
    topics: ["Hak Konsumen", "Penyelesaian Sengketa", "Transparansi", "Pengaduan"],
    lesson: {
      intro:
        "Perlindungan konsumen memastikan pengguna layanan keuangan digital diperlakukan adil. Modul ini membahas hak konsumen, transparansi, cara mengadu, dan penyelesaian sengketa. [Verifikasi mekanisme dan lembaga terkini dengan OJK.]",
      sections: [
        { h: "Hak Konsumen", b: "Konsumen berhak atas informasi yang jelas dan jujur, perlakuan adil, kerahasiaan data, serta akses terhadap penyelesaian keluhan. Penyedia wajib transparan tentang biaya dan risiko." },
        { h: "Transparansi", b: "Sebelum menyetujui produk, konsumen berhak tahu biaya total, bunga, denda, dan ketentuan. Tawaran yang menyembunyikan biaya atau menekan agar segera setuju adalah tanda bahaya." },
        { h: "Pengaduan", b: "Jika dirugikan, konsumen dapat mengadu lebih dahulu ke penyedia, lalu ke kanal pengaduan resmi (di Indonesia, mekanisme melalui OJK). Simpan bukti: tangkapan layar, perjanjian, riwayat transaksi. [Verifikasi kanal resmi terkini dengan OJK.]" },
        { h: "Penyelesaian Sengketa", b: "Sengketa dapat diselesaikan melalui mediasi atau lembaga alternatif penyelesaian sengketa sebelum jalur hukum. Dokumentasi yang baik memperkuat posisi konsumen." },
      ],
      example: {
        title: "Contoh penerapan — menggunakan hak konsumen",
        body: "Seorang pengguna dikenai biaya yang tidak dijelaskan di awal. Langkahnya: (1) kumpulkan bukti (perjanjian, tangkapan layar biaya), (2) ajukan keluhan tertulis ke penyedia, (3) bila tak selesai, teruskan ke kanal pengaduan resmi. Transparansi biaya adalah hak, bukan kebaikan penyedia.",
      },
      takeaways: [
        "Konsumen berhak atas informasi jujur, perlakuan adil, dan kerahasiaan data.",
        "Ketahui total biaya & ketentuan sebelum menyetujui produk.",
        "Simpan bukti; adukan ke penyedia lalu kanal resmi (OJK).",
        "Sengketa dapat diselesaikan via mediasi sebelum jalur hukum.",
      ],
    },
    quiz: [
      { q: "Hak dasar konsumen layanan keuangan meliputi:", options: ["Tidak berhak apa pun", "Informasi jujur, perlakuan adil, kerahasiaan data", "Hanya hak komplain", "Hanya potongan harga"], answer: 1, explanation: "Konsumen berhak atas informasi jujur, perlakuan adil, dan kerahasiaan data.", difficulty: "mudah" },
      { q: "Sebelum menyetujui produk keuangan, konsumen berhak tahu:", options: ["Warna logo", "Total biaya, bunga, denda, ketentuan", "Jumlah karyawan", "Lokasi kantor saja"], answer: 1, explanation: "Transparansi biaya dan ketentuan adalah hak konsumen.", difficulty: "mudah" },
      { q: "Tanda bahaya terkait transparansi:", options: ["Biaya dijelaskan di awal", "Biaya disembunyikan & tekanan untuk segera setuju", "Ada ringkasan ketentuan", "Ada nomor layanan resmi"], answer: 1, explanation: "Menyembunyikan biaya dan menekan adalah tanda bahaya.", difficulty: "sedang" },
      { q: "Langkah pertama bila dirugikan penyedia:", options: ["Diam saja", "Mengadu ke penyedia dengan bukti, lalu kanal resmi", "Menyebar di media sosial tanpa bukti", "Berhenti memakai semua aplikasi"], answer: 1, explanation: "Adukan ke penyedia dahulu, lalu kanal resmi, dengan bukti.", difficulty: "sedang" },
      { q: "Yang penting disimpan sebagai bukti sengketa:", options: ["Tidak ada", "Tangkapan layar, perjanjian, riwayat transaksi", "Hanya nama aplikasi", "Hanya rating"], answer: 1, explanation: "Dokumentasi memperkuat posisi konsumen.", difficulty: "mudah" },
      { q: "Di Indonesia, pengaduan layanan keuangan dapat diteruskan melalui:", options: ["Tidak ada lembaga", "Mekanisme melalui OJK", "Hanya kepolisian", "Hanya media massa"], answer: 1, explanation: "Tersedia mekanisme pengaduan melalui OJK. [Verifikasi kanal terkini.]", difficulty: "sedang" },
      { q: "Penyelesaian sengketa sebaiknya diupayakan melalui:", options: ["Langsung jalur hukum", "Mediasi/lembaga alternatif sebelum jalur hukum", "Tidak diselesaikan", "Balas dendam"], answer: 1, explanation: "Mediasi/alternatif diupayakan sebelum jalur hukum.", difficulty: "sulit" },
      { q: "Kerahasiaan data konsumen berarti penyedia harus:", options: ["Menjual data ke pihak lain", "Melindungi dan tidak menyalahgunakan data", "Mengumumkan data publik", "Mengabaikan keamanan"], answer: 1, explanation: "Penyedia wajib melindungi data konsumen.", difficulty: "sedang" },
      { q: "Transparansi biaya adalah:", options: ["Kebaikan opsional penyedia", "Hak konsumen", "Hal yang tidak penting", "Hanya untuk nasabah besar"], answer: 1, explanation: "Transparansi adalah hak, bukan kemurahan penyedia.", difficulty: "mudah" },
      { q: "Perlindungan konsumen pada akhirnya bertujuan:", options: ["Menghambat industri", "Memastikan perlakuan adil & menjaga kepercayaan", "Menaikkan biaya", "Mengurangi pilihan"], answer: 1, explanation: "Tujuannya perlakuan adil dan menjaga kepercayaan sistem.", difficulty: "sedang" },
    ],
  },
];

export const BADGES = [
  { id: "explorer", name: "Penjelajah Fintech", desc: "Selesaikan modul pertama Anda", icon: "🧭" },
  { id: "saver", name: "Penabung Cerdas", desc: "Tuntaskan modul Budgeting & Personal Finance", icon: "🐷" },
  { id: "borrower", name: "Peminjam Bijak", desc: "Tuntaskan modul Fintech Lending", icon: "🤝" },
  { id: "guardian", name: "Penjaga Keamanan Digital", desc: "Tuntaskan modul Digital Financial Security", icon: "🛡️" },
  { id: "advocate", name: "Sadar Hak Konsumen", desc: "Tuntaskan modul Consumer Protection", icon: "⚖️" },
  { id: "perfect", name: "Nilai Sempurna", desc: "Raih skor 100% pada kuis mana pun", icon: "💯" },
  { id: "streak5", name: "Pembelajar Konsisten", desc: "Capai rentetan 5 hari", icon: "🔥" },
];

export const LEVELS = [
  { lvl: 1, name: "Pemula", min: 0 },
  { lvl: 2, name: "Penjelajah", min: 200 },
  { lvl: 3, name: "Inovator", min: 500 },
  { lvl: 4, name: "Ahli", min: 1000 },
  { lvl: 5, name: "Master Fintech", min: 1800 },
];

export const POINTS = { lessonComplete: 30, quizPassPerCorrect: 15, dailyLogin: 20, challenge: 40 };

export const DAILY_CHALLENGES = [
  { id: "c1", text: "Selesaikan satu pelajaran hari ini", check: (s) => s.todayLessons >= 1 },
  { id: "c2", text: "Raih skor di atas 80% pada kuis mana pun", check: (s) => s.bestQuizPct >= 80 },
  { id: "c3", text: "Login 5 hari berturut-turut", check: (s) => s.streak >= 5 },
];

export const SEED_PEERS = [
  { name: "Ayu P.", points: 1240 }, { name: "Budi S.", points: 980 },
  { name: "Citra W.", points: 760 }, { name: "Dewi R.", points: 540 },
  { name: "Eko H.", points: 410 }, { name: "Fitri N.", points: 300 },
];


/* ============================================================
   SCENARIO-BASED GAME — data skenario
   ------------------------------------------------------------
   Tiap skenario adalah SITUASI KEPUTUSAN (bukan soal pengetahuan).
   Tiap pilihan punya:
     quality: 2 = keputusan aman/tepat, 1 = ragu/setengah tepat, 0 = berisiko
     outcome: konsekuensi yang dijelaskan setelah memilih
   Decision-Making Score dihitung dari rata-rata quality pilihan pemain.
   Catatan validitas: ini mengukur kualitas keputusan dalam SKENARIO,
   bukan perilaku finansial nyata (intention–behavior gap).
   ============================================================ */
export const SCENARIOS = [
  {
    id: "s1", theme: "Pinjaman Online",
    situation: "Anda butuh Rp2.000.000 mendesak. Sebuah iklan menawarkan 'cair 5 menit, tanpa syarat, cukup kirim KTP dan izinkan akses kontak'. Apa yang Anda lakukan?",
    choices: [
      { t: "Langsung daftar, uang lebih penting sekarang", quality: 0, outcome: "Aplikasi ternyata pinjol ilegal. Bunga membengkak dan kontak Anda dihubungi untuk intimidasi saat telat bayar." },
      { t: "Cek dulu status legalitasnya di OJK sebelum memutuskan", quality: 2, outcome: "Anda menemukan aplikasi itu tidak terdaftar. Anda menghindarinya dan mencari alternatif resmi yang lebih aman." },
      { t: "Tanya teman yang pernah pakai, ikut saja kalau dia aman", quality: 1, outcome: "Pengalaman satu orang bukan jaminan legalitas. Anda beruntung kali ini, tetapi keputusan tidak didasarkan pada verifikasi." },
    ],
  },
  {
    id: "s2", theme: "Investasi Bodong",
    situation: "Seorang kenalan mengajak investasi 'dijamin untung 15% per bulan, tanpa risiko' asal Anda juga mengajak dua orang lain. Sikap Anda?",
    choices: [
      { t: "Ikut, untungnya besar dan ada yang sudah dapat", quality: 0, outcome: "Ini ciri skema Ponzi/piramida. Beberapa bulan kemudian skema runtuh dan dana Anda hilang." },
      { t: "Tolak — 'untung tinggi dijamin tanpa risiko' itu tidak ada", quality: 2, outcome: "Anda mengenali tanda bahaya klasik penipuan dan menyelamatkan uang Anda." },
      { t: "Coba dengan uang kecil dulu untuk lihat hasilnya", quality: 1, outcome: "Skema sengaja membayar di awal untuk memancing setoran lebih besar. 'Tes kecil' membuat Anda lebih percaya — tepat seperti yang penipu inginkan." },
    ],
  },
  {
    id: "s3", theme: "Phishing",
    situation: "Anda menerima SMS: 'Akun bank Anda diblokir. Klik tautan ini dan masukkan PIN serta OTP untuk mengaktifkan kembali.' Tindakan Anda?",
    choices: [
      { t: "Klik tautan dan masukkan data agar akun aktif lagi", quality: 0, outcome: "Tautan adalah situs palsu. Kredensial Anda dicuri dan saldo terkuras." },
      { t: "Abaikan SMS, buka aplikasi resmi/hubungi call center bank", quality: 2, outcome: "Anda memverifikasi lewat saluran resmi — ternyata tidak ada pemblokiran. Anda terhindar dari phishing." },
      { t: "Klik tautan untuk lihat dulu, tapi tidak isi data", quality: 1, outcome: "Mengklik tautan mencurigakan tetap berisiko (malware/penyadapan). Lebih aman tidak mengklik sama sekali." },
    ],
  },
  {
    id: "s4", theme: "QRIS Palsu",
    situation: "Di sebuah toko, kasir menempelkan stiker QR baru di atas QRIS resmi dan meminta Anda scan untuk bayar. Nama penerima yang muncul bukan nama toko. Apa yang Anda lakukan?",
    choices: [
      { t: "Tetap bayar, mungkin itu rekening pemilik", quality: 0, outcome: "Dana masuk ke rekening pihak tak dikenal. QR Anda ditempeli QR penipu — uang Anda hilang." },
      { t: "Batalkan, konfirmasi ke kasir karena nama penerima tak sesuai", quality: 2, outcome: "Anda menyadari ketidaksesuaian nama penerima dan menghindari penipuan tempel-QR." },
      { t: "Bayar tunai saja tanpa menanyakan apa pun", quality: 1, outcome: "Anda terhindar dari kerugian, tetapi penipuan dibiarkan dan pembeli lain bisa jadi korban berikutnya." },
    ],
  },
  {
    id: "s5", theme: "Anggaran",
    situation: "Gaji pertama Anda Rp4.000.000 baru masuk. Ada diskon gawai impian Rp3.500.000 hari ini saja. Anda belum punya dana darurat. Keputusan Anda?",
    choices: [
      { t: "Beli sekarang, mumpung diskon besar", quality: 0, outcome: "Bulan itu Anda kehabisan dana untuk kebutuhan dan tak punya cadangan saat ada kejadian tak terduga." },
      { t: "Tahan, sisihkan untuk kebutuhan & mulai dana darurat dulu", quality: 2, outcome: "Anda menerapkan prioritas keuangan yang sehat: kebutuhan dan dana darurat sebelum keinginan." },
      { t: "Beli versi lebih murah dengan setengah uang", quality: 1, outcome: "Lebih baik daripada menghabiskan semua, tetapi membeli keinginan sebelum punya dana darurat tetap berisiko." },
    ],
  },
  {
    id: "s6", theme: "Perlindungan Konsumen",
    situation: "Anda dikenai biaya tersembunyi pada layanan keuangan digital yang tidak dijelaskan saat mendaftar. Langkah Anda?",
    choices: [
      { t: "Diamkan saja, jumlahnya kecil", quality: 0, outcome: "Hak Anda atas transparansi terabaikan, dan praktik itu berlanjut tanpa koreksi." },
      { t: "Kumpulkan bukti, ajukan keluhan ke penyedia, lalu kanal resmi", quality: 2, outcome: "Anda menggunakan hak konsumen dengan benar dan mendorong penyelesaian yang adil." },
      { t: "Marah-marah di media sosial tanpa bukti", quality: 1, outcome: "Keluhan tanpa dokumentasi lemah dan berisiko hukum. Jalur resmi dengan bukti jauh lebih efektif." },
    ],
  },
  {
    id: "s7", theme: "Keamanan Akun",
    situation: "Sebuah aplikasi baru meminta izin akses ke kontak, galeri, lokasi, dan mikrofon padahal fungsinya hanya pencatat keuangan. Sikap Anda?",
    choices: [
      { t: "Setujui semua agar aplikasi cepat jalan", quality: 0, outcome: "Anda memberi akses berlebihan ke data pribadi yang bisa disalahgunakan atau bocor." },
      { t: "Tolak izin yang tak relevan dengan fungsi aplikasi", quality: 2, outcome: "Anda menerapkan minimalisasi data — hanya memberi izin yang benar-benar diperlukan." },
      { t: "Setujui sebagian, tapi tidak yakin yang mana penting", quality: 1, outcome: "Lebih baik daripada menyetujui semua, tetapi tanpa memahami relevansi izin, risiko tetap ada." },
    ],
  },
  {
    id: "s8", theme: "Fintech Lending",
    situation: "Anda sudah punya satu cicilan pinjol. Datang tawaran pinjol lain untuk 'menutup' cicilan pertama dengan tenor lebih panjang. Keputusan Anda?",
    choices: [
      { t: "Ambil, supaya cicilan bulanan lebih ringan", quality: 0, outcome: "Anda masuk pola 'gali lubang tutup lubang'. Total bunga membengkak dan utang justru menumpuk." },
      { t: "Hentikan menambah utang, susun rencana pelunasan yang realistis", quality: 2, outcome: "Anda memutus rantai utang dan fokus melunasi sesuai kemampuan — keputusan yang menyelamatkan keuangan jangka panjang." },
      { t: "Ambil tapi berjanji ini yang terakhir", quality: 1, outcome: "Niat baik tanpa rencana konkret jarang berhasil; menambah utang baru memperbesar risiko keterlilitan." },
    ],
  },
];

/* ============================================================
   FINAL SIMULATION — Simulasi Keputusan Keuangan Akhir
   ------------------------------------------------------------
   Mahasiswa mengelola anggaran bulanan (mulai Rp3.000.000) sambil
   menghadapi serangkaian peristiwa dari semua modul. Tiap keputusan
   memengaruhi saldo, tabungan, dan skor keputusan.
   Catatan validitas: ini mengukur kualitas keputusan dalam lingkungan
   TERSIMULASI, bukan perilaku finansial nyata (intention–behavior gap).
   ============================================================ */
export const SIM_START_BALANCE = 3000000;

export const SIM_EVENTS = [
  {
    id: "e1", theme: "Anggaran Awal", icon: "📊",
    text: "Uang bulanan Rp3.000.000 baru masuk. Apa langkah pertama Anda?",
    choices: [
      { t: "Sisihkan Rp600.000 untuk tabungan dulu, baru atur sisanya", quality: 2, dBalance: 0, dSaving: 600000, outcome: "Bijak — 'membayar diri sendiri dulu' mengamankan tabungan sebelum tergoda belanja." },
      { t: "Belanja dulu sesuai keinginan, sisanya baru ditabung", quality: 0, dBalance: 0, dSaving: 0, outcome: "Berisiko — menabung dari 'sisa' sering berakhir tanpa tabungan sama sekali." },
      { t: "Tabung setengahnya, Rp1.500.000", quality: 1, dBalance: 0, dSaving: 1500000, outcome: "Niat baik, tetapi terlalu ketat bisa membuat Anda kehabisan untuk kebutuhan pokok dan akhirnya berutang." },
    ],
  },
  {
    id: "e2", theme: "Pinjaman Online", icon: "💸",
    text: "Muncul iklan: 'Pinjaman cair 5 menit tanpa syarat, cukup izinkan akses kontak'. Anda sedang ingin membeli gawai baru.",
    choices: [
      { t: "Abaikan — ini ciri pinjol ilegal dan saya tidak butuh utang untuk keinginan", quality: 2, dBalance: 0, dSaving: 0, outcome: "Tepat. Anda menghindari jebakan utang berbunga tinggi untuk hal yang bukan kebutuhan." },
      { t: "Ambil pinjaman untuk beli gawai sekarang", quality: 0, dBalance: -500000, dSaving: 0, outcome: "Bunga dan biaya tersembunyi menggerus saldo Anda. Utang untuk keinginan menambah beban." },
      { t: "Ambil pinjaman kecil saja untuk coba-coba", quality: 0, dBalance: -200000, dSaving: 0, outcome: "Meski kecil, Anda kini terikat pinjol berisiko dan datanya sudah mereka pegang." },
    ],
  },
  {
    id: "e3", theme: "Penipuan Pembayaran", icon: "🎣",
    text: "SMS: 'Selamat! Anda menang undian Rp10.000.000. Bayar pajak Rp300.000 dulu ke rekening ini untuk mencairkan.'",
    choices: [
      { t: "Abaikan — undian sah tidak meminta bayar di muka", quality: 2, dBalance: 0, dSaving: 0, outcome: "Benar. 'Bayar dulu untuk dapat hadiah' adalah ciri klasik penipuan." },
      { t: "Bayar Rp300.000, hadiahnya jauh lebih besar", quality: 0, dBalance: -300000, dSaving: 0, outcome: "Uang Anda hilang dan hadiah tidak pernah ada. Ini penipuan." },
      { t: "Balas untuk menanyakan detail undian", quality: 1, dBalance: 0, dSaving: 0, outcome: "Membalas menandakan nomor Anda aktif dan mengundang penipuan lanjutan." },
    ],
  },
  {
    id: "e4", theme: "Keamanan Akun", icon: "🔐",
    text: "Sebuah aplikasi keuangan baru meminta Anda membuat kata sandi dan menawarkan login lebih cepat tanpa verifikasi tambahan.",
    choices: [
      { t: "Pakai kata sandi unik & aktifkan autentikasi dua faktor (2FA)", quality: 2, dBalance: 0, dSaving: 0, outcome: "Aman. 2FA membuat akun tetap terlindungi meski kata sandi bocor." },
      { t: "Pakai kata sandi yang sama dengan akun lain agar mudah diingat", quality: 0, dBalance: 0, dSaving: 0, outcome: "Berisiko — bila satu akun bobol, semua akun lain ikut terancam." },
      { t: "Lewati 2FA supaya login lebih cepat", quality: 1, dBalance: 0, dSaving: 0, outcome: "Kurang aman. Kemudahan sesaat menukar perlindungan penting." },
    ],
  },
  {
    id: "e5", theme: "Investasi", icon: "📈",
    text: "Anda punya tabungan Rp600.000 lebih. Seorang teman menawarkan 'investasi untung 20% per bulan dijamin tanpa risiko'.",
    choices: [
      { t: "Tolak; pelajari produk investasi resmi yang sesuai profil risiko", quality: 2, dBalance: 0, dSaving: 0, outcome: "Tepat. 'Untung tinggi dijamin tanpa risiko' tidak ada — itu ciri penipuan." },
      { t: "Masukkan semua tabungan, mumpung untung besar", quality: 0, dBalance: 0, dSaving: -600000, outcome: "Skema runtuh dan tabungan Anda hilang. Tidak ada imbal hasil tanpa risiko." },
      { t: "Coba dengan setengah tabungan saja", quality: 0, dBalance: 0, dSaving: -300000, outcome: "Tetap rugi. Mencoba skema bodong dengan modal lebih kecil tetap kehilangan uang." },
    ],
  },
  {
    id: "e6", theme: "Perlindungan Konsumen", icon: "⚖️",
    text: "Di akhir bulan Anda menyadari ada potongan biaya Rp50.000 yang tak pernah dijelaskan oleh sebuah layanan.",
    choices: [
      { t: "Kumpulkan bukti, ajukan keluhan resmi ke penyedia; bila buntu, ke OJK", quality: 2, dBalance: 50000, dSaving: 0, outcome: "Tepat. Anda menggunakan hak konsumen; biaya tak sah berpeluang dikembalikan. [Verifikasi kanal OJK terkini.]" },
      { t: "Biarkan saja, jumlahnya kecil", quality: 1, dBalance: 0, dSaving: 0, outcome: "Hak Anda terlepas, dan praktik tidak transparan dibiarkan berlanjut." },
      { t: "Tutup akun dan pindah tanpa mengadu", quality: 1, dBalance: 0, dSaving: 0, outcome: "Anda menghindar, tetapi tidak menyelesaikan masalah maupun menuntut hak Anda." },
    ],
  },
];

