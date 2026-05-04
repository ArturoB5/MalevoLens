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
    `${text.reportModule}: ${module.name}`,
    `${text.reportSummary}: ${module.summary}`,
    "",
    `${text.step}: ${step.title}`,
    step.description,
    "",
    `${text.reportOutcome}: ${evaluationCopy.label}`,
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
      : [`- ${text.reportNoMitigations}`]),
    "",
    text.reportEthicalNote
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
