# Clickstack Data Reference - Actual Available Data

## Summary

The Clickstack MCP is connected to a ClickHouse database containing **observability and infrastructure data**, NOT business data like sales or customers.

---

## Available Tables in `default` Database

### Primary Data Tables (with actual data)

| Table | Type | Purpose | Fields | Row Count | TTL |
|-------|------|---------|--------|-----------|-----|
| **network_logs** | ✅ Active | Network traffic analysis | `timestamp` (DateTime), `source_ip` (String), `bytes` (UInt64) | **5,000,000** | 3 days |
| **otel_metrics_gauge** | ✅ Active | Point-in-time metric values | ServiceName, MetricName, Value, TimeUnix, Attributes | 10,608 | 3 days |
| **otel_metrics_sum** | ✅ Active | Cumulative metrics | ServiceName, MetricName, Sum, Count, Value, TimeUnix | 5,597 | 3 days |
| **otel_metrics_histogram** | ✅ Active | Distribution data | BucketCounts, ExplicitBounds, Sum, Count, Min, Max | 619 | 3 days |

### Indexed Tables (structure available, likely empty due to TTL)

| Table | Type | Purpose |
|-------|------|---------|
| **otel_logs** | Logs | Service log messages with severity (ERROR, WARN, INFO, etc.) |
| **otel_traces** | Traces | Request traces with span names, duration, status codes, latency |
| **otel_metrics_summary** | Metrics | Summary metrics with quantiles (currently empty) |
| **otel_metrics_exponential_histogram** | Metrics | Exponential histogram data (currently empty) |
| **hyperdx_sessions** | Observability | HyperDX session tracking (TTL expired likely) |

---

## Data Schema Details

### `network_logs` (5M rows - REAL DATA)
```
- timestamp: DateTime (ordered)
- source_ip: String (IP addresses)
- bytes: UInt64 (data transferred)
```
**Use for:** Network traffic trends, top talkers (IPs), bandwidth analysis

### `otel_metrics_gauge` (10.6K rows - REAL DATA)
```
- ServiceName: String (service identifier)
- MetricName: String (metric type)
- MetricDescription: String
- MetricUnit: String
- Value: Float64 (metric value)
- TimeUnix: DateTime64 (timestamp)
- Attributes: Map (key-value pairs)
- ResourceAttributes: Map
```
**Use for:** Current/gauge metrics (CPU %, memory, connections, temperature, etc.)

### `otel_metrics_sum` (5.6K rows - REAL DATA)
```
- ServiceName: String
- MetricName: String
- Sum: Float64 (total)
- Count: UInt64 (event count)
- Value: Float64
- TimeUnix: DateTime64
- IsMonotonic: Bool
```
**Use for:** Cumulative metrics (total requests, bytes processed, errors, events)

### `otel_metrics_histogram` (619 rows - REAL DATA)
```
- ServiceName: String
- MetricName: String
- BucketCounts: Array(UInt64) (distribution buckets)
- ExplicitBounds: Array(Float64) (bucket boundaries)
- Count: UInt64 (total count)
- Sum: Float64 (total value)
- Min, Max: Float64
```
**Use for:** Latency/duration distributions, response time histogram, percentiles

### `otel_traces` (TTL=3 days, structure only)
```
- Timestamp: DateTime64
- TraceId, SpanId: String
- SpanName: String (operation name)
- ServiceName: String
- Duration: UInt64 (microseconds)
- StatusCode: String (OK, ERROR, UNSET)
- SpanAttributes: Map
```
**Use for:** Performance analysis, latency, error tracking, service dependencies

### `otel_logs` (TTL=3 days, structure only)
```
- Timestamp: DateTime64
- ServiceName: String
- SeverityText: String (ERROR, WARN, INFO, DEBUG)
- SeverityNumber: UInt8
- Body: String (log message)
- ResourceAttributes, LogAttributes: Map
```
**Use for:** Error analysis, log patterns, severity distribution

