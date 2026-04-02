package se.dykservice.repository;

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
}
