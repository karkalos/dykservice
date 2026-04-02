package se.dykservice.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import se.dykservice.domain.ServiceOrder;

@Repository
@RequiredArgsConstructor
public class ServiceOrderRepository {

  private final JdbcClient jdbcClient;

  public void insert(ServiceOrder order) {
    jdbcClient
        .sql("""
            INSERT INTO service_orders (id, workshop_id, customer_id, booking_type, status, suit_type, suit_brand,
                                        items, urgency, estimated_price, notes, payment_method, payment_status)
            VALUES (:id, :workshopId, :customerId, :bookingType, :status, :suitType, :suitBrand,
                    :items, :urgency, :estimatedPrice, :notes, :paymentMethod, :paymentStatus)
            """)
        .param("id", order.id())
        .param("workshopId", order.workshopId())
        .param("customerId", order.customerId())
        .param("bookingType", order.bookingType())
        .param("status", order.status())
        .param("suitType", order.suitType())
        .param("suitBrand", order.suitBrand())
        .param("items", order.items())
        .param("urgency", order.urgency())
        .param("estimatedPrice", order.estimatedPrice())
        .param("notes", order.notes())
        .param("paymentMethod", order.paymentMethod())
        .param("paymentStatus", order.paymentStatus())
        .update();
  }

  public Optional<ServiceOrder> findById(String id) {
    return jdbcClient
        .sql("SELECT * FROM service_orders WHERE id = :id")
        .param("id", id)
        .query((rs, _) -> mapRow(rs))
        .optional();
  }

  public List<ServiceOrder> findByWorkshopId(String workshopId) {
    return jdbcClient
        .sql("SELECT * FROM service_orders WHERE workshop_id = :workshopId ORDER BY created_at DESC")
        .param("workshopId", workshopId)
        .query((rs, _) -> mapRow(rs))
        .list();
  }

  public List<ServiceOrder> findAll() {
    return jdbcClient
        .sql("SELECT * FROM service_orders ORDER BY created_at DESC")
        .query((rs, _) -> mapRow(rs))
        .list();
  }

  public void updateStatus(String id, String status) {
    jdbcClient
        .sql("UPDATE service_orders SET status = :status, updated_at = NOW() WHERE id = :id")
        .param("id", id)
        .param("status", status)
        .update();
  }

  public void updateDiagnosis(String id, String findings, String items, int price) {
    jdbcClient
        .sql("""
            UPDATE service_orders
            SET diagnosis_findings = :findings, diagnosis_items = :items,
                diagnosis_price = :price, updated_at = NOW()
            WHERE id = :id
            """)
        .param("id", id)
        .param("findings", findings)
        .param("items", items)
        .param("price", price)
        .update();
  }

  public void updatePaymentStatus(String id, String status) {
    jdbcClient
        .sql("UPDATE service_orders SET payment_status = :status, updated_at = NOW() WHERE id = :id")
        .param("id", id)
        .param("status", status)
        .update();
  }

  public void approveDiagnosis(String id) {
    jdbcClient
        .sql("UPDATE service_orders SET diagnosis_approved = true, updated_at = NOW() WHERE id = :id")
        .param("id", id)
        .update();
  }

  public List<ServiceOrder> findByCustomerId(UUID customerId) {
    return jdbcClient
        .sql("SELECT * FROM service_orders WHERE customer_id = :customerId ORDER BY created_at DESC")
        .param("customerId", customerId)
        .query((rs, _) -> mapRow(rs))
        .list();
  }

  private ServiceOrder mapRow(ResultSet rs) throws SQLException {
    return ServiceOrder.builder()
        .id(rs.getString("id"))
        .workshopId(rs.getString("workshop_id"))
        .customerId(rs.getObject("customer_id", UUID.class))
        .bookingType(rs.getString("booking_type"))
        .status(rs.getString("status"))
        .suitType(rs.getString("suit_type"))
        .suitBrand(rs.getString("suit_brand"))
        .items(rs.getString("items"))
        .urgency(rs.getString("urgency"))
        .estimatedPrice(rs.getInt("estimated_price"))
        .finalPrice(rs.getObject("final_price") != null ? rs.getInt("final_price") : null)
        .notes(rs.getString("notes"))
        .paymentMethod(rs.getString("payment_method"))
        .paymentStatus(rs.getString("payment_status"))
        .diagnosisFindings(rs.getString("diagnosis_findings"))
        .diagnosisItems(rs.getString("diagnosis_items"))
        .diagnosisPrice(rs.getObject("diagnosis_price") != null ? rs.getInt("diagnosis_price") : null)
        .diagnosisApproved(rs.getBoolean("diagnosis_approved"))
        .priority(rs.getInt("priority"))
        .estimatedMinutes(rs.getObject("estimated_minutes") != null ? rs.getInt("estimated_minutes") : null)
        .createdAt(rs.getTimestamp("created_at").toInstant())
        .updatedAt(rs.getTimestamp("updated_at").toInstant())
        .build();
  }

  public void updatePriority(String id, int priority) {
    jdbcClient
        .sql("UPDATE service_orders SET priority = :priority, updated_at = NOW() WHERE id = :id")
        .param("id", id)
        .param("priority", priority)
        .update();
  }

  public int countByStatusNotIn(List<String> statuses) {
    return jdbcClient
        .sql("SELECT COUNT(*) FROM service_orders WHERE status NOT IN (:statuses)")
        .param("statuses", statuses)
        .query(Integer.class)
        .single();
  }

  public int countCreatedToday() {
    return jdbcClient
        .sql("SELECT COUNT(*) FROM service_orders WHERE CAST(created_at AS DATE) = CURRENT_DATE")
        .query(Integer.class)
        .single();
  }

  public java.util.Map<String, Integer> countByStatus() {
    var result = new java.util.LinkedHashMap<String, Integer>();
    jdbcClient
        .sql("SELECT status, COUNT(*) as cnt FROM service_orders GROUP BY status")
        .query((rs, _) -> {
          result.put(rs.getString("status"), rs.getInt("cnt"));
          return null;
        })
        .list();
    return result;
  }
}
