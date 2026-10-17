import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

/** Must match the key read by the inline bootstrap in index.html. */
const STORAGE_KEY = 'su-theme'

/** Mirrors --c-void in global.css; keeps the browser chrome in step. */
const THEME_COLOR: Record<Theme, string> = {
  light: '#F5F3EE',
  dark: '#08090B',
}

const isTheme = (v: unknown): v is Theme => v === 'light' || v === 'dark'

const readStored = (): Theme | null => {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return isTheme(v) ? v : null
  } catch {
    return null
  }
}

/** Reads whatever the pre-paint script already put on <html>. */
const readCurrent = (): Theme =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'

export interface UseTheme {
  theme: Theme
  setTheme: (next: Theme) => void
  toggleTheme: () => void
}

/**
 * Single source of truth for the colour scheme.
 *
 * The inline script in index.html has already resolved and applied a scheme
 * before React mounts, so the initial state is read back off the document
 * rather than re-derived — that avoids a one-frame flash and a second write
 * to localStorage.
 */
export function useTheme(): UseTheme {
  const [theme, setThemeState] = useState<Theme>(readCurrent)

  const apply = useCallback((next: Theme) => {
    const root = document.documentElement
    root.dataset.theme = next
    /* Drives native form controls, scrollbars and the address bar. */
    root.style.colorScheme = next

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta) meta.content = THEME_COLOR[next]
  }, [])

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next)
      apply(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* storage blocked — the choice still applies for this page view */
      }
    },
    [apply],
  )

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  /* Keep multiple tabs in step. */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !isTheme(e.newValue)) return
      setThemeState(e.newValue)
      apply(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [apply])

  /* Follow the OS only while the visitor has not made an explicit choice. */
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia('(prefers-color-scheme: light)')

    const onChange = (e: MediaQueryListEvent) => {
      if (readStored()) return
      setThemeState(e.matches ? 'light' : 'dark')
      apply(e.matches ? 'light' : 'dark')
    }

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [apply])

  return { theme, setTheme, toggleTheme }
}
