# Kalkulator Pajak Hand-Carry (PMK 34/2025)

Estimasi bea masuk dan PPN untuk barang bawaan penumpang dari luar negeri.

- Live: https://barangbawaan.my.id
- Aturan: PMK 34/2025
- Tarif: bea masuk 10%, PPN 12%, pembebasan USD 500
- Semua perhitungan berjalan di browser; tidak ada backend.

## Fitur

- Kurs KMK resmi, sinkron otomatis. Bisa diganti manual jika sinkron gagal.
- Mode terang dan gelap.
- Rincian perhitungan dan cetak PDF.
- PWA: bisa dipakai offline setelah kunjungan pertama.
- Tanpa akun dan tanpa menyimpan data pribadi.

## Stack

- React 18 + Vite
- Tailwind CSS
- Nginx di Docker
- Cloudflare Tunnel untuk produksi

## Struktur

```text
src/                 React app
public/              ikon dan aset statis
dist/                hasil build; ikut di-commit untuk deploy
Dockerfile           nginx + dist
docker-compose.yml   container indo-tax-app, port 8084
nginx.conf           SPA fallback dan cache aset
```

## Jalankan lokal

Butuh Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
```

Build dan cek hasil produksi:

```bash
npm run build
npm run preview
```

## Deploy di VM Debian

Docker hanya menyalin `dist/` ke nginx. Node tidak dibutuhkan di VM selama `dist/` sudah terbaru.

1. Masuk ke VM dan ambil kode terbaru:

```bash
ssh root@vm-0-4-debian
cd ~/tax-calculator-hand-carry
git fetch origin
git checkout main
git pull --ff-only origin main
```

2. Pastikan build yang akan dipakai benar:

```bash
grep -o '<title>[^<]*' dist/index.html
```

3. Hentikan container lama dan deploy:

```bash
docker compose down
docker rm -f indo-tax-app tax-calculator-app 2>/dev/null || true
docker compose up -d --build
```

4. Verifikasi:

```bash
curl -I http://127.0.0.1:8084/
curl -s http://127.0.0.1:8084/ | grep -o '<title>[^<]*'
docker compose ps
docker logs --tail 30 indo-tax-app
```

Jika tidak memakai Docker Compose, gunakan Podman:

```bash
podman build -t tax-pwa:latest .
podman rm -f tax-calculator-app 2>/dev/null || true
podman run -d --name tax-calculator-app -p 8084:8084 --restart always tax-pwa:latest
```

### Setelah mengubah source

`dist/` ikut di-commit karena Dockerfile menyalin folder itu. Build di mesin yang punya Node, lalu commit dan push `dist/` sebelum deploy:

```bash
npm ci
npm run build
git add dist
git commit -m "build: update dist"
git push
```

Kalau tidak, deploy akan memakai build lama.

## Cloudflare Tunnel dan cache

Tunnel di VM mengarahkan domain ke container:

```yaml
# /etc/cloudflared/config.yml
ingress:
  - hostname: barangbawaan.my.id
    service: http://localhost:8084
  - service: http_status:404
```

Cloudflare bisa menyimpan HTML sampai 24 jam. Setelah setiap deploy, purge:

- Dashboard → Caching → Configuration → Purge Cache → Custom Purge
- URL: `https://barangbawaan.my.id/` dan `https://barangbawaan.my.id/index.html`

Atau lewat API:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://barangbawaan.my.id/","https://barangbawaan.my.id/index.html"]}'
```

Agar tidak perlu purge terus-menerus, buat Cache Rule untuk `/` dan `/index.html`: **Bypass cache**.

Service worker hanya aktif di HTTPS atau localhost. Akses lewat `http://IP:8084` tidak mengaktifkan mode offline.

## Kredensial Git di VM

Jangan simpan token di URL remote. Simpan di `.env`, batasi permission, dan pastikan file itu tidak ikut Git atau Docker.

```bash
cd ~/tax-calculator-hand-carry
umask 077
cat > .env <<'EOF'
GITHUB_USER=sigidpam
GITHUB_TOKEN=github_pat_xxx
EOF
chmod 600 .env
echo '.env' >> .git/info/exclude
```

Bersihkan token dari remote dan gunakan helper yang membaca `.env`:

```bash
git remote set-url origin https://github.com/sigidpam/tax-calculator-hand-carry.git
git config --local credential.helper '!f() { . "$(git rev-parse --show-toplevel)/.env"; printf "username=%s\npassword=%s\n" "$GITHUB_USER" "$GITHUB_TOKEN"; }; f'
git fetch origin
git check-ignore -v .env
```

`.env` sudah masuk `.gitignore` dan `.dockerignore`. File ini hanya untuk kredensial Git; aplikasi tidak punya secret runtime.

Kalau token pernah terekspos, rotasi di GitHub lalu ganti nilai di `.env`. Untuk jangka panjang, gunakan SSH deploy key.

## Rollback

```bash
cd ~/tax-calculator-hand-carry
docker compose down
docker tag tax-calculator-hand-carry-tax-calculator:rollback-<timestamp> \
  tax-calculator-hand-carry-tax-calculator:latest
docker compose up -d --no-build
```

Detail image dan commit terakhir ada di `/root/tax-calculator-rollback.txt`.

## Update rutin

```bash
cd ~/tax-calculator-hand-carry
git pull --ff-only origin main
docker compose down
docker compose up -d --build
# purge cache HTML Cloudflare
```

## Catatan

- Ini estimasi. Penetapan resmi dilakukan oleh Bea Cukai.
- Kurs berasal dari data KMK. Jika sinkron gagal, gunakan mode manual.
- `node_modules/` masih ikut ter-commit. Sebaiknya dibersihkan dari tracking pada commit terpisah:
  `git rm -r --cached node_modules`
