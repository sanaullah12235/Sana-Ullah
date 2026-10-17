export interface NavItem {
  /** Must match a section `id` in the page. */
  id: string
  label: string
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

/* Module-level constant: a stable identity keeps `useActiveSection` from
   re-subscribing on every render. */
export const navIds: string[] = navItems.map((i) => i.id)
