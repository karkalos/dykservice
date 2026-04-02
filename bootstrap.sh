#!/bin/bash
# Bootstrap script — run ONCE before first terraform apply.
# Enables required APIs. The Terraform state bucket (prod-tf-state-proven-country)
# and shared Cloud SQL instance (prod-shared-db) already exist.

set -euo pipefail

PROJECT_ID="proven-country-479800-f7"

echo "==> Verifying gcloud project..."
gcloud config set project "$PROJECT_ID"

echo "==> Enabling required APIs..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com

echo ""
echo "Bootstrap complete. Next steps:"
echo "  cd terraform/"
echo "  terraform init"
echo "  terraform plan"
echo "  terraform apply"
