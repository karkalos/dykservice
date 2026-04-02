package se.dykservice.repository;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import se.dykservice.domain.Workshop;

@Repository
@RequiredArgsConstructor
public class WorkshopRepository {

  private final JdbcClient jdbcClient;

  public List<Workshop> findAll() {
    return jdbcClient
        .sql("SELECT * FROM workshops ORDER BY name")
        .query((rs, _) -> Workshop.builder()
            .id(rs.getString("id"))
            .name(rs.getString("name"))
            .address(rs.getString("address"))
            .city(rs.getString("city"))
            .phone(rs.getString("phone"))
            .email(rs.getString("email"))
            .website(rs.getString("website"))
            .prioritySurchargePct(rs.getInt("priority_surcharge_pct"))
            .emergencySurchargePct(rs.getInt("emergency_surcharge_pct"))
            .warrantyYears(rs.getInt("warranty_years"))
            .acceptsWetSuits(rs.getBoolean("accepts_wet_suits"))
            .acceptsVikingHd(rs.getBoolean("accepts_viking_hd"))
            .hasMailIn(rs.getBoolean("has_mail_in"))
            .createdAt(rs.getTimestamp("created_at").toInstant())
            .build())
        .list();
  }

  public Optional<Workshop> findById(String id) {
    return jdbcClient
        .sql("SELECT * FROM workshops WHERE id = :id")
        .param("id", id)
        .query((rs, _) -> Workshop.builder()
            .id(rs.getString("id"))
            .name(rs.getString("name"))
            .address(rs.getString("address"))
            .city(rs.getString("city"))
            .phone(rs.getString("phone"))
            .email(rs.getString("email"))
            .website(rs.getString("website"))
            .prioritySurchargePct(rs.getInt("priority_surcharge_pct"))
            .emergencySurchargePct(rs.getInt("emergency_surcharge_pct"))
            .warrantyYears(rs.getInt("warranty_years"))
            .acceptsWetSuits(rs.getBoolean("accepts_wet_suits"))
            .acceptsVikingHd(rs.getBoolean("accepts_viking_hd"))
            .hasMailIn(rs.getBoolean("has_mail_in"))
            .createdAt(rs.getTimestamp("created_at").toInstant())
            .build())
        .optional();
  }
}
