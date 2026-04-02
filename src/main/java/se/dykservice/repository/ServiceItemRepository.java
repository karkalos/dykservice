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
