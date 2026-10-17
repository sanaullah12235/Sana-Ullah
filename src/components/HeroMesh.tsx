import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useFinePointer, useReducedMotion } from '../hooks/useMedia'

/* Isometric cube projection helpers --------------------------------------- */

const cube = (cx: number, cy: number, w: number, d: number, h: number) => ({
  top: `M ${cx} ${cy - d} L ${cx + w} ${cy} L ${cx} ${cy + d} L ${cx - w} ${cy} Z`,
  left: `M ${cx - w} ${cy} L ${cx} ${cy + d} L ${cx} ${cy + d + h} L ${cx - w} ${cy + h} Z`,
  right: `M ${cx + w} ${cy} L ${cx} ${cy + d} L ${cx} ${cy + d + h} L ${cx + w} ${cy + h} Z`,
  leftEdge: `M ${cx - w} ${cy} L ${cx - w} ${cy + h}`,
  rightEdge: `M ${cx + w} ${cy} L ${cx + w} ${cy + h}`,
  apex: `M ${cx} ${cy - d} L ${cx} ${cy + d + h}`,
})

const slab = (cx: number, cy: number, w: number, d: number, h: number) => ({
  top: `M ${cx} ${cy - d} L ${cx + w} ${cy} L ${cx} ${cy + d} L ${cx - w} ${cy} Z`,
  left: `M ${cx - w} ${cy} L ${cx} ${cy + d} L ${cx} ${cy + d + h} L ${cx - w} ${cy + h} Z`,
  right: `M ${cx + w} ${cy} L ${cx} ${cy + d} L ${cx} ${cy + d + h} L ${cx + w} ${cy + h} Z`,
})

const UPPER = cube(200, 148, 78, 52, 74)
const LOWER = cube(200, 258, 58, 39, 62)
const BASE = slab(200, 356, 148, 96, 20)

/* Every colour in the diagram resolves through a scheme token, so the same
   composition reads correctly in both light and dark. `style` is used rather
   than presentation attributes because `var()` is only reliably supported in
   the former. */
const face = {
  a: { fill: 'var(--c-mesh-face-a)' },
  b: { fill: 'var(--c-mesh-face-b)' },
  c: { fill: 'var(--c-mesh-face-c)' },
  slabL: { fill: 'var(--c-mesh-slab-l)' },
  slabR: { fill: 'var(--c-mesh-slab-r)' },
  slabT: { fill: 'var(--c-mesh-slab-t)' },
}

const edge = {
  stroke: { stroke: 'var(--c-mesh-stroke)', strokeWidth: 0.7 },
  stroke2: { stroke: 'var(--c-mesh-stroke-2)', strokeWidth: 0.7 },
  line: { stroke: 'var(--c-mesh-line)', strokeWidth: 0.5 },
  hair: { stroke: 'var(--c-mesh-line)', strokeWidth: 0.4 },
  rule: { stroke: 'var(--c-mesh-rule)', strokeWidth: 0.4 },
  ruleHalf: { stroke: 'var(--c-mesh-rule)', strokeWidth: 0.5 },
  axis: { stroke: 'var(--c-mesh-rule)', strokeWidth: 0.6 },
  ringSoft: { stroke: 'var(--c-mesh-rule-soft)', strokeWidth: 0.4 },
  detail: { fill: 'var(--c-mesh-detail)' },
  shell: { stroke: 'var(--c-mesh-shell)', strokeWidth: 0.7 },
  shell2: { stroke: 'var(--c-mesh-shell-2)', strokeWidth: 0.7 },
  accent: { fill: 'var(--c-lime)' },
  accentSoft: { fill: 'var(--c-lime)', opacity: 0.75 },
  accentLine: { fill: 'var(--c-lime)', opacity: 0.5 },
}

/**
 * Hand-drawn isometric "digital architecture" composition.
 *
 * Entirely vector, no images, no canvas — it stays sharp at any resolution and
 * costs almost nothing to load. Layers animate up on page load, drift gently
 * forever after, and lean a few degrees toward the pointer on desktop.
 */
