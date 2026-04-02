package se.dykservice.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import se.dykservice.domain.Invoice;

@Repository
@RequiredArgsConstructor
public class InvoiceRepository {

    private final JdbcClient jdbcClient;

    public void insert(Invoice invoice) {
        jdbcClient.sql("""
            INSERT INTO invoices (id, order_id, invoice_number, customer_name, customer_email,
                customer_address, items, subtotal, vat_rate, vat_amount, total,
                payment_method, payment_status, due_date, notes)
            VALUES (:id, :orderId, :invoiceNumber, :customerName, :customerEmail,
                :customerAddress, :items, :subtotal, :vatRate, :vatAmount, :total,
                :paymentMethod, :paymentStatus, :dueDate, :notes)
            """)
            .param("id", invoice.id())
            .param("orderId", invoice.orderId())
            .param("invoiceNumber", invoice.invoiceNumber())
            .param("customerName", invoice.customerName())
            .param("customerEmail", invoice.customerEmail())
            .param("customerAddress", invoice.customerAddress())
            .param("items", invoice.items())
            .param("subtotal", invoice.subtotal())
            .param("vatRate", invoice.vatRate())
            .param("vatAmount", invoice.vatAmount())
            .param("total", invoice.total())
            .param("paymentMethod", invoice.paymentMethod())
            .param("paymentStatus", invoice.paymentStatus())
            .param("dueDate", invoice.dueDate())
            .param("notes", invoice.notes())
            .update();
    }

    public Optional<Invoice> findByOrderId(String orderId) {
        return jdbcClient.sql("SELECT * FROM invoices WHERE order_id = :orderId")
            .param("orderId", orderId)
            .query((rs, _) -> mapRow(rs))
            .optional();
    }

    public List<Invoice> findAll() {
        return jdbcClient.sql("SELECT * FROM invoices ORDER BY created_at DESC")
            .query((rs, _) -> mapRow(rs))
            .list();
    }

    public List<Invoice> findByPaymentStatus(String status) {
        return jdbcClient.sql("SELECT * FROM invoices WHERE payment_status = :status ORDER BY created_at DESC")
            .param("status", status)
            .query((rs, _) -> mapRow(rs))
            .list();
    }

    public void updatePaymentStatus(UUID id, String status) {
        if ("paid".equals(status)) {
            jdbcClient.sql("UPDATE invoices SET payment_status = :status, paid_at = NOW() WHERE id = :id")
                .param("id", id).param("status", status).update();
        } else {
            jdbcClient.sql("UPDATE invoices SET payment_status = :status WHERE id = :id")
                .param("id", id).param("status", status).update();
        }
    }

    public long count() {
        return jdbcClient.sql("SELECT COUNT(*) FROM invoices").query(Long.class).single();
    }

    private Invoice mapRow(ResultSet rs) throws SQLException {
        return Invoice.builder()
            .id(rs.getObject("id", UUID.class))
            .orderId(rs.getString("order_id"))
            .invoiceNumber(rs.getString("invoice_number"))
            .customerName(rs.getString("customer_name"))
            .customerEmail(rs.getString("customer_email"))
            .customerAddress(rs.getString("customer_address"))
            .items(rs.getString("items"))
            .subtotal(rs.getInt("subtotal"))
            .vatRate(rs.getInt("vat_rate"))
            .vatAmount(rs.getInt("vat_amount"))
            .total(rs.getInt("total"))
            .paymentMethod(rs.getString("payment_method"))
            .paymentStatus(rs.getString("payment_status"))
            .dueDate(rs.getDate("due_date") != null ? rs.getDate("due_date").toLocalDate() : null)
            .paidAt(rs.getTimestamp("paid_at") != null ? rs.getTimestamp("paid_at").toInstant() : null)
            .notes(rs.getString("notes"))
            .createdAt(rs.getTimestamp("created_at").toInstant())
            .build();
    }
}
