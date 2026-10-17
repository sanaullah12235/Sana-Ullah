interface CommonProps {
  children: React.ReactNode
  className?: string
  /** Seconds to wait before this element animates within its group. */
  delay?: number
  /** Travel distance in px for the `up` variant. */
  y?: number
  as?: 'div' | 'span' | 'li' | 'article' | 'p' | 'h2' | 'h3'
}

/**
 * Declarative scroll-reveal wrapper. All motion is driven by the shared GSAP
 * pass in `lib/animation.ts`, so elements carry data attributes rather than
 * owning their own timelines.
 */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  kind = 'up',
  as: Tag = 'div',
}: CommonProps & { kind?: 'up' | 'fade' }) {
  return (
    <Tag
      /* `fade` shares the `up` pipeline in lib/animation.ts — it is the same
         opacity + translate reveal, kept as a separate name so markup can
         express intent. */
      data-reveal={kind === 'fade' ? 'fade' : 'up'}
      data-reveal-delay={delay}
      data-reveal-y={y}
      className={className}
    >
      {children}
    </Tag>
  )
}

export function RevealFade({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: CommonProps) {
  return (
    <Tag data-reveal="fade" data-reveal-delay={delay} className={className}>
      {children}
    </Tag>
  )
}

export function RevealMask({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: CommonProps) {
  return (
    <Tag data-reveal="mask" data-reveal-delay={delay} className={className}>
      {children}
    </Tag>
  )
}

export function RevealLine({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: CommonProps) {
  return (
    <Tag data-reveal="line" data-reveal-delay={delay} className={className}>
      {children}
    </Tag>
  )
}

/** Marks a container whose descendants should stagger as one sequence. */
export function RevealGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div data-reveal-group className={className}>
      {children}
    </div>
  )
}
