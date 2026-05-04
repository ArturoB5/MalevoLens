"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { Actor, AttackEvaluation, FlowEdge, Step } from "@/domain/entities";

type FlowDiagramProps = {
  actors: Actor[];
  diagramLabel: string;
  edges: FlowEdge[];
  evaluation: AttackEvaluation;
  roleLabels: Record<Actor["role"], string>;
  step: Step;
};

type Point = {
  x: number;
  y: number;
};

type StageNode = Point & {
  height: number;
  width: number;
};

const roleClasses: Record<Actor["role"], string> = {
  user: "border-signal-normal/50 bg-signal-normal/10 text-signal-normal",
  service: "border-slate-400/40 bg-slate-400/10 text-primary",
  database: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  attacker: "border-signal-compromised/50 bg-signal-compromised/10 text-signal-compromised"
};

const nodeWidth = 168;
const nodeHeight = 112;

const outcomeStroke: Record<AttackEvaluation["outcome"], string> = {
  normal: "#38bdf8",
  degraded: "#facc15",
  blocked: "#34d399",
  compromised: "#fb7185"
};

function buildLayout(actors: Actor[]): Record<string, Point> {
  const presets: Point[] = [
    { x: 210, y: 178 },
    { x: 450, y: 178 },
    { x: 690, y: 178 },
    { x: 450, y: 318 }
  ];

  return actors.reduce<Record<string, Point>>((positions, actor, index) => {
    positions[actor.id] = presets[index] ?? {
      x: 210 + (index % 3) * 240,
      y: 178 + Math.floor(index / 3) * 140
    };
    return positions;
  }, {});
}

function getNodeBox(point: Point): StageNode {
  return {
    height: nodeHeight,
    width: nodeWidth,
    x: point.x,
    y: point.y
  };
}

function getAnchor(from: StageNode, to: StageNode) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const horizontal = Math.abs(dx) >= Math.abs(dy);

  if (horizontal) {
    return {
      from: {
        x: from.x + Math.sign(dx) * (from.width / 2 + 8),
        y: from.y
      },
      to: {
        x: to.x - Math.sign(dx) * (to.width / 2 + 14),
        y: to.y
      }
    };
  }

  return {
    from: {
      x: from.x,
      y: from.y + Math.sign(dy) * (from.height / 2 + 8)
    },
    to: {
      x: to.x,
      y: to.y - Math.sign(dy) * (to.height / 2 + 14)
    }
  };
}

function getLineGeometry(fromPoint: Point, toPoint: Point) {
  const anchors = getAnchor(getNodeBox(fromPoint), getNodeBox(toPoint));
  const dx = anchors.to.x - anchors.from.x;
  const dy = anchors.to.y - anchors.from.y;
  const distance = Math.hypot(dx, dy) || 1;
  const startX = anchors.from.x;
  const startY = anchors.from.y;
  const endX = anchors.to.x;
  const endY = anchors.to.y;
  const verticalCurve = Math.abs(dy) > 80 ? -36 : 0;
  const angle = Math.atan2(dy, dx);
  const arrowLength = 12;
  const arrowWidth = 7;
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
  diagramLabel,
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

      <div className="grid place-items-center py-2">
        <svg
          aria-label={diagramLabel}
          className="h-[360px] w-full max-w-[900px]"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          viewBox="0 0 900 460"
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

        {actors.map((actor) => {
          const point = positions[actor.id];
          const isHighlighted = highlightedActors.has(actor.id);

          return (
            <foreignObject
              height={nodeHeight + 16}
              key={actor.id}
              width={nodeWidth + 16}
              x={point.x - nodeWidth / 2 - 8}
              y={point.y - nodeHeight / 2 - 8}
            >
              <motion.div
                animate={{
                  opacity: isHighlighted ? 1 : 0.78,
                  scale: isHighlighted ? 1.03 : 1
                }}
                className={`flex h-[112px] w-[168px] flex-col items-center justify-center rounded-xl border px-3 py-3 text-center shadow-lg backdrop-blur ${roleClasses[actor.role]} ${
                  isHighlighted ? "ring-2 ring-white/20" : ""
                }`}
                initial={false}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-current/25 bg-white/10">
                  <ActorIcon role={actor.role} />
                </span>
                <span className="mt-2 block text-xs font-semibold uppercase tracking-wide opacity-70">
                  {roleLabels[actor.role]}
                </span>
                <span className="mt-1 block text-sm font-bold leading-5">{actor.label}</span>
              </motion.div>
            </foreignObject>
          );
        })}
        </svg>
      </div>
    </div>
  );
});
