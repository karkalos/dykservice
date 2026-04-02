package se.dykservice.domain;

import lombok.Builder;

@Builder
public record ServiceItem(
    String id,
    String workshopId,
    String category,
    String name,
    String nameSv,
    int basePrice,
    String notes,
    boolean inStock) {}