export function HeroMesh({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<SVGGElement>(null)
  const floatRef = useRef<SVGGElement>(null)
  const upperRef = useRef<SVGGElement>(null)
  const lowerRef = useRef<SVGGElement>(null)
  const scanRef = useRef<SVGRectElement>(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const scene = sceneRef.current
    const float = floatRef.current
    if (!root || !scene || !float) return

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-mesh]', { opacity: 1, y: 0 })
        return
      }

      // Load-in: architecture assembles upward.
      gsap.fromTo(
        '[data-mesh="plane"]',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay: 0.15 },
      )
      gsap.fromTo(
        '[data-mesh="ghost"]',
        { opacity: 0, scale: 0.86 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.07,
          delay: 0.3,
          transformOrigin: '200px 240px',
        },
      )

      // Gentle perpetual drift — each layer out of phase.
      gsap.to(upperRef.current, {
        y: -7,
        duration: 3.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
      gsap.to(lowerRef.current, {
        y: 5,
        duration: 4.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      // Node travelling the vertical axis. Opacity and `cy` are animated by
      // separate tweens on purpose — a single tween must own each property or
      // the two fight over the attribute and the node jitters in place.
      gsap.fromTo(
        '[data-mesh="node"]',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 1.1 },
      )
      gsap.to('[data-mesh="node"]', {
        attr: { cy: 268 },
        duration: 2.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.6,
      })

      // Horizontal scan bar. The resting x position lives in the JSX so this
      // tween is the only thing writing to it.
      gsap.fromTo(
        scanRef.current,
        { opacity: 0 },
        { opacity: 0.5, duration: 0.6, delay: 1.2 },
      )
      gsap.to(scanRef.current, {
        attr: { x: 470 },
        duration: 3.4,
        ease: 'power1.inOut',
        repeat: -1,
        repeatDelay: 2.2,
        delay: 1.2,
      })
    }, root)

    // Pointer lean — desktop only, deliberately shallow.
    let cleanupLean: (() => void) | undefined
    if (fine && !reduced) {
      const rotY = gsap.quickTo(scene, 'rotationY', { duration: 0.9, ease: 'power3.out' })
      const rotX = gsap.quickTo(scene, 'rotationX', { duration: 0.9, ease: 'power3.out' })

      const onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect()
        const px = (e.clientX - (r.left + r.width / 2)) / r.width
        const py = (e.clientY - (r.top + r.height / 2)) / r.height
        rotY(px * 9)
        rotX(-py * 7)
      }
      const onLeave = () => {
        rotY(0)
        rotX(0)
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerleave', onLeave)
      cleanupLean = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerleave', onLeave)
      }
    }

    void float
    return () => {
      cleanupLean?.()
      ctx.revert()
    }
  }, [fine, reduced])

  return (
    <div ref={rootRef} className={className}>
      <div className="su-mesh-frame relative aspect-square w-full overflow-hidden border border-line bg-surface/40">
        {/* Dot lattice */}
        <svg
          className="absolute inset-0 h-full w-full text-line"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="su-mesh-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
            <linearGradient id="su-mesh-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="su-mesh-mask">
              <rect width="400" height="400" fill="url(#su-mesh-fade)" />
            </mask>
          </defs>
          <rect
            width="400"
            height="400"
            fill="url(#su-mesh-dots)"
            opacity="0.5"
            mask="url(#su-mesh-mask)"
          />
        </svg>

        {/* Architecture */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Abstract isometric diagram of stacked application layers"
        >
          <defs>
            <linearGradient id="su-top" x1="0" y1="0" x2="1" y2="1">
              <stop
                offset="0%"
                style={{ stopColor: 'var(--c-lime)', stopOpacity: 0.16 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: 'var(--c-lime)', stopOpacity: 0.02 }}
              />
            </linearGradient>
          </defs>

          <g
            ref={sceneRef}
            style={{ transformStyle: 'preserve-3d', transformOrigin: '200px 220px' }}
          >
            <g ref={floatRef}>
              {/* Concentric guide rings */}
              <g data-mesh="ghost" fill="none" style={edge.rule}>
                <circle cx="200" cy="228" r="176" style={edge.rule} />
                <circle
                  cx="200"
                  cy="228"
                  r="132"
                  strokeDasharray="2 6"
                  style={edge.ringSoft}
                />
              </g>

              {/* Blueprint callouts */}
              <g data-mesh="ghost" fill="none" style={edge.ruleHalf}>
                <path d="M200 20 V 72" />
                <path d="M200 396 V 330" strokeDasharray="3 4" />
                <path d="M28 228 H 122" strokeDasharray="3 4" />
                <path d="M278 228 H 372" strokeDasharray="3 4" />
              </g>
              <g data-mesh="ghost" style={edge.accentSoft}>
                <rect x="198.5" y="20" width="3" height="3" />
                <rect x="198.5" y="393" width="3" height="3" />
                <rect x="28" y="226.5" width="3" height="3" />
                <rect x="369" y="226.5" width="3" height="3" />
              </g>

              {/* Vertical axis + travelling node */}
              <g data-mesh="ghost">
                <path
                  d="M200 96 V 300"
                  strokeDasharray="2 5"
                  fill="none"
                  style={edge.axis}
                />
                <circle
                  data-mesh="node"
                  cx="200"
                  cy="222"
                  r="2.6"
                  style={edge.accent}
                />
              </g>

              {/* Upper layer — interface */}
              <g data-mesh="plane" ref={upperRef}>
                <path d={UPPER.left} style={{ ...face.a, ...edge.stroke }} />
                <path d={UPPER.right} style={{ ...face.b, ...edge.stroke }} />
                <path
                  d={UPPER.top}
                  style={{ fill: 'url(#su-top)', ...edge.stroke2 }}
                />
                <path d={UPPER.leftEdge} fill="none" style={edge.line} />
                <path d={UPPER.rightEdge} fill="none" style={edge.line} />
                <path d={UPPER.apex} fill="none" style={edge.hair} />
                <rect x="176" y="132" width="48" height="1" style={edge.accentLine} />
                <rect x="176" y="140" width="28" height="1" style={edge.detail} />
                <rect x="176" y="148" width="36" height="1" style={edge.detail} />
              </g>

              {/* Lower layer — server */}
              <g data-mesh="plane" ref={lowerRef}>
                <path d={LOWER.left} style={{ ...face.a, ...edge.stroke }} />
                <path d={LOWER.right} style={{ ...face.b, ...edge.stroke }} />
                <path d={LOWER.top} style={{ ...face.c, ...edge.stroke2 }} />
                {[0, 1, 2].map((i) => (
                  <rect
                    key={i}
                    x="172"
                    y={256 + i * 9}
                    width="12"
                    height="2"
                    style={
                      i === 0
                        ? { fill: 'var(--c-lime)', opacity: 0.85 }
                        : edge.detail
                    }
                  />
                ))}
                <rect x="192" y={256} width="34" height="1" style={edge.detail} />
                <rect x="192" y={265} width="24" height="1" style={edge.detail} />
                <rect x="192" y={274} width="30" height="1" style={edge.detail} />
              </g>

              {/* Base slab — data */}
              <g data-mesh="plane">
                <path d={BASE.left} style={{ ...face.slabL, ...edge.shell }} />
                <path d={BASE.right} style={{ ...face.slabR, ...edge.shell }} />
                <path d={BASE.top} style={{ ...face.slabT, ...edge.shell2 }} />
                {Array.from({ length: 9 }).map((_, i) => (
                  <ellipse
                    key={i}
                    cx={200}
                    cy={356 - 76 + i * 19}
                    rx={148 - i * 15}
                    ry={96 - i * 10}
                    fill="none"
                    style={edge.ringSoft}
                  />
                ))}
              </g>

              {/* Scan bar */}
              <rect
                data-mesh="ghost"
                ref={scanRef}
                x="-80"
                y="0"
                width="80"
                height="400"
                style={edge.accent}
                opacity="0"
              />
            </g>
          </g>
        </svg>

        {/* Overlay readouts */}
        <span className="pointer-events-none absolute left-3 top-3 font-mono text-[0.5625rem] tracking-[0.2em] text-faint sm:left-4 sm:top-4 sm:text-[0.625rem]">
          FIG. 01 — STACK
        </span>
        <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 font-mono text-[0.5625rem] tracking-[0.2em] text-faint sm:right-4 sm:top-4 sm:text-[0.625rem]">
          <i className="block size-1.5 rounded-full bg-lime" />
          LIVE
        </span>

        {/* Corner brackets */}
        {(
          [
            'left-0 top-0 border-l border-t',
            'right-0 top-0 border-r border-t',
            'left-0 bottom-0 border-l border-b',
            'right-0 bottom-0 border-r border-b',
          ] as const
        ).map((c) => (
          <span
            key={c}
            aria-hidden="true"
            className={`pointer-events-none absolute size-3 border-lime/60 sm:size-4 ${c}`}
          />
        ))}
      </div>
    </div>
  )
}
