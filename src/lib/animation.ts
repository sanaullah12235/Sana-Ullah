import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* GSAP's default `null` target warnings are noise for a portfolio. */
gsap.config({ nullTargetWarn: false })

/* Kill scroll-jacking behaviours GSAP could otherwise inherit. */
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
})

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* ---------------------------------------------------------------------------
 * Motion tokens — one vocabulary for the whole site.
 * ------------------------------------------------------------------------- */

export const EASE = {
  /** Entrances: decisive, no overshoot. */
  out: 'expo.out',
  /** Exits: quick and clean. */
  in: 'expo.in',
  /** Position changes. */
  smooth: 'power3.out',
} as const

export const D = {
  fast: 0.4,
  base: 0.7,
  slow: 1,
  slower: 1.3,
} as const

/* ---------------------------------------------------------------------------
 * Reveal helpers
 * ------------------------------------------------------------------------- */

/**
 * Marks an element as finished so the safety net never touches it again, and
 * drops its compositor hint — a `will-change` left behind after a one-shot
 * animation keeps the layer promoted for the life of the page.
 */
function markRevealed(el: Element) {
  el.setAttribute('data-revealed', '')
  if (el instanceof HTMLElement) el.style.willChange = 'auto'
}

/**
 * Animates every `[data-reveal]` inside `scope`, grouped by its nearest
 * `[data-reveal-group]` so lists stagger as a unit rather than per element.
 *
 * Returns a cleanup function that reverts everything it created. Without it,
 * StrictMode's double-invoked effect would leave two sets of ScrollTriggers on
 * the same elements and every reveal would run twice.
 */
export function initReveals(scope: Element | null = null): () => void {
  const root: ParentNode = scope ?? document
  const groups = Array.from(
    root.querySelectorAll<HTMLElement>('[data-reveal-group]'),
  )
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))

  if (!targets.length) return () => {}

  const reduced = prefersReducedMotion()

  if (reduced) {
    for (const el of targets) {
      el.style.removeProperty('opacity')
      el.style.removeProperty('clip-path')
      el.style.removeProperty('transform')
      el.style.removeProperty('will-change')
      markRevealed(el)
    }
    return () => {}
  }

  const ctx = gsap.context(() => {
    const inGroup = new Set<HTMLElement>()

    for (const group of groups) {
      const items = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal]'))
      if (!items.length) continue
      items.forEach((i) => inGroup.add(i))

      const tl = gsap.timeline({
        scrollTrigger: { trigger: group, start: 'top 86%', once: true },
        defaults: { ease: EASE.out },
        onComplete: () => items.forEach(markRevealed),
      })

      for (const el of items) {
        const kind = el.dataset.reveal
        const delay = Number(el.dataset.revealDelay ?? 0)

        if (kind === 'mask' || kind === 'line') {
          tl.fromTo(
            el,
            { clipPath: kind === 'mask' ? 'inset(0 0 100% 0)' : 'inset(0 0 110% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: D.slower, delay },
            '<',
          )
          // Inner content drifts up a touch as the mask opens.
          const inner = el.firstElementChild as HTMLElement | null
          if (inner) {
            tl.fromTo(
              inner,
              { yPercent: kind === 'mask' ? 18 : 0, opacity: kind === 'mask' ? 0 : 1 },
              { yPercent: 0, opacity: 1, duration: D.slow, delay },
              '<0.05',
            )
          }
        } else {
          const y = Number(el.dataset.revealY ?? 26)
          tl.fromTo(el, { y, opacity: 0 }, { y: 0, opacity: 1, duration: D.base, delay }, '<')
        }
      }
    }

    // Anything not inside a declared group reveals on its own trigger.
    for (const el of targets.filter((t) => !inGroup.has(t))) {
      const kind = el.dataset.reveal
      const delay = Number(el.dataset.revealDelay ?? 0)

      if (kind === 'mask' || kind === 'line') {
        gsap.fromTo(
          el,
          { clipPath: kind === 'mask' ? 'inset(0 0 100% 0)' : 'inset(0 0 110% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: D.slower,
            delay,
            ease: EASE.out,
            onComplete: () => markRevealed(el),
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          },
        )
        const inner = el.firstElementChild as HTMLElement | null
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: kind === 'mask' ? 18 : 0, opacity: kind === 'mask' ? 0 : 1 },
            {
              yPercent: 0,
              opacity: 1,
              duration: D.slow,
              delay,
              ease: EASE.out,
              scrollTrigger: { trigger: el, start: 'top 86%', once: true },
            },
          )
        }
      } else {
        gsap.fromTo(
          el,
          { y: Number(el.dataset.revealY ?? 26), opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: D.base,
            delay,
            ease: EASE.out,
            onComplete: () => markRevealed(el),
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          },
        )
      }
    }
  }, root)

  return () => {
    ctx.revert()
    for (const el of targets) el.removeAttribute('data-revealed')
  }
}

/**
 * Safety net. Reveal targets that sit well above their trigger line but were
 * never marked as revealed are forced visible — that combination only happens
 * when a ScrollTrigger failed to fire (layout shift, refresh race, dropped
 * frame), and invisible content is always worse than a missing animation.
 *
 * Elements that have not reached their trigger line yet are deliberately left
 * alone so the choreography is preserved.
 */
export function revealSafetyNet() {
  const force = () => {
    for (const el of document.querySelectorAll<HTMLElement>(
      '[data-reveal]:not([data-revealed])',
    )) {
      /* Anything already in motion is mid-stagger. Snapping it visible would
         truncate the sequence, so the net only rescues elements that nothing
         is animating at all. */
      if (gsap.isTweening(el)) continue
      if (el.firstElementChild && gsap.isTweening(el.firstElementChild)) continue

      const rect = el.getBoundingClientRect()
      if (rect.top >= window.innerHeight * 0.86) continue

      markRevealed(el)
      el.style.opacity = '1'
      el.style.clipPath = 'none'
      el.style.transform = 'none'
      el.style.willChange = 'auto'
    }
  }

  force()
  const timers = [window.setTimeout(force, 1200), window.setTimeout(force, 3000)]
  window.addEventListener('load', force)

  return () => {
    timers.forEach(window.clearTimeout)
    window.removeEventListener('load', force)
  }
}

/** Recalculate trigger positions — call after fonts, media or layout changes. */
export function refreshTriggers() {
  ScrollTrigger.refresh()
}
