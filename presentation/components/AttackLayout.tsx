"use client";

import type { AttackModule } from "@/domain/entities";
import { useAttackState } from "@/application/useAttackState";
import { AttackVisualizer } from "./AttackVisualizer";
import { ControlsPanel } from "./ControlsPanel";
import { ExplanationPanel } from "./ExplanationPanel";
import { MitigationPanel } from "./MitigationPanel";
import { StepController } from "./StepController";
import { useAppPreferences } from "./AppPreferencesProvider";
import { MetricsPanel } from "./MetricsPanel";
import { ReportExportButton } from "./ReportExportButton";

type AttackLayoutProps = {
  module: AttackModule;
};

export function AttackLayout({ module }: AttackLayoutProps) {
  const attackState = useAttackState(module);
  const { locale, text } = useAppPreferences();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-default pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-signal-normal">{text.moduleEyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold text-primary">{module.name}</h1>
        </div>
        <ControlsPanel
          canGoNext={attackState.canGoNext}
          canGoPrevious={attackState.canGoPrevious}
          onNext={attackState.goNext}
          onPrevious={attackState.goPrevious}
          onReset={attackState.resetSimulation}
          text={text}
        />
        <ReportExportButton
          evaluation={attackState.evaluation}
          locale={locale}
          metrics={attackState.metrics}
          mitigations={attackState.mitigations}
          module={module}
          step={attackState.currentStep}
          text={text}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
        <div className="space-y-5">
          <AttackVisualizer
            evaluation={attackState.evaluation}
            module={module}
            step={attackState.currentStep}
            text={text}
          />
          <StepController
            currentStepIndex={attackState.stepIndex}
            onSelectStep={attackState.goToStep}
            steps={module.steps}
            text={text}
          />
          <MetricsPanel metrics={attackState.metrics} text={text} />
        </div>

        <div className="space-y-5">
          <ExplanationPanel
            evaluation={attackState.evaluation}
            step={attackState.currentStep}
            stepIndex={attackState.stepIndex}
            totalSteps={attackState.totalSteps}
            text={text}
          />
          <MitigationPanel
            evaluation={attackState.evaluation}
            mitigations={attackState.mitigations}
            onToggle={attackState.toggleMitigation}
            text={text}
          />
        </div>
      </div>
    </div>
  );
}
