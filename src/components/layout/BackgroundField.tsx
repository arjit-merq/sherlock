export function BackgroundField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-grid" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-void via-charcoal/60 to-void" />
    </div>
  );
}
