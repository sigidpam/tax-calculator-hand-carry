# 🧮 Kalkulator Pajak Hand-Carry (PMK 34)

Web App PWA (Progressive Web App) untuk menghitung estimasi pajak impor barang bawaan penumpang dari luar negeri (HP, Laptop, Tas, dll) sesuai aturan Bea Cukai (PMK 34). Aplikasi ini dirancang agar cepat, akurat, dan bisa digunakan tanpa sinyal internet saat berada di pesawat.

🌐 **Live Demo:** [barangbawaan.my.id](https://barangbawaan.my.id)

## ✨ Fitur Unggulan

* **Akurat PMK 34:** Perhitungan otomatis mengurangkan nilai pembebasan bea masuk sebesar $500.
* **Auto-Sync Kurs KMK (Kemenkeu):** Tidak menggunakan kurs bank biasa. Aplikasi ini menyedot data Kurs Pajak resmi (KMK) mingguan langsung dari Kementerian Keuangan.
* **Offline Mode (PWA):** Tetap bisa menghitung pajak meskipun sedang dalam *Airplane Mode* di pesawat.
* **Dark Mode:** Tampilan yang ramah di mata untuk *red-eye flights*.
* **Cetak PDF:** Rincian perhitungan bisa disimpan/dicetak langsung.

## 🛠️ Tech Stack

* **Frontend:** React + Vite
* **Styling:** Tailwind CSS + Lucide Icons
* **Deployment:** Docker / Podman + Nginx
* **Data Scraper:** Google Sheets API (Bypass Cloudflare Kemenkeu)

## 🚀 Cara Menjalankan di Lokal (Development)

Pastikan kamu sudah menginstal Node.js di komputermu.

1. **Clone repository ini:**
   ```bash
   git clone [https://github.com/USERNAME_LU/kalkulator-pajak-pmk34.git](https://github.com/USERNAME_LU/kalkulator-pajak-pmk34.git)
   cd kalkulator-pajak-pmk34
2. **Install Dependencies**
   ```bash
   npm install
3. **Jalankan Server Dev**
   ```bash
   npm run dev
   
Cara Deploy (Production)
Proyek ini sudah dilengkapi dengan Dockerfile dan konfigurasi Nginx untuk deployment langsung menggunakan Podman atau Docker.
Build image dan jalankan container:

**Jika menggunakan Podman**
```bash 
podman build -t tax-pwa:latest .
podman run -d --name tax-calculator-app -p 8084:8084 --restart always tax-pwa:latest 
```

**Jika menggunakan Docker**

```bash
docker-compose up -d --build
```

Bersihkan sistem (Opsional):
```bash
podman builder prune -f && podman system prune -f
