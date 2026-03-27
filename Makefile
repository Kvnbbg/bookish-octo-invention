# =========================================================
# Makefile — Mirrord Workflow Automation
# Project: bookish-octo-invention
# Author: Kevin Marville (@Kvnbbg)
# =========================================================

SHELL := /bin/bash
MIRRORD_DIR := ops/mirrord
NAMESPACE := dev
APP_NAME := backend-api
JAR_PATH := target/bookish-octo-invention.jar
DATE_TAG := $(shell date +"%Y%m%d_%H%M%S")

# -------- HELP --------
help:
	@echo ""
	@echo "🪞 Mirrord Commands for bookish-octo-invention"
	@echo "----------------------------------------------"
	@echo "make setup        → Install mirrord CLI + prerequisites"
	@echo "make deploy-test  → Deploy dev test pod for mirroring"
	@echo "make mirror       → Run local JAR mirrored to Kubernetes pod"
	@echo "make auto         → Auto-detect and mirror pod (quick dev)"
	@echo "make report       → Generate new report file"
	@echo "make analyze      → Run Jupyter latency analysis"
	@echo "make clean-logs   → Clear old mirrord reports"
	@echo ""

# -------- SETUP --------
setup:
	@echo "⬇️ Installing mirrord CLI..."
	curl -fsSL https://raw.githubusercontent.com/metalbear-co/mirrord/main/install.sh | bash
	@echo "✅ Mirrord installed."
	@echo "🔍 Verifying cluster access..."
	kubectl cluster-info

# -------- DEPLOY TEST POD --------
deploy-test:
	@echo "🚀 Deploying test backend pod in namespace $(NAMESPACE)..."
	kubectl apply -f $(MIRRORD_DIR)/mirrord-test.yaml

# -------- MIRROR SESSION --------
mirror:
	@echo "🔎 Detecting running pod..."
	POD=$$(kubectl get pods -n $(NAMESPACE) | grep $(APP_NAME) | grep Running | head -n 1 | awk '{print $$1}'); \
	if [ -z "$$POD" ]; then \
	echo "❌ No pod found for $(APP_NAME) in $(NAMESPACE). Run 'make deploy-test' first."; exit 1; \
	fi; \
	echo "🎯 Found pod: $$POD"; \
	if [ ! -f "$(JAR_PATH)" ]; then \
	echo "🔨 Building backend JAR..."; mvn -q clean package -DskipTests; \
	fi; \
	echo "🚀 Starting mirrord session..."; \
	mirrord exec --target pod/$$POD -n $(NAMESPACE) -- env TF_MIRROR_TEST=1 java -jar $(JAR_PATH); \
	echo "🧾 Exporting logs..."; \
	mkdir -p $(MIRRORD_DIR)/reports; \
	kubectl logs $$POD -n $(NAMESPACE) > $(MIRRORD_DIR)/reports/mirrord_run_$(DATE_TAG).log || true

# -------- AUTO MODE --------
auto:
	@echo "⚙️  Auto-detect and mirror current dev pod"
	bash $(MIRRORD_DIR)/mirrord-auto.sh

# -------- REPORT GENERATION --------
report:
	@echo "🧩 Generating report template..."
	mkdir -p $(MIRRORD_DIR)/reports
	cp $(MIRRORD_DIR)/mirrord-report.md $(MIRRORD_DIR)/reports/report_$(DATE_TAG).md
	@echo "✅ New report created at ops/mirrord/reports/report_$(DATE_TAG).md"

# -------- ANALYSIS --------
analyze:
	@echo "📊 Opening Jupyter notebook for mirrord analysis..."
	jupyter notebook $(MIRRORD_DIR)/mirrord-log-analysis.ipynb

# -------- CLEAN --------
clean-logs:
	@echo "🧹 Cleaning mirrord logs and reports..."
	rm -rf $(MIRRORD_DIR)/reports/*
	@echo "✅ Done."
