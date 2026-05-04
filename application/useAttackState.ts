"use client";

import { useCallback, useMemo, useState } from "react";
import type { AttackModule } from "@/domain/entities";
import {
  clampStepIndex,
  evaluateAttackState,
  calculateSimulationMetrics,
  getCurrentStep,
  resetMitigations,
  toggleMitigation
} from "@/domain/rules";

export function useAttackState(module: AttackModule) {
  const [stepIndex, setStepIndex] = useState(0);
  const [mitigations, setMitigations] = useState(() => resetMitigations(module));

  const currentStep = useMemo(() => getCurrentStep(module, stepIndex), [module, stepIndex]);

  const evaluation = useMemo(
    () => evaluateAttackState(module, stepIndex, mitigations),
    [module, mitigations, stepIndex]
  );

  const metrics = useMemo(() => calculateSimulationMetrics(evaluation), [evaluation]);

  const canGoPrevious = stepIndex > 0;
  const canGoNext = stepIndex < module.steps.length - 1;

  const goNext = useCallback(() => {
    setStepIndex((current) => clampStepIndex(current + 1, module.steps.length));
  }, [module.steps.length]);

  const goPrevious = useCallback(() => {
    setStepIndex((current) => clampStepIndex(current - 1, module.steps.length));
  }, [module.steps.length]);

  const goToStep = useCallback(
    (nextStepIndex: number) => {
      setStepIndex(clampStepIndex(nextStepIndex, module.steps.length));
    },
    [module.steps.length]
  );

  const toggleMitigationById = useCallback((mitigationId: string) => {
    setMitigations((current) => toggleMitigation(current, mitigationId));
  }, []);

  const resetSimulation = useCallback(() => {
    setStepIndex(0);
    setMitigations(resetMitigations(module));
  }, [module]);

  return {
    canGoNext,
    canGoPrevious,
    currentStep,
    evaluation,
    goNext,
    goPrevious,
    goToStep,
    metrics,
    mitigations,
    resetSimulation,
    stepIndex,
    toggleMitigation: toggleMitigationById,
    totalSteps: module.steps.length
  };
}
