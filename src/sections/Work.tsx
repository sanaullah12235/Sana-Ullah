import { useCallback, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { projects, type Project } from '../data/projects'
import { SectionHeading } from '../components/SectionHeading'
import { ProjectMockup } from '../components/ProjectMockup'
import { ProjectModal } from '../components/ProjectModal'
import { useReducedMotion } from '../hooks/useMedia'
import { cn } from '../lib/cn'

/* Per-project grid placement — the alternation is what makes this section feel
   art-directed rather than a stack of repeated cards. */
const LAYOUT: Record<
  Project['layout'],
  { text: string; media: string; ratio?: string }
> = {
  wide: {
    text: 'lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:pr-6',
    media: 'lg:col-span-8 lg:col-start-5 lg:row-start-1',
  },
  offset: {
    text: 'lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:pl-4',
    media: 'lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:mt-20',
  },
  compact: {
    text: 'lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-end lg:pb-4',
    media: 'lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:-mt-8',
  },
  bleed: {
    /* col-start-3 centres the 8-column copy inside the 12-column grid. Without
       it the copy sits hard against the left edge and leaves a ~450px void on
       the right, which reads as a layout mistake rather than a margin. */
    text: 'col-span-1 lg:col-span-8 lg:col-start-3',
    media: 'col-span-1 lg:col-span-12 lg:row-start-1',
  },
}

function ArrowOut({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M5.5 3.5H3.5v9h9v-2M9 2.5h4.5V7M13 3 7.5 8.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  )
}

function ProjectRow({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (p: Project) => void
}) {
  const mediaRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const spec = LAYOUT[project.layout]
  const isBleed = project.layout === 'bleed'

  /* Pointer-tracked tilt on the preview — a few pixels of depth, nothing more. */
  const onMove = (e: React.PointerEvent) => {
    if (reduced || !innerRef.current) return
    const r = mediaRef.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    gsap.to(innerRef.current, {
      rotateY: px * 3.2,
      rotateX: -py * 2.4,
      transformPerspective: 1400,
      duration: 0.7,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const onLeave = () => {
    if (!innerRef.current) return
    gsap.to(innerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.9,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  return (
    <article
      data-reveal-group
      className={cn(
        'grid grid-cols-1 gap-y-9 lg:grid-cols-12 lg:gap-x-10',
        isBleed && 'lg:grid-rows-2',
      )}
    >
      {/* ---- Media ---- */}
      <div
        ref={mediaRef}
        data-reveal="mask"
        data-reveal-delay={0.1}
        className={cn('group relative', spec.media)}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <button
          type="button"
          onClick={() => onOpen(project)}
          data-cursor="view"
          data-cursor-label="View details"
          aria-label={`Open case study details for ${project.name}`}
          className="block w-full text-left"
        >
          <div
            ref={innerRef}
            className="relative origin-center transition-transform duration-700 ease-[var(--ease-out-expo)] will-change-transform"
          >
            <ProjectMockup project={project} className="su-mockup" />
          </div>

          {/* Hover affordance */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-lime/45"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 flex translate-y-2 items-center gap-2 bg-lime px-3 py-1.5 font-mono text-[0.625rem] font-medium tracking-[0.16em] text-void uppercase opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100"
          >
            View details
          </span>
        </button>
      </div>

      {/* ---- Copy ---- */}
      <div
        data-reveal="up"
        data-reveal-delay={0}
        className={cn('flex flex-col', spec.text)}
      >
        <div data-reveal="up" className="flex items-end justify-between gap-6">
          <span
            aria-hidden="true"
            className="su-outline-num text-[clamp(3rem,9vw,5.5rem)] leading-[0.75]"
          >
            {project.index}
          </span>
          <span
            data-reveal="up"
            data-reveal-delay={0.05}
            className="mb-1.5 shrink-0 font-mono text-[0.625rem] tracking-[0.2em] text-faint uppercase"
          >
            {project.year}
          </span>
        </div>

        <div data-reveal="up" data-reveal-delay={0.06} className="mt-6 h-px w-full bg-line" />

        <p
          data-reveal="up"
          data-reveal-delay={0.08}
          className="mt-6 font-mono text-[0.625rem] tracking-[0.24em] text-lime uppercase"
        >
          {project.kicker}
        </p>

        <h3
          data-reveal="up"
          data-reveal-delay={0.12}
          className="mt-3 text-display text-[clamp(1.5rem,4vw,2.25rem)]"
        >
          {project.name}
        </h3>

        <p
          data-reveal="up"
          data-reveal-delay={0.16}
          className="mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed text-bone-dim"
        >
          {project.summary}
        </p>

        <ul
          data-reveal="up"
          data-reveal-delay={0.2}
          className="mt-6 flex flex-wrap gap-x-2 gap-y-1.5"
        >
          {project.tech.map((t) => (
            <li
              key={t}
              className="border border-line px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.04em] text-mute"
            >
              {t}
            </li>
          ))}
        </ul>

        <div
          data-reveal="up"
          data-reveal-delay={0.24}
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="group/link -my-1.5 inline-flex items-center gap-2 py-1.5 text-[0.875rem] text-bone"
            >
              <span className="relative">
                View Live
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-100 bg-lime transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/link:scale-x-0"
                />
              </span>
              <ArrowOut className="size-3.5 text-lime transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          ) : (
            <span className="font-mono text-[0.75rem] tracking-[0.06em] text-faint">
              Not publicly deployed
            </span>
          )}

          <button
            type="button"
            onClick={() => onOpen(project)}
            data-cursor="link"
            className="group/detail -my-1.5 inline-flex items-center gap-2 py-1.5 text-[0.875rem] text-bone-dim transition-colors duration-300 hover:text-bone"
          >
            <span className="relative">
              View Details
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-bone-dim transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/detail:scale-x-100"
              />
            </span>
            <svg
              viewBox="0 0 16 16"
              className="size-3.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/detail:translate-x-1"
              fill="none"
              aria-hidden="true"
            >
              <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        {project.note && (
          <p
            data-reveal="up"
            data-reveal-delay={0.28}
            className="mt-6 max-w-[46ch] border-l-2 border-line pl-3 font-mono text-[0.6875rem] leading-relaxed text-faint"
          >
            {project.note}
          </p>
        )}
      </div>
    </article>
  )
}

export function Work() {
  const [active, setActive] = useState<Project | null>(null)

  /* Must be stable: ProjectModal keys its focus-trap and open animation off
     this callback, and a fresh identity on every render would tear the modal
     down and rebuild it (stealing focus back to the trigger) each time. */
  const closeModal = useCallback(() => setActive(null), [])

  return (
    <section id="work" aria-labelledby="work-title" className="relative scroll-mt-24">
      <div className="mx-auto w-full max-w-[100rem] px-5 pt-24 pb-8 sm:px-8 sm:pt-32 lg:px-12 lg:pt-40">
        <SectionHeading
          id="work-title"
          index="01"
          label="Selected Work"
          title={
            <>
              Some things
              <br />
              I&rsquo;ve built.
            </>
          }
          lede="Four projects that show how I think about structure, typography and the small details that make a site feel finished."
        />

        <div className="mt-20 space-y-28 sm:mt-28 sm:space-y-36 lg:mt-36 lg:space-y-48">
          {projects.map((p) => (
            <ProjectRow key={p.slug} project={p} onOpen={setActive} />
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={closeModal} />
    </section>
  )
}
