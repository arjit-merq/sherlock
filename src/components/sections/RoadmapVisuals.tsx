// Custom illustrations standing in for the three roadmap concepts (a real
// photo/AI-image pipeline isn't available in this build) — centralized
// infrastructure, a chat-style interface, and scaling capacity. Each one
// scrubs its own build-in animation from the column's scroll progress (0..1)
// so it plays forward and reverses with the rest of the deck.

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function CentralizedSystemVisual({ progress = 1 }: { progress?: number }) {
  const satellites = [
    { x: 40, y: 30 },
    { x: 160, y: 26 },
    { x: 20, y: 90 },
    { x: 180, y: 96 },
    { x: 60, y: 140 },
    { x: 140, y: 144 },
  ];
  const pulse = 1 + Math.sin(progress * Math.PI * 4) * 0.06;
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <radialGradient id="hubGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="var(--green)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="160" fill="var(--bg-panel)" />
      <circle cx="100" cy="80" r={55 * pulse} fill="url(#hubGlow)" />
      {satellites.map((s, i) => {
        const p = clamp01(progress * 1.6 - i * 0.12);
        return (
          <g key={i} style={{ opacity: p }}>
            <line
              x1="100"
              y1="80"
              x2={100 + (s.x - 100) * p}
              y2={80 + (s.y - 80) * p}
              stroke="var(--green)"
              strokeWidth="1.5"
              opacity="0.55"
            />
            <circle cx={s.x} cy={s.y} r="7" fill="var(--bg-void)" stroke="var(--green)" strokeWidth="1.5" style={{ transform: `scale(${0.5 + p * 0.5})`, transformOrigin: `${s.x}px ${s.y}px` }} />
          </g>
        );
      })}
      <circle cx="100" cy="80" r="20" fill="var(--bg-void)" stroke="var(--green)" strokeWidth="2" />
      {/* continuous idle pulse, independent of scroll, so the hub feels alive at rest */}
      <circle cx="100" cy="80" r="20" fill="none" stroke="var(--green)" strokeWidth="1.5" opacity={0.5 * progress}>
        <animate attributeName="r" values="20;34;20" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values={`${0.5 * progress};0;0`} dur="2.6s" repeatCount="indefinite" />
      </circle>
      <rect x="92" y="72" width="16" height="16" rx="2" fill="var(--green)" />
    </svg>
  );
}

export function ChatbotVisual({ progress = 1 }: { progress?: number }) {
  const bubble1 = clamp01(progress * 2.4);
  const bubble2 = clamp01(progress * 2.4 - 0.5);
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <rect width="200" height="160" fill="var(--bg-panel)" />
      {/* incoming question bubble */}
      <g style={{ opacity: bubble1, transform: `translateY(${(1 - bubble1) * 8}px)` }}>
        <rect x="14" y="20" width="120" height="28" rx="14" fill="var(--bg-void)" stroke="var(--line)" />
        <circle cx="30" cy="34" r="4" fill="var(--cyan)" />
        <rect x="42" y="29" width="80" height="4" rx="2" fill="var(--text-tertiary)" />
        <rect x="42" y="37" width="55" height="4" rx="2" fill="var(--text-tertiary)" opacity="0.6" />
      </g>
      {/* Sherlock reply bubble */}
      <g style={{ opacity: bubble2, transform: `translateY(${(1 - bubble2) * 8}px)` }}>
        <rect x="66" y="60" width="120" height="40" rx="14" fill="var(--green)" opacity="0.9" />
        <rect x="80" y="71" width="90" height="4" rx="2" fill="#04140c" />
        <rect x="80" y="80" width="65" height="4" rx="2" fill="#04140c" opacity="0.7" />
      </g>
      {/* input bar with a continuously animated "typing" indicator */}
      <rect x="14" y="128" width="172" height="20" rx="10" fill="var(--bg-void)" stroke="var(--green)" strokeOpacity="0.5" />
      {[160, 170, 180].map((cx, i) => (
        <circle key={cx} cx={cx} cy="138" r="2.5" fill="var(--green)" opacity={0.4 * progress}>
          <animate attributeName="opacity" values={`${0.4 * progress};${1 * progress};${0.4 * progress}`} dur="1.2s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

export function ScalabilityVisual({ progress = 1 }: { progress?: number }) {
  const bars = [
    { x: 20, h: 30 },
    { x: 55, h: 46 },
    { x: 90, h: 64 },
    { x: 125, h: 84 },
    { x: 160, h: 104 },
  ];
  const pathP = clamp01(progress * 1.3);
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <rect width="200" height="160" fill="var(--bg-panel)" />
      {bars.map((b, i) => {
        const p = clamp01(progress * 1.6 - i * 0.14);
        return (
          <rect
            key={i}
            x={b.x}
            y={140 - b.h * p}
            width="22"
            height={b.h * p}
            rx="4"
            fill="var(--amber)"
            opacity={0.4 + i * 0.12}
          />
        );
      })}
      <path
        d="M20 118 L55 100 L90 82 L125 58 L160 34"
        stroke="var(--amber)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 - pathP }}
      />
      <circle cx={20 + (160 - 20) * pathP} cy={118 - (118 - 34) * pathP} r="5" fill="var(--amber)">
        <animate attributeName="r" values="5;7;5" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
