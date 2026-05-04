"use client";

import { useAppPreferences } from "./AppPreferencesProvider";

export function PreferenceControls() {
  const { locale, setLocale, text, theme, toggleTheme } = useAppPreferences();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <div className="segmented-control" aria-label={text.language}>
        <button
          aria-pressed={locale === "es"}
          className={locale === "es" ? "is-active" : ""}
          onClick={() => setLocale("es")}
          type="button"
        >
          ES
        </button>
        <button
          aria-pressed={locale === "en"}
          className={locale === "en" ? "is-active" : ""}
          onClick={() => setLocale("en")}
          type="button"
        >
          EN
        </button>
      </div>
      <button
        aria-label={`${text.theme}: ${isDark ? text.dark : text.light}`}
        className="icon-button"
        onClick={toggleTheme}
        title={`${text.theme}: ${isDark ? text.dark : text.light}`}
        type="button"
      >
        {isDark ? (
          <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
            <path
              d="M21 14.6A8.4 8.4 0 0 1 9.4 3a7.7 7.7 0 1 0 11.6 11.6Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
            <path
              d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m0-11.4L4.9 4.9m14.2 14.2-1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
