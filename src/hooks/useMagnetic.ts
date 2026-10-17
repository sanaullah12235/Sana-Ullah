import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useFinePointer, useReducedMotion } from './useMedia'

interface MagneticOptions {
  /** How far the element travels toward the pointer, 0–1. */
  strength?: number
  /** Extra travel applied to [data-magnetic-inner] for depth. */
  innerStrength?: number
}

/**
 * Subtle magnetic pull toward the cursor. Intentionally reserved for a small
 * number of primary actions — applying it everywhere cheapens the effect.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>({
  strength = 0.3,
  innerStrength = 0.18,
}: MagneticOptions = {}) {
  const ref = useRef<T | null>(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !fine || reduced) return

    const inner = el.querySelector<HTMLElement>('[data-magnetic-inner]')

    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' })
    const ixTo = inner
      ? gsap.quickTo(inner, 'x', { duration: 0.75, ease: 'power3.out' })
      : null
    const iyTo = inner
      ? gsap.quickTo(inner, 'y', { duration: 0.75, ease: 'power3.out' })
      : null

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      xTo(relX * strength)
      yTo(relY * strength)
      ixTo?.(relX * innerStrength)
      iyTo?.(relY * innerStrength)
    }

    const reset = () => {
      xTo(0)
      yTo(0)
      ixTo?.(0)
      iyTo?.(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', reset)
    el.addEventListener('pointercancel', reset)

    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
      el.removeEventListener('pointercancel', reset)
      gsap.killTweensOf([el, inner].filter(Boolean) as HTMLElement[])
      gsap.set(el, { x: 0, y: 0 })
      if (inner) gsap.set(inner, { x: 0, y: 0 })
    }
  }, [fine, reduced, strength, innerStrength])

  return ref
}
