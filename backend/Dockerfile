# Backend Dockerfile for Cookapp (FastAPI)
# Multi-purpose container that installs dependencies and runs the FastAPI app with uvicorn

FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Copy backend sources
COPY . /app

RUN pip install uv

RUN if [ -f pyproject.toml ]; then \
    uv sync --locked --all-extras; \
    else \
    echo "No project dependency file found, continuing..." ; \
    fi

# Create a non-root user and switch to it
RUN useradd -m appuser || true
USER appuser

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
