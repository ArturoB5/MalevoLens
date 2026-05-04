"use client";

import Link from "next/link";
import { PreferenceControls } from "./PreferenceControls";
import { MalevoLensLogo } from "./MalevoLensLogo";

export function Header() {
  return (
    <header className="border-b border-default bg-app/90 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link className="group inline-flex items-center gap-3" href="/">
          <MalevoLensLogo />
          <span>
            <span className="block text-lg font-semibold tracking-wide text-primary">MalevoLens</span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-secondary">by Abalon Labs</span>
          </span>
        </Link>
        <PreferenceControls />
      </div>
    </header>
  );
}
