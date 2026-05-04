"use client";

import Link from "next/link";
import { PreferenceControls } from "./PreferenceControls";
import { useAppPreferences } from "./AppPreferencesProvider";

export function Header() {
  return (
    <header className="border-b border-default bg-app/90 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link className="group inline-flex items-center gap-3" href="/">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-signal-normal/40 bg-signal-normal/10 text-sm font-bold text-signal-normal shadow-glow">
            ML
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-wide text-primary">MalevoLens</span>
          </span>
        </Link>
        <PreferenceControls />
      </div>
    </header>
  );
}
