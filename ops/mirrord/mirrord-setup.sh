#!/usr/bin/env bash
# ================================================
# mirrord Setup Script for bookish-octo-invention
# Author: Kevin Marville (@Kvnbbg)
# ================================================

set -e

echo "🚀 Starting mirrord setup..."

# --- 1. Check prerequisites
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl not found. Install it first."; exit 1; }
command -v java >/dev/null 2>&1 || { echo "❌ Java not found. Install JDK 17+."; exit 1; }

# --- 2. Install mirrord CLI
if ! command -v mirrord >/dev/null 2>&1; then
  echo "⬇️ Installing mirrord CLI..."
  curl -fsSL https://raw.githubusercontent.com/metalbear-co/mirrord/main/install.sh | bash
else
  echo "✅ mirrord already installed."
fi

# --- 3. Verify Kubernetes cluster access
echo "🔍 Checking Kubernetes connection..."
kubectl cluster-info || { echo "❌ Cluster not reachable. Check your kubeconfig."; exit 1; }

# --- 4. List available pods
echo "📦 Listing available pods in namespace 'dev'..."
kubectl get pods -n dev

# --- 5. Ready to execute mirrord test
echo "🎯 Example test command:"
echo "mirrord exec --target pod/backend-api-dev-1234 -n dev -- java -jar target/bookish-octo-invention.jar"

echo "✅ mirrord setup complete!"
