package se.dykservice.domain;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;

@Builder
public record ServiceOrder(
    String id,
    String workshopId,
    UUID customerId,
    String bookingType,
    String status,
    String suitType,
    String suitBrand,
    String items,
    String urgency,
    int estimatedPrice,
    Integer finalPrice,
    String notes,
    String paymentMethod,
    String paymentStatus,
    String diagnosisFindings,
    String diagnosisItems,
    Integer diagnosisPrice,
    boolean diagnosisApproved,
    int priority,
    Integer estimatedMinutes,
    Instant createdAt,
    Instant updatedAt) {}
