#!/bin/bash

# ============================================================================
# Pet Adoption Platform - Kubernetes Deployment Script
# Automates complete deployment to Kubernetes cluster
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE=${1:-pet-adoption}
CONTEXT=${2:-}
TIMEOUT=300
WAIT_TIME=10

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi

    # Check cluster access
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot access Kubernetes cluster"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

set_context() {
    if [ -n "$CONTEXT" ]; then
        log_info "Setting kubectl context to: $CONTEXT"
        kubectl config use-context "$CONTEXT"
    fi
}

verify_ingress_controller() {
    log_info "Checking NGINX Ingress Controller..."

    if ! kubectl get deployment -n ingress-nginx ingress-nginx-controller &> /dev/null; then
        log_warning "NGINX Ingress Controller not found. Installing..."
        kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml

        log_info "Waiting for ingress controller to be ready..."
        sleep 30
        kubectl wait --namespace ingress-nginx \
            --for=condition=ready pod \
            --selector=app.kubernetes.io/component=controller \
            --timeout=120s || log_warning "Ingress controller not ready yet"
    else
        log_success "NGINX Ingress Controller is ready"
    fi
}

deploy_namespace() {
    log_info "Creating namespace: $NAMESPACE"
    kubectl apply -f kubernetes/namespace.yaml
    sleep 2
    log_success "Namespace created"
}

deploy_secrets() {
    log_info "Creating secrets..."
    kubectl apply -f kubernetes/secret.yaml

    log_warning "⚠️  IMPORTANT: Update MongoDB credentials in kubernetes/secret.yaml before production!"
    sleep 2
    log_success "Secrets configured"
}

deploy_configmaps() {
    log_info "Creating ConfigMaps..."
    kubectl apply -f kubernetes/configmap.yaml
    sleep 2
    log_success "ConfigMaps configured"
}

deploy_mongodb() {
    log_info "Deploying MongoDB StatefulSet..."
    kubectl apply -f kubernetes/mongodb-statefulset.yaml

    log_info "Waiting for MongoDB pods to be ready (max ${TIMEOUT}s)..."
    kubectl wait --for=condition=ready pod \
        -l app=pet-adoption,component=database \
        -n "$NAMESPACE" \
        --timeout="${TIMEOUT}s" || log_warning "Timeout waiting for MongoDB"

    sleep "$WAIT_TIME"
    log_success "MongoDB deployed and ready"
}

deploy_services() {
    log_info "Creating Kubernetes Services..."
    kubectl apply -f kubernetes/service.yaml
    sleep 2
    log_success "Services configured"
}

deploy_backend() {
    log_info "Deploying backend..."
    kubectl apply -f kubernetes/backend-deployment.yaml

    log_info "Waiting for backend pods to be ready (max ${TIMEOUT}s)..."
    kubectl wait --for=condition=ready pod \
        -l app=pet-adoption,component=backend \
        -n "$NAMESPACE" \
        --timeout="${TIMEOUT}s" || log_warning "Timeout waiting for backend"

    sleep "$WAIT_TIME"
    log_success "Backend deployed and ready"
}

deploy_frontend() {
    log_info "Deploying frontend..."
    kubectl apply -f kubernetes/frontend-deployment.yaml

    log_info "Waiting for frontend pods to be ready (max ${TIMEOUT}s)..."
    kubectl wait --for=condition=ready pod \
        -l app=pet-adoption,component=frontend \
        -n "$NAMESPACE" \
        --timeout="${TIMEOUT}s" || log_warning "Timeout waiting for frontend"

    sleep "$WAIT_TIME"
    log_success "Frontend deployed and ready"
}

deploy_ingress() {
    log_info "Configuring ingress routes..."
    kubectl apply -f kubernetes/ingress.yaml
    sleep 3
    log_success "Ingress routes configured"
}

