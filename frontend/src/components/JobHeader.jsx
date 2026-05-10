const STATUS_STYLES = {
  PROCESSING: { dot: 'bg-secondary animate-pulse', text: 'text-secondary' },
  SUCCESS: { dot: 'bg-secondary', text: 'text-secondary' },
  FAILURE: { dot: 'bg-error animate-pulse', text: 'text-error' },
  PENDING: { dot: 'bg-outline animate-pulse', text: 'text-outline' },
}

export default function JobHeader({ jobId, filename, status }) {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md">
      <div>
        <div className="flex items-center gap-xs text-secondary mb-xs">
          <span className="material-symbols-outlined text-[18px]">
            fingerprint
          </span>
          <span className="font-code-md text-code-md tracking-wider">
            JOB ID: {jobId}
          </span>
        </div>
        <h1 className="font-display-md text-display-md text-on-surface">
          {filename}
        </h1>
      </div>
      <div className="flex gap-sm">
        <span className="flex items-center gap-xs px-md py-xs bg-surface-container-high rounded-full border border-outline-variant/30">
          <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
          <span className={`font-label-xs text-label-xs ${styles.text}`}>
            {status}
          </span>
        </span>
      </div>
    </div>
  )
}
