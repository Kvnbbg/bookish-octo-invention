# Observability Modernization Plan

## Objectives
- Provide production-grade insight into the Spring Boot application runtime.
- Establish consistent logging, metrics, and distributed tracing across services and infrastructure.
- Enable rapid detection and remediation of anomalies through automated alerting and dashboards.

## Structured Logging
- Adopt Logback JSON appenders via `logstash-logback-encoder` to produce ECS-compatible JSON logs.
- Use correlation identifiers propagated from HTTP headers (`X-Request-ID`) and generated at the gateway when absent.
- Enforce sanitized logging (no secrets, PII redaction) through centralized logging policies and static analysis checks.
- Ship logs to OpenSearch/Elasticsearch through Fluent Bit sidecars in Kubernetes or Filebeat in VM deployments.

## Metrics
- Integrate Micrometer with Prometheus registry; expose `/actuator/prometheus` endpoint.
- Instrument key application metrics:
  - Text analysis throughput (items/minute, success/error counts).
  - Queue depth and processing latency for parallel scanning operations.
  - Security events (authentication successes/failures) using Spring Security metrics.
- Publish JVM, HTTP server, and datasource pool metrics; configure scrape configs in Prometheus and dashboards in Grafana.

## Tracing
- Adopt OpenTelemetry Java agent with OTLP exporter.
- Trace HTTP requests through controller/service layers and outbound JDBC calls.
- Annotate spans with business metadata (scan mode, detected emoji counts) for rapid issue triage.
- Send traces to Jaeger/Tempo and integrate with Grafana dashboards.

## Alerting & SLOs
- Define service-level objectives:
  - 99.5% availability for the `/scan` API.
  - P95 latency under 500ms for sequential scans and 250ms for parallel scans.
  - Zero critical vulnerability deployments.
- Configure alert rules in Prometheus Alertmanager for SLO violations and anomaly detection thresholds derived from Bayesian forecasting models.

## Operational Dashboards
- Build Grafana dashboards combining logs, metrics, and traces with template variables for environment and tenant.
- Include release markers from CI/CD to correlate deploys with performance shifts.

## Data Retention & Compliance
- Retain logs for 30 days (hot) and 180 days (cold) with encryption at rest.
- Enforce RBAC for observability platforms, linking access to CODEOWNERS groups.

## Implementation Phases
1. **Foundational** – add dependencies, enable metrics endpoint, configure centralized logging sinks.
2. **Tracing rollout** – deploy OpenTelemetry agent, verify trace propagation through staging.
3. **Advanced analytics** – integrate anomaly detection jobs and SLO alerting; iterate on dashboards.
4. **Continuous improvement** – review observability posture quarterly via ADR updates.
