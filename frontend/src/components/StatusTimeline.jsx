function Step({ label, state, progress, hint }) {
  const isDone = state === 'done'
  const isActive = state === 'active'
  const isError = state === 'error'

  const dotClass = isDone
    ? 'bg-secondary'
    : isActive
    ? 'bg-primary animate-pulse shadow-[0_0_10px_rgba(202,190,255,0.5)]'
    : isError
    ? 'bg-error'
    : 'bg-surface-container-high border border-outline-variant/40'

  const labelColorClass = isDone
    ? 'text-secondary'
    : isActive
    ? 'text-primary'
    : isError
    ? 'text-error'
    : 'text-on-surface-variant'

  const barColorClass = isDone
    ? 'bg-secondary'
    : isActive
    ? 'bg-primary'
    : isError
    ? 'bg-error'
    : 'bg-outline-variant/20'

  const labelText = isDone ? 'Done' : isActive ? 'Processing...' : isError ? 'Failed' : 'Waiting'

  const icon = isDone ? 'check' : isActive ? 'sync' : isError ? 'close' : null

  return (
    <div className="relative pl-10">
      <div
        className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center z-10 ${dotClass}`}
      >
        {icon && (
          <span
            className={`material-symbols-outlined text-[16px] ${
              isDone ? 'text-on-secondary' : isActive ? 'text-on-primary' : 'text-on-error'
            }`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="flex justify-between items-start mb-xs">
        <span className="font-body-md text-body-md font-bold text-on-surface">
          {label}
        </span>
        <span className={`font-label-xs text-label-xs ${labelColorClass}`}>{labelText}</span>
      </div>
      <div className="w-full h-1 bg-outline-variant/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColorClass}`}
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      {hint && (
        <p className="font-label-xs text-label-xs text-on-surface-variant mt-xs">{hint}</p>
      )}
    </div>
  )
}

export default function StatusTimeline({ stages }) {
  return (
    <section className="bg-surface-container-low rounded-xl p-lg border border-outline-variant/20">
      <h3 className="font-headline-sm text-headline-sm mb-lg flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">analytics</span>
        System Status
      </h3>
      <div className="space-y-lg relative">
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-outline-variant/30" />
        <Step
          label="Upload"
          state={stages.upload}
          progress={stages.upload === 'done' ? 1 : 0}
        />
        <Step
          label="Queue"
          state={stages.queue}
          progress={stages.queue === 'done' ? 1 : stages.queue === 'active' ? 0.5 : 0}
        />
        <Step
          label="Inference"
          state={stages.inference}
          progress={stages.progress}
          hint={stages.inference === 'active' ? 'Running on GPU…' : null}
        />
      </div>
    </section>
  )
}
