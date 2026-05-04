"use client";

import Link from "next/link";
import { useAppPreferences } from "./AppPreferencesProvider";
import { MalevoLensLogo } from "./MalevoLensLogo";
import { Sidebar } from "./Sidebar";

export function HomeContent() {
  const { attacks, text } = useAppPreferences();
  const firstAttack = attacks[0];

  return (
    <main className="lg:flex">
      <Sidebar attacks={attacks} />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-signal-protected">
            {text.homeEyebrow}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <MalevoLensLogo size="lg" />
            <div>
              <h1 className="text-4xl font-bold text-primary sm:text-5xl">{text.homeTitle}</h1>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-secondary">by Abalon Labs</p>
            </div>
          </div>
          <p className="mt-5 text-base leading-7 text-secondary">{text.homeDescription}</p>
          {firstAttack ? (
            <Link className="primary-button mt-7 inline-flex" href={`/attacks/${firstAttack.id}`}>
              {text.startSimulation}
            </Link>
          ) : null}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {attacks.map((attack) => (
            <Link
              className="panel block p-5 transition hover:border-signal-normal/40 focus:outline-none focus:ring-2 focus:ring-signal-normal"
              href={`/attacks/${attack.id}`}
              key={attack.id}
            >
              <h2 className="text-lg font-semibold text-primary">{attack.name}</h2>
              <p className="mt-3 text-sm leading-6 text-secondary">{attack.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
