# DB password in Secret Manager
# The shared instance uses a single postgres user. Store the password
# in Secret Manager so Cloud Run can read it securely.
resource "google_secret_manager_secret" "db_password" {
  secret_id = "${var.service_name}-db-password"
  project   = var.project_id

  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = "change-me"

  lifecycle {
    ignore_changes = [secret_data]
  }
}

# Grant Cloud Run access to the secret
resource "google_secret_manager_secret_iam_member" "cloud_run_access" {
  secret_id = google_secret_manager_secret.db_password.secret_id
  project   = var.project_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_project.current.number}-compute@developer.gserviceaccount.com"
}
