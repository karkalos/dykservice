package se.dykservice.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import se.dykservice.domain.Invoice;
import se.dykservice.service.InvoiceService;

@RestController
@RequestMapping("/v1/admin/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/generate/{orderId}")
    @ResponseStatus(HttpStatus.CREATED)
    Invoice generateInvoice(@PathVariable String orderId) {
        return invoiceService.generateInvoice(orderId);
    }

    @GetMapping
    List<Invoice> listInvoices() {
        return invoiceService.getAllInvoices();
    }

    @GetMapping("/unpaid")
    List<Invoice> listUnpaid() {
        return invoiceService.getUnpaidInvoices();
    }

    @PostMapping("/{id}/paid")
    Map<String, String> markAsPaid(@PathVariable UUID id) {
        invoiceService.markAsPaid(id);
        return Map.of("status", "paid");
    }
}
