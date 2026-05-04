"use client";

import type { AttackEvaluation, AttackModule, Mitigation, SimulationMetrics, Step } from "@/domain/entities";
import type { UiText } from "@/infrastructure/i18n";
import { getLocalizedEvaluationCopy, type Locale } from "@/infrastructure/i18n";

type ReportExportButtonProps = {
  evaluation: AttackEvaluation;
  locale: Locale;
  metrics: SimulationMetrics;
  mitigations: Mitigation[];
  module: AttackModule;
  step: Step;
  text: UiText;
};

function buildReport({
  evaluation,
  locale,
  metrics,
  mitigations,
  module,
  step,
  text
}: ReportExportButtonProps) {
  const evaluationCopy = getLocalizedEvaluationCopy(locale, evaluation);
  const activeMitigations = mitigations.filter((mitigation) => mitigation.enabled);

  return [
    "MalevoLens",
    "==========",
    "",
    `${locale === "es" ? "Modulo" : "Module"}: ${module.name}`,
    `${locale === "es" ? "Resumen" : "Summary"}: ${module.summary}`,
    "",
    `${text.step}: ${step.title}`,
    step.description,
    "",
    `${locale === "es" ? "Resultado" : "Outcome"}: ${evaluationCopy.label}`,
    evaluationCopy.description,
    "",
    text.metricsTitle,
    `- ${text.latency}: ${metrics.latency}%`,
    `- ${text.availability}: ${metrics.availability}%`,
    `- ${text.trust}: ${metrics.trust}%`,
    "",
    text.mitigationsTitle,
    ...(activeMitigations.length > 0
      ? activeMitigations.map((mitigation) => `- ${mitigation.title}: ${mitigation.description}`)
      : [`- ${locale === "es" ? "No hay mitigaciones activas." : "No mitigations enabled."}`]),
    "",
    locale === "es"
      ? "Nota ética: reporte educativo defensivo. No contiene payloads ni instrucciones ofensivas."
      : "Ethical note: defensive educational report. It contains no payloads or offensive instructions."
  ].join("\n");
}

export function ReportExportButton(props: ReportExportButtonProps) {
  const handleExport = () => {
    const report = buildReport(props);
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `malevolens-${props.module.id}-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="control-button" onClick={handleExport} type="button">
      {props.text.exportReport}
    </button>
  );
}
