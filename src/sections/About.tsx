import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SectionHeading } from '../components/SectionHeading'
import { RevealGroup, RevealMask } from '../components/Reveal'
import { personalDetails } from '../data/process'
import { useReducedMotion } from '../hooks/useMedia'

/** Syntax-coloured, hand-written excerpt used by the code window. */
const CODE: Array<Array<{ t: string; c?: string }>> = [
  [
    { t: 'export ', c: 'kw' },
    { t: 'const ', c: 'kw' },
    { t: 'build', c: 'fn' },
    { t: ' = ' },
    { t: 'async ', c: 'kw' },
    { t: '(' },
    { t: 'idea', c: 'var' },
    { t: ': ', c: 'p' },
    { t: 'string', c: 'ty' },
    { t: ') ' },
    { t: '=>', c: 'p' },
  ],
  [
    { t: '  ' },
    { t: 'const ', c: 'kw' },
    { t: 'stack ', c: 'var' },
    { t: '= [' },
    { t: "'React'", c: 'str' },
    { t: ', ' },
    { t: "'Node'", c: 'str' },
    { t: ', ' },
    { t: "'MongoDB'", c: 'str' },
    { t: ']' },
  ],
  [{ t: '  ' }, { t: 'return ', c: 'kw' }, { t: 'stack' }, { t: '.map' }, { t: '(render)', c: 'fn' }, { t: ')' }],
  [{ t: '}' }],
]

/* Colours come from scheme-aware tokens so the code window stays readable
   on both light and dark. */
const TOKEN: Record<string, string> = {
  kw: 'text-[var(--c-code-kw)]',
  fn: 'text-[var(--c-code-fn)]',
  str: 'text-[var(--c-code-str)]',
  ty: 'text-[var(--c-code-ty)]',
  var: 'text-[var(--c-code-var)]',
  p: 'text-mute',
}

function CodeWindow() {
  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const bar = barRef.current
    if (!root || !bar) return

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-mesh]', { opacity: 1, scaleX: 1 })
        gsap.set(bar, { left: '72%' })
        return
      }

      // A single scan line crossing the panel — reads as "actively building".
      gsap.fromTo(
        bar,
        { left: '-12%' },
        { left: '104%', duration: 3.6, ease: 'power1.inOut', repeat: -1, repeatDelay: 1.8 },
      )
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <div
      ref={rootRef}
      className="@container relative overflow-hidden border border-line bg-ink"
    >
      {/* chrome */}
      <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <i className="block size-2 rounded-full bg-line" />
          <i className="block size-2 rounded-full bg-line" />
          <i className="block size-2 rounded-full bg-lime/70" />
        </span>
        <span className="font-mono text-[0.5625rem] tracking-[0.18em] text-faint uppercase sm:text-[0.625rem]">
          developer.js
        </span>
      </div>

      <div className="relative px-4 py-5 sm:px-5 sm:py-6">
        <pre className="overflow-x-auto font-mono text-[0.6875rem] leading-[1.75] sm:text-[0.75rem]">
          <code>
            {CODE.map((line, i) => (
              <span key={i} className="block whitespace-pre" data-reveal="fade">
                <span className="mr-4 inline-block w-4 select-none text-right text-line">
                  {i + 1}
                </span>
                {line.map((tok, j) => (
                  <span key={j} className={TOKEN[tok.c ?? ''] ?? 'text-bone-dim'}>
                    {tok.t}
                  </span>
                ))}
                {i === CODE.length - 1 && (
                  <span className="anim-caret ml-0.5 inline-block h-3.5 w-[0.4em] translate-y-[0.15em] bg-lime" />
                )}
              </span>
            ))}
          </code>
        </pre>
      </div>

      <span
        ref={barRef}
        aria-hidden="true"
        className="su-scan pointer-events-none absolute inset-y-0 left-0 w-16"
      />

      <div className="flex items-center justify-between border-t border-line-soft px-4 py-2.5 sm:px-5">
        <span className="font-mono text-[0.5625rem] tracking-[0.18em] text-faint uppercase sm:text-[0.625rem]">
          JavaScript
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[0.5625rem] tracking-[0.18em] text-lime uppercase sm:text-[0.625rem]">
          <i className="size-1.5 rounded-full bg-lime" />
          Building
        </span>
      </div>
    </div>
  )
}

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative scroll-mt-24 border-t border-line-soft"
    >
      <div className="mx-auto w-full max-w-[100rem] px-5 pt-24 sm:px-8 sm:pt-32 lg:px-12 lg:pt-40">
        <SectionHeading
          id="about-title"
          index="02"
          label="About"
          title={
            <>
              Curious by nature.
              <br />
              Developer by choice.
            </>
          }
        />

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 lg:mt-20 lg:grid-cols-12">
          {/* ---- Narrative ---- */}
          <RevealGroup className="lg:col-span-7">
            <RevealMask className="max-w-[56ch]">
              <p className="text-[clamp(1.0625rem,2.1vw,1.375rem)] leading-[1.45] tracking-[-0.015em] text-bone">
                I&rsquo;m a Computer Science student and web developer who genuinely
                enjoys the part where a vague idea becomes something people can
                actually use.
              </p>
            </RevealMask>

            <div className="mt-8 max-w-[58ch] space-y-5 text-[0.9375rem] leading-relaxed text-bone-dim">
              <p data-reveal="up" data-reveal-delay={0.06}>
                Most of what I build starts with a practical problem — a business
                that needs a clearer website, a workflow that should not live in
                spreadsheets, an idea that needs an interface before it can be
                judged. I like taking those apart and putting them back together as
                something fast, responsive and easy to use.
              </p>
              <p data-reveal="up" data-reveal-delay={0.12}>
                My work sits across the stack. On the front end I care about
                typography, layout and the small interactions that make a page feel
                considered. On the back end I work with Node.js, Express and
                databases, wiring up real APIs rather than mocked ones. WordPress
                and custom builds are part of the toolkit too, because the right
                answer depends on what the project actually needs.
              </p>
              <p data-reveal="up" data-reveal-delay={0.18}>
                I&rsquo;m still a student, and I treat that as an advantage: I am
                learning quickly, taking feedback well, and spending the extra
                hours getting the details right. Right now I&rsquo;m going deep on
                the MERN stack and modern front-end tooling, and I intend to keep
                improving long after any single project ships.
              </p>
            </div>

            {/* ---- Details list ---- */}
            <dl
              data-reveal="up"
              data-reveal-delay={0.24}
              className="mt-12 divide-y divide-line-soft border-y border-line-soft"
            >
              {personalDetails.map((d) => (
                <div
                  key={d.label}
                  className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                >
                  <dt className="font-mono text-[0.625rem] tracking-[0.2em] text-faint uppercase sm:col-span-4">
                    {d.label}
                  </dt>
                  <dd className="text-[0.9375rem] text-bone sm:col-span-8">
                    {d.value}
                  </dd>
                </div>
              ))}
            </dl>
          </RevealGroup>

          {/* ---- Visual ---- */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div data-reveal="up" data-reveal-delay={0.1} className="lg:sticky lg:top-28">
              <CodeWindow />

              <div className="mt-6 grid grid-cols-2 gap-px border border-line bg-line">
                {[
                  ['Focus', 'Full-Stack'],
                  ['Stack', 'MERN'],
                  ['Based in', 'Pakistan'],
                  ['Learning', 'Daily'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-void px-4 py-4">
                    <p className="font-mono text-[0.5625rem] tracking-[0.2em] text-faint uppercase">
                      {k}
                    </p>
                    <p className="mt-2 text-[0.875rem] text-bone">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
