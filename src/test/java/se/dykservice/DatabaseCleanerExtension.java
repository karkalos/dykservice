package se.dykservice;

import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.test.context.junit.jupiter.SpringExtension;

public class DatabaseCleanerExtension implements BeforeEachCallback {

  @Override
  public void beforeEach(ExtensionContext context) {
    var appContext = SpringExtension.getApplicationContext(context);
    var jdbc = appContext.getBean(JdbcClient.class);
    jdbc.sql("DELETE FROM order_events").update();
    jdbc.sql("DELETE FROM service_orders").update();
    jdbc.sql("DELETE FROM customers").update();
  }
}
