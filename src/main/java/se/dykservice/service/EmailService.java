package se.dykservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.Map;
import java.util.List;

@Service
@Slf4j
public class EmailService {

    private final RestClient restClient;
    private final String fromEmail;
    private final boolean enabled;

    public EmailService(
            @Value("${app.email.resend-api-key:}") String apiKey,
            @Value("${app.email.from:noreply@dykservice.se}") String fromEmail,
            @Value("${app.email.enabled:false}") boolean enabled) {
        this.fromEmail = fromEmail;
        this.enabled = enabled && !apiKey.isBlank();
        this.restClient = RestClient.builder()
            .baseUrl("https://api.resend.com")
            .defaultHeader("Authorization", "Bearer " + apiKey)
            .defaultHeader("Content-Type", "application/json")
            .build();
    }

    public void sendBookingConfirmation(String toEmail, String customerName, String orderId) {
        String subject = "Bokningsbekräftelse — " + orderId;
        String html = """
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a1a2e;">Tack för din bokning, %s!</h2>
                <p>Din bokning har registrerats.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <div style="font-size: 13px; color: #888;">Ditt ordernummer</div>
                    <div style="font-size: 28px; font-weight: 700; color: #1a1a2e;">%s</div>
                </div>
                <p>Du kan följa din service här:<br>
                <a href="https://dykservice-v5k7fnjf3a-nw.a.run.app/status/%s">Spåra din order</a></p>
                <p style="color: #888; font-size: 13px; margin-top: 40px;">DykService — Din Marina Dräktverkstad</p>
            </div>
            """.formatted(customerName, orderId, orderId);
        send(toEmail, subject, html);
    }

    public void sendStatusUpdate(String toEmail, String customerName, String orderId, String status, String message) {
        String statusSv = switch (status) {
            case "received" -> "Mottagen på verkstad";
            case "diagnosed" -> "Diagnostiserad";
            case "in_progress" -> "Under arbete";
            case "testing" -> "Trycktest";
            case "ready" -> "Klar för hämtning/retur";
            case "returned" -> "Returnerad";
            default -> status;
        };

        String subject = "Statusuppdatering — " + orderId;
        String messageHtml = message != null && !message.isBlank()
            ? "<p><strong>Meddelande:</strong> " + message + "</p>"
            : "";
        String html = """
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a1a2e;">Statusuppdatering</h2>
                <p>Hej %s, din order <strong>%s</strong> har uppdaterats.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <div style="font-size: 13px; color: #888;">Ny status</div>
                    <div style="font-size: 20px; font-weight: 700; color: #1a1a2e;">%s</div>
                </div>
                %s
                <p><a href="https://dykservice-v5k7fnjf3a-nw.a.run.app/status/%s">Se detaljer</a></p>
                <p style="color: #888; font-size: 13px; margin-top: 40px;">DykService — Din Marina Dräktverkstad</p>
            </div>
            """.formatted(customerName, orderId, statusSv, messageHtml, orderId);
        send(toEmail, subject, html);
    }

    public void sendDiagnosisApproval(String toEmail, String customerName, String orderId,
            String findings, int updatedPrice) {
        String subject = "Diagnos klar — godkänn arbete — " + orderId;
        String html = """
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a1a2e;">Diagnos av din dräkt</h2>
                <p>Hej %s, vi har undersökt din dräkt och hittat följande:</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <div style="font-size: 14px; white-space: pre-wrap;">%s</div>
                </div>
                <div style="background: #1a1a2e; color: #fff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <div style="font-size: 13px; opacity: 0.7;">Uppskattat pris</div>
                    <div style="font-size: 28px; font-weight: 700;">%d kr</div>
                </div>
                <p>Godkänn så påbörjar vi arbetet:</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="https://dykservice-v5k7fnjf3a-nw.a.run.app/status/%s?approve=true"
                       style="background: #28a745; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
                        Godkänn arbete
                    </a>
                </p>
                <p style="color: #888; font-size: 13px;">Vill du diskutera först? Ring oss eller svara på detta mail.</p>
                <p style="color: #888; font-size: 13px; margin-top: 40px;">DykService — Din Marina Dräktverkstad</p>
            </div>
            """.formatted(customerName, findings, updatedPrice, orderId);
        send(toEmail, subject, html);
    }

    private void send(String to, String subject, String html) {
        if (!enabled) {
            log.info("Email disabled — would send to {}: {}", to, subject);
            return;
        }
        try {
            restClient.post()
                .uri("/emails")
                .body(Map.of(
                    "from", fromEmail,
                    "to", List.of(to),
                    "subject", subject,
                    "html", html
                ))
                .retrieve()
                .toBodilessEntity();
            log.info("Email sent to {}: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
