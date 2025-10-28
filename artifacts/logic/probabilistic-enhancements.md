# Probabilistic & Mathematical Enhancements

## 1. Personalized Quiz Optimization (Multi-Armed Bandit)
- **Context**: The frontend gamified quiz and `ScanController` currently present deterministic question flows.
- **Approach**: Implement a Thompson Sampling multi-armed bandit service to select quiz challenges and hints based on engagement metrics.
- **Outcome**: Minimize cumulative regret, increasing user retention and learning efficacy.

## 2. Text Analysis Accelerator (Bloom Filter + HyperLogLog)
- **Context**: Emoji and money symbol detection performed in `ScanResultGatherer` operates on raw streams.
- **Approach**: Introduce a Bloom Filter for quick membership tests of known emoji/token patterns and HyperLogLog for estimating unique symbol counts across large datasets.
- **Outcome**: Reduce memory footprint and improve throughput for `/scan/analyze-parallel` workloads.

## 3. Security Anomaly Detection (Bayesian Forecasting)
- **Context**: Spring Security logs capture authentication events via `SecurityConfig` in-memory users.
- **Approach**: Stream login metrics to a Bayesian structural time series model that flags deviations (credential stuffing, brute force) in near real-time.
- **Outcome**: Early detection of attacks with probabilistic confidence scores feeding SIEM alerts.

## Implementation Notes
- Create dedicated module `probabilistic-core` with reusable math utilities and integration tests.
- Instrument events via Micrometer to feed both analytics services and observability dashboards.
- Store models and priors in version-controlled registry (e.g., MLflow) for reproducibility.
