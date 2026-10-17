import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { useMagnetic } from '../hooks/useMagnetic'

type Variant = 'primary' | 'outline' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: Variant
  size?: Size
  /** Adds the magnetic pull. Use sparingly — primary actions only. */
  magnetic?: boolean
  className?: string
  children: ReactNode
}

const base =
  'group/btn relative inline-flex items-center justify-center gap-2.5 font-medium ' +
  'transition-[color,background-color,border-color,transform] duration-500 ' +
  'ease-[var(--ease-out-expo)] will-change-transform select-none'

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-[0.8125rem]',
  md: 'h-12 px-6 text-[0.875rem]',
  lg: 'h-14 px-7 text-[0.9375rem] sm:h-[3.75rem] sm:px-9 sm:text-base',
}

const variants: Record<Variant, string> = {
  /* Hover inverts the chip to `bone`, which is near-black in the light
     scheme — so the label has to flip with it, not stay on `text-void`. */
  primary:
    'bg-lime text-void border border-lime hover:bg-bone hover:border-bone hover:text-inverse',
  outline:
    'bg-transparent text-bone border border-line hover:border-bone-dim hover:bg-surface-2/70',
  quiet: 'bg-transparent text-mute hover:text-bone',
}

interface ButtonProps<T extends ElementType = 'button'> extends BaseProps {
  as?: T
}

export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  magnetic = false,
  className,
  children,
  ...rest
}: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof BaseProps>) {
  const Tag = (as ?? 'button') as ElementType
  const ref = useMagnetic<HTMLElement>({ strength: 0.26, innerStrength: 0.14 })

  return (
    <Tag
      ref={magnetic ? ref : undefined}
      data-cursor="link"
      className={cn(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      {/* Sweep fill — sits behind the label, animates on hover only. */}
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:scale-y-100"
        />
      )}
      {variant === 'outline' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-lime transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:scale-x-100"
        />
      )}
      <span
        data-magnetic-inner={magnetic ? '' : undefined}
        className="relative z-1 inline-flex items-center gap-2.5"
      >
        {children}
      </span>
    </Tag>
  )
}
