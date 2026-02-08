interface SvgProps {
  className?: string;
}

export function FloralAccent({ className = "" }: SvgProps) {
  // Small decorative flower for inline use
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 38 C20 28, 20 22, 20 18" />
      <path d="M14 20 C10 14, 14 8, 20 8 C26 8, 30 14, 26 20" />
      <path d="M20 8 C20 2, 26 0, 28 5" />
      <path d="M20 8 C18 3, 12 2, 12 6" />
      <path d="M16 22 C12 24, 10 28, 14 30" />
      <path d="M24 22 C28 24, 30 28, 26 30" />
    </svg>
  );
}
