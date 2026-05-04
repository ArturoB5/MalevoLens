"use client";

import Link from "next/link";
import { useState } from "react";
import type { AttackModule } from "@/domain/entities";
import { useAppPreferences } from "./AppPreferencesProvider";

type SidebarProps = {
  attacks: AttackModule[];
  activeAttackId?: string;
};

export function Sidebar({ activeAttackId, attacks }: SidebarProps) {
  const { text } = useAppPreferences();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`w-full border-b border-default bg-panel transition-[width] duration-200 lg:min-h-[calc(100vh-129px)] lg:border-b-0 lg:border-r ${
        isCollapsed ? "lg:w-20" : "lg:w-64"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-3 lg:px-3 lg:py-4">
        <span className={`text-xs font-semibold uppercase tracking-wide text-secondary ${isCollapsed ? "lg:sr-only" : ""}`}>
          {text.attackNavigation}
        </span>
        <button
          aria-label={isCollapsed ? text.expandMenu : text.collapseMenu}
          aria-pressed={isCollapsed}
          className="icon-button shrink-0"
          onClick={() => setIsCollapsed((current) => !current)}
          title={isCollapsed ? text.expandMenu : text.collapseMenu}
          type="button"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            ) : (
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>

      <nav
        aria-label={text.attackNavigation}
        className={`mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 lg:flex-col lg:overflow-x-visible lg:px-3 lg:pb-6 ${
          isCollapsed ? "lg:items-center" : ""
        } ${isCollapsed ? "hidden lg:flex" : ""}`}
      >
        {attacks.map((attack) => {
          const isActive = attack.id === activeAttackId;
          const shortLabel = attack.name
            .split(/[\s-]+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0]?.toUpperCase())
            .join("");

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`rounded-lg border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-signal-normal ${
                isActive
                  ? "border-signal-normal/50 bg-signal-normal/10 text-primary"
                  : "border-default bg-soft text-secondary hover:border-signal-normal/30 hover:bg-soft-strong"
              } ${isCollapsed ? "min-w-12 text-center lg:grid lg:h-12 lg:w-12 lg:min-w-0 lg:place-items-center lg:p-0" : "min-w-48 lg:w-full"}`}
              href={`/attacks/${attack.id}`}
              key={attack.id}
              title={attack.name}
            >
              <span className={isCollapsed ? "lg:hidden" : ""}>{attack.name}</span>
              <span className={`hidden ${isCollapsed ? "lg:block" : ""}`}>{shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
