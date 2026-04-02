package se.dykservice;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "DykService API",
        version = "1.0",
        description = "Compare prices and book diving suit service across workshops in Sweden"),
    servers = @Server(url = "http://localhost:8080", description = "Local development"))
public class Application {
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
