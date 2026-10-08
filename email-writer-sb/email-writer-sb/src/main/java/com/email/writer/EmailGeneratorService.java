package com.email.writer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public EmailGeneratorService(
            @Value("${gemini.api.url}") String baseUrl,
            @Value("${gemini.api.key}") String geminiApiKey) {

        this.apiKey = geminiApiKey;

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();

        this.objectMapper = new ObjectMapper();
    }

    public String generateEmailReply(EmailRequest emailRequest) {

        // Build prompt
        String prompt = buildPrompt(emailRequest);

        // Create JSON safely
        Map<String, Object> requestBody = Map.of(
                "model", "gemini-3.8-flash",
                "input", prompt
        );

        try {

            // Send request to Gemini
            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1beta/interactions")
                            .build())
                    .header("x-goog-api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // Extract generated text
            return extractResponseContent(response);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Error while calling Gemini API: " + e.getMessage(), e
            );
        }
    }

    private String extractResponseContent(String response) {

        try {

            JsonNode root = objectMapper.readTree(response);

            for (JsonNode step : root.path("steps")) {

                if ("model_output".equals(step.path("type").asText())) {

                    JsonNode content = step.path("content");

                    if (content.isArray() && !content.isEmpty()) {
                        return content.get(0)
                                .path("text")
                                .asText();
                    }
                }
            }

            return "No response generated.";

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error processing Gemini response: " + e.getMessage(), e
            );
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
                Generate a professional email reply for the following email with subject.

                """);

        if (emailRequest.getTone() != null
                && !emailRequest.getTone().isEmpty()) {

            prompt.append("Use a ")
                    .append(emailRequest.getTone())
                    .append(" tone.\n\n");
        }

        prompt.append("Original Email:\n")
                .append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}