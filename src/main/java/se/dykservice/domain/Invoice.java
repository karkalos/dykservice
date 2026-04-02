package se.dykservice.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Builder;

@Builder
public record Invoice(
    UUID id,
    String orderId,
    String invoiceNumber,
    String customerName,
    String customerEmail,
    String customerAddress,
    String items,
    int subtotal,
    int vatRate,
    int vatAmount,
    int total,
    String paymentMethod,
    String paymentStatus,
    LocalDate dueDate,
    Instant paidAt,
    String notes,
    Instant createdAt) {}
