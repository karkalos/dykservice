variable "project_id" {
  description = "GCP project ID"
  type        = string
  default     = "proven-country-479800-f7"
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "europe-west2"
}

variable "service_name" {
  description = "Cloud Run service name"
  type        = string
  default     = "dykservice"
}

variable "db_instance_name" {
  description = "Shared Cloud SQL instance name"
  type        = string
  default     = "prod-shared-db"
}

variable "db_name" {
  description = "Database name (created on the shared instance)"
  type        = string
  default     = "dykservice_db"
}

variable "db_user" {
  description = "Database user"
  type        = string
  default     = "postgres"
}
