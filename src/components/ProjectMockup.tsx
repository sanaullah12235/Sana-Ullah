import type { Project } from '../data/projects'
import { cn } from '../lib/cn'

/* ==========================================================================
 * Project artwork — INTENTIONAL FIXED PALETTES
 * --------------------------------------------------------------------------
 * Everything below this line hardcodes its colours on purpose. These are
 * stand-ins for the *brands of the four external websites* (a cream salon, a
 * graphite contractor, a blue agency, a slate portal), not for this site, so
 * they must NOT follow the light/dark scheme — flipping them would make each
 * preview misrepresent the project it is showing.
 *
 * The surrounding BrowserFrame chrome does use theme tokens and does flip.
 * Anything styling this page's own surfaces belongs above this line.
 * ========================================================================== */

/* ==========================================================================
 * BrowserFrame — shared chrome around every project composition.
 * A container query makes the internals scale with the frame width, so the
 * artwork stays crisp at any size without shipping a single image.
 * ========================================================================== */

function BrowserFrame({
  address,
  theme,
  children,
  className,
}: {
  address: string
  theme: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        '@container relative overflow-hidden rounded-[3px] border border-line bg-surface',
        className,
      )}
      data-mockup-theme={theme}
    >
      {/* Chrome */}
      <div className="relative z-2 flex items-center gap-2 border-b border-line bg-ink/85 px-3 py-2 backdrop-blur-[2px] sm:px-4 sm:py-2.5">
        <span className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <i className="block size-2 rounded-full bg-line sm:size-2.5" />
          <i className="block size-2 rounded-full bg-line sm:size-2.5" />
          <i className="block size-2 rounded-full bg-lime/70 sm:size-2.5" />
        </span>
        <span className="mx-auto flex min-w-0 max-w-[62%] items-center gap-1.5 truncate rounded-[2px] border border-line-soft bg-void/70 px-2 py-1 font-mono text-[0.5625rem] tracking-[0.08em] text-faint sm:text-[0.625rem]">
          <svg
            viewBox="0 0 12 12"
            className="size-2.5 shrink-0"
            fill="none"
            aria-hidden="true"
          >
            <rect x="2.6" y="5" width="6.8" height="5" rx="0.8" stroke="currentColor" />
            <path d="M4 5V3.6a2 2 0 0 1 4 0V5" stroke="currentColor" />
          </svg>
          <span className="truncate">{address}</span>
        </span>
      </div>
      {/* Viewport */}
      <div className="relative">{children}</div>
    </div>
  )
}

/* --- tiny primitives ------------------------------------------------------ */

const Bar = ({
  w,
  h = '0.5cqw',
  tone = 'soft',
  className,
}: {
  w: string
  h?: string
  tone?: 'soft' | 'dim' | 'strong'
  className?: string
}) => {
  const map = {
    soft: 'bg-current/12',
    dim: 'bg-current/22',
    strong: 'bg-current/70',
  }
  return (
    <span
      aria-hidden="true"
      className={cn('block rounded-full', map[tone], className)}
      style={{ width: w, height: h }}
    />
  )
}

/* ==========================================================================
 * 01 — Kasa Bella Salon & Spa  ·  warm editorial, light surface
 * ========================================================================== */

