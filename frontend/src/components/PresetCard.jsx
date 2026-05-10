export default function PresetCard({ icon, label }) {
  return (
    <button
      type="button"
      className="glass-panel rounded-xl p-sm border border-outline-variant/20 hover:border-secondary/50 transition-all cursor-pointer group text-left"
    >
      <span className="material-symbols-outlined text-outline group-hover:text-secondary mb-xs block">
        {icon}
      </span>
      <p className="font-label-xs text-label-xs font-bold">{label}</p>
    </button>
  )
}
