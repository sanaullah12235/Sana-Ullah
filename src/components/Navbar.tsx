import { useEffect, useId, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { siteConfig } from '../config/site.config'
import { navIds, navItems } from '../data/navigation'
import { useActiveSection } from '../hooks/useActiveSection'
import { useLockBodyScroll, useReducedMotion } from '../hooks/useMedia'
import { cn } from '../lib/cn'
import { useMagnetic } from '../hooks/useMagnetic'
import { ThemeToggle } from './ThemeToggle'

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'text-display text-[1.0625rem] leading-none tracking-[-0.02em] sm:text-[1.1875rem]',
        className,
      )}
    >
      SANA
      <span className="text-lime">.</span>
    </span>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const active = useActiveSection(navIds, !open)
  const reduced = useReducedMotion()
  const menuId = useId()

  useLockBodyScroll(open)
  const ctaRef = useMagnetic<HTMLAnchorElement>({ strength: 0.22, innerStrength: 0.12 })

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (progressRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight
        progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Mobile menu open / close */
  useEffect(() => {
    const el = menuRef.current
    if (!el) return

    if (open && !reduced) {
      gsap.set(el, { pointerEvents: 'auto' })
      gsap
        .timeline()
        .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.32, ease: 'power2.out' })
        .fromTo(
          el.querySelectorAll('[data-menu-item]'),
          { yPercent: 116, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.055 },
          0.06,
        )
        .fromTo(
          el.querySelectorAll('[data-menu-meta]'),
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.05 },
          0.24,
        )
    } else if (open && reduced) {
      gsap.set(el, { autoAlpha: 1 })
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => gsap.set(el, { pointerEvents: 'none' }),
      })
    }
  }, [open, reduced])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    const target = document.getElementById(id)
    if (!target) return
    // Let the overlay release the scroll lock before scrolling.
    window.setTimeout(
      () => target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }),
      open ? 240 : 0,
    )
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-expo)]',
          scrolled || open
            ? 'border-b border-line bg-void/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-[100rem] items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8 lg:px-12"
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              go('home')
            }}
            className="relative z-2 -skew-x-6 transition-opacity duration-300 hover:opacity-70"
            aria-label={`${siteConfig.meta.name} — home`}
          >
            <Logo />
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      go(item.id)
                    }}
                    className="group relative block px-3.5 py-2 text-[0.875rem] text-bone-dim transition-colors duration-300 hover:text-bone"
                  >
                    <span className="relative">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute -bottom-1 left-0 h-px w-full origin-left bg-lime transition-transform duration-500 ease-[var(--ease-out-expo)]',
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )}
                      />
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              ref={open ? undefined : ctaRef}
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                go('contact')
              }}
              className="group relative hidden h-10 items-center overflow-hidden border border-line px-5 text-[0.8125rem] text-bone transition-colors duration-500 hover:border-bone-dim sm:inline-flex"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-lime transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
              />
              <span
                data-magnetic-inner
                className="relative z-1 transition-colors duration-500 group-hover:text-void"
              >
                Let&rsquo;s Talk
              </span>
            </a>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative z-2 flex size-10 items-center justify-center border border-line text-bone transition-colors duration-300 hover:border-bone-dim lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    'absolute left-0 block h-px w-full bg-current transition-all duration-400 ease-[var(--ease-out-expo)]',
                    open ? 'top-1/2 rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 block h-px w-full bg-current transition-all duration-400 ease-[var(--ease-out-expo)]',
                    open ? 'top-1/2 -rotate-45' : 'top-3',
                  )}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* Scroll progress hairline */}
        <span
          ref={progressRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-lime/70"
        />
      </header>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        id={menuId}
        className="invisible fixed inset-0 z-40 opacity-0 lg:hidden"
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 cursor-default bg-void/96 backdrop-blur-2xl"
        />
        <div className="relative flex h-full flex-col justify-between px-5 pb-8 pt-24 sm:px-8">
          <nav aria-label="Mobile">
            <ul>
              {navItems.map((item, i) => (
                <li key={item.id} className="overflow-hidden border-b border-line-soft">
                  <a
                    href={`#${item.id}`}
                    tabIndex={open ? 0 : -1}
                    data-menu-item
                    onClick={(e) => {
                      e.preventDefault()
                      go(item.id)
                    }}
                    className="flex items-baseline gap-4 py-4"
                  >
                    <span className="font-mono text-[0.625rem] tracking-[0.2em] text-faint">
                      0{i + 1}
                    </span>
                    <span className="text-display text-[clamp(2.25rem,10vw,3.25rem)]">
                      {item.label}
                    </span>
                    {active === item.id && (
                      <span className="ml-auto size-1.5 rounded-full bg-lime" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div data-menu-meta className="space-y-4">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              tabIndex={open ? 0 : -1}
              className="inline-flex h-12 w-full items-center justify-center border border-lime bg-lime px-6 text-[0.875rem] font-medium text-void"
            >
              Let&rsquo;s Talk
            </a>
            <p className="font-mono text-[0.625rem] leading-relaxed tracking-[0.18em] text-faint uppercase">
              {siteConfig.location.city} · {siteConfig.location.worldwide}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