function SalonArt() {
  return (
    <div
      data-palette="cream"
      className="relative aspect-16/10 w-full overflow-hidden bg-[#F4F1EA] text-[#17150F] [--cream-line:#D8D2C4]"
    >
      {/* Faint concentric arcs, standing in for editorial photography */}
      <svg
        className="pointer-events-none absolute -top-[18%] right-[-8%] h-[115%] w-[58%] text-[#C9C2AE]"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        {[92, 76, 60, 44, 28].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} stroke="currentColor" strokeWidth="0.5" />
        ))}
        <circle cx="100" cy="100" r="16" fill="currentColor" opacity="0.5" />
      </svg>

      <div className="relative z-1 flex h-full flex-col justify-between p-[5cqw]">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[1.5cqw] uppercase tracking-[0.34em] text-[#17150F]">
            Kasa&nbsp;Bella
          </span>
          <span className="hidden gap-[2.4cqw] font-mono text-[1.15cqw] uppercase tracking-[0.2em] text-[#6B6455] sm:flex">
            <span>Services</span>
            <span>About</span>
            <span>Contact</span>
          </span>
          <span className="border border-[#17150F]/20 px-[1.5cqw] py-[0.6cqw] font-mono text-[1cqw] uppercase tracking-[0.18em] sm:hidden">
            Menu
          </span>
        </div>

        <div className="flex items-end justify-between gap-[4cqw]">
          {/* Wordmark */}
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[1.1cqw] uppercase tracking-[0.3em] text-[#8A8272]">
              Salon &amp; Spa
            </p>
            <h4
              className="mt-[1.2cqw] text-[6.4cqw] leading-[0.86] font-medium tracking-[-0.04em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Quiet
              <br />
              luxury,
              <br />
              <span className="italic">daily.</span>
            </h4>
            <div className="mt-[2.4cqw] flex max-w-[62%] flex-col gap-[0.7cqw]">
              <Bar w="100%" h="0.5cqw" tone="dim" />
              <Bar w="88%" h="0.5cqw" tone="soft" />
              <Bar w="64%" h="0.5cqw" tone="soft" />
            </div>
            <div className="mt-[2.6cqw] flex items-center gap-[1.4cqw]">
              <span className="bg-[#17150F] px-[1.8cqw] py-[1cqw] font-mono text-[1cqw] uppercase tracking-[0.16em] text-[#F4F1EA]">
                Book now
              </span>
              <span className="font-mono text-[1cqw] uppercase tracking-[0.16em] text-[#6B6455]">
                View services
              </span>
            </div>
          </div>

          {/* Service rail */}
          <div className="hidden w-[26%] shrink-0 border-l border-[#17150F]/12 pl-[2.4cqw] sm:block">
            {['Hair', 'Skin', 'Nails', 'Massage'].map((s, i) => (
              <div
                key={s}
                className="flex items-baseline justify-between border-b border-[#17150F]/10 py-[1.5cqw] last:border-0"
              >
                <span className="text-[1.5cqw] tracking-[-0.01em]">{s}</span>
                <span className="font-mono text-[1cqw] text-[#8A8272]">
                  0{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
 * 02 — Dubai Prime Technical  ·  graphite + amber, sidebar layout
 * ========================================================================== */

function TechnicalArt() {
  return (
    <div
      data-palette="graphite"
      className="relative aspect-16/10 w-full overflow-hidden bg-[#14161A] text-[#E8EAF0]"
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="hidden w-[19%] shrink-0 flex-col justify-between border-r border-[#282C33] bg-[#101216] p-[1.8cqw] sm:flex">
          <div className="flex items-center gap-[0.9cqw]">
            <span className="grid size-[2.2cqw] place-items-center border border-[#D8A24A]/60 text-[1.1cqw] text-[#D8A24A]">
              D
            </span>
            <span className="font-mono text-[1.1cqw] uppercase tracking-[0.16em]">
              Prime
            </span>
          </div>
          <ul className="flex flex-col gap-[1.5cqw]">
            {['Home', 'Services', 'Projects', 'About', 'Contact'].map((s, i) => (
              <li
                key={s}
                className={
                  i === 1
                    ? 'border-l-2 border-[#D8A24A] pl-[1cqw] text-[#D8A24A]'
                    : 'border-l-2 border-transparent pl-[1cqw] text-[#7C828C]'
                }
                style={{ fontSize: '1.25cqw' }}
              >
                {s}
              </li>
            ))}
          </ul>
          <p className="font-mono text-[0.95cqw] leading-relaxed text-[#5A606A]">
            Dubai, UAE
            <br />
            Est. 2019
          </p>
        </aside>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between p-[2.4cqw] sm:p-[3cqw]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.95cqw] uppercase tracking-[0.24em] text-[#7C828C]">
              Villa maintenance &amp; renovation
            </span>
            <span className="hidden items-center gap-[0.7cqw] border border-[#282C33] px-[1.4cqw] py-[0.7cqw] font-mono text-[0.95cqw] text-[#C9CED8] sm:flex">
              Get a quote
            </span>
          </div>

          <div className="grid grid-cols-1 items-end gap-[2.4cqw] sm:grid-cols-[1.15fr_1fr]">
            <div>
              <h4
                className="text-[4.6cqw] leading-[0.9] font-medium tracking-[-0.04em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Built to
                <br />
                last. <span className="text-[#D8A24A]">Maintained</span>
                <br />
                to last.
              </h4>
              <div className="mt-[2cqw] flex max-w-[90%] flex-col gap-[0.65cqw]">
                <Bar w="100%" h="0.45cqw" tone="soft" />
                <Bar w="82%" h="0.45cqw" tone="soft" />
              </div>
            </div>

            {/* Abstract technical elevation drawing */}
            <div className="relative aspect-4/3 w-full overflow-hidden border border-[#282C33] bg-[#181B20] p-[1.6cqw]">
              <svg
                viewBox="0 0 120 90"
                className="h-full w-full text-[#4A5058]"
                fill="none"
                aria-hidden="true"
              >
                <path d="M6 82h108" stroke="currentColor" strokeWidth="0.7" />
                <path d="M14 82V30l24-16 26 14v54" stroke="currentColor" strokeWidth="0.7" />
                <path d="M38 14v68" stroke="currentColor" strokeWidth="0.5" />
                <path d="M64 28l22-12 26 12v54" stroke="currentColor" strokeWidth="0.7" />
                <path d="M86 16v66" stroke="currentColor" strokeWidth="0.5" />
                <path d="M112 28V82" stroke="currentColor" strokeWidth="0.5" />
                {[
                  [22, 40],
                  [22, 56],
                  [22, 70],
                  [72, 38],
                  [72, 54],
                  [72, 68],
                  [98, 36],
                  [98, 52],
                ].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="9" height="8" stroke="currentColor" strokeWidth="0.45" />
                ))}
                <path d="M6 8h108" stroke="#D8A24A" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.7" />
              </svg>
              <span className="absolute bottom-[1.2cqw] left-[1.6cqw] font-mono text-[0.9cqw] tracking-[0.14em] text-[#5A606A]">
                FIG. 02
              </span>
            </div>
          </div>

          {/* Service tiles */}
          <div className="mt-[2.4cqw] hidden grid-cols-3 gap-[1.2cqw] sm:grid">
            {['HVAC', 'Painting', 'Electrical'].map((t, i) => (
              <div
                key={t}
                className="flex items-center justify-between border border-[#282C33] px-[1.4cqw] py-[1.2cqw]"
              >
                <span className="text-[1.35cqw]">{t}</span>
                <span className="font-mono text-[1cqw] text-[#D8A24A]">0{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
 * 03 — VexoraTech  ·  type-led agency layout, near-black + electric blue
 * ========================================================================== */

function AgencyArt() {
  return (
    <div
      data-palette="agency"
      className="relative aspect-16/10 w-full overflow-hidden bg-[#0A0B0F] text-[#F2F4F8] [--a-blue:#4C7DFF]"
    >
      {/* Large offset circle, flat fill — no glow */}
      <div
        aria-hidden="true"
        className="absolute -right-[10%] -top-[34%] aspect-square w-[52%] rounded-full border border-[#4C7DFF]/25"
      />
      <div
        aria-hidden="true"
        className="absolute -right-[4%] -top-[26%] aspect-square w-[36%] rounded-full bg-[#4C7DFF]/12"
      />

      <div className="relative flex h-full flex-col justify-between p-[3cqw]">
        <div className="flex items-center justify-between">
          <span
            className="text-[2.2cqw] font-medium tracking-[-0.04em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Vexora<span className="text-[#4C7DFF]">Tech</span>
          </span>
          <span className="hidden font-mono text-[1cqw] uppercase tracking-[0.2em] text-[#6C7280] sm:block">
            Work · Services · Studio · Contact
          </span>
        </div>

        <div className="grid grid-cols-1 items-end gap-[3cqw] sm:grid-cols-[1.4fr_1fr]">
          <div>
            <h4
              className="text-[5.2cqw] leading-[0.9] font-medium tracking-[-0.045em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              We build
              <br />
              the web
              <br />
              <span className="text-[#4C7DFF]">layer.</span>
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-[1cqw]">
            {[
              ['Web development', '01'],
              ['UI / UX design', '02'],
              ['E-commerce', '03'],
              ['Maintenance', '04'],
            ].map(([t, n]) => (
              <div
                key={t}
                className="border border-[#1E212A] bg-[#0E1015] p-[1.3cqw]"
              >
                <span className="font-mono text-[0.9cqw] text-[#4C7DFF]">{n}</span>
                <p className="mt-[0.7cqw] text-[1.35cqw] leading-tight">{t}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#1E212A] pt-[1.6cqw]">
          <span className="font-mono text-[1cqw] uppercase tracking-[0.24em] text-[#6C7280]">
            Strategy · Design · Code
          </span>
          <span className="font-mono text-[1cqw] text-[#4C7DFF]">Start a project →</span>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
 * 04 — HITEC University Portal  ·  slate dashboard, four role surfaces
 * ========================================================================== */

function StatTile({
  label,
  value,
  delta,
  accent,
}: {
  label: string
  value: string
  delta: string
  accent?: boolean
}) {
  return (
    <div className="border border-[#28303B] bg-[#141A22] p-[1.5cqw]">
      <p className="font-mono text-[0.9cqw] uppercase tracking-[0.18em] text-[#6D7987]">
        {label}
      </p>
      <div className="mt-[0.8cqw] flex items-baseline gap-[0.9cqw]">
        <span className="text-[2.6cqw] leading-none font-medium tracking-[-0.03em]">
          {value}
        </span>
        <span
          className={
            accent ? 'font-mono text-[0.95cqw] text-[#5CE0C4]' : 'font-mono text-[0.95cqw] text-[#6D7987]'
          }
        >
          {delta}
        </span>
      </div>
    </div>
  )
}

function PortalArt() {
  return (
    <div
      data-palette="portal"
      className="relative aspect-16/10 w-full overflow-hidden bg-[#0F141A] text-[#E4EAF2] [--p-line:#28303B] [--p-cyan:#5CE0C4]"
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="hidden w-[15%] shrink-0 flex-col justify-between border-r border-[#28303B] bg-[#0C1116] p-[1.6cqw] sm:flex">
          <div className="flex items-center gap-[0.8cqw]">
            <span className="grid size-[2cqw] place-items-center bg-[#5CE0C4] text-[1cqw] font-bold text-[#0C1116]">
              H
            </span>
            <span className="font-mono text-[0.95cqw] uppercase tracking-[0.14em] text-[#8A94A2]">
              Portal
            </span>
          </div>
          <ul className="flex flex-col gap-[1.2cqw]">
            {['Dashboard', 'Courses', 'Library', 'Admin', 'Users'].map((s, i) => (
              <li
                key={s}
                className={
                  i === 0
                    ? 'bg-[#182029] px-[1cqw] py-[0.7cqw] text-[#5CE0C4]'
                    : 'px-[1cqw] py-[0.7cqw] text-[#5E6875]'
                }
                style={{ fontSize: '1.15cqw' }}
              >
                {s}
              </li>
            ))}
          </ul>
          <p className="font-mono text-[0.85cqw] leading-relaxed text-[#4E5763]">
            Academic
            <br />
            project
          </p>
        </aside>

        {/* Dashboard */}
        <div className="flex min-w-0 flex-1 flex-col gap-[1.4cqw] p-[1.8cqw] sm:p-[2.2cqw]">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-[#28303B] pb-[1.2cqw]">
            <div>
              <p className="font-mono text-[0.9cqw] uppercase tracking-[0.2em] text-[#5E6875]">
                Student dashboard
              </p>
              <p className="mt-[0.4cqw] text-[1.7cqw] tracking-[-0.02em]">
                Welcome back
              </p>
            </div>
            <div className="flex items-center gap-[0.8cqw]">
              <span className="hidden h-[2cqw] w-[9cqw] border border-[#28303B] bg-[#141A22] sm:block" />
              <span className="grid size-[2.2cqw] place-items-center rounded-full bg-[#253040] font-mono text-[0.95cqw] text-[#8A94A2]">
                SU
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-[1.1cqw]">
            <StatTile label="Enrolled" value="1,284" delta="+4.2%" accent />
            <StatTile label="Books out" value="46" delta="due Fri" />
            <StatTile label="GPA" value="3.62" delta="sem 5" />
          </div>

          {/* Chart + list */}
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-[1.1cqw] sm:grid-cols-[1.25fr_1fr]">
            <div className="flex min-h-0 flex-col border border-[#28303B] bg-[#141A22] p-[1.5cqw]">
              <p className="font-mono text-[0.9cqw] uppercase tracking-[0.18em] text-[#6D7987]">
                Attendance
              </p>
              <div className="mt-auto flex h-[58%] items-end gap-[0.7cqw] pt-[1cqw]">
                {[42, 66, 54, 78, 62, 88, 71, 94, 80, 100, 86, 96].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t-[1px] bg-[#2C3A4A]"
                    style={{ height: `${h}%` }}
                  >
                    {i === 9 && (
                      <span className="block h-full w-full rounded-t-[1px] bg-[#5CE0C4]" />
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex min-h-0 flex-col gap-[0.7cqw]">
              {['CS-401 Database Systems', 'CS-315 Web Engineering', 'CS-220 HCI'].map(
                (c, i) => (
                  <div
                    key={c}
                    className="flex items-center justify-between border border-[#28303B] bg-[#141A22] px-[1.3cqw] py-[0.9cqw]"
                  >
                    <span className="truncate text-[1.15cqw] text-[#C3CCDA]">{c}</span>
                    <span
                      className={
                        i === 1
                          ? 'ml-[0.8cqw] shrink-0 font-mono text-[0.9cqw] text-[#5CE0C4]'
                          : 'ml-[0.8cqw] shrink-0 font-mono text-[0.9cqw] text-[#5E6875]'
                      }
                    >
                      {i === 1 ? 'A' : i === 0 ? 'A-' : 'B+'}
                    </span>
                  </div>
                ),
              )}
              <div className="mt-auto flex items-center justify-between border border-dashed border-[#28303B] px-[1.3cqw] py-[0.9cqw]">
                <span className="font-mono text-[0.9cqw] uppercase tracking-[0.14em] text-[#5E6875]">
                  Librarian
                </span>
                <span className="font-mono text-[0.9cqw] text-[#5CE0C4]">12 pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
 * Public API
 * ========================================================================== */

const palettes: Record<Project['mockup'], string> = {
  salon: 'cream',
  technical: 'graphite',
  agency: 'agency',
  portal: 'portal',
}

export function ProjectMockup({
  project,
  className,
}: {
  project: Project
  className?: string
}) {
  // A real screenshot always wins when one has been added to /public/shots.
  if (project.screenshot) {
    return (
      <BrowserFrame
        address={project.address}
        theme={palettes[project.mockup]}
        className={className}
      >
        <img
          src={project.screenshot}
          alt={`Screenshot of ${project.name}`}
          loading="lazy"
          decoding="async"
          width={1600}
          height={1000}
          className="aspect-16/10 w-full object-cover"
        />
      </BrowserFrame>
    )
  }

  return (
    <BrowserFrame
      address={project.address}
      theme={palettes[project.mockup]}
      className={className}
    >
      {project.mockup === 'salon' && <SalonArt />}
      {project.mockup === 'technical' && <TechnicalArt />}
      {project.mockup === 'agency' && <AgencyArt />}
      {project.mockup === 'portal' && <PortalArt />}
    </BrowserFrame>
  )
}
