FROM node:22-slim as frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM eclipse-temurin:24-jdk-noble as builder
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:resolve
COPY src ./src
COPY --from=frontend /app/src/main/resources/static ./src/main/resources/static
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:24-jre-noble
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
