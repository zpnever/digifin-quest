import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("🚀 Memulai proses build DigiFin Quest untuk Hosting PHP...\n");

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const apiDir = path.join(rootDir, "api");
const outputDir = path.join(rootDir, "dist-php");
const rootHtaccess = path.join(rootDir, ".htaccess");
const zipFile = path.join(rootDir, "digifinquest-php.zip");

// 1. Build Vite Frontend
console.log("📦 1. Mem-build Frontend React dengan Vite (mode production)...");
try {
  execSync("npm run build", { stdio: "inherit", cwd: rootDir });
} catch (err) {
  console.error("❌ Gagal mem-build frontend.");
  process.exit(1);
}

// 2. Bersihkan atau buat output directory dist-php
console.log("\n📁 2. Menyiapkan folder paket 'dist-php/'...");
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// Helper untuk copy recursive
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      // Lewati node_modules atau temporary files jika ada
      if (child === "node_modules" || child === ".DS_Store") continue;
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 3. Salin hasil build dist ke dist-php
console.log("📋 3. Menyalin aset frontend dari 'dist/' ke 'dist-php/'...");
copyRecursive(distDir, outputDir);

// 4. Salin folder api ke dist-php/api
console.log("📋 4. Menyalin backend PHP dari 'api/' ke 'dist-php/api/'...");
copyRecursive(apiDir, path.join(outputDir, "api"));

// 5. Salin .htaccess root ke dist-php/.htaccess
console.log("📋 5. Menyalin root .htaccess ke 'dist-php/.htaccess'...");
if (fs.existsSync(rootHtaccess)) {
  fs.copyFileSync(rootHtaccess, path.join(outputDir, ".htaccess"));
}

// 6. Buat file ZIP jika utilitas zip tersedia
console.log("\n📦 6. Membuat arsip ZIP 'digifinquest-php.zip'...");
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

try {
  // Gunakan zip di Unix/Mac
  execSync(`zip -r -q "${zipFile}" .`, { cwd: outputDir });
  const zipStats = fs.statSync(zipFile);
  console.log(`✅ File zip berhasil dibuat: digifinquest-php.zip (${(zipStats.size / (1024 * 1024)).toFixed(2)} MB)`);
} catch (e) {
  console.log("ℹ️  Utilitas 'zip' tidak tersedia, folder 'dist-php/' tetap siap digunakan secara manual.");
}

console.log("\n=======================================================");
console.log("🎉 BUILD PHP HOSTING BERHASIL!");
console.log("=======================================================");
console.log("Direktori Paket : " + outputDir);
console.log("File ZIP Siap Upload : " + (fs.existsSync(zipFile) ? zipFile : "Gunakan isi folder dist-php"));
console.log("\nLangkah selanjutnya:");
console.log("1. Upload file 'digifinquest-php.zip' ke direktori 'public_html' cPanel hosting Anda.");
console.log("2. Ekstrak file zip tersebut di cPanel File Manager.");
console.log("3. Buat database MySQL di cPanel dan sesuaikan 'api/config.php'.");
console.log("4. Buka https://domain-anda.com/api/install/setup.php untuk inisialisasi database.");
console.log("5. Panduan lengkap dapat dibaca di: PANDUAN_HOSTING_PHP.md\n");
