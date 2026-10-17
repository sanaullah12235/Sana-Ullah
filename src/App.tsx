import { useCallback, useEffect, useState } from 'react'
import { Preloader } from './components/Preloader'
import { Navbar } from './components/Navbar'
import { CustomCursor } from './components/CustomCursor'
import { Footer } from './components/Footer'
import { Hero } from './sections/Hero'
import { Work } from './sections/Work'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { Process } from './sections/Process'
import { Contact } from './sections/Contact'
import { initReveals, refreshTriggers, revealSafetyNet } from './lib/animation'
import { useReducedMotion } from './hooks/useMedia'

export default function App() {
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()

  /* Scroll-reveal system — registered once, then refreshed as the page settles.
     Both calls hand back a teardown so StrictMode's double invocation cannot
     leave a second set of ScrollTriggers attached to the same elements. */
  useEffect(() => {
    const teardownReveals = initReveals()
    const teardownNet = revealSafetyNet()

    const id = window.setTimeout(refreshTriggers, 400)
    return () => {
      window.clearTimeout(id)
      teardownNet()
      teardownReveals()
    }
  }, [])

  /* Web fonts change metrics, so trigger positions must be recalculated. */
  useEffect(() => {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (!fonts) return
    let cancelled = false
    void fonts.ready.then(() => {
      if (!cancelled) refreshTriggers()
    })
    return () => {
      cancelled = true
    }
  }, [])

  const onPreloaderDone = useCallback(() => {
    setReady(true)
    window.setTimeout(refreshTriggers, 120)
  }, [])

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:border focus:border-lime focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:text-bone"
      >
        Skip to content
      </a>

      <Preloader onDone={onPreloaderDone} />
      <CustomCursor />
      <Navbar />

      <main id="main">
        <Hero ready={ready} />
        <Work />
        <About />
        <Skills />
        <Process />
        <Contact />
      </main>

      <Footer />

      {/* Screen-reader status line for motion preferences, useful for debugging
          and referenced by the reduced-motion behaviour description. */}
      <p className="sr-only" aria-live="polite">
        {reduced ? 'Reduced motion is enabled.' : ''}
      </p>
    </>
  )
}
