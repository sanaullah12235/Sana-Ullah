import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

interface SectionHeadingProps {
  /** Two-digit section number, e.g. '02'. */
  index: string
  /** Small uppercase label, e.g. 'About'. */
  label: string
  /** Editorial headline. */
  title: ReactNode
  /** Optional supporting line, set in the right-hand column. */
  lede?: ReactNode
  className?: string
  id?: string
}

/**
 * Shared section header used across the site: index + rule + label on one line,
 * then a large display headline with an optional supporting column beneath.
 */
export function SectionHeading({
  index,
  label,
  title,
  lede,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <header className={cn('w-full', className)}>
      <div className="flex items-center gap-4 sm:gap-5">
        <span
          data-reveal="up"
          className="font-mono text-[0.6875rem] font-medium tracking-[0.2em] text-lime"
        >
          {index}
        </span>
        <span data-reveal="up" className="eyebrow-rule" data-reveal-delay={0.05} />
        <span
          data-reveal="up"
          data-reveal-delay={0.1}
          className="text-mono-label text-mute"
        >
          {label}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-7 lg:grid-cols-12 lg:gap-x-10">
        <h2
          id={id}
          data-reveal="up"
          data-reveal-delay={0.12}
          data-reveal-y={34}
          className="text-display col-span-1 text-[clamp(2.1rem,7.2vw,4.75rem)] lg:col-span-7"
        >
          {title}
        </h2>

        {lede && (
          <p
            data-reveal="up"
            data-reveal-delay={0.2}
            className="max-w-md text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base lg:col-span-4 lg:col-start-9 lg:self-end lg:pb-2"
          >
            {lede}
          </p>
        )}
      </div>
    </header>
  )
}
