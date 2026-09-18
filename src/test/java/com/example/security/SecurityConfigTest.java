package com.example.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

class SecurityConfigTest {

    @Test
    void passwordEncoderUsesBCryptAndUsersHaveExpectedRoles() {
        SecurityConfig config = new SecurityConfig();
        var encoder = config.passwordEncoder();

        assertTrue(encoder.matches("password", encoder.encode("password")));
        assertTrue(encoder.matches("admin", encoder.encode("admin")));

        UserDetailsService service = config.userDetailsService();
        UserDetails user = service.loadUserByUsername("user");
        UserDetails admin = service.loadUserByUsername("admin");

        assertEquals("ROLE_USER", user.getAuthorities().iterator().next().getAuthority());
        assertEquals("ROLE_ADMIN", admin.getAuthorities().iterator().next().getAuthority());
    }

    @Test
    void securityFixtureDocumentsTheProtectedBoundary() throws Exception {
        try (InputStream input = getClass().getResourceAsStream("/security-contract.json")) {
            Map<String, Object> fixture =
                    new ObjectMapper().readValue(input, new TypeReference<>() {});
            assertEquals(
                    List.of("/", "/about", "/css/**", "/js/**", "/images/**"),
                    fixture.get("publicPaths"));
            assertEquals("/login", fixture.get("loginPath"));
            assertEquals("/logout", fixture.get("logoutPath"));
            assertEquals(true, fixture.get("authenticatedByDefault"));
            assertEquals("BCrypt", fixture.get("passwordEncoder"));
        }
    }
}
