package se.dykservice;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Import(TestConfig.class)
@ExtendWith(DatabaseCleanerExtension.class)
public @interface IntegrationTest {}
