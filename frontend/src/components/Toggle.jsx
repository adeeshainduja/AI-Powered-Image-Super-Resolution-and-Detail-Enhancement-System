export default function Toggle({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="font-body-md text-body-md font-medium">{title}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {description}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full relative flex items-center p-1 cursor-pointer transition-colors ${
          checked ? 'bg-secondary-container' : 'bg-[#2A3561]'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full shadow-sm transition-all ${
            checked ? 'ml-auto bg-white' : 'bg-on-surface-variant'
          }`}
        />
      </button>
    </div>
  )
}
