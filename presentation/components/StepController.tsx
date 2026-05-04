import type { Step } from "@/domain/entities";
import type { UiText } from "@/infrastructure/i18n";

type StepControllerProps = {
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  steps: Step[];
  text: UiText;
};

export function StepController({ currentStepIndex, onSelectStep, steps, text }: StepControllerProps) {
  return (
    <div aria-label={text.step} className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;

        return (
          <button
            aria-current={isActive ? "step" : undefined}
            className={`rounded-lg border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-signal-normal ${
              isActive
                ? "border-signal-normal/50 bg-signal-normal/10"
                : "border-default bg-soft hover:bg-soft-strong"
            }`}
            key={step.id}
            onClick={() => onSelectStep(index)}
            type="button"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {text.step} {index + 1}
            </span>
            <span className="mt-1 block text-sm font-semibold text-primary">{step.title}</span>
          </button>
        );
      })}
    </div>
  );
}
