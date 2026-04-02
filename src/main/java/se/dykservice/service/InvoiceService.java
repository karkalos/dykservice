package se.dykservice.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.dykservice.domain.Invoice;
import se.dykservice.repository.CustomerRepository;
import se.dykservice.repository.InvoiceRepository;
import se.dykservice.repository.ServiceOrderRepository;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ServiceOrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final EmailService emailService;

    @Transactional
    public Invoice generateInvoice(String orderId) {
        var order = orderRepository.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        var customer = customerRepository.findById(order.customerId())
            .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        // Use diagnosis price if available, otherwise estimated price
        int subtotal = order.diagnosisPrice() != null ? order.diagnosisPrice() : order.estimatedPrice();
        int vatRate = 25;
        int vatAmount = (int) Math.round(subtotal * vatRate / 125.0); // Price is incl moms, extract VAT
        int total = subtotal;

        String invoiceNumber = "F-%d-%04d".formatted(
            LocalDate.now().getYear(), invoiceRepository.count() + 1);

        String address = String.join(", ",
            customer.street() != null ? customer.street() : "",
            customer.postalCode() != null ? customer.postalCode() : "",
            customer.city() != null ? customer.city() : "").replaceAll("^, |, $", "");

        var invoice = Invoice.builder()
            .id(UUID.randomUUID())
            .orderId(orderId)
            .invoiceNumber(invoiceNumber)
            .customerName(customer.name())
            .customerEmail(customer.email())
            .customerAddress(address)
            .items(order.diagnosisItems() != null ? order.diagnosisItems() : order.items())
            .subtotal(subtotal)
            .vatRate(vatRate)
            .vatAmount(vatAmount)
            .total(total)
            .paymentMethod(order.paymentMethod())
            .paymentStatus("unpaid")
            .dueDate(LocalDate.now().plusDays(15))
            .notes("")
            .build();

        invoiceRepository.insert(invoice);

        // Update order payment status
        orderRepository.updatePaymentStatus(orderId, "invoiced");

        // Send invoice email
        emailService.sendInvoice(customer.email(), customer.name(), invoice);

        return invoice;
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public List<Invoice> getUnpaidInvoices() {
        return invoiceRepository.findByPaymentStatus("unpaid");
    }

    @Transactional
    public void markAsPaid(UUID invoiceId) {
        invoiceRepository.updatePaymentStatus(invoiceId, "paid");
    }
}
