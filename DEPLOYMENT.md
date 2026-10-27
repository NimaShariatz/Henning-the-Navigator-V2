# Deployment Guide

Henning the Navigator runs on a single AWS Lightsail Ubuntu 24.04 server (1 GB RAM, 2 vCPU, 40GB SSD disk, 2 TB Transfer).

## Architecture

- **Domain:** `henningthenavigator.ca` and `www.henningthenavigator.ca` (DNS at Namecheap, A records `@` and `www` point to the Lightsail static IP)
- **Nginx** serves the built React app and proxies `/api/` and `/admin/` to Gunicorn over a unix socket
- **Gunicorn** runs Django as the systemd service `henning` (`gunicornService/henning.service`)
- **SQLite** database at `/var/lib/henning/db.sqlite3`
- **HTTPS** from Let's Encrypt (certbot, auto-renews)
- **Node.js is not installed on the server.** The frontend is built locally and uploaded.

## Server layout

| Path | Contents |
|---|---|
| `/srv/henning` | Git clone of this repo |
| `/srv/henning/venv` | Python virtual environment |
| `/srv/henning/backend/.env` | Production environment variables (**not in git**) |
| `/srv/henning/backend/staticfiles` | Output of `collectstatic` (admin and Swagger assets) |
| `/var/lib/henning` | SQLite DB and nightly backups |
| `/var/www/henning` | Built React app (uploaded from `frontend/dist`) |
| `/etc/nginx/sites-available/henning` | Nginx config (**not in git**, certbot edits it) |
| `/etc/systemd/system/henning.service` | Symlink to `gunicornService/henning.service` |

## Environment variables

**Backend**, in `backend/.env` on each machine. It is gitignored and loaded by `settings.py` through `python-dotenv`.

| Variable | Local dev | Production |
|---|---|---|
| `DJANGO_SECRET_KEY` | any string | a generated secret, different from dev |
| `DJANGO_DEBUG` | `1` | `0` |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | `henningthenavigator.ca,www.henningthenavigator.ca` |
| `DJANGO_ORIGINS` | `http://localhost:5173` | `https://henningthenavigator.ca,https://www.henningthenavigator.ca` |
| `DJANGO_DB_PATH` | unset (uses `backend/db.sqlite3`) | `/var/lib/henning/db.sqlite3` |

- Comma-separated values must have **no spaces**.
- Gunicorn reads `.env` only at startup. After any edit, run `sudo systemctl restart henning`.
- Generate a secret key with:
  `./venv/bin/python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"`

**Frontend**, committed because nothing in them is secret (values are baked into the bundle at build time):
- `frontend/.env.development`: `VITE_API_URL=http://127.0.0.1:8000/`
- `frontend/.env.production`: `VITE_API_URL=/`

## First-time setup

### 1. Lightsail and DNS
1. Create an Ubuntu 24.04 instance. Django 6 needs Python 3.12 or newer.
2. Networking: create a static IP and attach it. Allow only TCP 22, 80 and 443.
3. Enable automatic snapshots.
4. Namecheap, Advanced DNS: add A records for `@` and `www` pointing to the static IP. Remove parking-page records.
5. Check with `nslookup henningthenavigator.ca`.

### 2. Server prep
```bash
ssh -i LightsailKey.pem ubuntu@STATIC_IP
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-venv python3-pip nginx git sqlite3 certbot python3-certbot-nginx

sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

sudo mkdir -p /srv/henning /var/lib/henning /var/www/henning
sudo chown ubuntu:ubuntu /srv/henning /var/lib/henning /var/www/henning
```

### 3. Backend
```bash
git clone https://github.com/NimaShariatz/Henning-the-Navigator-V2.git /srv/henning
cd /srv/henning && python3 -m venv venv
./venv/bin/pip install -r backend/requirements.txt
nano backend/.env          # fill in the production values from the table above
chmod 600 backend/.env
cd backend
../venv/bin/python manage.py migrate
../venv/bin/python manage.py collectstatic --noinput
../venv/bin/python manage.py createsuperuser
```

### 4. Gunicorn service
```bash
sudo systemctl link /srv/henning/gunicornService/henning.service
sudo systemctl daemon-reload
sudo systemctl enable --now henning
sudo systemctl status henning
ls -l /run/henning/gunicorn.sock
```

