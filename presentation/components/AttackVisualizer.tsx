"use client";

import type { AttackEvaluation, AttackModule, Step } from "@/domain/entities";
import type { UiText } from "@/infrastructure/i18n";
import { getLocalizedEvaluationCopy } from "@/infrastructure/i18n";
import { useAppPreferences } from "./AppPreferencesProvider";
import { FlowDiagram } from "./FlowDiagram";

type AttackVisualizerProps = {
  evaluation: AttackEvaluation;
  module: AttackModule;
  step: Step;
  text: UiText;
};

const outcomeClasses: Record<AttackEvaluation["outcome"], string> = {
  normal: "border-signal-normal/40 bg-signal-normal/10 text-signal-normal",
  degraded: "border-signal-warning/40 bg-signal-warning/10 text-signal-warning",
  blocked: "border-signal-protected/40 bg-signal-protected/10 text-signal-protected",
  compromised: "border-signal-compromised/40 bg-signal-compromised/10 text-signal-compromised"
};

export function AttackVisualizer({ evaluation, module, step, text }: AttackVisualizerProps) {
  const { locale } = useAppPreferences();
  const evaluationCopy = getLocalizedEvaluationCopy(locale, evaluation);

  return (
    <section aria-labelledby="visualizer-title" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-primary" id="visualizer-title">
            {text.visualizerTitle}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-secondary">{module.summary}</p>
        </div>
        <div className={`rounded-lg border px-3 py-2 text-sm font-semibold ${outcomeClasses[evaluation.outcome]}`}>
          {evaluationCopy.label}
        </div>
      </div>
      <FlowDiagram
        actors={module.actors}
        edges={module.edges}
        evaluation={evaluation}
        roleLabels={text.roles}
        step={step}
      />
    </section>
  );
}
