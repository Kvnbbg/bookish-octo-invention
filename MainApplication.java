// MainApplication.java (Integration)
import java.io.IOException;

public class MainApplication {
    private static MalwareDetectionService detectionService;
    private static final String MODEL_PATH = "models/scam_detection.pb";

    public static void main(String[] args) {
        try {
            detectionService = new MalwareDetectionService(MODEL_PATH);
            
            // Example email analysis
            String emailContent = "Hi Kevin, check this amazing offer!";
            float riskScore = detectionService.analyzeContent(emailContent);
            System.out.println("Scam probability: " + riskScore);
            
            // JWT Example
            String jwt = SecurityConfig.createJWT("user123");
            System.out.println("JWT Valid: " + SecurityConfig.validateJWT(jwt));
            
        } catch (IOException e) {
            System.err.println("Error loading detection model: " + e.getMessage());
        }
    }
}
