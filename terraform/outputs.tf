output "cloud_run_url" {
  description = "Cloud Run service URL"
  value       = google_cloud_run_v2_service.app.uri
}

output "cloud_sql_connection_name" {
  description = "Cloud SQL connection name (shared instance)"
  value       = data.google_sql_database_instance.shared.connection_name
}

output "db_name" {
  description = "Database name on the shared instance"
  value       = google_sql_database.app.name
}
