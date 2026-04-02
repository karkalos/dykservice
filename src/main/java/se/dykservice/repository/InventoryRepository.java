package se.dykservice.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import se.dykservice.domain.InventoryItem;

@Repository
@RequiredArgsConstructor
public class InventoryRepository {

    private final JdbcClient jdbcClient;

    public List<InventoryItem> findAll() {
        return jdbcClient.sql("SELECT * FROM inventory ORDER BY category, name")
            .query((rs, _) -> mapRow(rs))
            .list();
    }

    public Optional<InventoryItem> findById(UUID id) {
        return jdbcClient.sql("SELECT * FROM inventory WHERE id = :id")
            .param("id", id)
            .query((rs, _) -> mapRow(rs))
            .optional();
    }

    public List<InventoryItem> findLowStock() {
        return jdbcClient.sql("SELECT * FROM inventory WHERE quantity <= min_quantity ORDER BY category, name")
            .query((rs, _) -> mapRow(rs))
            .list();
    }

    public void insert(InventoryItem item) {
        jdbcClient.sql("""
            INSERT INTO inventory (id, name, category, sku, quantity, min_quantity, supplier, unit_cost, notes)
            VALUES (:id, :name, :category, :sku, :quantity, :minQuantity, :supplier, :unitCost, :notes)
            """)
            .param("id", item.id())
            .param("name", item.name())
            .param("category", item.category())
            .param("sku", item.sku())
            .param("quantity", item.quantity())
            .param("minQuantity", item.minQuantity())
            .param("supplier", item.supplier())
            .param("unitCost", item.unitCost())
            .param("notes", item.notes())
            .update();
    }

    public void updateQuantity(UUID id, int quantity) {
        jdbcClient.sql("UPDATE inventory SET quantity = :quantity, updated_at = NOW() WHERE id = :id")
            .param("id", id)
            .param("quantity", quantity)
            .update();
    }

    public void adjustQuantity(UUID id, int delta) {
        jdbcClient.sql("UPDATE inventory SET quantity = quantity + :delta, updated_at = NOW() WHERE id = :id")
            .param("id", id)
            .param("delta", delta)
            .update();
    }

    public void update(InventoryItem item) {
        jdbcClient.sql("""
            UPDATE inventory SET name = :name, category = :category, sku = :sku,
                quantity = :quantity, min_quantity = :minQuantity, supplier = :supplier,
                unit_cost = :unitCost, notes = :notes, updated_at = NOW()
            WHERE id = :id
            """)
            .param("id", item.id())
            .param("name", item.name())
            .param("category", item.category())
            .param("sku", item.sku())
            .param("quantity", item.quantity())
            .param("minQuantity", item.minQuantity())
            .param("supplier", item.supplier())
            .param("unitCost", item.unitCost())
            .param("notes", item.notes())
            .update();
    }

    public void deleteById(UUID id) {
        jdbcClient.sql("DELETE FROM inventory WHERE id = :id")
            .param("id", id)
            .update();
    }

    private InventoryItem mapRow(ResultSet rs) throws SQLException {
        return InventoryItem.builder()
            .id(rs.getObject("id", UUID.class))
            .name(rs.getString("name"))
            .category(rs.getString("category"))
            .sku(rs.getString("sku"))
            .quantity(rs.getInt("quantity"))
            .minQuantity(rs.getInt("min_quantity"))
            .supplier(rs.getString("supplier"))
            .unitCost(rs.getObject("unit_cost") != null ? rs.getInt("unit_cost") : null)
            .notes(rs.getString("notes"))
            .updatedAt(rs.getTimestamp("updated_at").toInstant())
            .createdAt(rs.getTimestamp("created_at").toInstant())
            .build();
    }
}
