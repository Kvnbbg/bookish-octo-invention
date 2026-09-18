# Bookish — Power / Energy / Time Contract

## Runtime contract
Spring Boot is the authoritative application layer. Maven is the authoritative build/test entry point.

## Data contract
- Scanner inputs are untrusted text.
- Monetary extraction must reject non-finite or malformed values.
- Authentication data must never be represented by default credentials in production documentation.
- H2 is for development/testing; production database configuration is externalized.

## Verification
- `mvn -B test`
- `mvn -B package -DskipTests`
- Keep Docker and application health checks aligned with the deployed artifact.

## Next gain
Remove stale deployment claims and replace demo credentials with environment-driven configuration before adding features.
