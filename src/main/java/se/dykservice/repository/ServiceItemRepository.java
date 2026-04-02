package se.dykservice.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import se.dykservice.domain.ServiceItem;

@Repository
@RequiredArgsConstructor
public class ServiceItemRepository {

  private final JdbcClient jdbcClient;

  public List<ServiceItem> findByWorkshopId(String workshopId) {
    return jdbcClient
        .sql("SELECT * FROM service_items WHERE workshop_id = :workshopId ORDER BY category, name")
        .param("workshopId", workshopId)
        .query((rs, _) -> mapRow(rs))
        .list();
  }

  public List<ServiceItem> findByName(String name) {
    return jdbcClient
        .sql("SELECT * FROM service_items WHERE name = :name")
        .param("name", name)
        .query((rs, _) -> mapRow(rs))
        .list();
  }

  public Optional<ServiceItem> findById(String id) {
    return jdbcClient
        .sql("SELECT * FROM service_items WHERE id = :id")
        .param("id", id)
        .query((rs, _) -> mapRow(rs))
        .optional();
  }

  public List<ServiceItem> findAll() {
    return jdbcClient
        .sql("SELECT * FROM service_items ORDER BY category, name")
        .query((rs, _) -> mapRow(rs))
        .list();
  }

  public void updatePrice(String id, int newPrice) {
    jdbcClient
        .sql("UPDATE service_items SET base_price = :price WHERE id = :id")
        .param("price", newPrice)
        .param("id", id)
        .update();
  }

  public void insert(ServiceItem item) {
    jdbcClient
        .sql("""
            INSERT INTO service_items (id, workshop_id, category, name, name_sv, base_price, notes, in_stock)
            VALUES (:id, :workshopId, :category, :name, :nameSv, :basePrice, :notes, :inStock)
            """)
        .param("id", item.id())
        .param("workshopId", item.workshopId())
        .param("category", item.category())
        .param("name", item.name())
        .param("nameSv", item.nameSv())
        .param("basePrice", item.basePrice())
        .param("notes", item.notes())
        .param("inStock", item.inStock())
        .update();
  }

  public void deleteById(String id) {
    jdbcClient
        .sql("DELETE FROM service_items WHERE id = :id")
        .param("id", id)
        .update();
  }

  private ServiceItem mapRow(ResultSet rs) throws SQLException {
    return ServiceItem.builder()
        .id(rs.getString("id"))
        .workshopId(rs.getString("workshop_id"))
        .category(rs.getString("category"))
        .name(rs.getString("name"))
        .nameSv(rs.getString("name_sv"))
        .basePrice(rs.getInt("base_price"))
        .notes(rs.getString("notes"))
        .inStock(rs.getBoolean("in_stock"))
        .build();
  }
}
