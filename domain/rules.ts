import type {
  AttackEvaluation,
  AttackModule,
  Mitigation,
  Outcome,
  SimulationMetrics,
  Step
} from "./entities";

const protectiveOutcomes: ReadonlySet<Outcome> = new Set(["blocked", "normal"]);

export function clampStepIndex(stepIndex: number, totalSteps: number): number {
  if (totalSteps <= 0) {
    return 0;
  }

  return Math.min(Math.max(stepIndex, 0), totalSteps - 1);
}

export function getCurrentStep(module: AttackModule, stepIndex: number): Step {
  return module.steps[clampStepIndex(stepIndex, module.steps.length)] ?? module.steps[0];
}

export function toggleMitigation(mitigations: Mitigation[], mitigationId: string): Mitigation[] {
  return mitigations.map((mitigation) =>
    mitigation.id === mitigationId
      ? { ...mitigation, enabled: !mitigation.enabled }
      : mitigation
  );
}

export function resetMitigations(module: AttackModule): Mitigation[] {
  return module.mitigations.map((mitigation) => ({ ...mitigation }));
}

export function evaluateAttackState(
  module: AttackModule,
  stepIndex: number,
  mitigations: Mitigation[]
): AttackEvaluation {
  const step = getCurrentStep(module, stepIndex);
  const activeMitigations = mitigations.filter((mitigation) => mitigation.enabled).length;
  const protectionScore = Math.round((activeMitigations / Math.max(mitigations.length, 1)) * 100);

  if (activeMitigations > 0 && step.outcome && !protectiveOutcomes.has(step.outcome)) {
    return {
      outcome: activeMitigations === mitigations.length ? "blocked" : "degraded",
      label: activeMitigations === mitigations.length ? "Ataque bloqueado" : "Impacto reducido",
      description:
        activeMitigations === mitigations.length
          ? "Las defensas conceptuales cubren los puntos críticos del flujo y detienen la progresión del riesgo."
          : "Las defensas activas reducen el impacto, aunque todavía queda superficie de exposición por cubrir.",
      protectionScore,
      activeMitigations
    };
  }

  const outcome = step.outcome ?? "normal";

  return {
    outcome,
    label: getOutcomeLabel(outcome),
    description: getOutcomeDescription(outcome),
    protectionScore,
    activeMitigations
  };
}

export function getOutcomeLabel(outcome: Outcome): string {
  const labels: Record<Outcome, string> = {
    normal: "Flujo normal",
    degraded: "Servicio degradado",
    blocked: "Ataque bloqueado",
    compromised: "Riesgo comprometido"
  };

  return labels[outcome];
}

export function getOutcomeDescription(outcome: Outcome): string {
  const descriptions: Record<Outcome, string> = {
    normal: "La comunicación sigue el camino esperado sin señales de abuso.",
    degraded: "El sistema mantiene operación parcial, pero con presión o pérdida de calidad.",
    blocked: "Las defensas evitan que el escenario avance hacia un estado dañino.",
    compromised: "La simulación muestra una consecuencia conceptual si faltan controles defensivos."
  };

  return descriptions[outcome];
}

export function calculateSimulationMetrics(evaluation: AttackEvaluation): SimulationMetrics {
  const baseByOutcome: Record<Outcome, SimulationMetrics> = {
    normal: { latency: 24, availability: 96, trust: 92 },
    degraded: { latency: 68, availability: 58, trust: 54 },
    blocked: { latency: 34, availability: 91, trust: 88 },
    compromised: { latency: 82, availability: 36, trust: 24 }
  };
  const base = baseByOutcome[evaluation.outcome];
  const protectionBoost = Math.round(evaluation.protectionScore * 0.18);

  return {
    latency: Math.max(10, Math.min(95, base.latency - protectionBoost)),
    availability: Math.max(5, Math.min(100, base.availability + protectionBoost)),
    trust: Math.max(5, Math.min(100, base.trust + protectionBoost))
  };
}
