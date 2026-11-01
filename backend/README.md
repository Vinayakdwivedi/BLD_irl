# Donation API

This Django project stores donation transaction submissions in PostgreSQL and exposes them in Django Admin, which provides the requested spreadsheet-style staff view.

## Local setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
docker compose up -d db
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Alternatively, run the complete local stack without installing Python packages on the host:

```bash
docker compose up -d --build
docker compose exec api python manage.py createsuperuser
```

The repository includes a local `.env` for this Docker database; it is ignored by Git. For another machine, copy `.env.example` to `.env` and replace the development values. Set `VITE_DONATION_API_URL=http://127.0.0.1:8000` in the frontend `.env` before running Vite. Admin is available at `/admin/`; submissions arrive at `POST /api/donations/`.

The root URL (`/`) returns a JSON status response so you can confirm that Django is running. The donation form uses `POST /api/donations/`; opening `/api/donations/` directly with a browser sends a `GET` request and is intentionally not the submission flow.

For production, use a managed PostgreSQL provider and deploy Django on a Python-capable service. Do not expose Django Admin publicly without HTTPS, strong credentials, and appropriate access controls.
