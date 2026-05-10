import Toggle from './Toggle.jsx'
import PresetCard from './PresetCard.jsx'

const SCALE_LABELS = ['1x', '2x', '3x', '4x', '5x']

export default function EnhancementPanel({
  scale,
  onScaleChange,
  denoise,
  onDenoiseChange,
  sharpen,
  onSharpenChange,
  onEnhance,
  uploading = false,
  disabled = false,
}) {
  const fillPercent = ((scale - 1) / 4) * 100
  const enhanceDisabled = uploading || disabled

  return (
    <>
      <div className="glass-panel inner-glow-border rounded-xl p-md flex flex-col gap-md">
        <div className="flex items-center gap-xs">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            tune
          </span>
          <h3 className="font-headline-sm text-headline-sm">Enhancement</h3>
        </div>

        <div className="space-y-sm">
          <div className="flex justify-between items-center">
            <label className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">
              Upscale Factor
            </label>
            <span className="font-code-md text-code-md text-secondary">
              {scale}x
            </span>
          </div>

          <div className="relative h-6 flex items-center">
            <div className="absolute w-full h-1.5 bg-[#2A3561] rounded-full" />
            <div
              className="absolute h-1.5 bg-gradient-to-r from-primary-container to-secondary-container rounded-full"
              style={{ width: `${fillPercent}%` }}
            />
            <div
              className="absolute -translate-x-1/2 w-5 h-5 bg-white border-2 border-secondary rounded-full shadow-lg pointer-events-none"
              style={{ left: `${fillPercent}%` }}
            />
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={scale}
              onChange={(e) => onScaleChange(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upscale factor"
            />
          </div>

          <div className="flex justify-between text-[10px] text-outline font-code-md">
            {SCALE_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <div className="h-px bg-outline-variant/30 my-xs" />

        <div className="space-y-md">
          <Toggle
            title="Neural Denoise"
            description="Remove artifacts & grain"
            checked={denoise}
            onChange={onDenoiseChange}
          />
          <Toggle
            title="Face Sharpen"
            description="Restore facial details"
            checked={sharpen}
            onChange={onSharpenChange}
          />
        </div>

        <div className="mt-md flex flex-col gap-sm">
          <button
            onClick={onEnhance}
            disabled={enhanceDisabled}
            className={`w-full py-md rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-bold flex items-center justify-center gap-xs transition-all ${
              enhanceDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-[0_0_20px_rgba(148,125,255,0.4)] active:scale-[0.98]'
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                uploading ? 'animate-spin' : ''
              }`}
            >
              {uploading ? 'progress_activity' : 'auto_fix_high'}
            </span>
            {uploading ? 'Uploading…' : 'Enhance Image'}
          </button>
          <button
            disabled={uploading}
            className="w-full py-sm rounded-xl border border-secondary text-secondary font-medium hover:bg-secondary/10 transition-colors font-body-md text-body-md disabled:opacity-50"
          >
            Try a sample
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-sm">
        <PresetCard icon="portrait" label="Portrait Pro" />
        <PresetCard icon="landscape" label="Landscape" />
      </div>
    </>
  )
}
