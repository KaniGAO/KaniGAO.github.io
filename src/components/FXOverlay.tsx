/**
 * Global immersive FX layer: film grain + scanlines + vignette.
 * Fixed, pointer-events-none, dark-mode only (light mode renders nothing
 * visible). All motion respects prefers-reduced-motion via the CSS guard.
 */
export default function FXOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="true"
    >
      <div className="fx-vignette absolute inset-0" />
      <div className="fx-scanlines absolute inset-0" />
      <div className="fx-grain absolute inset-0" />
    </div>
  )
}