---

## Query Examples

### Network Traffic Trends (Hourly)
```sql
SELECT toStartOfInterval(timestamp, INTERVAL 1 HOUR) as hour,
       COUNT(*) as request_count,
       SUM(bytes) as total_bytes,
       AVG(bytes) as avg_bytes
FROM network_logs
WHERE timestamp >= subtractDays(now(), 7)
GROUP BY hour
ORDER BY hour DESC
LIMIT 168;
```

### Top Talker IPs
```sql
SELECT source_ip,
       COUNT(*) as request_count,
       SUM(bytes) as total_bytes,
       AVG(bytes) as avg_bytes
FROM network_logs
WHERE timestamp >= subtractDays(now(), 1)
GROUP BY source_ip
ORDER BY total_bytes DESC
LIMIT 20;
```

### Service Metrics - Current Status
```sql
SELECT DISTINCT ServiceName, MetricName, Value, MetricUnit
FROM otel_metrics_gauge
WHERE TimeUnix >= subtractHours(now(), 1)
ORDER BY ServiceName, MetricName;
```

### Metric Aggregations Over Time
```sql
SELECT toStartOfInterval(TimeUnix, INTERVAL 1 HOUR) as hour,
       ServiceName,
       MetricName,
       AVG(Value) as avg_value,
       MAX(Value) as max_value,
       MIN(Value) as min_value
FROM otel_metrics_gauge
WHERE TimeUnix >= subtractDays(now(), 3)
GROUP BY hour, ServiceName, MetricName
ORDER BY hour DESC;
```

### Latency Percentiles (from histogram)
```sql
SELECT ServiceName,
       MetricName,
       Sum as total_sum,
       Count as observation_count,
       Min,
       Max
FROM otel_metrics_histogram
WHERE MetricName LIKE '%duration%' OR MetricName LIKE '%latency%'
ORDER BY TimeUnix DESC;
```

---

## Important Constraints

⚠️ **TTL Expiration**: Logs, traces, and sessions expire after 3 days
- Use `network_logs` and `otel_metrics_*` tables for longer-term analysis
- For recent logs/traces, use queries with `WHERE timestamp >= subtractDays(now(), 2)`

⚠️ **Data Types**: 
- Timestamps use `DateTime64(9)` (nanosecond precision) - format with `toDateTime()`
- Durations are in microseconds - divide by 1000 for milliseconds
- Use `subtractDays()`, `subtractHours()` for date math

⚠️ **Empty Tables**:
- `otel_traces` may be empty due to TTL
- `otel_metrics_summary` and `otel_metrics_exponential_histogram` have no data
- Always have a fallback to `network_logs` or `otel_metrics_gauge`

---

## Recommended Query Patterns

### For UI Visualizations

**Trend Chart (time-series)**
```sql
SELECT toStartOfInterval(timestamp, INTERVAL 1 HOUR) as time,
       SUM(bytes) as value
FROM network_logs
GROUP BY time
ORDER BY time
```

**Bar Chart (top N by category)**
```sql
SELECT source_ip, SUM(bytes) as total
FROM network_logs
GROUP BY source_ip
ORDER BY total DESC
LIMIT 10
```

**Pie Chart (distribution by category)**
```sql
SELECT ServiceName, COUNT(*) as count
FROM otel_metrics_gauge
GROUP BY ServiceName
```

**Gauge/KPI (single value)**
```sql
SELECT AVG(Value) as current_value
FROM otel_metrics_gauge
WHERE MetricName = 'cpu_usage'
  AND TimeUnix >= subtractHours(now(), 1)
```

---

## Next Steps for MainAgent.md

✅ **Updated** - MainAgent.md now contains:
- Actual table names and structure
- Real SQL query examples
- Observability-focused intent patterns
- Correct data type handling (DateTime64, UInt64, Float64)
- TTL awareness and fallback strategies
- Realistic assumption table mapping user requests to available tables
