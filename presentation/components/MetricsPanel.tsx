"use client";

import type { SimulationMetrics } from "@/domain/entities";
import type { UiText } from "@/infrastructure/i18n";

type MetricsPanelProps = {
  metrics: SimulationMetrics;
  text: UiText;
};

const metricAccent = {
  latency: "bg-signal-warning",
  availability: "bg-signal-protected",
  trust: "bg-signal-normal"
};

export function MetricsPanel({ metrics, text }: MetricsPanelProps) {
  const items = [
    { id: "latency", label: text.latency, value: metrics.latency, invert: true },
    { id: "availability", label: text.availability, value: metrics.availability, invert: false },
    { id: "trust", label: text.trust, value: metrics.trust, invert: false }
  ] as const;

  return (
    <section aria-labelledby="metrics-title" className="panel p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary" id="metrics-title">
        {text.metricsTitle}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div className="rounded-lg border border-default bg-soft p-3" key={item.id}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-primary">{item.label}</span>
              <span className="text-sm font-bold text-primary">{item.value}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-soft-strong">
              <div
                className={`h-full rounded-full ${metricAccent[item.id]}`}
                style={{ width: `${item.invert ? 100 - item.value : item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
