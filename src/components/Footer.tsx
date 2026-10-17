import { siteConfig } from '../config/site.config'
import { navItems } from '../data/navigation'
import { Logo } from './Navbar'
import { useReducedMotion } from '../hooks/useMedia'

/* Resolved once per page load: a static site has no reason to re-derive the
   year on every render, and doing so during render is impure. */
const YEAR = new Date().getFullYear()

export function Footer() {
  const year = YEAR
  const reduced = useReducedMotion()

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })

  return (
    <footer className="relative border-t border-line-soft">
      <div className="mx-auto w-full max-w-[100rem] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-4 max-w-[34ch] text-[0.875rem] leading-relaxed text-mute">
              {siteConfig.meta.role} building responsive, thoughtful websites with
              modern web technologies.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-4 lg:col-start-7">
            <p className="text-mono-label text-faint">Sections</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-[0.875rem] text-bone-dim transition-colors duration-300 hover:text-lime"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="text-mono-label text-faint">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              {(
                [
                  ['Email', siteConfig.social.email],
                  ['LinkedIn', siteConfig.social.linkedin],
                  ['GitHub', siteConfig.social.github],
                ] as const
              ).map(([label, link]) => {
                /* Email is built from contact.email so the address only lives in
                   one place; the others carry their own href. A mailto opens in
                   the visitor's mail app, so it must not open a blank tab. */
                const external = Boolean(link.href)
                const href = link.href ?? `mailto:${siteConfig.contact.email}`
                const configured = link.configured ?? siteConfig.contact.emailConfigured

                return configured ? (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="group/lnk inline-flex items-center gap-1.5 text-[0.875rem] text-bone-dim transition-colors duration-300 hover:text-lime"
                    >
                      {label}
                      <svg
                        viewBox="0 0 16 16"
                        className="size-3 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/lnk:translate-x-0.5 group-hover/lnk:-translate-y-0.5"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M5.5 3.5H3.5v9h9v-2M9 2.5h4.5V7M13 3 7.5 8.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                      </svg>
                    </a>
                  </li>
                ) : (
                  <li
                    key={label}
                    className="text-[0.875rem] text-faint"
                  >
                    {label}{' '}
                    <span className="font-mono text-[0.625rem] tracking-[0.14em] uppercase">
                      — coming soon
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start gap-6 border-t border-line-soft pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-faint uppercase">
            © {year} {siteConfig.meta.name}. All rights reserved.
          </p>

          <button
            type="button"
            onClick={toTop}
            data-cursor="link"
            className="group/top inline-flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.14em] text-mute uppercase transition-colors duration-300 hover:text-bone"
          >
            Back to top
            <span className="relative grid size-8 place-items-center border border-line transition-colors duration-300 group-hover/top:border-lime">
              <svg
                viewBox="0 0 16 16"
                className="size-3 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/top:-translate-y-0.5"
                fill="none"
                aria-hidden="true"
              >
                <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
