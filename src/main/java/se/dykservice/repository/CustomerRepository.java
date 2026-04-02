package se.dykservice.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
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
            INSERT INTO customers (id, name, email, phone, street, postal_code, city, is_business, company, org_nr, notes)
            VALUES (:id, :name, :email, :phone, :street, :postalCode, :city, :isBusiness, :company, :orgNr, :notes)
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
        .param("notes", customer.notes() != null ? customer.notes() : "")
        .update();
    return id;
  }

  public Optional<Customer> findById(UUID id) {
    return jdbcClient
        .sql("SELECT * FROM customers WHERE id = :id")
        .param("id", id)
        .query((rs, _) -> mapRow(rs))
        .optional();
  }

  public List<Customer> findAll() {
    return jdbcClient
        .sql("SELECT * FROM customers ORDER BY name")
        .query((rs, _) -> mapRow(rs))
        .list();
  }

  public List<Customer> search(String query) {
    return jdbcClient
        .sql("SELECT * FROM customers WHERE LOWER(name) LIKE :q OR LOWER(email) LIKE :q OR phone LIKE :q ORDER BY name")
        .param("q", "%" + query.toLowerCase() + "%")
        .query((rs, _) -> mapRow(rs))
        .list();
  }

  public void update(Customer customer) {
    jdbcClient
        .sql("""
            UPDATE customers SET name = :name, email = :email, phone = :phone,
            street = :street, postal_code = :postalCode, city = :city,
            is_business = :isBusiness, company = :company, org_nr = :orgNr, notes = :notes
            WHERE id = :id
            """)
        .param("id", customer.id())
        .param("name", customer.name())
        .param("email", customer.email())
        .param("phone", customer.phone())
        .param("street", customer.street())
        .param("postalCode", customer.postalCode())
        .param("city", customer.city())
        .param("isBusiness", customer.isBusiness())
        .param("company", customer.company())
        .param("orgNr", customer.orgNr())
        .param("notes", customer.notes() != null ? customer.notes() : "")
        .update();
  }

  private Customer mapRow(ResultSet rs) throws SQLException {
    return Customer.builder()
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
        .notes(rs.getString("notes"))
        .build();
  }
}
