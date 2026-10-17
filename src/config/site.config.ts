/* ============================================================================
 * SITE CONFIGURATION
 * ----------------------------------------------------------------------------
 * This is the ONLY file you need to edit for your personal details,
 * social links and SEO metadata. Everything else in the site reads from here.
 *
 * Any value written as `null` (or an empty string) is intentionally treated as
 * "not provided yet" and the UI degrades gracefully — placeholders are shown
 * instead of inventing information. Set `configured: false` to false for any
 * channel you have not filled in yet.
 * ========================================================================== */

export interface SocialLink {
  /** Label shown to assistive tech and in the footer / contact rows. */
  label: string
  /**
   * Full absolute URL. Replace the placeholder with your real profile.
   * Omitted for email, whose address is built from `contact.email` so that
   * address only ever has to be written in one place.
   */
  href?: string
  /**
   * Set to `true` once the href above is a real, working profile URL.
   * While falsy, links render as "coming soon" instead of a dead tab.
   */
  configured?: boolean
}

export interface SiteConfig {
  meta: {
    name: string
    shortName: string
    role: string
    title: string
    description: string
    /**
     * Absolute canonical URL of the deployed site.
     *
     * Empty until you actually have a domain. Nothing in the code reads this
     * yet — it is here so that when you deploy there is one obvious place to
     * record your origin. Do NOT invent a hostname you do not own: a canonical
     * URL pointing at someone else's domain tells search engines to index
     * their page instead of yours.
     */
    url: string
    locale: string
    keywords: string[]
    author: string
  }

  contact: {
    /**
     * Your real email address. The contact form and the mailto fallback both
     * read from here.
     */
    email: string
    /** Set to true once `email` above is a real, working address. */
    emailConfigured: boolean
    /**
     * Optional: a form endpoint (Formspree, Web3Forms, Resend proxy, etc.).
     * Leave as null to use the mailto fallback.
     * Example: 'https://formspree.io/f/xxxxxxxx'
     */
    formEndpoint: string | null
  }

  social: {
    email: SocialLink
    linkedin: SocialLink
    github: SocialLink
  }

  /** Availability line rendered in the hero. Set to null to hide the pill. */
  availability: string | null

  location: {
    city: string
    worldwide: string
  }
}

export const siteConfig: SiteConfig = {
  meta: {
    name: 'Sana Ullah',
    shortName: 'SANA.',
    role: 'Full-Stack Web Developer',
    title: 'Sana Ullah — Full-Stack Web Developer',
    description:
      'Sana Ullah is a full-stack web developer and BS Computer Science student at HITEC University, building fast, responsive and thoughtfully designed websites with React, Node.js and modern web technologies.',
    url: '', // TODO: set to your real origin when you deploy, e.g. 'https://your-domain.com'
    locale: 'en_US',
    keywords: [
      'Sana Ullah',
      'full stack web developer',
      'React developer',
      'MERN stack developer',
      'frontend developer Pakistan',
      'Node.js developer',
      'MongoDB developer',
      'WordPress developer',
      'responsive web design',
      'HITEC University computer science',
    ],
    author: 'Sana Ullah',
  },

  contact: {
    /* Your real address. This single value drives the email link in the footer,
       the "Direct email" line, the contact-form mailto fallback and the mobile
       menu button — there is nowhere else to update. */
    // TODO: replace with your real email address, then set emailConfigured: true
    email: 'your-email@example.com',
    emailConfigured: false,
    // TODO: add a form endpoint to receive submissions without opening a mail app.
    // Leave null to fall back to a prefilled mailto: link.
    formEndpoint: null,
  },

  social: {
    /* No href on purpose: the address lives in `contact.email` above, so the
       footer and contact section build `mailto:` from that one value. */
    email: {
      label: 'Email',
    },
    linkedin: {
      // TODO: replace with your real LinkedIn profile URL
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/your-handle',
      // Dummy for now at your request: renders as a real, clickable link.
      // Flip back to false if you would rather it show as "coming soon".
      configured: true,
    },
    github: {
      // TODO: replace with your real GitHub profile URL
      label: 'GitHub',
      href: 'https://github.com/your-handle',
      // Dummy for now at your request: renders as a real, clickable link.
      configured: true,
    },
  },

  availability: 'Available for new projects',

  location: {
    city: 'Based in Pakistan',
    worldwide: 'Working worldwide',
  },
}

/** Convenience accessor used by <MailTo> and the contact form. */
export const mailtoHref = (subject: string, body: string) => {
  const email = siteConfig.contact.email
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
