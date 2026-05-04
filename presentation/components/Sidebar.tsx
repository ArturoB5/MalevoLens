"use client";

import Link from "next/link";
import type { AttackModule } from "@/domain/entities";
import { useAppPreferences } from "./AppPreferencesProvider";

type SidebarProps = {
  attacks: AttackModule[];
  activeAttackId?: string;
};

export function Sidebar({ activeAttackId, attacks }: SidebarProps) {
  const { text } = useAppPreferences();

  return (
    <aside className="w-full border-b border-default bg-panel lg:min-h-[calc(100vh-73px)] lg:w-80 lg:border-b-0 lg:border-r">
      <nav aria-label={text.attackNavigation} className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 lg:flex-col lg:px-4 lg:py-6">
        {attacks.map((attack) => {
          const isActive = attack.id === activeAttackId;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`min-w-64 rounded-lg border px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-signal-normal lg:min-w-0 ${
                isActive
                  ? "border-signal-normal/50 bg-signal-normal/10 text-primary"
                  : "border-default bg-soft text-secondary hover:border-signal-normal/30 hover:bg-soft-strong"
              }`}
              href={`/attacks/${attack.id}`}
              key={attack.id}
            >
              <span className="block text-sm font-semibold">{attack.name}</span>
              <span className="mt-1 block text-xs leading-5 text-secondary">{attack.summary}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
