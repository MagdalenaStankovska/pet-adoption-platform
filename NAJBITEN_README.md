# KIII Project Requirements Map

This document shows exactly **which file in the repository fulfills each project requirement**.

## 1) Upload the application to a public Git repository — 10%

**What this means:**
Your project must be stored in a public Git repository.

**Where it is in this repo:**
- The whole repository is the submission
- Git history is stored in `.git/`
- Main application code is in `client/` and `server/`

**Evidence in the repo:**
- `README.md`
- `client/`
- `server/`
- `kubernetes/`
- `.github/workflows/`

---

## 2) Dockerize the application — 10%

**What this means:**
You must create Docker images for the app services.

**Files that satisfy this requirement:**
- `client/Dockerfile` — frontend container image
- `server/Dockerfile` — backend container image
- `client/.dockerignore` — keeps frontend image clean
- `server/.dockerignore` — keeps backend image clean

**What they do:**
- The frontend builds React and serves it with Nginx
- The backend runs Express and connects to MongoDB

---

## 3) Orchestrate app and database with Docker Compose — 10%

**What this means:**
You must run the frontend, backend, and database together with Docker Compose.

**File that satisfies this requirement:**
- `docker-compose.yml`

**Services inside it:**
- `frontend`
- `backend`
- `mongodb`

**What it does:**
- Starts the full stack locally
- Connects backend to MongoDB
- Exposes the app on ports 3000 and 5000

---

## 4) CI/CD pipeline with image publishing — 20%

**What this means:**
You must configure a CI platform to build and publish Docker images on every push.

**Files that satisfy this requirement:**
- `.github/workflows/ci-cd-docker.yml`

**What it does:**
- Runs on push and pull request
- Builds frontend and backend
- Runs tests where available
- Builds Docker images
- Publishes images to GitHub Container Registry
- Runs security scanning

**Registry used:**
- GitHub Container Registry: `ghcr.io`

---

## 5) Kubernetes Deployment with ConfigMaps/Secrets — 10%

**What this means:**
You must create Kubernetes Deployment manifests for the application and use ConfigMaps/Secrets.

**Files that satisfy this requirement:**
- `kubernetes/frontend-deployment.yaml`
- `kubernetes/backend-deployment.yaml`
- `kubernetes/configmap.yaml`
- `kubernetes/secret.yaml`

**What they do:**
- Deploy the React frontend
- Deploy the Express backend
- Inject configuration through ConfigMaps
- Inject sensitive values through Secrets

---

## 6) Kubernetes Service — 10%

**What this means:**
You must create Services for the application.

**File that satisfies this requirement:**
- `kubernetes/service.yaml`

**Services inside it:**
- `frontend-service`
- `backend-service`
- `mongodb-service` (headless service for database communication)

---

## 7) Kubernetes Ingress — 10%

**What this means:**
You must create an Ingress object so users can reach the app through HTTP/HTTPS.

**File that satisfies this requirement:**
- `kubernetes/ingress.yaml`

**What it does:**
- Routes `/` to the frontend
- Routes `/api` to the backend
- Includes NGINX Ingress configuration

---

## 8) Kubernetes StatefulSet for the database — 10%

**What this means:**
You must deploy the database as a StatefulSet and use ConfigMaps/Secrets where needed.

**Files that satisfy this requirement:**
- `kubernetes/mongodb-statefulset.yaml`
- `kubernetes/configmap.yaml`
- `kubernetes/secret.yaml`

**What it does:**
- Runs MongoDB as a StatefulSet
- Gives the database stable network identity
- Uses persistent storage
- Uses credentials from Secrets

---

## 9) Deploy manifests into a separate namespace and demonstrate the app works — 10%

**What this means:**
You must deploy everything into its own namespace and prove the app runs.

**Files that satisfy this requirement:**
- `kubernetes/namespace.yaml` — creates the namespace `pet-adoption`
- `kubernetes/deploy.sh` — deploys everything in the right order
- `KUBERNETES-STARTUP.md` — explains how to verify and access the app

**How to demonstrate it works:**
```bash
kubectl get all -n pet-adoption
kubectl get ingress -n pet-adoption
kubectl port-forward -n pet-adoption svc/frontend-service 3000:80
```

---

## Quick file-to-requirement summary

| Requirement | Main File(s) |
|---|---|
| Public Git repository | whole repo / `.git/` |
| Dockerize application | `client/Dockerfile`, `server/Dockerfile` |
| Docker Compose orchestration | `docker-compose.yml` |
| CI/CD pipeline | `.github/workflows/ci-cd-docker.yml` |
| Kubernetes Deployment | `kubernetes/frontend-deployment.yaml`, `kubernetes/backend-deployment.yaml` |
| Kubernetes Service | `kubernetes/service.yaml` |
| Kubernetes Ingress | `kubernetes/ingress.yaml` |
| StatefulSet for database | `kubernetes/mongodb-statefulset.yaml` |
| Separate namespace + demo | `kubernetes/namespace.yaml`, `kubernetes/deploy.sh` |

---

## Which file should you show to your professor?

For a short explanation, show these first:
1. `README.md`
2. `PROJECT-REQUIREMENTS-README.md`
3. `KUBERNETES-STARTUP.md`
4. `docker-compose.yml`
5. `.github/workflows/ci-cd-docker.yml`
6. `kubernetes/`

---

## Short answer: how to start the app with Kubernetes?

From the repo root:

```bash
bash kubernetes/deploy.sh pet-adoption
```

Then verify:

```bash
kubectl get all -n pet-adoption
```

If you want local access:

```bash
kubectl port-forward -n pet-adoption svc/frontend-service 3000:80
```

---

## Notes for the report

This project is a good match for the KIII requirements because it includes:
- Frontend service
- Backend service
- Database service
- Docker containerization
- Docker Compose orchestration
- CI/CD pipeline
- Kubernetes manifests
- Separate namespace deployment

That means you can document every required item with a real file from the repository.

