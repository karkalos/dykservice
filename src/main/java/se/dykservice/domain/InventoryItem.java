package se.dykservice.domain;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;

@Builder
public record InventoryItem(
    UUID id,
    String name,
    String category,
    String sku,
    int quantity,
    int minQuantity,
    String supplier,
    Integer unitCost,
    String notes,
    Instant updatedAt,
    Instant createdAt) {}