### 5. Frontend (run on your PC)
```powershell
cd frontend
npm run build
scp -i LightsailKey.pem -r dist\* ubuntu@STATIC_IP:/var/www/henning/
ssh -i LightsailKey.pem ubuntu@STATIC_IP "sudo chmod -R a+rX /var/www/henning"
```
The `chmod` is needed because files uploaded from Windows can arrive unreadable by Nginx, which causes 403 errors on `/assets/`.

### 6. Nginx
Create `/etc/nginx/sites-available/henning`:
```nginx
server {
    listen 80;
    server_name henningthenavigator.ca www.henningthenavigator.ca;
    root /var/www/henning;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml model/gltf-binary;

    location /api/    { include proxy_params; proxy_pass http://unix:/run/henning/gunicorn.sock; }
    location /admin/  { include proxy_params; proxy_pass http://unix:/run/henning/gunicorn.sock; }
    location /static/ { alias /srv/henning/backend/staticfiles/; }
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location / { try_files $uri /index.html; }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/henning /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```
Do not symlink this file into the repo. Certbot edits it in place.

### 7. HTTPS
Do this **before** testing in a browser. With `DEBUG=0`, Django redirects HTTP to HTTPS.
```bash
sudo certbot --nginx -d henningthenavigator.ca -d www.henningthenavigator.ca
sudo certbot renew --dry-run
```
Choose the redirect option when asked.

### 8. Backups
Run `crontab -e` and add:
```
0 3 * * * sqlite3 /var/lib/henning/db.sqlite3 ".backup /var/lib/henning/backup-$(date +\%a).db"
```
This keeps seven rotating daily copies. Copy them off the server now and then.

### 9. Smoke test
- `https://www.henningthenavigator.ca` loads
- `/admin/` accepts the superuser login
- Sign up, log in and create a session
- Reload a deep link and confirm it still loads

## Deploying updates

| What changed | Do this |
|---|---|
| Backend code | Run the backend deploy block below |
| Frontend code | On your PC: `npm run build`, then `scp` and `chmod` as in step 5 |
| Both | Both |
| `backend/.env` | Edit it on the server, then `sudo systemctl restart henning` |
| `henning.service` | `git pull`, then `sudo systemctl daemon-reload && sudo systemctl restart henning` |
| Nginx config | Edit it, then `sudo nginx -t && sudo systemctl reload nginx` |

**Backend deploy (on the server):**
```bash
cd /srv/henning && git pull
./venv/bin/pip install -r backend/requirements.txt
cd backend
../venv/bin/python manage.py migrate
../venv/bin/python manage.py collectstatic --noinput
sudo systemctl restart henning
```
A bash file has been created with the following lines: 
```bash
set -euo pipefail

cd /srv/henning
git pull
./venv/bin/pip install -r backend/requirements.txt

cd backend
../venv/bin/python manage.py migrate
../venv/bin/python manage.py collectstatic --noinput

sudo systemctl restart henning
sudo systemctl status henning --no-pager
```
make sure when you push a bash file, it ends with CRLF (so dont push with Terminal. Do it with Ubuntu). On first run do
```
cd /srv/henning && git pull
```
After that, you can now run the bash file with this command from /srv/henning
```
/srv/henning/scripts/deploy-backend.sh
```


## Troubleshooting

| Symptom | Check |
|---|---|
| 502 Bad Gateway | `sudo systemctl status henning` and `journalctl -u henning -n 50 --no-pager` |
| 400 Bad Request (plain page) | `DJANGO_ALLOWED_HOSTS` is wrong. It must exactly match the domain (`.ca`, no spaces). Restart after editing. |
| 403 on login or POST | `DJANGO_ORIGINS` must use `https://` |
| 403 on `/assets/...` files | Run `sudo chmod -R a+rX /var/www/henning` |
| Admin has no styling | Run `collectstatic`, and check the `/static/` alias path |
| Blank page or asset 404s | `dist` files weren't uploaded to `/var/www/henning/` |
| Socket permission denied | Gunicorn needs `Group=www-data` and `--umask 007` |
| Nginx errors | `/var/log/nginx/error.log` |
| See what Django loaded | `cd /srv/henning/backend && ../venv/bin/python manage.py shell -c "from django.conf import settings; print(settings.ALLOWED_HOSTS, settings.CSRF_TRUSTED_ORIGINS)"` |

## Notes

- `/api/docs/` and `/api/schema/` (Swagger) are public in production. Remove them from `backend/backend/urls.py` if that's not wanted.
- GitHub Actions and GitHub Secrets are not used yet. If CI/CD is added later, the secrets would be the deploy SSH key, server IP and username. The Django secret stays on the server.# Deployment Guide
