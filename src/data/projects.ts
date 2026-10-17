/* ============================================================================
 * PROJECT DATA
 * ----------------------------------------------------------------------------
 * `screenshot` is optional:
 *   • If you set it to a real image path (e.g. '/shots/kasa-bella.webp'), the
 *     component renders that image inside the browser frame instead of the
 *     hand-drawn CSS composition.
 *   • If it stays null, the original CSS/SVG artwork below is used — which is
 *     fully vector, weighs almost nothing and needs no photography.
 *
 * `details` powers the "View Details" modal.
 * ========================================================================== */

export type ProjectMockup = 'salon' | 'technical' | 'agency' | 'portal'

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  /** Two-digit index, e.g. '01'. */
  index: string
  slug: string
  name: string
  /** Short label above the project name in the list. */
  kicker: string
  /** One-line editorial summary shown next to the mockup. */
  summary: string
  /** Two or three sentences used in the detail modal. */
  details: string
  /** Bullet highlights in the detail modal. */
  highlights: string[]
  tech: string[]
  year: string
  role: string
  /** null until you drop a real screenshot into /public/shots. */
  screenshot: string | null
  mockup: ProjectMockup
  /** Browser frame address bar text. */
  address: string
  /** null = academic / not publicly deployed. */
  liveUrl: string | null
  /** Secondary link, e.g. source repository. Leave null if none. */
  secondary: ProjectLink | null
  /** 'wide' | 'offset' | 'compact' | 'bleed' — drives the alternating layout. */
  layout: 'wide' | 'offset' | 'compact' | 'bleed'
  /** Small honest disclaimer shown where relevant. */
  note?: string
}

export const projects: Project[] = [
  {
    index: '01',
    slug: 'kasa-bella-salon-spa',
    name: 'Kasa Bella Salon & Spa',
    kicker: 'Beauty & Wellness',
    summary:
      'A premium salon and spa website built around a modern visual identity, generous whitespace and an elegant booking journey.',
    details:
      'Kasa Bella is a brand-forward website for a salon and spa. The work focused on establishing a calm, premium identity online: a restrained colour system, oversized editorial typography and layouts that hold up from a 320px phone to an ultrawide monitor. Sections are structured around the customer journey — services, atmosphere, team and contact — so visitors can reach the information they need without scrolling through filler.',
    highlights: [
      'Custom responsive layout system instead of a stock theme grid',
      'Editorial service presentation with detailed hover states',
      'Mobile-first typography scale that stays readable on small screens',
      'Fast static build with minimal JavaScript overhead',
    ],
    tech: ['React', 'Tailwind CSS', 'JavaScript'],
    year: '2025',
    role: 'Design & Development',
    screenshot: null,
    mockup: 'salon',
    address: 'kasabellasalon.vercel.app',
    liveUrl: 'https://kasabellasalon.vercel.app/',
    secondary: null,
    layout: 'wide',
  },
  {
    index: '02',
    slug: 'dubai-prime-technical',
    name: 'Dubai Prime Technical',
    kicker: 'Villa Maintenance & Renovation',
    summary:
      'A professional website for villa maintenance, technical services and renovation work — built to turn local trust into enquiries.',
    details:
      'Dubai Prime Technical needed a site that communicates technical competence without feeling cold. The result pairs a clear services architecture with prominent calls to action, a strong local SEO foundation and a content structure that makes it easy to add new service areas and projects. Every layout is hand-written HTML, CSS and JavaScript, which keeps the pages fast and the markup fully under control.',
    highlights: [
      'Service-led information architecture with conversion-focused CTAs',
      'Hand-written semantic HTML, CSS and JavaScript — no framework overhead',
      'Local SEO structure with structured data and page-level metadata',
      'Fully responsive across mobile, tablet and desktop',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Web'],
    year: '2025',
    role: 'Design & Development',
    screenshot: null,
    mockup: 'technical',
    address: 'dubaiprimetechnical.com',
    liveUrl: 'https://dubaiprimetechnical.com/',
    secondary: null,
    layout: 'offset',
  },
  {
    index: '03',
    slug: 'vexoratech',
    name: 'VexoraTech',
    kicker: 'Digital Agency',
    summary:
      'A modern agency website presenting web development services with a clean, confident, conversion-focused design system.',
    details:
      'VexoraTech is a digital agency site built to feel precise and premium. A strict typographic grid, a single restrained accent colour and deliberate asymmetry keep the page from falling into template territory. Service blocks, process steps and the contact flow are all designed as one system so the site scales as new services are added.',
    highlights: [
      'Typographic grid system with intentional asymmetric layouts',
      'Service and process modules designed as reusable sections',
      'Clear visual hierarchy that guides visitors toward the enquiry form',
      'React component architecture with Tailwind for consistent styling',
    ],
    tech: ['React', 'Tailwind CSS', 'JavaScript'],
    year: '2025',
    role: 'Design & Development',
    screenshot: null,
    mockup: 'agency',
    address: 'vexora-seven.vercel.app',
    liveUrl: 'https://vexora-seven.vercel.app/',
    secondary: null,
    layout: 'compact',
  },
  {
    index: '04',
    slug: 'hitec-university-portal',
    name: 'HITEC University Portal',
    kicker: 'Academic Project',
    summary:
      'A multi-role academic portal with dedicated dashboards and organised digital workflows for students, faculty, admins and librarians.',
    details:
      'A university-wide portal concept built as an academic project. The scope was deliberately large: four distinct user roles, each with its own dashboard, permissions model and workflow, backed by a relational database and a REST API. The work was about turning a messy real-world process into clear, role-specific digital tools without losing the underlying data model.',
    highlights: [
      'Four role-based dashboards: student, faculty, admin and librarian',
      'REST API with Express.js and a normalised SQL schema',
      'Supabase for authentication, storage and row-level access control',
      'Typed React front end built with TypeScript end to end',
    ],
    tech: ['React', 'TypeScript', 'Express.js', 'Supabase', 'SQL'],
    year: '2025',
    role: 'Academic Project',
    screenshot: null,
    mockup: 'portal',
    address: 'hi-tec-db-026-web.vercel.app',
    liveUrl: 'https://hi-tec-db-026-web.vercel.app/',
    secondary: null,
    layout: 'bleed',
    note: 'University-affiliated academic project. Not an official or endorsed HITEC University product.',
  },

]
