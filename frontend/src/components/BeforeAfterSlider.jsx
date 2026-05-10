import { useCallback, useEffect, useRef, useState } from 'react'

function PlaceholderPanel({ label }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant font-label-xs text-label-xs uppercase tracking-widest">
      {label}
    </div>
  )
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  isProcessing,
  status,
}) {
  const containerRef = useRef(null)
  const [position, setPosition] = useState(65)
  const [isDragging, setIsDragging] = useState(false)

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, pct)))
  }, [])

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX
      updateFromClientX(x)
    }
    const stop = () => setIsDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchend', stop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchend', stop)
    }
  }, [isDragging, updateFromClientX])

  const showSlider = beforeSrc && afterSrc

  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 glow-border group select-none"
    >
      {afterSrc ? (
        <img
          src={afterSrc}
          alt="After AI enhancement"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <PlaceholderPanel
          label={
            status === 'FAILURE'
              ? 'Enhancement failed'
              : isProcessing
              ? 'Awaiting result…'
              : 'No output yet'
          }
        />
      )}

      {beforeSrc && (
        <div
          className="absolute inset-0 overflow-hidden border-r-2 border-primary z-10"
          style={{ width: `${showSlider ? position : 100}%` }}
        >
          <img
            src={beforeSrc}
            alt="Before AI enhancement"
            className="absolute inset-0 h-full object-cover filter grayscale-[0.3]"
            style={{ width: showSlider ? `${(100 / position) * 100}%` : '100%' }}
          />
          <div className="absolute top-md left-md px-sm py-xs bg-black/60 backdrop-blur-sm rounded font-label-xs text-label-xs text-white uppercase tracking-widest border border-white/10">
            Before
          </div>
        </div>
      )}

      {afterSrc && (
        <div className="absolute top-md right-md px-sm py-xs bg-primary/20 backdrop-blur-sm rounded font-label-xs text-label-xs text-primary uppercase tracking-widest border border-primary/30 z-20">
          After
        </div>
      )}

      {showSlider && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-30 flex items-center justify-center"
          style={{ left: `${position}%` }}
        >
          <button
            type="button"
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary flex items-center justify-center shadow-xl cursor-ew-resize hover:scale-110 transition-transform"
            aria-label="Drag to compare"
          >
            <span className="material-symbols-outlined text-primary rotate-90">
              unfold_more
            </span>
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/10 to-transparent h-1 w-full scanline z-40 pointer-events-none" />
      )}
    </div>
  )
}
