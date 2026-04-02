package se.dykservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateBookingRequest(
    @NotBlank String workshopId,
    String bookingType,
    String suitType,
    String suitBrand,
    String items,
    String urgency,
    int estimatedPrice,
    String notes,
    String paymentMethod,
    @NotBlank String customerName,
    @NotBlank @Email String customerEmail,
    @NotBlank String customerPhone,
    String street,
    String postalCode,
    String city,
    boolean isBusiness,
    String company,
    String orgNr) {}
