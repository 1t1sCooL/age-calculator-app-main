/**
 * Animate an integer from 0 to `target` over `duration` ms using an ease-out
 * curve, calling `onFrame` with each intermediate whole number. Returns a
 * canceller so a new submission can abort an in-flight animation.
 *
 * `requestAnimationFrame` is read lazily so the module stays importable under
 * jsdom/node where rAF may be absent.
 */
export const countUp = (
  target: number,
  duration: number,
  onFrame: (value: number) => void,
): (() => void) => {
  if (typeof requestAnimationFrame !== 'function' || duration <= 0) {
    onFrame(target)
    return () => {}
  }

  let raf = 0
  let start = 0
  let cancelled = false
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

  const step = (ts: number) => {
    if (cancelled) return
    if (start === 0) start = ts
    const progress = Math.min(1, (ts - start) / duration)
    onFrame(Math.round(easeOut(progress) * target))
    if (progress < 1) raf = requestAnimationFrame(step)
  }

  raf = requestAnimationFrame(step)

  return () => {
    cancelled = true
    cancelAnimationFrame(raf)
  }
}
