import { useRef } from 'react'
import { skillGroups } from '../data/skills'
import { SectionHeading } from '../components/SectionHeading'
import { useReducedMotion } from '../hooks/useMedia'
import { cn } from '../lib/cn'

/**
 * Typographic skill index. Each group is a row in an editorial table rather
 * than a card: an index numeral, the discipline, a short descriptor and the
 * technologies set as a continuous list. A single lime marker follows the
 * pointer so hovering feels like moving a cursor over a printed index.
 */
export function Skills() {
  const rootRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return
    const root = rootRef.current
    const marker = markerRef.current
    if (!root || !marker) return
    const r = root.getBoundingClientRect()
    marker.style.transform = `translate3d(${e.clientY - r.top}px, 0, 0)`
  }

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative scroll-mt-24 border-t border-line-soft"
    >
      <div className="mx-auto w-full max-w-[100rem] px-5 pt-24 sm:px-8 sm:pt-32 lg:px-12 lg:pt-40">
        <SectionHeading
          id="skills-title"
          index="03"
          label="Skills"
          title={
            <>
              Tools I use to
              <br />
              bring ideas to life.
            </>
          }
          lede="A working toolkit, grouped the way I actually reach for it — from markup and CSS through to data, CMS and deployment."
        />

        <div
          ref={rootRef}
          onPointerMove={onMove}
          className="relative mt-16 sm:mt-24"
        >
          {/* Pointer marker — desktop only, purely decorative */}
          <span
            ref={markerRef}
            aria-hidden="true"
            className="pointer-events-none absolute -left-4 top-0 hidden h-px w-8 origin-left bg-lime lg:block"
          />

          <ul className="border-t border-line">
            {skillGroups.map((group) => (
              <li
                key={group.id}
                data-reveal-group
                className="group/row border-b border-line transition-colors duration-500 hover:bg-surface/60"
              >
                <div className="grid grid-cols-1 items-start gap-y-5 py-8 sm:grid-cols-12 sm:gap-x-8 sm:py-10">
                  <span
                    data-reveal="up"
                    className="font-mono text-[0.625rem] tracking-[0.2em] text-faint sm:col-span-1"
                  >
                    {group.index}
                  </span>

                  <div data-reveal="up" data-reveal-delay={0.05} className="sm:col-span-4">
                    <h3 className="text-display text-[clamp(1.375rem,3.4vw,2rem)]">
                      {group.title}
                    </h3>
                    <p className="mt-2 font-mono text-[0.6875rem] tracking-[0.1em] text-faint">
                      {group.note}
                    </p>
                  </div>

                  <ul
                    data-reveal="up"
                    data-reveal-delay={0.1}
                    className="flex flex-wrap items-baseline gap-x-5 gap-y-2 sm:col-span-7 sm:justify-end"
                  >
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className={cn(
                          'relative text-[clamp(1rem,2.4vw,1.375rem)] leading-tight tracking-[-0.02em] text-bone-dim',
                          'transition-colors duration-500 group-hover/row:text-bone',
                        )}
                      >
                        {item}
                        <span
                          aria-hidden="true"
                          className="absolute -left-3 top-1/2 size-1 -translate-y-1/2 rotate-45 bg-lime opacity-0 transition-opacity duration-500 group-hover/row:opacity-100"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
