import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useFinePointer, useReducedMotion } from '../hooks/useMedia'

type CursorMode = 'default' | 'link' | 'view'

/**
 * Refined two-part cursor: a small dot that tracks almost 1:1 and a ring that
 * trails behind it. Interactive intent is communicated by the ring; richer
 * intent (project previews) fills the ring and reveals a text label.
 *
 * State is driven entirely by `data-cursor` attributes on any descendant, so
 * adding a new interactive element needs no extra wiring:
 *   data-cursor="link"            → ring expands
 *   data-cursor="view"            → ring fills, shows data-cursor-label
 *   data-cursor="hide"            → ring hides
 *
 * The dot and ring only ever accompany the native pointer — the OS cursor is
 * never hidden and never suppressed. A decorative overlay can fail or lag and
 * the worst case is a missing flourish, never a missing pointer. This is
 * deliberate: the native cursor must always be present.
 *
 * Disabled automatically on touch devices and under reduced-motion, where the
 * native cursor is left completely untouched.
 */
export function CustomCursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const enabled = fine && !reduced

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label || !enabled) return

    const setX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const setY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const setRX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const setRY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let mode: CursorMode = 'default'
    let visible = false
    let raf = 0

    const paint = () => {
      setX(pos.x)
      setY(pos.y)
      setRX(pos.x)
      setRY(pos.y)
      raf = 0
    }

    const setMode = (next: CursorMode) => {
      if (next === mode) return
      mode = next
      ring.dataset.mode = next
      dot.dataset.mode = next
    }

    /* Fade the dot/ring in on the first real mouse move and keep them pinned to
       the pointer; fade them out only while the pointer is away from the
       document or the window is unfocused. Nothing here touches the native
       cursor — it is always on screen. */
    const show = () => {
      if (visible) return
      visible = true
      gsap.to([dot, ring], { opacity: 1, duration: 0.3, ease: 'power2.out' })
    }
    const hide = () => {
      if (!visible) return
      visible = false
      gsap.to([dot, ring], { opacity: 0, duration: 0.2, overwrite: true })
    }
    const onLeave = hide
    const onBlur = hide

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return

      pos.x = e.clientX
      pos.y = e.clientY
      if (!raf) raf = requestAnimationFrame(paint)
      show()

      /* e.target is not guaranteed to be an Element — over `pointer-events:
         none` regions it can be the Document, and a synthetic event dispatched
         at the window reports the window itself. `closest` does not exist on
         any of those, so normalise before calling it. */
      const el = e.target instanceof Element ? (e.target as HTMLElement) : null

      if (el?.closest('input, textarea, select, [contenteditable="true"]')) {
        setMode('default')
        return
      }

      const marked = el?.closest<HTMLElement>('[data-cursor]')
      const raw = marked?.dataset.cursor as CursorMode | 'hide' | undefined

      if (!raw || raw === 'hide') {
        setMode('default')
        return
      }

      setMode(raw)
      if (raw === 'view') {
        const text = marked?.dataset.cursorLabel ?? 'View'
        if (label.textContent !== text) label.textContent = text
      }
    }

    /* GSAP owns transform on this element (quickTo for x/y), so the press
       scale has to be a GSAP tween too. A stylesheet rule setting transform
       would lose to the inline value GSAP writes. */
    const onDown = () =>
      gsap.to(ring, { scale: 0.82, duration: 0.22, ease: 'power2.out', overwrite: 'auto' })
    const onUp = () =>
      gsap.to(ring, { scale: 1, duration: 0.28, ease: 'power2.out', overwrite: 'auto' })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onBlur)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onBlur)
      gsap.killTweensOf([dot, ring])
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="su-cursor-root">
      <div ref={ringRef} className="su-cursor-ring" data-mode="default">
        <span ref={labelRef} className="su-cursor-label" />
      </div>
      <div ref={dotRef} className="su-cursor-dot" data-mode="default" />
    </div>
  )
}
