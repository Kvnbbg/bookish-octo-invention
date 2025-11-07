# Security Ground State Plan

## Prioritized Actions
1. **Supply chain hardening**
   - Enable Dependabot updates for Maven, npm, Docker.
   - Require SBOM generation (`mvn cyclonedx:makeAggregateBom`) during CI and publish as artifact.
   - Sign release artifacts and container images with Sigstore Cosign.

2. **Static & dynamic analysis**
   - Integrate CodeQL (Java) and Semgrep (Spring Boot security rules) into CI.
   - Schedule nightly OWASP ZAP scans against staging environment.

3. **Identity & access management**
   - Migrate from in-memory Spring Security users to external IdP (e.g., Keycloak/Okta) with MFA enforcement.
   - Implement role-based access control for admin features.

4. **Data protection**
   - Encrypt sensitive columns (stored tokens, monetary values) using JPA attribute converters with AES-GCM.
   - Enforce TLS 1.2+ everywhere (Nginx reverse proxy, Oracle connections with TCPS).

5. **Observability-driven security**
   - Forward security logs to SIEM with correlation to application traces.
   - Use Bayesian anomaly detection on authentication metrics to flag credential stuffing.

6. **Incident response**
   - Develop runbooks covering detection, containment, eradication, recovery.
   - Conduct quarterly tabletop exercises to test response readiness.

## Risk Heatmap
| Area | Current Risk | Target State |
|------|--------------|--------------|
| Secret leakage | High | Low (Vault, scanning) |
| Dependency vulnerabilities | High | Low (CI/CD gates) |
| Authentication bypass | Medium | Low (external IdP, MFA) |
| Observability gaps | Medium | Low (centralized logging/tracing) |
| Configuration drift | Medium | Low (IaC scanning, policy as code) |

## Success Metrics
- Zero critical vulnerabilities open for more than 72 hours.
- 100% of secrets sourced from Vault by end of Q2.
- Mean time to detect (MTTD) < 10 minutes via SIEM alerts.
