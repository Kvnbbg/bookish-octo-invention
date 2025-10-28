# Secrets Management Plan

## Platform
- Adopt HashiCorp Vault as the central secrets manager.
- Use the Kubernetes Auth method for workloads; GitHub Actions retrieves short-lived credentials through OIDC auth.
- Store database credentials, API tokens, encryption keys, and signing certificates in Vault KV v2.

## Integration Steps
1. **Bootstrap Vault**
   - Deploy highly available Vault cluster (Raft storage, integrated auto-unseal via HSM or cloud KMS).
   - Enable audit logging to send events to the observability stack.
2. **Define policies**
   - Create fine-grained policies: `app-backend`, `ci-cd`, `platform-ops`.
   - Map GitHub OIDC claims to roles using audience `github-actions`.
3. **Application wiring**
   - Replace plaintext credentials in `application.properties` with Spring Cloud Vault integration.
   - Use Vault Agent Injector sidecar in containerized deployments to render templates at `/vault/secrets/`.
4. **Rotation & lifecycle**
   - Enable dynamic secrets for Oracle via Vault database secrets engine.
   - Schedule automatic rotation (e.g., every 24 hours) and notify teams via Slack/Webhooks on rotation events.
5. **Developer experience**
   - Provide CLI workflows using `vault login -method=ldap` for temporary access.
   - Document fallback procedures and break-glass policies in runbooks.

## Governance
- Enforce mandatory secrets scanning in CI using TruffleHog/Gitleaks to prevent commits of secrets.
- Conduct quarterly access reviews and maintain evidence for compliance audits.
