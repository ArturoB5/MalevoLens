"use client";

import type { AttackEvaluation, Step } from "@/domain/entities";
import type { UiText } from "@/infrastructure/i18n";
import { getLocalizedEvaluationCopy } from "@/infrastructure/i18n";
import { useAppPreferences } from "./AppPreferencesProvider";

type ExplanationPanelProps = {
  evaluation: AttackEvaluation;
  step: Step;
  stepIndex: number;
  text: UiText;
  totalSteps: number;
};

export function ExplanationPanel({ evaluation, step, stepIndex, text, totalSteps }: ExplanationPanelProps) {
  const { locale } = useAppPreferences();
  const evaluationCopy = getLocalizedEvaluationCopy(locale, evaluation);

  return (
    <section
      aria-labelledby="explanation-title"
      className="panel p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {text.step} {stepIndex + 1} {text.of} {totalSteps}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-primary" id="explanation-title">
        {step.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-secondary">{step.description}</p>
      <div className="mt-5 rounded-lg border border-default bg-soft p-4">
        <p className="text-sm font-semibold text-primary">{evaluationCopy.label}</p>
        <p className="mt-2 text-sm leading-6 text-secondary">{evaluationCopy.description}</p>
      </div>
    </section>
  );
}
