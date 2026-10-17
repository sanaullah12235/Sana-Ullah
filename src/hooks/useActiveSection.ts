import { useEffect, useState } from 'react'

/**
 * Tracks which section is currently in view, for the navigation indicator.
 * Uses a top-biased root margin so the "current" item matches what the
 * visitor is actually reading rather than what is technically on screen.
 */
export function useActiveSection(ids: string[], enabled = true) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    if (!enabled || !ids.length) return

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!sections.length) return

    const compute = () => {
      const line = window.innerHeight * 0.34
      let current = sections[0]!.id
      /* The section whose top edge is furthest down the page but still above
         the reading line — i.e. the last one the visitor actually entered.
         Comparing by position rather than trusting the caller's array order
         matters: the nav lists About before Work, but Work sits above it in
         the document, so an order-based "last match" would pin the indicator
         to Work for the whole of the About section. */
      let deepest = -Infinity

      for (const section of sections) {
        const top = section.getBoundingClientRect().top
        if (top - line <= 0 && top > deepest) {
          deepest = top
          current = section.id
        }
      }

      // Pin the last section once the page is scrolled to the bottom.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 24
      if (atBottom) current = sections[sections.length - 1]!.id

      setActive((prev) => (prev === current ? prev : current))
    }

    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [ids, enabled])

  return active
}
