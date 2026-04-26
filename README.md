# Patient Management System (PMS)

A simple full-stack application for clinics to manage patient records.

[![CI](https://github.com/saqibsadiq212/PMS/actions/workflows/ci.yml/badge.svg)](https://github.com/saqibsadiq212/PMS/actions)

## Stack

- **Backend:** Django 5 + Django REST Framework, Postgres 16
- **Frontend:** React 18 + TypeScript, Vite, axios
- **Infrastructure:** Docker + Docker Compose, GitHub Actions

## Quickstart

Prerequisites: Docker and Docker Compose installed.

```bash
git clone https://github.com/saqibsadiq212/PMS.git
cd pms
cp .env.example .env
cp backend/.env.example backend/.env
docker compose up --build
```

Once all three services are healthy:

- Frontend: http://localhost:5173
- API: http://localhost:8000/api/patients/
- API browsable UI: http://localhost:8000/api/patients/ (in browser)
- Django admin: http://localhost:8000/admin/

A default clinic ("ABC Clinic") is seeded automatically via a data migration.
The app is functional immediately — no manual setup required.

To stop:

```bash
docker compose down       # stops containers, preserves data
docker compose down -v    # also wipes the database
```


## Data Model
- **Clinic** has many Patients
- **Patient** belongs to one Clinic, has many Appointments
- **Appointment** has many Clinicians (M2M)
- **Clinician** belongs to one Clinic


## API
Patient CRUD endpoints, scoped to the current clinic:

| Method | URL | Action |
|---|---|---|
| GET | `/api/patients/` | List patients (paginated, 20/page) |
| POST | `/api/patients/` | Create patient |
| GET | `/api/patients/{id}/` | Retrieve patient with nested appointments |
| PATCH | `/api/patients/{id}/` | Partial update |
| PUT | `/api/patients/{id}/` | Full update |
| DELETE | `/api/patients/{id}/` | Delete patient |


## Authentication
Currently no authentication mechanism is being added


## CI
GitHub Actions runs on every push, pull request, or manual trigger.
Two parallel jobs:

- **Backend** — `ruff` lint, Django system check, migrations against a Postgres service container
- **Frontend** — TypeScript type check, Vite production build


## Local Development (without Docker)
If you'd rather run pieces locally:

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt

# Postgres needed locally on port 5432, or run just the db container:
docker run --name pms-db -e POSTGRES_DB=pms_db -e POSTGRES_USER=pms_user \
  -e POSTGRES_PASSWORD=pms_password -p 5432:5432 -d postgres:16-alpine

python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```