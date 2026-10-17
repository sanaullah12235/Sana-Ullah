import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { processSteps } from '../data/process'
import { SectionHeading } from '../components/SectionHeading'
import { useReducedMotion } from '../hooks/useMedia'

/**
 * Four-step approach, laid out as an editorial timeline. A rail on the left
 * fills as the sequence is scrolled through, tying the four steps into one
 * continuous process instead of four separate blocks.
 */
export function Process() {
  const rootRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const fill = fillRef.current
    if (!root || !fill || reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top 72%',
            end: 'bottom 78%',
            scrub: 0.4,
          },
        },
      )

      /* Node colour is left to CSS (`.su-rail-node.is-on`) so it always
         matches the active scheme. GSAP only handles the scale. */
      for (const node of root.querySelectorAll<HTMLElement>('[data-node]')) {
        gsap.fromTo(
          node,
          { scale: 0.4 },
          {
            scale: 1,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: node,
              start: 'top 82%',
              once: true,
              onEnter: () => node.classList.add('is-on'),
            },
          },
        )
      }
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      aria-labelledby="process-title"
      className="relative scroll-mt-24 border-t border-line-soft"
    >
      <div className="mx-auto w-full max-w-[100rem] px-5 pt-24 sm:px-8 sm:pt-32 lg:px-12 lg:pt-40">
        <SectionHeading
          id="process-title"
          index="04"
          label="Process"
          title={
            <>
              A process that
              <br />
              keeps things honest.
            </>
          }
          lede="The same four steps on every project, whether it is a one-page site or a full application. It keeps the work predictable and the feedback useful."
        />

        <div className="mt-16 grid grid-cols-1 gap-x-10 sm:mt-24 lg:grid-cols-12">
          {/* ---- Rail ---- */}
          <div className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-32 flex items-center gap-5">
              <span className="relative block h-64 w-px bg-line-soft">
                <span
                  ref={fillRef}
                  className="absolute inset-0 block w-px origin-top bg-lime"
                  style={{ transform: 'scaleY(0)' }}
                />
              </span>
              <p className="text-mono-label text-faint [writing-mode:vertical-rl]">
                How I work
              </p>
            </div>
          </div>

          {/* ---- Steps ---- */}
          <div ref={rootRef} className="lg:col-span-9 lg:col-start-4">
            <ol className="border-t border-line">
              {processSteps.map((step) => (
                <li
                  key={step.index}
                  data-reveal-group
                  className="group/step relative border-b border-line"
                >
                  <div className="grid grid-cols-1 items-baseline gap-x-8 gap-y-3 py-9 sm:py-12 lg:grid-cols-12">
                    <div className="flex items-center gap-4 lg:col-span-4">
                      <span
                        data-reveal="up"
                        aria-hidden="true"
                        className="su-outline-num text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.8] transition-[ -webkit-text-stroke-color] duration-700"
                      >
                        {step.index}
                      </span>
                      <span
                        data-node
                        aria-hidden="true"
                        className="su-rail-node block size-2 shrink-0 rounded-full ring-1 ring-line"
                      />
                    </div>

                    <div className="lg:col-span-4">
                      <h3
                        data-reveal="up"
                        data-reveal-delay={0.05}
                        className="text-display text-[clamp(1.5rem,3.6vw,2.125rem)] transition-colors duration-500 group-hover/step:text-lime"
                      >
                        {step.title}
                      </h3>
                      <p
                        data-reveal="up"
                        data-reveal-delay={0.08}
                        className="mt-1.5 font-mono text-[0.625rem] tracking-[0.2em] text-faint uppercase"
                      >
                        {step.tag}
                      </p>
                    </div>

                    <p
                      data-reveal="up"
                      data-reveal-delay={0.12}
                      className="max-w-[38ch] text-[0.9375rem] leading-relaxed text-bone-dim lg:col-span-4"
                    >
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
