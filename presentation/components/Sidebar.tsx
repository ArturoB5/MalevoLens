"use client";

import Link from "next/link";
import { useState } from "react";
import type { AttackCategory, AttackModule } from "@/domain/entities";
import { useAppPreferences } from "./AppPreferencesProvider";

type SidebarProps = {
  attacks: AttackModule[];
  activeAttackId?: string;
};

export function Sidebar({ activeAttackId, attacks }: SidebarProps) {
  const { text } = useAppPreferences();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const categoryOrder: AttackCategory[] = [
    "injection",
    "client",
    "session",
    "access",
    "availability",
    "transport",
    "configuration"
  ];
  const groupedAttacks = categoryOrder
    .map((category) => ({
      attacks: attacks.filter((attack) => attack.category === category),
      category
    }))
    .filter((group) => group.attacks.length > 0);

  return (
    <aside
      className={`w-full border-b border-default bg-panel transition-[width] duration-200 lg:min-h-[calc(100vh-129px)] lg:border-b-0 lg:border-r ${
        isCollapsed ? "lg:w-20" : "lg:w-72"
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-3 lg:py-4">
        <span className={`text-xs font-semibold uppercase tracking-wide text-secondary ${isCollapsed ? "lg:sr-only" : ""}`}>
          {text.attackNavigation}
        </span>
        <button
          aria-expanded={isMobileOpen}
          aria-label={isMobileOpen ? text.collapseMenu : text.expandMenu}
          className="control-button flex items-center gap-2 lg:hidden"
          onClick={() => setIsMobileOpen((current) => !current)}
          type="button"
        >
          <span>{isMobileOpen ? text.collapseMenu : text.expandMenu}</span>
          <svg
            aria-hidden="true"
            className={`h-4 w-4 transition-transform ${isMobileOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
        <button
          aria-label={isCollapsed ? text.expandMenu : text.collapseMenu}
          aria-pressed={isCollapsed}
          className="icon-button hidden shrink-0 lg:grid"
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
        className={`${isMobileOpen ? "block" : "hidden"} border-t border-default px-4 pb-4 pt-3 lg:block lg:border-t-0 lg:px-3 lg:pb-6 lg:pt-0`}
      >
        {groupedAttacks.map((group) => (
          <div className="mb-4 last:mb-0" key={group.category}>
            <p
              className={`mb-2 px-2 pt-1 text-[0.68rem] font-bold uppercase tracking-wide text-secondary ${
                isCollapsed ? "lg:sr-only" : ""
              }`}
            >
              {text.categoryLabels[group.category]}
            </p>
            <div className={`grid gap-2 ${isCollapsed ? "lg:place-items-center" : ""}`}>
            {group.attacks.map((attack) => {
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
                  className={`block rounded-lg border text-sm font-semibold leading-5 transition focus:outline-none focus:ring-2 focus:ring-signal-normal ${
                    isActive
                      ? "border-signal-normal/50 bg-signal-normal/10 text-primary"
                      : "border-default bg-soft text-secondary hover:border-signal-normal/30 hover:bg-soft-strong"
                  } ${
                    isCollapsed
                      ? "px-4 py-3 lg:grid lg:h-12 lg:w-12 lg:place-items-center lg:p-0 lg:text-center"
                      : "w-full px-4 py-3 text-left"
                  }`}
                  href={`/attacks/${attack.id}`}
                  key={attack.id}
                  onClick={() => setIsMobileOpen(false)}
                  title={`${text.categoryLabels[attack.category]} · ${attack.name}`}
                >
                  <span className={`${isCollapsed ? "lg:hidden" : ""}`}>{attack.name}</span>
                  <span className={`hidden ${isCollapsed ? "lg:block" : ""}`}>{shortLabel}</span>
                </Link>
              );
            })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
