/**
 * ISO 128 phantom line (long dash, two short dashes): the outline of a part that is not there yet.
 * The loading state of the system. Decorative; the container announces the loading.
 */
export function Phantom({ className = "" }: { className?: string }) {
  return (
    <span className={`phantom ${className}`} aria-hidden="true">
      <svg preserveAspectRatio="none">
        <rect width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="12 3 2 3 2 3" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}
