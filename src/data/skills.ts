export interface SkillGroup {
  id: string
  /** Two-digit index used as the typographic marker. */
  index: string
  title: string
  note: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    index: '01',
    title: 'Frontend',
    note: 'Interfaces, layouts and interaction',
    items: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    index: '02',
    title: 'Backend',
    note: 'APIs, routing and server logic',
    items: ['Node.js', 'Express.js', 'REST APIs'],
  },
  {
    id: 'data',
    index: '03',
    title: 'Database',
    note: 'Data modelling and persistence',
    items: ['MongoDB', 'SQL', 'Supabase'],
  },
  {
    id: 'cms',
    index: '04',
    title: 'CMS & E-Commerce',
    note: 'Content-managed builds',
    items: ['WordPress', 'Elementor', 'WooCommerce'],
  },
  {
    id: 'tools',
    index: '05',
    title: 'Tools',
    note: 'Version control, editing and shipping',
    items: ['Git', 'GitHub', 'VS Code', 'Vercel'],
  },
]

/* ---------------------------------------------------------------------------
 * Marquee strip in the hero — reused as a single source of truth
 * ------------------------------------------------------------------------- */

export const marqueeWords = [
  'React',
  'TypeScript',
  'Node.js',
  'Express',
  'MongoDB',
  'Tailwind',
  'WordPress',
  'REST APIs',
  'JavaScript',
]
