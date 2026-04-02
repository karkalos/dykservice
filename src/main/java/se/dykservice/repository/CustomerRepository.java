package se.dykservice.repository;

import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import se.dykservice.domain.Customer;

@Repository
@RequiredArgsConstructor
public class CustomerRepository {

  private final JdbcClient jdbcClient;

  public UUID insert(Customer customer) {
    var id = UUID.randomUUID();
    jdbcClient
        .sql("""
            INSERT INTO customers (id, name, email, phone, street, postal_code, city, is_business, company, org_nr)
            VALUES (:id, :name, :email, :phone, :street, :postalCode, :city, :isBusiness, :company, :orgNr)
            """)
        .param("id", id)
        .param("name", customer.name())
        .param("email", customer.email())
        .param("phone", customer.phone())
        .param("street", customer.street())
        .param("postalCode", customer.postalCode())
        .param("city", customer.city())
        .param("isBusiness", customer.isBusiness())
        .param("company", customer.company())
        .param("orgNr", customer.orgNr())
        .update();
    return id;
  }

  public Optional<Customer> findById(UUID id) {
    return jdbcClient
        .sql("SELECT * FROM customers WHERE id = :id")
        .param("id", id)
        .query((rs, _) -> Customer.builder()
            .id(rs.getObject("id", UUID.class))
            .name(rs.getString("name"))
            .email(rs.getString("email"))
            .phone(rs.getString("phone"))
            .street(rs.getString("street"))
            .postalCode(rs.getString("postal_code"))
            .city(rs.getString("city"))
            .isBusiness(rs.getBoolean("is_business"))
            .company(rs.getString("company"))
            .orgNr(rs.getString("org_nr"))
            .build())
        .optional();
  }
}
