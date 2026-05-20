# DevOps Implementation Guide - Pet Adoption Platform

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Docker Setup](#docker-setup)
5. [Docker Compose](#docker-compose)
6. [GitHub Actions CI/CD](#github-actions-cicd)
7. [Kubernetes Deployment](#kubernetes-deployment)
8. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
9. [Security Hardening](#security-hardening)
10. [Scaling & Performance](#scaling--performance)

---

## Overview

This document describes the complete DevOps infrastructure for the Pet Adoption Platform spanning:

- **Containerization**: Docker for consistent application packaging
- **Orchestration**: Docker Compose for local development, Kubernetes for production
- **CI/CD**: GitHub Actions for automated testing and image publishing
- **Database**: MongoDB StatefulSet with persistent storage and replication
- **Networking**: Kubernetes Ingress with NGINX for path-based routing
- **Security**: Non-root users, secrets management, resource limits, RBAC
- **Monitoring**: Health checks, liveness/readiness probes, Prometheus metrics

**Key Metrics:**
- ✅ 3 Frontend replicas with auto-scaling (3-10 pods)
- ✅ 3 Backend replicas with auto-scaling (3-10 pods)
- ✅ 3 MongoDB replicas with persistent storage (10Gi each)
- ✅ Load balancing via NGINX Ingress
- ✅ Automated CI/CD pipeline with Docker image publishing

---

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Kubernetes Cluster                         │
│                                                                 │
│  Namespace: pet-adoption                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    NGINX Ingress                          │  │
│  │  (Routes: / → Frontend, /api → Backend)                  │  │
│  └────────┬──────────────────────────────────┬───────────────┘  │
│           │                                  │                  │
│           ▼                                  ▼                  │
│  ┌──────────────────┐         ┌──────────────────────┐          │
│  │  Frontend Pods   │         │   Backend Pods       │          │
│  │  (3 replicas)    │         │   (3 replicas)       │          │
│  │  - React + Nginx │         │   - Express.js       │          │
│  │  - HPA: 3-10     │         │   - Node.js          │          │
│  │    pods          │         │   - HPA: 3-10 pods   │          │
│  └──────────────────┘         └───────┬──────────────┘          │
│                                       │                         │
│                                       ▼                         │
│  ┌─────────────────────────────────────────────────┐            │
│  │       MongoDB Cluster (StatefulSet)             │            │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐       │            │
│  │  │  Pod 0   │ │  Pod 1   │ │  Pod 2   │       │            │
│  │  │ Primary  │ │ Secondary│ │ Secondary│       │            │
│  │  │ mongodb- │ │ mongodb- │ │ mongodb- │       │            │
│  │  │ cluster-0│ │ cluster-1│ │ cluster-2│       │            │
│  │  └──────────┘ └──────────┘ └──────────┘       │            │
│  │       ▼              ▼              ▼           │            │
│  │  ┌─────────────────────────────────────┐       │            │
│  │  │  Persistent Volumes (10Gi each)     │       │            │
│  │  │  - Replica Set: mongodb-cluster     │       │            │
│  │  │  - Authentication enabled            │       │            │
│  │  │  - Automatic backups configured     │       │            │
│  │  └─────────────────────────────────────┘       │            │
│  └─────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### Services Communication

```
Frontend (Port 3000)
    ↓
Nginx (Port 80)
    ↓
Frontend Service (ClusterIP:80)
    ↓
Frontend Pods → Environment: REACT_APP_API_URL=http://localhost/api
    ↓ (HTTP requests via Ingress)
    ▼
Backend Service (ClusterIP:5000)
    ↓
Backend Pods → Environment: MONGO_URI from Secret
    ↓
MongoDB Service (Headless, Port 27017)
    ↓
MongoDB Cluster (Replica Set: mongodb-cluster)
```

---

## Prerequisites

### Local Development
- Docker & Docker Compose
- Node.js 18+
- MongoDB 7+ (optional, use Docker Compose)
- npm/yarn

### Kubernetes Deployment
- Kubernetes cluster (1.24+)
  - Local: Minikube, Docker Desktop, Kind
  - Cloud: EKS, GKE, AKS
- `kubectl` CLI tool
- NGINX Ingress Controller
- Helm (optional, for package management)
- 10+ CPU cores, 16GB RAM minimum
- Storage class configured

### GitHub Actions
- GitHub repository access
- Docker Hub or GitHub Container Registry account
- Secrets configured in GitHub Actions

---

## Docker Setup

### Building Images Locally

```bash
# Build frontend image
docker build -t pet-adoption-frontend:latest ./client

# Build backend image
docker build -t pet-adoption-backend:latest ./server

# Verify images
docker images | grep pet-adoption
```

### Image Features

**Frontend Image (Multi-stage Build)**
- Build stage: Node.js 18 Alpine → React build
- Runtime stage: Nginx Alpine → optimized serving
- Size reduction: ~800MB → ~50MB
- Benefits:
  - Smaller footprint
  - Security hardened
  - Gzip compression enabled
  - SPA routing configured
  - Security headers added

**Backend Image**
- Base: Node.js 18 Alpine
- Non-root user (1001)
- dumb-init for proper signal handling
- Security audit (`npm audit fix`)
- Health checks configured
- Size: ~250MB

### Running Containers

```bash
# Frontend
docker run -d \
  --name pet-adoption-frontend \
  -p 3000:3000 \
  -e REACT_APP_API_URL=http://localhost:5000 \
  pet-adoption-frontend:latest

# Backend
docker run -d \
  --name pet-adoption-backend \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://localhost:27017/pet-adoption \
  pet-adoption-backend:latest

# Check container status
docker ps | grep pet-adoption
docker logs pet-adoption-backend -f

# Health checks
docker inspect pet-adoption-frontend --format='{{json .State.Health}}'
```

---

## Docker Compose

### Quick Start - Local Environment

```bash
# Start all services (frontend, backend, mongodb)
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

### Services Included

1. **Frontend** (localhost:3000)
   - React + Nginx
   - Health check every 30s
   - Depends on backend

2. **Backend** (localhost:5000)
   - Express.js API
   - Health check every 30s
   - Depends on MongoDB

3. **MongoDB** (localhost:27017)
   - Persistent volume: mongodb_data
   - Default credentials: `petadmin` / `petadmin123`
   - Health check: `mongosh --eval "db.adminCommand('ping')"`

### Environment Configuration

```yaml
# From docker-compose.yml
Backend:
  MONGO_URI: mongodb://mongodb:27017/pet-adoption
  NODE_ENV: production

Frontend:
  REACT_APP_API_URL: http://localhost:5000
```

### Troubleshooting Docker Compose

```bash
# View detailed logs
docker-compose logs backend -f

# Restart specific service
docker-compose restart backend

# Execute command in container
docker-compose exec backend npm run dev

# Remove and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## GitHub Actions CI/CD

### Pipeline Overview

**Trigger Events:**
- Push to `main` or `master` branches
- Pull requests (build, test, but don't push images)
- Git tags (v*.*.*)

**Pipeline Stages:**

```
┌─────────────────────────────────────────────────────────┐
│  1. CHECKOUT                                            │
│     - Fetch code from repository                        │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  2. BUILD & TEST (Parallel)                             │
│     Backend:                                             │
│     - npm ci                                            │
│     - npm run lint (if exists)                          │
│     - npm test (if exists)                              │
│                                                         │
│     Frontend:                                            │
│     - npm ci                                            │
│     - npm run lint (if exists)                          │
│     - npm run build                                     │
│     - npm test (if exists)                              │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  3. DOCKER BUILD & PUSH                                 │
│     - Set up Docker Buildx                              │
│     - Login to GHCR (GitHub Container Registry)        │
│     - Generate semantic versioning tags                │
│     - Build and push backend image                     │
│     - Build and push frontend image                    │
│     - Cache layers for faster builds                   │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  4. SECURITY SCANNING                                   │
│     - npm audit (backend & frontend)                   │
│     - Trivy vulnerability scanner                      │
│     - Upload results to GitHub Security tab            │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  5. NOTIFICATION                                        │
│     - Send success/failure notification                 │
└─────────────────────────────────────────────────────────┘
```

### Setting Up GitHub Actions

#### 1. Enable GitHub Actions

```bash
# Repository Settings → Actions → Allow all actions
```

#### 2. Configure Docker Registry Credentials

**For GitHub Container Registry (GHCR):**
```bash
# Automatic with GitHub Actions:
# GitHub uses GITHUB_TOKEN automatically for ghcr.io
```

**For Docker Hub (optional):**
```bash
# Add secrets to repository:
# Settings → Secrets and variables → Actions
# Add:
#   - DOCKER_USERNAME
#   - DOCKER_PASSWORD
#   - DOCKER_REGISTRY_URL (docker.io)
```

#### 3. Image Naming Convention

```
ghcr.io/{github-org}/{repository}-{service}:{tag}

Examples:
ghcr.io/yourusername/pet-adoption-platform-frontend:latest
ghcr.io/yourusername/pet-adoption-platform-frontend:main-35a8f2c
ghcr.io/yourusername/pet-adoption-platform-frontend:v1.0.0
ghcr.io/yourusername/pet-adoption-platform-backend:latest
```

#### 4. View Pipeline Results

```bash
# In GitHub:
UI: Repository → Actions → Select workflow → View logs

# Via GitHub CLI:
gh run list
gh run view {run-id}
gh run logs {run-id}
```

### Example: Manual Trigger

```bash
# Git push triggers pipeline
git add .
git commit -m "feat: new feature"
git push origin main

# Or use GitHub CLI to trigger manually
gh workflow run ci-cd-docker.yml --ref main
```

---

## Kubernetes Deployment

### Prerequisites Checklist

```bash
# Check cluster access
kubectl cluster-info
kubectl get nodes

# Install NGINX Ingress Controller (if not present)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml

# Wait for ingress-nginx to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

# Verify storage class
kubectl get storageclass
# Output: standard, premium, etc.
```

### Deployment Steps

#### 1. Create Namespace and Secrets

```bash
# Create namespace
kubectl apply -f kubernetes/namespace.yaml

# Create secrets (update credentials first!)
kubectl apply -f kubernetes/secret.yaml

# Verify secrets
kubectl get secrets -n pet-adoption
```

#### 2. Create ConfigMaps

```bash
# Create configuration
kubectl apply -f kubernetes/configmap.yaml

# Verify ConfigMaps
kubectl get configmaps -n pet-adoption
```

#### 3. Deploy MongoDB

```bash
# Create MongoDB StatefulSet with RBAC
kubectl apply -f kubernetes/mongodb-statefulset.yaml

# Wait for MongoDB pods to be ready
kubectl wait --for=condition=ready pod \
  -l app=pet-adoption,component=database \
  -n pet-adoption \
  --timeout=300s

# Verify MongoDB
kubectl get statefulsets -n pet-adoption
kubectl get pods -n pet-adoption -o wide
```

#### 4. Deploy Backend

```bash
# Create service first
kubectl apply -f kubernetes/service.yaml

# Deploy backend
kubectl apply -f kubernetes/backend-deployment.yaml

# Wait for backend pods
kubectl wait --for=condition=ready pod \
  -l app=pet-adoption,component=backend \
  -n pet-adoption \
  --timeout=300s

# Verify backend
kubectl get deployment backend -n pet-adoption
kubectl logs -n pet-adoption deployment/backend -f
```

#### 5. Deploy Frontend

```bash
# Deploy frontend
kubectl apply -f kubernetes/frontend-deployment.yaml

# Wait for frontend pods
kubectl wait --for=condition=ready pod \
  -l app=pet-adoption,component=frontend \
  -n pet-adoption \
  --timeout=300s

# Verify frontend
kubectl get deployment frontend -n pet-adoption
kubectl logs -n pet-adoption deployment/frontend -f
```

#### 6. Configure Ingress

```bash
# Apply Ingress rules
kubectl apply -f kubernetes/ingress.yaml

# Verify Ingress
kubectl get ingress -n pet-adoption
kubectl describe ingress pet-adoption-ingress -n pet-adoption
```

### Complete Deployment Script

```bash
#!/bin/bash
# deploy.sh - Complete deployment script

set -e

NAMESPACE="pet-adoption"

echo "🚀 Deploying Pet Adoption Platform to Kubernetes..."

# 1. Namespace
echo "1️⃣  Creating namespace..."
kubectl apply -f kubernetes/namespace.yaml
sleep 2

# 2. Secrets and ConfigMaps
echo "2️⃣  Creating secrets and configmaps..."
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/configmap.yaml
sleep 2

# 3. MongoDB
echo "3️⃣  Deploying MongoDB StatefulSet..."
kubectl apply -f kubernetes/mongodb-statefulset.yaml
kubectl wait --for=condition=ready pod \
  -l app=pet-adoption,component=database \
  -n $NAMESPACE \
  --timeout=300s
echo "✅ MongoDB ready"
sleep 10

# 4. Services
echo "4️⃣  Creating services..."
kubectl apply -f kubernetes/service.yaml
sleep 2

# 5. Backend
echo "5️⃣  Deploying backend..."
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl wait --for=condition=ready pod \
  -l app=pet-adoption,component=backend \
  -n $NAMESPACE \
  --timeout=300s
echo "✅ Backend ready"
sleep 5

# 6. Frontend
echo "6️⃣  Deploying frontend..."
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl wait --for=condition=ready pod \
  -l app=pet-adoption,component=frontend \
  -n $NAMESPACE \
  --timeout=300s
echo "✅ Frontend ready"
sleep 5

# 7. Ingress
echo "7️⃣  Configuring ingress..."
kubectl apply -f kubernetes/ingress.yaml
sleep 3

echo ""
echo "✨ Deployment complete!"
echo ""
echo "📊 Resources:"
kubectl get all -n $NAMESPACE
echo ""
echo "🌐 Ingress:"
kubectl get ingress -n $NAMESPACE
echo ""
echo "💾 Persistent Volumes:"
kubectl get pvc -n $NAMESPACE
echo ""
echo "✅ To access the application:"
echo "   Frontend: kubectl port-forward -n $NAMESPACE svc/frontend-service 3000:80"
echo "   Backend: kubectl port-forward -n $NAMESPACE svc/backend-service 5000:5000"
echo "   MongoDB: kubectl port-forward -n $NAMESPACE svc/mongodb-service 27017:27017"
```

### Verify Deployment

```bash
# Check all resources
kubectl get all -n pet-adoption

# Check pod status
kubectl get pods -n pet-adoption -o wide

# View logs
kubectl logs -n pet-adoption deployment/backend -f
kubectl logs -n pet-adoption deployment/frontend -f

# Check ingress
kubectl get ingress -n pet-adoption
kubectl describe ingress pet-adoption-ingress -n pet-adoption

# Test connectivity
kubectl port-forward -n pet-adoption svc/frontend-service 3000:80
kubectl port-forward -n pet-adoption svc/backend-service 5000:5000

# Then access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/health
```

---

## Monitoring & Troubleshooting

### Health Checks

```bash
# Check pod health
kubectl describe pod <pod-name> -n pet-adoption

# View events
kubectl get events -n pet-adoption

# Check resource usage
kubectl top pods -n pet-adoption
kubectl top nodes

# Database health
kubectl exec -it mongodb-cluster-0 -n pet-adoption -- \
  mongosh --eval 'rs.status()'
```

### Common Issues & Solutions

#### Issue: Backend can't connect to MongoDB

```bash
# Solution 1: Check MONGO_URI environment variable
kubectl get deployment backend -n pet-adoption -o yaml | grep MONGO_URI

# Solution 2: Test MongoDB connectivity
kubectl run -it --rm debug --image=mongo:7-alpine --restart=Never -n pet-adoption -- \
  mongosh mongodb://mongoadmin:password@mongodb-cluster-0.mongodb-service.pet-adoption.svc.cluster.local:27017/pet-adoption

# Solution 3: Check MongoDB StatefulSet
kubectl describe statefulset mongodb-cluster -n pet-adoption
```

#### Issue: Frontend can't connect to Backend

```bash
# Solution: Update REACT_APP_API_URL in ConfigMap
kubectl edit configmap frontend-config -n pet-adoption

# Then restart frontend pods
kubectl rollout restart deployment/frontend -n pet-adoption
```

#### Issue: Image pull failures

```bash
# Solution: Pull with correct credentials
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=<username> \
  --docker-password=<token> \
  -n pet-adoption

# Update deployment imagePullSecrets
```

---

## Security Hardening

### Network Policies

```yaml
# NetworkPolicy example
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: pet-adoption-network-policy
  namespace: pet-adoption
spec:
  podSelector:
    matchLabels:
      app: pet-adoption
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000
        - protocol: TCP
          port: 5000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: pet-adoption
              component: database
      ports:
        - protocol: TCP
          port: 27017
```

### Secrets Management Best Practices

1. **Use External Secrets** (Production)
   ```bash
   # Install External Secrets Operator
   helm repo add external-secrets https://charts.external-secrets.io
   helm install external-secrets external-secrets/external-secrets -n external-secrets-system --create-namespace
   ```

2. **Use Sealed Secrets** (GitOps-friendly)
   ```bash
   # Install Sealed Secrets
   kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/sealed-secrets-v0.24.0.tar.gz
   ```

3. **Secret Rotation**
   ```bash
   # Regular rotation of credentials
   kubectl patch secret mongodb-credentials -n pet-adoption -p '{"stringData":{"MONGO_INITDB_ROOT_PASSWORD":"new-password"}}'
   ```

### Resource Quotas

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: pet-adoption-quota
  namespace: pet-adoption
spec:
  hard:
    requests.cpu: "10"
    requests.memory: "20Gi"
    limits.cpu: "20"
    limits.memory: "40Gi"
    pods: "50"
```

---

## Scaling & Performance

### Auto-Scaling Configuration

```bash
# View HPA status
kubectl get hpa -n pet-adoption

# Monitor scaling events
kubectl describe hpa backend-hpa -n pet-adoption

# Manual scaling (testing)
kubectl scale deployment/backend --replicas=5 -n pet-adoption
```

### Performance Tuning

1. **MongoDB Tuning**
   - Adjust wiredTigerCacheSizeGB based on available memory
   - Index optimization for query performance
   - Connection pooling

2. **Backend Tuning**
   - Node.js memory management
   - Connection pooling for MongoDB
   - Gzip compression
   - Request caching

3. **Frontend Tuning**
   - Nginx gzip compression
   - Browser caching headers
   - CDN integration

### Backup Strategy

```bash
# MongoDB backup (manual)
kubectl exec mongodb-cluster-0 -n pet-adoption -- \
  mongodump --uri="mongodb://petadmin:password@localhost:27017/pet-adoption?authSource=admin" \
  --out=/backup

# Restore from backup
kubectl exec -it mongodb-cluster-0 -n pet-adoption -- \
  mongorestore --uri="mongodb://petadmin:password@localhost:27017?authSource=admin" \
  /backup
```

---

## Additional Resources

- [Kubernetes Official Documentation](https://kubernetes.io/docs/)
- [MongoDB Kubernetes Operator](https://www.mongodb.com/kubernetes)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Last Updated:** May 2026
**Version:** 1.0.0
**Maintained By:** DevOps Team

