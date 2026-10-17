import { useCallback, useEffect, useLayoutEffect, useSyncExternalStore } from 'react'

/** SSR-safe layout effect. */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Subscribes to a media query.
 *
 * A media query is an external store, so this uses useSyncExternalStore
 * rather than useState + useEffect. That removes the render/effect drift
 * entirely: React re-reads the snapshot on commit and again on subscribe, so a
 * query that changed between render and effect resyncs on its own, with no
 * setState-in-effect cascade.
 *
 * The snapshot is a boolean, so Object.is comparison is exact and no caching
 * layer is needed.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {}

      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  }, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export const useReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')

/** True on devices where a precise pointer exists (mouse / trackpad). */
export const useFinePointer = () =>
  useMediaQuery('(hover: hover) and (pointer: fine)')

/** Locks body scroll without layout shift, accounting for the scrollbar. */
export function useLockBodyScroll(locked: boolean) {
  useIsomorphicLayoutEffect(() => {
    if (!locked) return

    const { body } = document
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight
    const gap = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
    }
  }, [locked])
}
