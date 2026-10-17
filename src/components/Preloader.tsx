import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { siteConfig } from '../config/site.config'
import { useReducedMotion } from '../hooks/useMedia'

/**
 * Short, tasteful entrance curtain. Deliberately short (≈1.4s) and skipped
 * entirely under reduced-motion so nobody waits on a decoration.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [gone, setGone] = useState(false)
  const reduced = useReducedMotion()

  /* Under reduced motion the curtain is pure decoration, so it is never
     rendered at all — the hero just starts on its final state. */
  useEffect(() => {
    if (!reduced) return
    const t = window.setTimeout(() => {
      setGone(true)
      onDone()
    }, 60)
    return () => window.clearTimeout(t)
  }, [reduced, onDone])

  useEffect(() => {
    if (reduced) return

    const root = rootRef.current
    if (!root) return

    const counter = { v: 0 }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setGone(true)
          onDone()
        },
      })

      tl.to(counter, {
        v: 100,
        duration: 1.15,
        ease: 'power2.inOut',
        onUpdate: () => setCount(Math.round(counter.v)),
      })
        .to('[data-pre-bar]', { scaleX: 1, duration: 1.15, ease: 'power2.inOut' }, 0)
        .to('[data-pre-mark]', { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 0.15)
        .to('[data-pre-meta]', { opacity: 1, duration: 0.4 }, 0.4)
        .to(root, {
          yPercent: -100,
          duration: 0.85,
          ease: 'expo.inOut',
          delay: 0.12,
        })
    }, root)

    return () => ctx.revert()
  }, [reduced, onDone])

  if (gone || reduced) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-void px-5 py-6 sm:px-8 sm:py-8"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between">
        <span className="text-display text-[1.0625rem] leading-none tracking-[-0.02em] text-bone opacity-0 sm:text-[1.1875rem]">
          SANA<span className="text-lime">.</span>
        </span>
        <span
          data-pre-meta
          className="font-mono text-[0.5625rem] tracking-[0.24em] text-faint opacity-0 uppercase sm:text-[0.625rem]"
        >
          {siteConfig.meta.role}
        </span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <span
          data-pre-mark
          className="text-display translate-y-3 text-[clamp(2.5rem,13vw,9rem)] leading-[0.85] text-bone opacity-0"
        >
          Portfolio
        </span>
        <span
          data-pre-meta
          className="font-mono text-[clamp(1.5rem,6vw,3rem)] leading-none tabular-nums text-lime opacity-0"
        >
          {String(count).padStart(3, '0')}
        </span>
      </div>

      <div className="h-px w-full bg-line">
        <div data-pre-bar className="h-px w-full origin-left scale-x-0 bg-lime" />
      </div>
    </div>
  )
}
