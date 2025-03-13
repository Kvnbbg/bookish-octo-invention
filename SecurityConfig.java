// SecurityConfig.java (JWT Implementation)
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

public class SecurityConfig {
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    public static String createJWT(String username) {
        return Jwts.builder()
                .setSubject(username)
                .signWith(SECRET_KEY)
                .compact();
    }
    
    public static boolean validateJWT(String jwt) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(jwt);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
