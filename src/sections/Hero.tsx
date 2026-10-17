import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { siteConfig } from '../config/site.config'
import { marqueeWords } from '../data/skills'
import { Button } from '../components/Button'
import { HeroMesh } from '../components/HeroMesh'
import { useReducedMotion } from '../hooks/useMedia'

const HEADLINE: Array<Array<{ t: string; accent?: boolean }>> = [
  [
    { t: 'I build ' },
    { t: 'digital', accent: true },
  ],
  [{ t: 'experiences that' }],
  [{ t: 'feel ' }, { t: 'different.', accent: true }],
]

export function Hero({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!ready) return
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-hero]', { opacity: 1, y: 0, yPercent: 0 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.fromTo('[data-hero="lead"]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.05)
        .fromTo(
          '[data-hero-line]',
          { yPercent: 112 },
          { yPercent: 0, duration: 1.05, stagger: 0.085 },
          0.1,
        )
        .fromTo(
          '[data-hero="lede"]',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.42,
        )
        .fromTo(
          '[data-hero="actions"] > *',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
          0.52,
        )
        .fromTo(
          '[data-hero="meta"]',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 },
          0.62,
        )
        .fromTo(
          '[data-hero="strip"]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.7,
        )
    }, root)

    return () => ctx.revert()
  }, [ready, reduced])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <section
      ref={rootRef}
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col overflow-hidden pt-16 sm:pt-[4.5rem]"
    >
      {/* Ambient structure — a single hairline lattice, heavily faded */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hairline-grid opacity-[0.55]"
        style={{
          maskImage:
            'radial-gradient(115% 78% at 78% 18%, #000 0%, rgba(0,0,0,0.35) 45%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(115% 78% at 78% 18%, #000 0%, rgba(0,0,0,0.35) 45%, transparent 78%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-[100rem] flex-1 flex-col justify-center px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-y-14 lg:grid-cols-12 lg:gap-x-10">
          {/* ---- Copy column ---- */}
          <div className="lg:col-span-7">
            {siteConfig.availability && (
              <p
                data-hero="lead"
                className="mb-8 inline-flex items-center gap-2.5 border border-line px-3 py-1.5"
              >
                <span className="relative flex size-1.5" aria-hidden="true">
                  <span className="anim-pulse-dot absolute inline-flex size-full rounded-full bg-lime" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-lime" />
                </span>
                <span className="text-mono-label text-bone-dim">
                  {siteConfig.availability}
                </span>
              </p>
            )}

            <h1 className="text-display text-[clamp(2.25rem,9.5vw,4.25rem)] leading-[0.92] lg:text-[clamp(3.5rem,5.6vw,5.5rem)]">
              {HEADLINE.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <span data-hero-line className="block will-change-transform">
                    {line.map((word, j) => (
                      <span
                        key={j}
                        className={word.accent ? 'text-lime' : undefined}
                      >
                        {word.t}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </h1>

            <p
              data-hero="lede"
              className="mt-8 max-w-[46ch] text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base"
            >
              Full-stack web developer crafting fast, thoughtful, and interactive
              digital experiences with modern technologies.
            </p>

            <div data-hero="actions" className="mt-9 flex flex-wrap items-center gap-3">
              <Button as="a" href="#work" size="lg" magnetic onClick={go('work')}>
                Explore My Work
                <svg
                  viewBox="0 0 16 16"
                  className="size-3.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Button>
              <Button as="a" href="#contact" size="lg" variant="outline" onClick={go('contact')}>
                Let&rsquo;s Talk
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <p
                data-hero="meta"
                className="flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.16em] text-mute uppercase"
              >
                <span className="size-1 rounded-full bg-faint" aria-hidden="true" />
                {siteConfig.location.city}
                <span className="text-line">·</span>
                {siteConfig.location.worldwide}
              </p>
              <p
                data-hero="meta"
                className="flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.16em] text-faint uppercase"
              >
                <span className="hidden h-px w-6 bg-line sm:block" aria-hidden="true" />
                {siteConfig.meta.role}
              </p>
            </div>
          </div>

          {/* ---- Visual column ---- */}
          <div className="lg:col-span-5 lg:pl-4">
            <HeroMesh className="mx-auto w-full max-w-[30rem] lg:max-w-none" />
          </div>
        </div>
      </div>

      {/* ---- Bottom strip: scroll hint + marquee ---- */}
      <div
        data-hero="strip"
        className="relative border-t border-line-soft"
        aria-hidden="true"
      >
        <div className="mx-auto flex w-full max-w-[100rem] flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:gap-10 lg:px-12">
          <p className="flex shrink-0 items-center gap-3 font-mono text-[0.625rem] tracking-[0.24em] text-faint uppercase">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-line">
              <span className="anim-scroll-hint absolute inset-0 block w-px bg-lime" />
            </span>
          </p>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="su-marquee items-center gap-8">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex shrink-0 items-center gap-8 pr-8">
                  {marqueeWords.map((w) => (
                    <span
                      key={`${dup}-${w}`}
                      className="flex shrink-0 items-center gap-8 text-[0.8125rem] text-mute"
                    >
                      {w}
                      <span className="size-1 rotate-45 bg-lime/60" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
