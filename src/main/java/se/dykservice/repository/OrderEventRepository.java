package se.dykservice.repository;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import se.dykservice.domain.OrderEvent;

@Repository
@RequiredArgsConstructor
public class OrderEventRepository {

  private final JdbcClient jdbcClient;

  public void insert(String orderId, String status, String message, String createdBy) {
    jdbcClient
        .sql("""
            INSERT INTO order_events (id, order_id, status, message, created_by)
            VALUES (:id, :orderId, :status, :message, :createdBy)
            """)
        .param("id", UUID.randomUUID())
        .param("orderId", orderId)
        .param("status", status)
        .param("message", message)
        .param("createdBy", createdBy)
        .update();
  }

  public List<OrderEvent> findByOrderId(String orderId) {
    return jdbcClient
        .sql("SELECT * FROM order_events WHERE order_id = :orderId ORDER BY created_at ASC")
        .param("orderId", orderId)
        .query((rs, _) -> OrderEvent.builder()
            .id(rs.getObject("id", UUID.class))
            .orderId(rs.getString("order_id"))
            .status(rs.getString("status"))
            .message(rs.getString("message"))
            .createdBy(rs.getString("created_by"))
            .createdAt(rs.getTimestamp("created_at").toInstant())
            .build())
        .list();
  }
}
