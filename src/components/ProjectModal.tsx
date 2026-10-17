import { useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import type { Project } from '../data/projects'
import { ProjectMockup } from './ProjectMockup'
import { useLockBodyScroll, useReducedMotion } from '../hooks/useMedia'
import { Button } from './Button'

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

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

interface Props {
  project: Project | null
  onClose: () => void
}

/**
 * Accessible case-study panel: focus is trapped, Escape and backdrop clicks
 * close it, body scroll is locked, and focus returns to the trigger.
 */
export function ProjectModal({ project, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  useLockBodyScroll(Boolean(project))

  useEffect(() => {
    if (!project) return

    restoreRef.current = document.activeElement as HTMLElement | null

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables.length) return
      const first = focusables[0]!
      const last = focusables[focusables.length - 1]!

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)

    const ctx = gsap.context(() => {
      if (reduced) return
      gsap
        .timeline()
        .fromTo(backdropRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28 })
        .fromTo(
          panelRef.current,
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' },
          0.04,
        )
    })

    const t = window.setTimeout(() => closeRef.current?.focus(), 60)

    return () => {
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      ctx.revert()
      restoreRef.current?.focus?.()
    }
  }, [project, onClose, reduced])

  const onBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) onClose()
    },
    [onClose],
  )

  if (!project) return null

  return (
    <div
      ref={backdropRef}
      onClick={onBackdrop}
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto overscroll-contain bg-void/85 px-4 py-6 backdrop-blur-md sm:px-6 sm:py-10"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="su-modal-title"
        className="su-panel-shadow relative w-full max-w-4xl border border-line bg-ink"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center border border-line bg-ink/80 text-bone backdrop-blur-sm transition-colors duration-300 hover:border-lime hover:text-lime"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>

        <div className="p-4 sm:p-6">
          <ProjectMockup project={project} />

          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-3 font-mono text-[0.625rem] tracking-[0.24em] text-faint uppercase">
                <span className="text-lime">{project.index}</span>
                <span className="h-px w-8 bg-line" aria-hidden="true" />
                {project.kicker}
              </p>
              <h3
                id="su-modal-title"
                className="mt-4 text-display text-[clamp(1.75rem,5vw,2.75rem)]"
              >
                {project.name}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-bone-dim">
                {project.details}
              </p>

              <ul className="mt-6 space-y-2.5">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[0.875rem] text-bone-dim">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1 shrink-0 rotate-45 bg-lime"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <dl className="divide-y divide-line-soft border-y border-line-soft">
                {[
                  ['Role', project.role],
                  ['Year', project.year],
                  ['Status', project.liveUrl ? 'Live' : 'Academic project'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="font-mono text-[0.625rem] tracking-[0.2em] text-faint uppercase">
                      {k}
                    </dt>
                    <dd className="text-right text-[0.875rem] text-bone">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 font-mono text-[0.625rem] tracking-[0.2em] text-faint uppercase">
                Stack
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <li
                    key={t}
                    className="border border-line px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.06em] text-bone-dim"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-2.5">
                {project.liveUrl ? (
                  <Button
                    as="a"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="md"
                  >
                    Visit live site
                    <ArrowOut className="size-3.5" />
                  </Button>
                ) : (
                  <p className="border border-dashed border-line px-4 py-3 font-mono text-[0.6875rem] leading-relaxed tracking-[0.08em] text-mute">
                    Not publicly deployed. This is an academic project kept private
                    to the university.
                  </p>
                )}

                {project.secondary && (
                  <Button
                    as="a"
                    href={project.secondary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="md"
                  >
                    {project.secondary.label}
                    <ArrowOut className="size-3.5" />
                  </Button>
                )}
              </div>

              {project.note && (
                <p className="mt-5 border-l-2 border-lime/50 pl-3 font-mono text-[0.6875rem] leading-relaxed text-faint">
                  {project.note}
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="flex items-center gap-2 border-t border-line-soft px-4 py-3 font-mono text-[0.625rem] tracking-[0.18em] text-faint uppercase sm:px-6">
          <ArrowRight className="size-3 text-lime" />
          Esc to close
        </p>
      </div>
    </div>
  )
}
