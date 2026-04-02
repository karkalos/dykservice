package se.dykservice.dto;

public record DiagnosisRequest(String findings, String recommendedItems, int updatedPrice) {}
