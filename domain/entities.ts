export type ActorRole = "user" | "service" | "database" | "attacker";

export type Outcome = "normal" | "degraded" | "blocked" | "compromised";

export type AttackCategory =
  | "injection"
  | "availability"
  | "transport"
  | "client"
  | "session"
  | "access"
  | "configuration";

export type Actor = {
  id: string;
  label: string;
  role: ActorRole;
};

export type FlowEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
};

export type Step = {
  id: string;
  title: string;
  description: string;
  highlights?: {
    actors?: string[];
    edges?: string[];
  };
  outcome?: Outcome;
};

export type Mitigation = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export type AttackModule = {
  id: string;
  name: string;
  category: AttackCategory;
  summary: string;
  actors: Actor[];
  edges: FlowEdge[];
  steps: Step[];
  mitigations: Mitigation[];
};

export type AttackEvaluation = {
  outcome: Outcome;
  label: string;
  description: string;
  protectionScore: number;
  activeMitigations: number;
};

export type SimulationMetrics = {
  latency: number;
  availability: number;
  trust: number;
};
