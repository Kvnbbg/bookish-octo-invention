#!/usr/bin/env bash
# ==============================================================
# mirrord-auto.sh — Auto-detect & run mirrord session
# For: bookish-octo-invention
# Author: Kevin Marville (@Kvnbbg)
# ==============================================================

set -e

echo "⚙️  Auto-mirrord launcher for bookish-octo-invention"

# --- CONFIG ---
NAMESPACE="dev"
JAR_PATH="target/bookish-octo-invention.jar"
APP_NAME="backend-api"
TF_FLAG="TF_MIRROR_TEST=1"

# --- CHECKS ---
if ! command -v mirrord >/dev/null 2>&1; then
  echo "❌ mirrord not installed. Run ops/mirrord/mirrord-setup.sh first."
  exit 1
fi

if [ ! -f "$JAR_PATH" ]; then
  echo "🔨 Building project..."
  mvn clean package -DskipTests
fi

# --- DETECT POD ---
echo "🔍 Searching for target pod in namespace '$NAMESPACE'..."
TARGET_POD=$(kubectl get pods -n "$NAMESPACE" \
  | grep "$APP_NAME" \
  | grep Running \
  | head -n 1 \
  | awk '{print $1}')

if [ -z "$TARGET_POD" ]; then
  echo "❌ No running pod found matching '$APP_NAME' in namespace '$NAMESPACE'."
  echo "👉 Try: kubectl apply -f ops/mirrord/mirrord-test.yaml"
  exit 1
fi

echo "🎯 Found pod: $TARGET_POD"
sleep 1

# --- RUN MIRRORD ---
echo "🚀 Starting mirrord session..."
echo "    Namespace: $NAMESPACE"
echo "    Pod: $TARGET_POD"
echo "    Jar: $JAR_PATH"

mirrord exec --target pod/"$TARGET_POD" -n "$NAMESPACE" -- \
  env "$TF_FLAG" java -jar "$JAR_PATH"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ Mirrord session completed successfully."
else
  echo "⚠️  Mirrord session ended with code $EXIT_CODE"
fi

# --- LOG EXPORT ---
mkdir -p ops/mirrord/reports
DATE_TAG=$(date +"%Y%m%d_%H%M%S")
kubectl logs "$TARGET_POD" -n "$NAMESPACE" > ops/mirrord/reports/mirrord_run_${DATE_TAG}.log 2>/dev/null || true
echo "🧾 Logs saved to ops/mirrord/reports/mirrord_run_${DATE_TAG}.log"
