package se.dykservice.domain;

import java.util.UUID;
import lombok.Builder;

@Builder
public record Customer(
    UUID id,
    String name,
    String email,
    String phone,
    String street,
    String postalCode,
    String city,
    boolean isBusiness,
    String company,
    String orgNr,
    String notes) {}
