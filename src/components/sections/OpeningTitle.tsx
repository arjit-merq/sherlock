const DOTS = ["#a855f7", "#3b82f6", "#0f9d58"];

export function OpeningTitle() {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden px-6 py-24 md:px-16 lg:px-24">
      <div className="radial-glow absolute left-1/4 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2" aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-2" aria-hidden>
          {DOTS.map((c) => (
            <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />
          ))}
        </div>

        <p className="mono-label text-sm text-text-tertiary md:text-base">Platform Engineering Support</p>
        <h1 className="section-heading mt-2 text-4xl font-semibold leading-tight text-text-primary md:text-5xl">
          How We Investigate,
          <br />
          Support &amp; Improve
        </h1>
        <div className="mt-5 h-1 w-32 rounded-full" style={{ background: "linear-gradient(90deg, var(--green), var(--cyan))" }} />
      </div>

      <div className="relative z-10 mx-auto mt-14 flex w-full max-w-6xl flex-col items-center gap-2 text-text-tertiary">
        <span className="mono-label text-[14px]">Scroll to begin</span>
        <span className="h-8 w-px animate-pulse bg-text-tertiary/60" />
      </div>
    </section>
  );
}
