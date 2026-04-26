FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# System dependencies. libpq for psycopg2 for Postgres.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
        gcc \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user to run the app.
RUN groupadd -r app && useradd -r -g app app

WORKDIR /app

# Copy and install Python Dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN chown -R app:app /app
USER app

# Default Port
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
