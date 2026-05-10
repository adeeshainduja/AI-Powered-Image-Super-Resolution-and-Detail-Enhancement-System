import { useEffect, useRef, useState } from 'react'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp']
const FORMAT_TAGS = ['JPG', 'PNG', 'WEBP', 'BMP']
const MAX_BYTES = 20 * 1024 * 1024

export default function DropZone({ file, onFileSelect, error }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [validationError, setValidationError] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleFile = (f) => {
    if (!f) return
    if (!ACCEPTED.includes(f.type)) {
      setValidationError('Unsupported format. Use JPG, PNG, WebP, or BMP.')
      return
    }
    if (f.size > MAX_BYTES) {
      setValidationError(
        `File is ${(f.size / 1024 / 1024).toFixed(1)} MB — limit is 20 MB.`
      )
      return
    }
    setValidationError(null)
    onFileSelect(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const displayedError = validationError || error

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      className={`w-full h-full glass-panel rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-xl relative overflow-hidden group transition-colors cursor-pointer min-h-[500px] ${
        displayedError
          ? 'border-error/60'
          : isDragging
          ? 'border-secondary'
          : 'border-outline-variant/50 hover:border-secondary'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

      {previewUrl ? (
        <img
          src={previewUrl}
          alt={file?.name ?? 'Preview'}
          className="absolute inset-0 w-full h-full object-contain z-0"
        />
      ) : (
        <div className="flex flex-col items-center text-center max-w-sm z-10">
          <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-md group-hover:scale-110 transition-transform duration-500">
            <span
              className="material-symbols-outlined text-4xl text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              cloud_upload
            </span>
          </div>
          <h2 className="font-headline-sm text-headline-sm mb-xs">
            Drop an image here
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-md">
            JPG, PNG, WebP, or BMP up to 20 MB.
          </p>
          <div className="flex gap-sm">
            {FORMAT_TAGS.map((tag) => (
              <div
                key={tag}
                className="px-sm py-xs bg-surface-container-lowest rounded-lg border border-outline-variant/30 font-code-md text-label-xs text-outline"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      )}

      {displayedError && (
        <div className="absolute bottom-md left-md right-md z-20 px-md py-sm rounded-lg bg-error-container/80 border border-error/40 text-error font-body-sm text-body-sm backdrop-blur-md">
          {displayedError}
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-1 bg-outline-variant/20">
        <div className="h-full w-0 bg-secondary shadow-[0_0_10px_#5de6ff] transition-all duration-700" />
      </div>
    </div>
  )
}
