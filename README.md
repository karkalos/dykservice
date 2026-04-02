# GCP Spring Boot Template

A production-ready Spring Boot template designed for fast deployment to Google Cloud Platform (Cloud Run & Cloud SQL). Includes a lightweight JDBC persistence example.

## Features
- **Spring Boot 3.4.1** & **Java 21**.
- **PostgreSQL Persistence**: Uses `JdbcTemplate` for lightweight, direct SQL interaction.
- **Database Migrations (Flyway)**: Automated, versioned schema management out of the box.
- **Cloud SQL Integration**: Uses the shared `prod-shared-db` instance — no per-project database instances.
- **Infrastructure as Code**: Terraform for Cloud Run and Secret Manager.
- **Zero-Conf Deployment**: Optimized `Dockerfile` for Cloud Run.
- **Local Dev Support**: Pre-configured H2 database profile with Flyway support.

## Quick Start

### 1. Copy this template

Copy the project and update these values for your new service:
- `terraform/versions.tf` — change `prefix` to your project name
- `terraform/variables.tf` — change `service_name` and `db_name`
- `pom.xml` — change `artifactId`, `name`, `description`
- `application.properties` — change `spring.application.name`

### 2. Bootstrap (one-time)

```bash
./bootstrap.sh
```

### 3. Deploy infrastructure with Terraform

```bash
cd terraform/
terraform init
terraform plan
terraform apply
```

This creates:
- A database on the shared `prod-shared-db` Cloud SQL instance
- Secret Manager secret for the DB password
- Cloud Run service wired to Cloud SQL and Secret Manager

### 4. Build and deploy the app

```bash
gcloud builds submit --tag gcr.io/proven-country-479800-f7/cloud-run-sample .
```

## Local Development

Run the application locally using the `local` profile (uses in-memory H2):

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### Database Migrations
This project uses **Flyway** for database migrations.
- Place all migration scripts in: `src/main/resources/db/migration/`
- Use the versioning format: `V1__description.sql`, `V2__another_change.sql`.

### API Endpoints
- `GET /db-check`: Database health check.
- `POST /messages`: Save a message (send raw text in body).
- `GET /messages`: List all saved messages.

## Project Structure

```
cloud-run-sample/
  bootstrap.sh                          # One-time API enablement
  Dockerfile                            # Multi-stage build for Cloud Run
  terraform/
    main.tf                             # Provider, APIs, shared DB data source
    cloud-run.tf                        # Cloud Run service
    cloud-sql.tf                        # Database on shared instance
    secrets.tf                          # Secret Manager + IAM
    variables.tf                        # Configurable values
    outputs.tf                          # Useful outputs (URLs, connection names)
    versions.tf                         # Terraform + provider versions, state backend
  src/
    main/
      resources/
        application.properties          # Cloud config
        application-local.properties    # Local H2 overrides
        db/migration/                   # Flyway migrations
      java/com/example/template/
        TemplateApplication.java        # Entry point
        MessageController.java          # CRUD endpoints
        ProbeController.java            # DB health check
        Message.java                    # Data model
```

## Configuration

Environment variables used by the app (all managed by Terraform in production):

| Variable | Description | Default |
|---|---|---|
| `CLOUD_SQL_CONNECTION_NAME` | Full connection string (`project:region:instance`) | `proven-country-479800-f7:europe-west2:prod-shared-db` |
| `CLOUD_SQL_DATABASE_NAME` | Database name | `sample_db` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASS` | Database password | *none — must be set* |

## Infrastructure

All projects share a single Cloud SQL instance and Terraform state bucket:

- **Cloud SQL**: `prod-shared-db` (PostgreSQL 15, db-f1-micro, europe-west2)
- **Terraform state**: `gs://prod-tf-state-proven-country/<project-name>/`
- **Container Registry**: `gcr.io/proven-country-479800-f7/`

Each project creates its own database on the shared instance — no per-project instances needed.
