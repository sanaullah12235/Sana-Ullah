import { useTheme } from '../hooks/useTheme'
import { cn } from '../lib/cn'

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2.3M12 19.3v2.3M2.4 12h2.3M19.3 12h2.3M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.5 14.2A8.6 8.6 0 1 1 9.8 3.5a6.9 6.9 0 0 0 10.7 10.7Z" />
    </svg>
  )
}

/**
 * Scheme switch. Deliberately built from the same square outlined control the
 * mobile menu button uses, so it reads as part of the existing header rather
 * than as a new piece of chrome. Sun and moon cross-fade on the active scheme.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-cursor="link"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'relative z-2 flex size-10 shrink-0 items-center justify-center',
        'border border-line text-bone transition-colors duration-300 hover:border-bone-dim',
        className,
      )}
    >
      <span className="relative block size-4">
        <SunIcon
          className={cn(
            'absolute inset-0 size-4 transition-all duration-500 ease-[var(--ease-out-expo)]',
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-50 opacity-0',
          )}
        />
        <MoonIcon
          className={cn(
            'absolute inset-0 size-4 transition-all duration-500 ease-[var(--ease-out-expo)]',
            isDark
              ? '-rotate-90 scale-50 opacity-0'
              : 'rotate-0 scale-100 opacity-100',
          )}
        />
      </span>
    </button>
  )
}
