package se.dykservice.domain;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;

@Builder
public record OrderEvent(
    UUID id,
    String orderId,
    String status,
    String message,
    String createdBy,
    Instant createdAt) {}
