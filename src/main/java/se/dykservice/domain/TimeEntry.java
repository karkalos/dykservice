package se.dykservice.domain;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;

@Builder
public record TimeEntry(UUID id, String orderId, String description, int minutes, Instant createdAt) {}
