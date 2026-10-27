#!/usr/bin/env bash
set -euo pipefail

cd /srv/henning
git pull
./venv/bin/pip install -r backend/requirements.txt

cd backend
../venv/bin/python manage.py migrate
../venv/bin/python manage.py collectstatic --noinput

sudo systemctl restart henning
sudo systemctl status henning --no-pager