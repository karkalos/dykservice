package se.dykservice.domain;

import java.time.Instant;
import lombok.Builder;

@Builder
public record Workshop(
    String id,
    String name,
    String address,
    String city,
    String phone,
    String email,
    String website,
    int prioritySurchargePct,
    int emergencySurchargePct,
    int warrantyYears,
    boolean acceptsWetSuits,
    boolean acceptsVikingHd,
    boolean hasMailIn,
    Instant createdAt) {}
