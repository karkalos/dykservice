# Database on the shared instance
# The instance itself (prod-shared-db) is managed outside this project.
# Each project only creates its own database on the shared instance.
resource "google_sql_database" "app" {
  name     = var.db_name
  instance = data.google_sql_database_instance.shared.name
  project  = var.project_id
}
