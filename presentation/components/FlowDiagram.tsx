"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { Actor, AttackEvaluation, FlowEdge, Step } from "@/domain/entities";

type FlowDiagramProps = {
  actors: Actor[];
  edges: FlowEdge[];
  evaluation: AttackEvaluation;
  roleLabels: Record<Actor["role"], string>;
  step: Step;
};

type Point = {
  x: number;
  y: number;
};

const roleClasses: Record<Actor["role"], string> = {
  user: "border-signal-normal/50 bg-signal-normal/10 text-signal-normal",
  service: "border-slate-400/40 bg-slate-400/10 text-primary",
  database: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  attacker: "border-signal-compromised/50 bg-signal-compromised/10 text-signal-compromised"
};

const nodeSize = {
  width: "clamp(7rem, 13vw, 10rem)",
  height: 86
};

const outcomeStroke: Record<AttackEvaluation["outcome"], string> = {
  normal: "#38bdf8",
  degraded: "#facc15",
  blocked: "#34d399",
  compromised: "#fb7185"
};

function buildLayout(actors: Actor[]): Record<string, Point> {
  const presets: Point[] = [
    { x: 22, y: 38 },
    { x: 50, y: 38 },
    { x: 78, y: 38 },
    { x: 50, y: 72 }
  ];

  return actors.reduce<Record<string, Point>>((positions, actor, index) => {
    positions[actor.id] = presets[index] ?? {
      x: 16 + (index % 3) * 34,
      y: 28 + Math.floor(index / 3) * 32
    };
    return positions;
  }, {});
}

function getLineGeometry(from: Point, to: Point) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy) || 1;
  const trim = 9.5;
  const startX = from.x + (dx / distance) * trim;
  const startY = from.y + (dy / distance) * trim;
  const endX = to.x - (dx / distance) * trim;
  const endY = to.y - (dy / distance) * trim;
  const verticalCurve = Math.abs(dy) > 18 ? -7 : 0;
  const angle = Math.atan2(dy, dx);
  const arrowLength = 2.4;
  const arrowWidth = 1.35;
  const tip = { x: endX, y: endY };
  const back = {
    x: endX - Math.cos(angle) * arrowLength,
    y: endY - Math.sin(angle) * arrowLength
  };
  const normal = {
    x: Math.cos(angle + Math.PI / 2) * arrowWidth,
    y: Math.sin(angle + Math.PI / 2) * arrowWidth
  };

  return {
    arrowPoints: `${tip.x},${tip.y} ${back.x + normal.x},${back.y + normal.y} ${back.x - normal.x},${back.y - normal.y}`,
    path: `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY + verticalCurve}, ${(startX + endX) / 2} ${endY + verticalCurve}, ${endX} ${endY}`
  };
}

function ActorIcon({ role }: { role: Actor["role"] }) {
  if (role === "user") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }

  if (role === "database") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M5 6c0 1.7 3.1 3 7 3s7-1.3 7-3-3.1-3-7-3-7 1.3-7 3Zm0 0v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }

  if (role === "attacker") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="m12 3 8 4v5c0 5-3.4 8.5-8 9-4.6-.5-8-4-8-9V7l8-4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
        <path d="M9 10h.01M15 10h.01M9.5 15c1.5 1 3.5 1 5 0" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M5 7h14v10H5V7Zm3 13h8M12 17v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export const FlowDiagram = memo(function FlowDiagram({
  actors,
  edges,
  evaluation,
  roleLabels,
  step
}: FlowDiagramProps) {
  const positions = useMemo(() => buildLayout(actors), [actors]);
  const highlightedActors = new Set(step.highlights?.actors ?? []);
  const highlightedEdges = new Set(step.highlights?.edges ?? []);
  const activeEdgeLabels = edges.filter((edge) => highlightedEdges.has(edge.id) && edge.label);

  return (
    <div className="diagram-surface overflow-hidden rounded-xl border border-default p-4">
      <div className="flex min-h-10 flex-wrap items-center justify-center gap-2">
        {activeEdgeLabels.map((edge) => (
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full border border-default bg-soft px-3 py-1 text-xs font-semibold text-secondary"
            initial={{ opacity: 0, y: -4 }}
            key={edge.id}
            transition={{ duration: 0.2 }}
          >
            {edge.label}
          </motion.span>
        ))}
      </div>

      <div className="grid place-items-center">
      <div className="relative h-[300px] w-full max-w-[860px] sm:h-[320px]">
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {edges.map((edge) => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            const isHighlighted = highlightedEdges.has(edge.id);

            if (!from || !to) {
              return null;
            }
            const geometry = getLineGeometry(from, to);
            const stroke = isHighlighted ? outcomeStroke[evaluation.outcome] : "rgba(100, 116, 139, 0.42)";

            return (
              <motion.g
                animate={{ opacity: isHighlighted ? 1 : 0.26 }}
                initial={false}
                key={edge.id}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <motion.path
                  animate={{ pathLength: isHighlighted ? 1 : 0.9 }}
                  d={geometry.path}
                  fill="none"
                  initial={false}
                  stroke={stroke}
                  strokeLinecap="round"
                  strokeWidth={isHighlighted ? 1.25 : 0.65}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
                <polygon fill={stroke} points={geometry.arrowPoints} />
              </motion.g>
            );
          })}
        </svg>

        {actors.map((actor) => {
          const point = positions[actor.id];
          const isHighlighted = highlightedActors.has(actor.id);

          return (
            <motion.div
              animate={{
                scale: isHighlighted ? 1.04 : 1,
                opacity: isHighlighted ? 1 : 0.78
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-3 text-center shadow-lg backdrop-blur ${roleClasses[actor.role]} ${
                isHighlighted ? "ring-2 ring-white/20" : ""
              }`}
              initial={false}
              key={actor.id}
              style={{
                left: `${point.x}%`,
                minHeight: nodeSize.height,
                top: `${point.y}%`,
                width: nodeSize.width
              }}
              transition={{ duration: 0.34, ease: "easeOut" }}
            >
              <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg border border-current/25 bg-white/10">
                <ActorIcon role={actor.role} />
              </span>
              <span className="mt-2 block text-xs font-semibold uppercase tracking-wide opacity-70">
                {roleLabels[actor.role]}
              </span>
              <span className="mt-1 block text-sm font-bold leading-5">{actor.label}</span>
            </motion.div>
          );
        })}
        </div>
      </div>
    </div>
  );
});
