# Backend Monitoring

Application performance monitoring for the NestJS server (`server/`): distributed traces, Prometheus metrics, slow-query logging, and recommended alert thresholds for the ops team.

## OpenTelemetry tracing

Tracing is initialized in `server/src/tracing.ts` and must load before any other application code (`import './tracing'` is the first line in `main.ts`).

| Resource attribute | Value |
| --- | --- |
| `service.name` | `shelterflex-backend` |
| `service.version` | `APP_VERSION` (fallback: `1.0.0`) |
| `deployment.environment` | `NODE_ENV` |

| Variable | Default | Description |
| --- | --- | --- |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `http://localhost:4318` | OTLP HTTP collector base URL (non-development) |
| `NODE_ENV` | — | `development` uses the console span exporter; other values export via OTLP HTTP |

Auto-instrumentation covers Express HTTP, PostgreSQL (Prisma/pg), and outgoing HTTP.

**Local verification:** run Jaeger or another OTLP HTTP receiver on port `4318`, or start the server with `NODE_ENV=development` and inspect console span output.

## Prometheus metrics

Endpoint: `GET /metrics`

Authentication: `Authorization: Bearer <METRICS_TOKEN>`. Requests without a valid token receive `401 Unauthorized`.

| Variable | Description |
| --- | --- |
| `METRICS_TOKEN` | Bearer token required to scrape metrics |

### Custom metrics

| Metric | Type | Labels | Description |
| --- | --- | --- | --- |
| `payment_initiated_total` | Counter | `provider`, `status` | Payment checkout initiations (`success` / `failed`) |
| `deal_activation_duration_ms` | Histogram | — | End-to-end deal activation latency (ms) |
| `kyc_submission_total` | Counter | `status` | KYC submissions by outcome |
| `late_payment_escalation_total` | Counter | `escalation_step` | Late-payment escalations by step |

Default process metrics (CPU, memory, event loop, etc.) are collected via `prom-client` `collectDefaultMetrics`.

Record helpers live in `server/src/metrics.ts` for use when domain flows are implemented.

## Database query monitoring

- Queries slower than **100 ms** log a warning with parameterised SQL (`event.query` from Prisma) and `durationMs`.
- Each HTTP request tracks **query count** per `x-request-id` (generated if missing) and logs it when the response finishes.

## Health check

`GET /health` returns:

```json
{
  "status": "ok",
  "uptime": 123.45,
  "version": "1.0.0",
  "dbLatencyMs": 2,
  "memoryUsageMb": 85
}
```

`dbLatencyMs` is measured with `SELECT 1`. `memoryUsageMb` is heap used rounded to megabytes.

## Recommended alert thresholds

Configure these in Grafana, Datadog, or your monitoring platform against scraped metrics and trace data:

| Condition | Threshold | Window | Suggested severity |
| --- | --- | --- | --- |
| Route P99 latency | > 2 s | 5 min | Warning |
| HTTP error rate | > 1% of requests | 5 min | Critical |
| Container memory | > 80% of limit | 5 min | Warning |
| Slow DB queries | sustained increase in slow-query log rate | 15 min | Warning |

Example PromQL (adjust job/route labels to your setup):

- P99 latency: `histogram_quantile(0.99, sum(rate(http_server_duration_bucket[5m])) by (le, http_route)) > 2`
- Error rate: `sum(rate(http_server_requests_total{http_status_code=~"5.."}[5m])) / sum(rate(http_server_requests_total[5m])) > 0.01`
- Memory: `process_resident_memory_bytes / container_memory_limit_bytes > 0.8`

## Environment summary

```env
APP_VERSION=1.0.0
METRICS_TOKEN=<secure-random-token>
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```
