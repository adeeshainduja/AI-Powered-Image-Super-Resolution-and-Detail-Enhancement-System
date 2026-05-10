const FIELDS = [
  { key: 'model', label: 'Model' },
  { key: 'scale', label: 'Scale' },
  { key: 'denoise', label: 'Denoise' },
  { key: 'sharpen', label: 'Sharpen' },
]

export default function ParametersGrid({ params }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
      {FIELDS.map((f) => (
        <div
          key={f.key}
          className="p-md bg-surface-container rounded-lg border border-outline-variant/20"
        >
          <span className="font-label-xs text-label-xs text-on-surface-variant block mb-base uppercase opacity-70">
            {f.label}
          </span>
          <span className="font-code-md text-code-md text-primary">
            {params[f.key] ?? '—'}
          </span>
        </div>
      ))}
    </div>
  )
}
