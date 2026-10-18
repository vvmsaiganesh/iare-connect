/**
 * RoleOrbitArt — the animated artwork on the right panel of the login page.
 *
 * A "prism gyroscope": three luminous rings — one per role (Admin · Faculty ·
 * Student) — tumble around a radiant secure-auth core on different axes and
 * at different speeds, like the movement of a fine timepiece. Each ring
 * carries a glass node (glyph + upright label) that travels with it, plus a
 * companion glow riding the far side. Twin light streaks silently circle the
 * core while sonar breaths pulse outward.
 *
 * Contrast is the point: saturated blue / gold / aqua rings carry coloured
 * bloom (SVG drop-shadow glow) and white glyphs, so they read sharply
 * against the panel while the motion stays slow and calm.
 *
 * Pure SVG + CSS keyframes only (no SMIL), so the whole piece honours
 * prefers-reduced-motion and freezes into a still composition.
 */

const CX = 260;
const CY = 210;
const RX = 176;
const RY = 62;

/** Parametric point on the ellipse for a given angle (degrees). */
const pointOn = (phi) => {
  const rad = (phi * Math.PI) / 180;
  return { x: CX + RX * Math.cos(rad), y: CY + RY * Math.sin(rad) };
};

const RINGS = [
  { id: 'admin', label: 'ADMIN', color: '#7cc4ff', glow: '#3f9dff', tilt: 0, phi: 0, spin: 'a', bobDelay: '0s' },
  { id: 'faculty', label: 'FACULTY', color: '#ffd98a', glow: '#f2b34a', tilt: 60, phi: 140, spin: 'b', bobDelay: '-2.2s' },
  { id: 'student', label: 'STUDENT', color: '#5ff0e0', glow: '#2bd8c4', tilt: 120, phi: 230, spin: 'c', bobDelay: '-4.4s' },
];

const SPARKLES = [
  { cx: 74, cy: 80, dur: '4.6s', begin: '0s' },
  { cx: 450, cy: 96, dur: '5.8s', begin: '-2.1s' },
  { cx: 444, cy: 352, dur: '5.2s', begin: '-3.6s' },
  { cx: 68, cy: 342, dur: '6.4s', begin: '-1.2s' },
];

/** Role glyphs drawn on the standard 24×24 icon grid. */
function RoleGlyph({ id }) {
  if (id === 'admin') {
    return (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    );
  }
  if (id === 'faculty') {
    return (
      <>
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </>
    );
  }
  return (
    <>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <circle cx="8" cy="11.5" r="2" />
      <path d="M5 16.5c.8-1.3 1.9-2 3-2s2.2.7 3 2" />
      <path d="M14 10.5h4" />
      <path d="M14 14.5h4" />
    </>
  );
}

