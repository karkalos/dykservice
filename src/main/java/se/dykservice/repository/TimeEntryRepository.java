package se.dykservice.repository;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import se.dykservice.domain.TimeEntry;

@Repository
@RequiredArgsConstructor
public class TimeEntryRepository {

  private final JdbcClient jdbcClient;

  public List<TimeEntry> findByOrderId(String orderId) {
    return jdbcClient
        .sql("SELECT * FROM time_entries WHERE order_id = :orderId ORDER BY created_at DESC")
        .param("orderId", orderId)
        .query((rs, _) -> TimeEntry.builder()
            .id(rs.getObject("id", UUID.class))
            .orderId(rs.getString("order_id"))
            .description(rs.getString("description"))
            .minutes(rs.getInt("minutes"))
            .createdAt(rs.getTimestamp("created_at").toInstant())
            .build())
        .list();
  }

  public void insert(String orderId, String description, int minutes) {
    jdbcClient
        .sql("INSERT INTO time_entries (order_id, description, minutes) VALUES (:orderId, :description, :minutes)")
        .param("orderId", orderId)
        .param("description", description)
        .param("minutes", minutes)
        .update();
  }

  public int getTotalMinutes(String orderId) {
    return jdbcClient
        .sql("SELECT COALESCE(SUM(minutes), 0) FROM time_entries WHERE order_id = :orderId")
        .param("orderId", orderId)
        .query(Integer.class)
        .single();
  }

  public void deleteById(UUID id) {
    jdbcClient
        .sql("DELETE FROM time_entries WHERE id = :id")
        .param("id", id)
        .update();
  }

  public int getTotalMinutesToday() {
    return jdbcClient
        .sql("SELECT COALESCE(SUM(minutes), 0) FROM time_entries WHERE CAST(created_at AS DATE) = CURRENT_DATE")
        .query(Integer.class)
        .single();
  }
}
