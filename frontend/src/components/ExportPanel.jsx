export default function ExportPanel({ ready, downloadUrl, filename }) {
  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt('Copy this link', url)
    }
  }

  return (
    <section className="bg-surface-container-high rounded-xl p-lg border border-primary/20 shadow-lg">
      <h3 className="font-headline-sm text-headline-sm mb-lg">Export Options</h3>
      <div className="space-y-md">
        <a
          href={ready ? downloadUrl : undefined}
          download={ready ? filename : undefined}
          aria-disabled={!ready}
          className={`w-full py-md px-lg bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container rounded-xl font-body-md text-body-md font-bold flex items-center justify-center gap-md shadow-xl transition-transform ${
            ready
              ? 'hover:scale-[1.02] active:scale-95'
              : 'opacity-50 cursor-not-allowed pointer-events-none'
          }`}
        >
          <span className="material-symbols-outlined">download</span>
          Download PNG
        </a>

        <div className="grid grid-cols-2 gap-sm">
          <button
            disabled={!ready}
            className="py-sm px-md border border-secondary/50 text-secondary rounded-lg font-label-xs text-label-xs hover:bg-secondary/10 transition-colors flex items-center justify-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            JPG (Max)
          </button>
          <button
            disabled={!ready}
            className="py-sm px-md border border-secondary/50 text-secondary rounded-lg font-label-xs text-label-xs hover:bg-secondary/10 transition-colors flex items-center justify-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            WebP (Pro)
          </button>
        </div>

        <div className="pt-md mt-md border-t border-outline-variant/30 space-y-md">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-between p-sm hover:bg-surface-bright/50 transition-all rounded-lg group"
          >
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                share
              </span>
              <span className="font-body-md text-body-md">Copy link</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-outline">
              chevron_right
            </span>
          </button>
          <button className="w-full flex items-center justify-between p-sm hover:bg-surface-bright/50 transition-all rounded-lg group text-error">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined">delete</span>
              <span className="font-body-md text-body-md">Delete Job</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}
