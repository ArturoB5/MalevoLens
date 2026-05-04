type MalevoLensLogoProps = {
  size?: "sm" | "md" | "lg";
};

const sizes: Record<NonNullable<MalevoLensLogoProps["size"]>, string> = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16"
};

export function MalevoLensLogo({ size = "sm" }: MalevoLensLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center rounded-xl border border-signal-normal/40 bg-signal-normal/10 text-signal-normal shadow-glow ${sizes[size]}`}
    >
      <svg fill="none" viewBox="0 0 48 48" className="h-[78%] w-[78%]">
        <circle cx="21" cy="21" r="12" stroke="currentColor" strokeWidth="3" />
        <path d="m30 30 9 9" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
        <path
          d="M17 21c0-3 2-5 5-5s5 2 5 5v4c0 3-2 5-5 5s-5-2-5-5v-4Z"
          fill="currentColor"
          opacity="0.18"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M22 16v14M16 20h-3M31 20h-3M16 25h-3M31 25h-3M18 17l-3-3M26 17l3-3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        <path d="M19.5 22h.01M24.5 22h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
      </svg>
    </span>
  );
}
