export interface ProcessStep {
  index: string
  title: string
  body: string
  /** Short keyword shown in the rail while the step is in view. */
  tag: string
}

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Discover',
    tag: 'Listen',
    body: 'Understand the problem, the goals and who the actual users are before a single line of code gets written.',
  },
  {
    index: '02',
    title: 'Design',
    tag: 'Structure',
    body: 'Plan the structure, the visual hierarchy and the user experience so the finished build already feels obvious.',
  },
  {
    index: '03',
    title: 'Develop',
    tag: 'Build',
    body: 'Build responsive, accessible and maintainable interfaces with clean components and a sensible data model behind them.',
  },
  {
    index: '04',
    title: 'Refine',
    tag: 'Polish',
    body: 'Test across devices, tune the performance and polish the details that separate a working site from a good one.',
  },
]

export const personalDetails = [
  { label: 'Location', value: 'Pakistan' },
  { label: 'Education', value: 'BS Computer Science, HITEC University' },
  { label: 'Focus', value: 'Full-Stack Web Development' },
  { label: 'Currently learning', value: 'MERN Stack and modern web technologies' },
]
