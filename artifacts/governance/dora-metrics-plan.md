# DORA Metrics Implementation Plan

## Deployment Frequency
- Instrument GitHub Actions to tag deployments with environment (`staging`, `production`).
- Use a scheduled workflow to query GitHub Releases/Deployments API weekly and store metrics in BigQuery or TimescaleDB.

## Lead Time for Changes
- Measure from pull request creation to deployment completion.
- Capture timestamps via GitHub webhooks into an analytics pipeline (e.g., Segment -> Snowflake).
- Visualize lead time distribution in Looker/Grafana.

## Change Failure Rate
- Integrate incident tracking (PagerDuty, Jira) with deployment events.
- Mark deployments as failed when post-deploy rollbacks, hotfixes, or SEV incidents occur within 24 hours.
- Automate correlation by tagging incidents with deployment IDs.

## Mean Time to Restore (MTTR)
- Track incident resolution timestamps from PagerDuty.
- Enforce incident runbooks to update status pages and close tickets with time-to-recovery metadata.

## Tooling & Automation
- Build a `metrics/collect.py` script (future work) to aggregate GitHub + incident data and push to analytics warehouse.
- Schedule nightly job via GitHub Actions cron or external orchestrator (Airflow) to refresh dashboards.
- Provide self-service dashboards with filters for service/component, environment, and severity.

## Governance
- Review DORA metrics in monthly engineering leadership meeting.
- Use metrics to drive continuous improvement experiments captured via follow-up ADRs.