export default function RoleOrbitArt({ className = '' }) {
  return (
    <svg
      viewBox="0 0 520 440"
      className={className}
      role="img"
      aria-label="Three luminous rings for Admin, Faculty and Student tumbling around a secure authentication core"
    >
      <defs>
        {/* soft centre light so the movement reads on the photo */}
        <radialGradient id="prismBackdrop" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.13" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.035" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        {/* teal bloom behind the core */}
        <radialGradient id="prismCoreHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9dfff4" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#2bd8c4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2bd8c4" stopOpacity="0" />
        </radialGradient>
        <filter id="prismSoft" x="-140%" y="-140%" width="380%" height="380%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* white bloom for the core streaks + shield */}
        <filter id="coreGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ffffff" floodOpacity="0.8" />
        </filter>
        {/* dark lift so labels stay readable over bright passes */}
        <filter id="labelShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.6" floodColor="#020814" floodOpacity="0.8" />
        </filter>
        {RINGS.map((ring) => (
          <linearGradient key={ring.id} id={`prism-${ring.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={ring.color} stopOpacity="0.22" />
            <stop offset="34%" stopColor={ring.color} stopOpacity="1" />
            <stop offset="68%" stopColor={ring.color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={ring.color} stopOpacity="0.14" />
          </linearGradient>
        ))}
        {RINGS.map((ring) => (
          <filter key={ring.id} id={`ringGlow-${ring.id}`} x="-35%" y="-35%" width="170%" height="170%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={ring.glow} floodOpacity="0.85" />
          </filter>
        ))}
        {RINGS.map((ring) => (
          <filter key={ring.id} id={`nodeGlow-${ring.id}`} x="-70%" y="-70%" width="240%" height="240%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={ring.glow} floodOpacity="0.9" />
          </filter>
        ))}
      </defs>

      {/* soft centre light so the movement reads on the photo */}
      <circle cx={CX} cy={CY} r={196} fill="url(#prismBackdrop)" />

      {/* twinkling sparkles */}
      {SPARKLES.map((s) => (
        <circle
          key={`${s.cx}-${s.cy}`}
          cx={s.cx}
          cy={s.cy}
          r="2.2"
          fill="#ffffff"
          opacity="0.4"
          className="gyro-twinkle"
          style={{ animationDuration: s.dur, animationDelay: s.begin }}
        />
      ))}

      {/* sonar breath from the core — two staggered pulses */}
      <circle cx={CX} cy={CY} r={46} fill="none" stroke="#5ff0e0" strokeWidth="1.2" opacity="0" className="gyro-ping" />
      <circle
        cx={CX}
        cy={CY}
        r={46}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.85"
        strokeWidth="1"
        opacity="0"
        className="gyro-ping"
        style={{ animationDelay: '-3.5s' }}
      />

      {/* ---- the three tumbling role rings ---- */}
      {RINGS.map((ring) => {
        const node = pointOn(ring.phi);
        const mate = pointOn(ring.phi + 180);
        return (
          <g key={ring.id} className={`gyro-spin-${ring.spin}`}>
            <g transform={`rotate(${ring.tilt} ${CX} ${CY})`}>
              {/* hairline link to the core */}
              <line
                x1={CX}
                y1={CY}
                x2={node.x}
                y2={node.y}
                stroke="#ffffff"
                strokeOpacity="0.18"
                strokeWidth="1.2"
                strokeDasharray="1.5 8"
                strokeLinecap="round"
              />

              {/* the ring itself, blooming in its own colour */}
              <ellipse
                cx={CX}
                cy={CY}
                rx={RX}
                ry={RY}
                fill="none"
                stroke={`url(#prism-${ring.id})`}
                strokeWidth="1.5"
                filter={`url(#ringGlow-${ring.id})`}
              />

              {/* companion glow riding the far side of the ring */}
              <circle cx={mate.x} cy={mate.y} r={9} fill={ring.color} opacity="0.5" filter="url(#prismSoft)" />
              <circle cx={mate.x} cy={mate.y} r={3} fill={ring.color} opacity="1" />

              {/* node — static un-tilt then counter-spin keeps the label upright */}
              <g transform={`rotate(${-ring.tilt} ${node.x} ${node.y})`}>
                <g className={`gyro-counter-${ring.spin}`} style={{ transformOrigin: `${node.x}px ${node.y}px` }}>
                  <g className="gyro-bob" style={{ animationDelay: ring.bobDelay }}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={25}
                      fill="none"
                      stroke={ring.color}
                      strokeOpacity="0.45"
                      strokeWidth="1.1"
                      strokeDasharray="2 7"
                    />
                    <g filter={`url(#nodeGlow-${ring.id})`}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={19}
                        fill="rgba(8,18,38,0.78)"
                        stroke={ring.color}
                        strokeWidth="1.7"
                      />
                      <g
                        transform={`translate(${node.x} ${node.y}) scale(1.15) translate(-12 -12)`}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.85"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <RoleGlyph id={ring.id} />
                      </g>
                    </g>
                    <text
                      x={node.x}
                      y={node.y + 41}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="700"
                      letterSpacing="3"
                      className="font-mono"
                      filter="url(#labelShadow)"
                    >
                      {ring.label}
                    </text>
                  </g>
                </g>
              </g>
            </g>
          </g>
        );
      })}

      {/* ---- the secure-auth core (stays at the centre) ---- */}
      <g>
        {/* teal bloom halo */}
        <circle cx={CX} cy={CY} r={74} fill="url(#prismCoreHalo)" />
        {/* breathing glow */}
        <circle cx={CX} cy={CY} r={36} fill="#5ff0e0" opacity="0.55" filter="url(#prismSoft)" className="gyro-glow" />
        {/* twin light streaks circling the core — white and gold, opposite ways */}
        <g filter="url(#coreGlow)">
          <circle
            cx={CX}
            cy={CY}
            r={37}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="34 198"
            className="gyro-arc"
          />
          <circle
            cx={CX}
            cy={CY}
            r={37}
            fill="none"
            stroke="#ffd98a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="14 218"
            className="gyro-arc-b"
          />
        </g>
        <circle cx={CX} cy={CY} r={30} fill="rgba(3,14,30,0.92)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
        <g
          transform={`translate(${CX} ${CY}) scale(1.3) translate(-12 -12)`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#coreGlow)"
        >
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </g>
      </g>
    </svg>
  );
}
