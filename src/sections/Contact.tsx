import { useRef, useState } from 'react'
import { siteConfig, mailtoHref } from '../config/site.config'
import { Button } from '../components/Button'
import { cn } from '../lib/cn'

type Status = 'idle' | 'sending' | 'sent' | 'error'

interface Errors {
  name?: string
  email?: string
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = 'Please add your name.'
  else if (values.name.trim().length < 2) errors.name = 'That looks a little short.'

  if (!values.email.trim()) errors.email = 'Please add your email address.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please check this email address.'

  if (!values.message.trim()) errors.message = 'Please tell me a little about the project.'
  else if (values.message.trim().length < 12)
    errors.message = 'A sentence or two more would help.'

  return errors
}

/** Icon used for the social / contact rows. */
function LinkIcon({ kind }: { kind: 'mail' | 'linkedin' | 'github' | 'arrow' }) {
  const common = { fill: 'none', 'aria-hidden': true as const }
  if (kind === 'mail')
    return (
      <svg viewBox="0 0 16 16" className="size-4" {...common}>
        <rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="currentColor" />
        <path d="m2 4.5 6 4 6-4" stroke="currentColor" />
      </svg>
    )
  if (kind === 'linkedin')
    return (
      <svg viewBox="0 0 16 16" className="size-4" {...common}>
        <rect x="1.5" y="1.5" width="13" height="13" rx="1" stroke="currentColor" />
        <path d="M4.6 6.8V11M4.6 4.2v.1M7.4 11V6.8M7.4 8.6c0-1 .7-1.8 1.7-1.8s1.7.7 1.7 1.8V11" stroke="currentColor" strokeLinecap="round" />
      </svg>
    )
  if (kind === 'github')
    return (
      <svg viewBox="0 0 16 16" className="size-4" {...common}>
        <path
          d="M8 1.5a6.5 6.5 0 0 0-2.06 12.68c.33.06.45-.14.45-.31v-1.1c-1.83.4-2.22-.88-2.22-.88-.3-.76-.73-.96-.73-.96-.6-.41.05-.4.05-.4.66.05 1.01.68 1.01.68.59 1.01 1.55.72 1.93.55.06-.43.23-.72.42-.88-1.46-.17-3-.73-3-3.26 0-.72.26-1.31.68-1.77-.07-.17-.3-.84.07-1.75 0 0 .56-.18 1.83.68a6.3 6.3 0 0 1 3.34 0c1.27-.86 1.83-.68 1.83-.68.37.91.14 1.58.07 1.75.42.46.68 1.05.68 1.77 0 2.54-1.54 3.09-3.01 3.25.24.2.45.6.45 1.21v1.8c0 .17.11.38.45.31A6.5 6.5 0 0 0 8 1.5Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    )
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" {...common}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

const socials = [
  {
    key: 'email' as const,
    kind: 'mail' as const,
    label: siteConfig.social.email.label,
    configured: siteConfig.contact.emailConfigured,
  },
  {
    key: 'linkedin' as const,
    kind: 'linkedin' as const,
    label: siteConfig.social.linkedin.label,
    configured: siteConfig.social.linkedin.configured,
    href: siteConfig.social.linkedin.href,
  },
  {
    key: 'github' as const,
    kind: 'github' as const,
    label: siteConfig.social.github.label,
    configured: siteConfig.social.github.configured,
    href: siteConfig.social.github.href,
  },
]

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-mono-label text-mute">
          {label}
        </label>
        {error && (
          <span id={`${id}-error`} role="alert" className="text-[0.6875rem] text-danger">
            {error}
          </span>
        )}
      </div>
      <div
        className={cn(
          'mt-2.5 border-b bg-transparent transition-colors duration-300 focus-within:border-lime',
          /* line-strong, not line: this underline is the only thing marking
             where the field is, so it must clear 3:1 to be perceivable. */
          error ? 'border-danger/60' : 'border-line-strong hover:border-bone-dim',
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [touched, setTouched] = useState(false)
  const [copied, setCopied] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const endpoint = siteConfig.contact.formEndpoint
  const canSend = Boolean(endpoint) && siteConfig.contact.emailConfigured
  const displayEmail = siteConfig.contact.email

  const set = (k: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (touched) setErrors(validate({ ...values, [k]: e.target.value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    const subject = `Project enquiry from ${values.name.trim()}`
    const body = `${values.message.trim()}\n\n—\nFrom: ${values.name.trim()}\nReply to: ${values.email.trim()}`

    /* No endpoint configured: hand off to the visitor's mail client. Nothing is
       ever reported as "sent" unless it genuinely was. */
    if (!canSend) {
      window.location.href = mailtoHref(subject, body)
      setStatus('idle')
      setValues({ name: '', email: '', message: '' })
      setTouched(false)
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(endpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name: values.name.trim(), email: values.email.trim(), message: values.message.trim() }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)

      setStatus('sent')
      setValues({ name: '', email: '', message: '' })
      setTouched(false)
    } catch {
      setStatus('error')
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(displayEmail)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative scroll-mt-24 border-t border-line-soft"
    >
      <div className="mx-auto w-full max-w-[100rem] px-5 pt-24 sm:px-8 sm:pt-32 lg:px-12 lg:pt-40">
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-12">
          {/* ---- Left: pitch + channels ---- */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <span className="font-mono text-[0.6875rem] font-medium tracking-[0.2em] text-lime">
                05
              </span>
              <span className="eyebrow-rule" />
              <span className="text-mono-label text-mute">Contact</span>
            </div>

            <h2
              id="contact-title"
              data-reveal="up"
              data-reveal-y={34}
              className="mt-6 text-display text-[clamp(2.1rem,6.6vw,4.25rem)]"
            >
              Have an idea?
              <br />
              Let&rsquo;s build
              <br />
              something{' '}
              <span className="text-lime">meaningful.</span>
            </h2>

            <p
              data-reveal="up"
              data-reveal-delay={0.08}
              className="mt-7 max-w-[46ch] text-[0.9375rem] leading-relaxed text-bone-dim"
            >
              Whether you have a brief, a half-formed idea, or just a problem worth
              talking through — send a message. I read everything and I reply to
              genuine enquiries.
            </p>

            {/* Email as a first-class link */}
            <div data-reveal="up" data-reveal-delay={0.14} className="mt-10">
              <p className="text-mono-label text-faint">Direct email</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
                <a
                  href={`mailto:${displayEmail}`}
                  data-cursor="link"
                  className="group/mail relative text-[clamp(1.0625rem,2.6vw,1.5rem)] tracking-[-0.02em] break-all"
                >
                  <span className="bg-[linear-gradient(to_right,var(--color-lime),var(--color-lime))] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-[var(--ease-out-expo)] group-hover/mail:bg-[length:100%_1px]">
                    {siteConfig.contact.emailConfigured ? displayEmail : 'your-email@example.com'}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  disabled={!siteConfig.contact.emailConfigured}
                  data-cursor="link"
                  className="border border-line-strong px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.16em] text-mute uppercase transition-colors duration-300 hover:border-bone-dim hover:text-bone disabled:pointer-events-none disabled:opacity-40"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              {!siteConfig.contact.emailConfigured && (
                <p className="mt-3 font-mono text-[0.6875rem] leading-relaxed text-faint">
                  Placeholder — add your real address in
                  <code className="mx-1 text-lime/80">src/config/site.config.ts</code>
                </p>
              )}
            </div>

            {/* Socials */}
            <ul data-reveal="up" data-reveal-delay={0.2} className="mt-10 border-t border-line-soft">
              {socials.map((s) => (
                <li key={s.key} className="border-b border-line-soft">
                  {s.configured ? (
                    <a
                      {...(s.key === 'email'
                        ? { href: `mailto:${siteConfig.contact.email}` }
                        : { href: s.href, target: '_blank', rel: 'noopener noreferrer' })}
                      data-cursor="link"
                      className="group/row flex items-center justify-between gap-4 py-4"
                    >
                      <span className="flex items-center gap-3.5">
                        <span className="text-mute transition-colors duration-300 group-hover/row:text-lime">
                          <LinkIcon kind={s.kind} />
                        </span>
                        <span className="text-[0.9375rem] text-bone-dim transition-colors duration-300 group-hover/row:text-bone">
                          {s.label}
                        </span>
                      </span>
                      <span className="text-mute transition-colors duration-300 group-hover/row:text-lime">
                        {s.key === 'email' ? (
                          <span className="font-mono text-[0.625rem] tracking-[0.16em] break-all uppercase">
                            {siteConfig.contact.email}
                          </span>
                        ) : (
                          <LinkIcon kind="arrow" />
                        )}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center justify-between gap-4 py-4">
                      <span className="flex items-center gap-3.5 text-faint">
                        <span className="text-faint">
                          <LinkIcon kind={s.kind} />
                        </span>
                        <span className="text-[0.9375rem]">{s.label}</span>
                      </span>
                      <span className="shrink-0 border border-dashed border-line-strong px-2 py-1 font-mono text-[0.5625rem] tracking-[0.16em] text-faint uppercase">
                        Add your link
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Right: form ---- */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div
              data-reveal="up"
              data-reveal-delay={0.06}
              className="border border-line-strong bg-ink p-6 sm:p-8"
            >
              <div className="flex items-center justify-between border-b border-line-soft pb-5">
                <h3 className="text-display text-[1.375rem]">Send a message</h3>
                <span className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.18em] text-mute uppercase">
                  <i
                    className={cn(
                      'block size-1.5 rounded-full',
                      status === 'sending' ? 'bg-bone-dim' : 'bg-lime',
                    )}
                  />
                  {status === 'sending' ? 'Sending' : 'Ready'}
                </span>
              </div>

              <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-6 space-y-6">
                <Field id="su-name" label="Your name" error={touched ? errors.name : undefined}>
                  <input
                    id="su-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={set('name')}
                    aria-invalid={Boolean(touched && errors.name)}
                    aria-describedby={touched && errors.name ? 'su-name-error' : undefined}
                    placeholder="Jane Doe"
                    className="w-full bg-transparent py-3 text-[0.9375rem] text-bone outline-none placeholder:text-faint"
                  />
                </Field>

                <Field
                  id="su-email"
                  label="Email address"
                  error={touched ? errors.email : undefined}
                >
                  <input
                    id="su-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={values.email}
                    onChange={set('email')}
                    aria-invalid={Boolean(touched && errors.email)}
                    aria-describedby={touched && errors.email ? 'su-email-error' : undefined}
                    placeholder="jane@company.com"
                    className="w-full bg-transparent py-3 text-[0.9375rem] text-bone outline-none placeholder:text-faint"
                  />
                </Field>

                <Field
                  id="su-message"
                  label="Message"
                  error={touched ? errors.message : undefined}
                >
                  <textarea
                    id="su-message"
                    name="message"
                    rows={4}
                    value={values.message}
                    onChange={set('message')}
                    aria-invalid={Boolean(touched && errors.message)}
                    aria-describedby={touched && errors.message ? 'su-message-error' : undefined}
                    placeholder="What are you building?"
                    className="w-full resize-none bg-transparent py-3 text-[0.9375rem] leading-relaxed text-bone outline-none placeholder:text-faint"
                  />
                </Field>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Button type="submit" size="md" magnetic disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
                      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </Button>
                  <p className="font-mono text-[0.625rem] leading-relaxed tracking-[0.08em] text-faint">
                    {canSend
                      ? 'Sent securely — no data stored.'
                      : 'Opens your email app with the message pre-filled.'}
                  </p>
                </div>

                {/* Live region so screen readers announce the outcome */}
                <div
                  role="status"
                  aria-live="polite"
                  className={cn(
                    'min-h-0 border-l-2 pl-3 font-mono text-[0.6875rem] leading-relaxed transition-colors',
                    status === 'sent'
                      ? 'border-lime text-lime'
                      : status === 'error'
                        ? 'border-danger text-danger'
                        : 'border-transparent text-transparent',
                  )}
                >
                  {status === 'sent'
                    ? 'Message sent. Thanks for reaching out.'
                    : status === 'error'
                      ? 'Something went wrong and the message was not sent. Please email me directly.'
                      : '\u00A0'}
                </div>
              </form>
            </div>

            <p className="mt-5 font-mono text-[0.625rem] leading-relaxed tracking-[0.1em] text-faint uppercase">
              {siteConfig.location.city} · {siteConfig.location.worldwide} · Replies
              within a few days
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
