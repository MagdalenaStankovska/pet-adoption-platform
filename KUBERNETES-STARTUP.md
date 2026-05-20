# Kubernetes Startup Guide

## Can I start the app with Kubernetes?

Yes. The Pet Adoption Platform can be deployed to a Kubernetes cluster using the manifests in the `kubernetes/` folder.

## What you need first

- A working Kubernetes cluster
  - Local options: Docker Desktop Kubernetes, Minikube, Kind
  - Cloud options: GKE, EKS, AKS, or another cluster
- `kubectl` installed and configured
- An Ingress controller installed, preferably NGINX Ingress
- Docker images available from your registry if you are using image pulls from GHCR/Docker Hub

## Recommended way to start

From the project root, run:

```bash
bash kubernetes/deploy.sh pet-adoption
```

This script creates the namespace, secrets, configmaps, MongoDB StatefulSet, services, backend deployment, frontend deployment, and ingress.

## Manual startup order

If you want to apply the manifests one by one, use this order:

```bash
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/mongodb-statefulset.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/ingress.yaml
```

## Verify that everything is running

```bash
kubectl get all -n pet-adoption
kubectl get pvc -n pet-adoption
kubectl get ingress -n pet-adoption
```

You should see:
- frontend deployment and service
- backend deployment and service
- mongodb StatefulSet and headless service
- persistent volume claims for MongoDB
- an ingress resource

## Access the app locally

If your cluster is local and you want to access the services without a real domain, use port-forwarding:

```bash
kubectl port-forward -n pet-adoption svc/frontend-service 3000:80
kubectl port-forward -n pet-adoption svc/backend-service 5000:5000
kubectl port-forward -n pet-adoption svc/mongodb-service 27017:27017
```

Then open:
- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:5000/health`
- Backend API: `http://localhost:5000/api/pets`

## Where the app runs in Kubernetes

- **Namespace:** `pet-adoption`
- **Frontend service:** `frontend-service`
- **Backend service:** `backend-service`
- **Database service:** `mongodb-service`
- **Database workload:** `mongodb-cluster` StatefulSet

## Important note about images

The Kubernetes manifests currently reference images from GHCR. Before deploying to a real cluster, make sure:

1. Your GitHub Actions workflow has pushed the latest images
2. Your cluster can pull from the registry
3. If the registry is private, add an image pull secret

## Files used for Kubernetes deployment

- `kubernetes/namespace.yaml`
- `kubernetes/secret.yaml`
- `kubernetes/configmap.yaml`
- `kubernetes/frontend-deployment.yaml`
- `kubernetes/backend-deployment.yaml`
- `kubernetes/service.yaml`
- `kubernetes/ingress.yaml`
- `kubernetes/mongodb-statefulset.yaml`
- `kubernetes/deploy.sh`

## Troubleshooting

### `current-context is not set`

This means `kubectl` is not connected to any Kubernetes cluster yet.

Fix it by starting or enabling a cluster first:

**Docker Desktop Kubernetes**
1. Open Docker Desktop
2. Go to Settings / Kubernetes
3. Turn on Kubernetes
4. Click **Apply** if the button is enabled
5. Wait until the cluster status changes from **Stopped** to **Running**
6. Docker Desktop should create the `docker-desktop` context automatically

If you see a cluster named `docker-desktop` but it says **Stopped**, Kubernetes is not ready yet. You must apply the setting and wait for Docker Desktop to finish creating the cluster.

**Minikube**
```bash
minikube start
kubectl config use-context minikube
```

**Kind**
```bash
kind create cluster
kubectl config use-context kind-kind
```

After that, confirm the context:

```bash
kubectl config current-context
kubectl cluster-info
```

### Pod is not starting
Check events and logs:

```bash
kubectl describe pod <pod-name> -n pet-adoption
kubectl logs <pod-name> -n pet-adoption
```

### MongoDB is not healthy
Check the StatefulSet and PVCs:

```bash
kubectl get statefulset -n pet-adoption
kubectl get pvc -n pet-adoption
kubectl logs statefulset/mongodb-cluster -n pet-adoption
```

### Ingress does not open the site
- Make sure the NGINX Ingress Controller is installed
- Check your ingress host configuration
- If needed, use port-forwarding first

## Best option for class demo

For a classroom or project demo, the easiest flow is:

1. Deploy the app to Kubernetes with `bash kubernetes/deploy.sh pet-adoption`
2. Use `kubectl get all -n pet-adoption` to show the running resources
3. Use port-forwarding to open the frontend in your browser
4. Show the MongoDB StatefulSet and the API endpoint response

---

If you want, I can also make a `kubectl` command cheat sheet specifically for Windows/Git Bash.

