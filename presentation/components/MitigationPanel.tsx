import type { AttackEvaluation, Mitigation } from "@/domain/entities";
import type { UiText } from "@/infrastructure/i18n";

type MitigationPanelProps = {
  evaluation: AttackEvaluation;
  mitigations: Mitigation[];
  onToggle: (mitigationId: string) => void;
  text: UiText;
};

export function MitigationPanel({ evaluation, mitigations, onToggle, text }: MitigationPanelProps) {
  return (
    <section
      aria-labelledby="mitigation-title"
      className="panel p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-primary" id="mitigation-title">
            {text.mitigationsTitle}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            {text.defensiveCoverage}: {evaluation.protectionScore}%
          </p>
        </div>
        <span className="rounded-lg border border-signal-protected/30 bg-signal-protected/10 px-3 py-1 text-sm font-semibold text-signal-protected">
          {evaluation.activeMitigations}/{mitigations.length}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {mitigations.map((mitigation) => (
          <label
            className="flex cursor-pointer gap-3 rounded-lg border border-default bg-soft p-4 transition hover:bg-soft-strong"
            key={mitigation.id}
          >
            <input
              checked={mitigation.enabled}
              className="mt-1 h-4 w-4 rounded border-slate-500 bg-surface-muted text-signal-protected focus:ring-signal-protected"
              onChange={() => onToggle(mitigation.id)}
              type="checkbox"
            />
            <span>
              <span className="block text-sm font-semibold text-primary">{mitigation.title}</span>
              <span className="mt-1 block text-sm leading-6 text-secondary">{mitigation.description}</span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
