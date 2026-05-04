"use client";

import { getLocalizedAttackModule } from "@/infrastructure/i18n";
import { AttackLayout } from "./AttackLayout";
import { useAppPreferences } from "./AppPreferencesProvider";
import { Sidebar } from "./Sidebar";

type AttackPageContentProps = {
  attackId: string;
};

export function AttackPageContent({ attackId }: AttackPageContentProps) {
  const { attacks, locale } = useAppPreferences();
  const attackModule = getLocalizedAttackModule(locale, attackId);

  if (!attackModule) {
    return null;
  }

  return (
    <main className="lg:flex">
      <Sidebar activeAttackId={attackModule.id} attacks={attacks} />
      <section className="w-full px-4 py-6 sm:px-6 lg:py-8">
        <AttackLayout module={attackModule} />
      </section>
    </main>
  );
}