verify_deployment() {
    log_info "Verifying deployment..."

    echo ""
    echo -e "${BLUE}Deployment Summary:${NC}"
    echo "===================="
    echo ""

    log_info "Namespace: $NAMESPACE"
    kubectl get namespace "$NAMESPACE" -o wide

    echo ""
    log_info "Deployments:"
    kubectl get deployments -n "$NAMESPACE" -o wide

    echo ""
    log_info "StatefulSets:"
    kubectl get statefulsets -n "$NAMESPACE" -o wide

    echo ""
    log_info "Pods:"
    kubectl get pods -n "$NAMESPACE" -o wide

    echo ""
    log_info "Services:"
    kubectl get services -n "$NAMESPACE" -o wide

    echo ""
    log_info "Ingress:"
    kubectl get ingress -n "$NAMESPACE" -o wide

    echo ""
    log_info "Persistent Volume Claims:"
    kubectl get pvc -n "$NAMESPACE" -o wide

    echo ""
}

display_access_info() {
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}🎉 Deployment Complete!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo ""

    echo -e "${BLUE}📊 Access Information:${NC}"
    echo ""

    echo "1. Port Forward (Local Development):"
    echo "   Frontend:"
    echo "   $ kubectl port-forward -n $NAMESPACE svc/frontend-service 3000:80"
    echo "   Access: http://localhost:3000"
    echo ""
    echo "   Backend:"
    echo "   $ kubectl port-forward -n $NAMESPACE svc/backend-service 5000:5000"
    echo "   Access: http://localhost:5000"
    echo ""
    echo "   MongoDB:"
    echo "   $ kubectl port-forward -n $NAMESPACE svc/mongodb-service 27017:27017"
    echo "   Access: mongodb://petadmin:petadmin123@localhost:27017"
    echo ""

    echo "2. View Logs:"
    echo "   $ kubectl logs -n $NAMESPACE deployment/backend -f"
    echo "   $ kubectl logs -n $NAMESPACE deployment/frontend -f"
    echo "   $ kubectl logs -n $NAMESPACE statefulset/mongodb-cluster -f"
    echo ""

    echo "3. Interactive Shell:"
    echo "   $ kubectl exec -it -n $NAMESPACE deployment/backend -- sh"
    echo "   $ kubectl exec -it -n $NAMESPACE statefulset/mongodb-cluster -- mongosh"
    echo ""

    echo "4. Monitor Resources:"
    echo "   $ kubectl top pods -n $NAMESPACE"
    echo "   $ kubectl top nodes"
    echo ""

    echo -e "${BLUE}📋 Configuration:${NC}"
    echo "   Namespace:  $NAMESPACE"
    echo "   Frontend:   3 replicas (HPA: 3-10)"
    echo "   Backend:    3 replicas (HPA: 3-10)"
    echo "   MongoDB:    3 replicas (StatefulSet)"
    echo "   Storage:    10Gi per MongoDB pod"
    echo ""

    echo -e "${YELLOW}⚠️  Next Steps:${NC}"
    echo "   1. Update MongoDB password in secret.yaml"
    echo "   2. Configure Ingress TLS certificates"
    echo "   3. Set up monitoring (Prometheus/Grafana)"
    echo "   4. Configure backups for MongoDB"
    echo ""

    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo ""
}

# Main execution
main() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}🚀 Pet Adoption Platform - Kubernetes Deployment${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""

    check_prerequisites
    set_context

    log_info "Starting deployment to namespace: $NAMESPACE"
    echo ""

    verify_ingress_controller
    echo ""

    deploy_namespace
    echo ""

    deploy_secrets
    echo ""

    deploy_configmaps
    echo ""

    deploy_mongodb
    echo ""

    deploy_services
    echo ""

    deploy_backend
    echo ""

    deploy_frontend
    echo ""

    deploy_ingress
    echo ""

    verify_deployment

    display_access_info
}

# Error handling
trap 'log_error "Deployment failed"; exit 1' ERR

# Run main
main "$@"

