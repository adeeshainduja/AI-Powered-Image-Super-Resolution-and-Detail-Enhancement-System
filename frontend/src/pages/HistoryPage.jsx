import { useState } from 'react'

const JOBS = [
  {
    key: 'cyber_neon',
    status: 'processing',
    processingLabel: 'Neural Upscaling...',
    progressPct: 66,
    filename: 'cyber_neon_landscape_01.png',
    scale: '4X',
    date: 'Today, 2:14 PM',
    meta: { icon: 'id_card', value: 'ID: #98221' },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_SU-v7m5XPFG5M_p3nzxltGaw5DnM4HqCCeQnsXP5J2yrZTXWKXQkJ37FSBfZP8Up-F_YoF5-WPuKcaer4CwugV88Kku5Wi-D1J_8TBpfCGAY6Dqo7aQkbODyGgM3lk9vC_SHJi9l7WYI0vnl5P7EFHy_38nxSC4m4GTDStKh9Ok8KOn44F9DBgJDsH4YmMFPZtnwZgSDfugRQ0kT-NawSuREA0yLxnclhhqOj6aCDefk7f2-oqHF7x3A-_-0akjuYBkJNHK22aU',
  },
  {
    key: 'archviz',
    status: 'completed',
    filename: 'archviz_render_final.jpg',
    scale: '8X',
    date: 'Nov 24, 11:05 AM',
    meta: { icon: 'download', value: '42.5 MB' },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx9e_BpLOgtnTW80HVGYUXoPxlpPAYPshdpNKVcujrHphZDLjM4OT8HNV7xjfPq7xtxK-9uQoKKVy16vHcQ91oLVsQ8dNiUdGDrNP4Cwt67OiqwK-qMhfC9UjpR-2JKhz5kJSGowVe6liUstBMENvMmeNx4jY_7PwOAZYDDUTcKGBkra67lu7Ntd7uiIXci7KdJlOzV3pNIXfL_E0BuLDLdWLrDfm9-8w5yhTWUPI_2wDuXTQXrxkougMpAUKPJUwtJ0XrpqmgFiE',
  },
  {
    key: 'concept_car',
    status: 'completed',
    filename: 'concept_car_sketch_alt.png',
    scale: '2X',
    date: 'Nov 23, 09:22 PM',
    meta: { icon: 'download', value: '12.8 MB' },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn_AWIU_jFnb6BMM8FwIHTHnoRN1FOfWlqEIRB7AIMviT68ObTrKdgsFDqY2v1Z0t4breuUOJn8yrA2FJzWLV5TpuCWic8KuyKERjEglAneX0EtQAq75wykzaAhwsRa1iFwR8_4BVHFbVzlw2Em3VtBa1eWdW0aWxZt91UXcw4zVsHa7n_qobQH7w3JJ8VEqWvY92JkW3F1bCXBfvHzLdHkdHZQ7cYwX2LWlQGxhQEC46xTIqhZg-C34m1bjko1P1mJN9ZnI7-x2o',
  },
  {
    key: 'legacy',
    status: 'failed',
    filename: 'legacy_component_scan.raw',
    scale: 'N/A',
    errorMsg: 'Unsupported file format encountered during parsing.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyaioiiDlfPSNnvVoxEmRKy0kmgQgJ3RlD3BllSMT3v3S0Z2dQdWBD4sNOTlq017vBfHsPbr7-RUOJeEwcipbHSubYiWeFp9GRasVJiAyeH2W8Xtb2f9p4uByGoAc9aCk2SmGkDbbjplk05wDe_EKmLpXvFz2vtKal8OtkieECr-FT-Mh__iJiGXYnNURwGP5RyzTqXoZzo8KlyOZqpzyOgh6zf-2wlQ-DTgmA8H2V0LdVDMYT8K3G0mUJBJwUqzlizORe0cPf6aU',
  },
  {
    key: 'abstract_orb',
    status: 'completed',
    filename: 'abstract_orb_composition.png',
    scale: '4X',
    date: 'Nov 22, 02:44 PM',
    meta: { icon: 'download', value: '31.2 MB' },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUvrBZs_0bIEIb79-SFTsh7b9kkJLALiWbY76Mpj2NDgE9RZI9vLetAlkpK8PObGwU08Y6fkGlB9zaAz6XGq5hO6qdG8kkgRCgLyKkctpGSSQDNl9JIiSsRqPaEXsnF3FSh8VNpikm_WLkWFeM83qDvYpuBaKA27ZIQbe4Lgbbx4qu4uKOclH9HRxO_zoBZD1-a25tPqD_ej1ZXnDY6iOsLPjfQMPEdRICubP2OpDYvKO1UyImw2sfV7-rWdxMhojoEwFGZqgNvmU',
  },
  {
    key: 'ui_kit',
    status: 'processing',
    processingLabel: 'Enhancing Details...',
    progressPct: 25,
    filename: 'ui_kit_gradient_mesh.jpg',
    scale: '2X',
    date: 'Nov 22, 01:15 PM',
    meta: { icon: 'id_card', value: 'ID: #98218' },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByhaseFa6hcgCtBND_XoInB9enFzT0m5uOxqcbEQsWcyzu1ZyWbBY58wX9Qej3nWrVc01aEQoWcnfUWx7mjqe2f-7HrncwfOOZElpCeB9CfWvSNL5U12_fn0FD2hWelrQAZsdpUgynL5TDzEi4gdENnBuZL9RaSr74uopWpCueyvgIezVBeVvEpNrFWgrJMxwHeVfvzogz3Y6oLaSroumcQEBZhsHEcecj3bn0sanAEkeDn54s1fqCQeIy0dmbcHUjJAWKNamc0iY',
  },
]

function JobCard({ job }) {
  if (job.status === 'processing') {
    return (
      <div className="glass-panel rounded-xl overflow-hidden inner-glow-border group cursor-pointer">
        <div className="aspect-video relative scanline-effect bg-surface-container-low">
          <img
            src={job.img}
            alt={job.filename}
            className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-xs">
              <span className="font-code-md text-label-xs text-secondary animate-pulse uppercase tracking-widest">
                {job.processingLabel}
              </span>
              <div className="w-32 h-1 bg-outline-variant rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_#5de6ff]"
                  style={{ width: `${job.progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-md">
          <div className="flex justify-between items-start mb-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface truncate pr-md">
              {job.filename}
            </h3>
            <span className="font-label-xs text-label-xs px-xs py-[2px] rounded bg-secondary/10 text-secondary border border-secondary/20 shrink-0">
              {job.scale}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-md font-body-sm text-body-sm text-on-surface-variant">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              {job.date}
            </div>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">{job.meta.icon}</span>
              {job.meta.value}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (job.status === 'failed') {
    return (
      <div className="glass-panel rounded-xl overflow-hidden inner-glow-border group cursor-pointer">
        <div className="aspect-video relative bg-surface-container-low">
          <img
            src={job.img}
            alt={job.filename}
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-error-container/20 backdrop-blur-md p-md rounded-xl border border-error/50 flex flex-col items-center">
              <span className="material-symbols-outlined text-error text-[32px] mb-xs">error</span>
              <span className="font-label-xs text-label-xs text-error font-bold uppercase tracking-widest">
                Process Failed
              </span>
            </div>
          </div>
        </div>
        <div className="p-md">
          <div className="flex justify-between items-start mb-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface truncate pr-md">
              {job.filename}
            </h3>
            <span className="font-label-xs text-label-xs px-xs py-[2px] rounded bg-error/10 text-error border border-error/20 shrink-0">
              {job.scale}
            </span>
          </div>
          <div className="flex items-center gap-xs font-body-sm text-body-sm text-error/80">
            <span className="material-symbols-outlined text-[18px]">info</span>
            {job.errorMsg}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden inner-glow-border group cursor-pointer">
      <div className="aspect-video relative bg-surface-container-low">
        <img
          src={job.img}
          alt={job.filename}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute top-sm right-sm">
          <div className="bg-surface-container-lowest/90 backdrop-blur-sm p-xs rounded-lg border border-outline-variant/30 text-on-surface">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
        </div>
      </div>
      <div className="p-md">
        <div className="flex justify-between items-start mb-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface truncate pr-md">
            {job.filename}
          </h3>
          <span className="font-label-xs text-label-xs px-xs py-[2px] rounded bg-secondary/10 text-secondary border border-secondary/20 shrink-0">
            {job.scale}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-md font-body-sm text-body-sm text-on-surface-variant">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            {job.date}
          </div>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">{job.meta.icon}</span>
            {job.meta.value}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [dateFilter, setDateFilter] = useState('Last 7 days')

  const filtered = JOBS.filter((job) => {
    const matchesSearch =
      search === '' || job.filename.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'All Statuses' ||
      job.status === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Job History</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Monitor and manage your neural upscaling pipeline. Processing logs are retained for 30
            days.
          </p>
        </div>
        <button className="flex items-center gap-xs px-md py-sm border border-secondary text-secondary rounded-xl font-bold hover:bg-secondary/10 transition-all duration-300 self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
          <span className="font-body-md text-body-md">Clear history</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="glass-panel p-md rounded-xl mb-lg flex flex-col md:flex-row gap-md items-center border border-outline-variant/30">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or ID..."
            className="w-full pl-xl pr-md py-sm bg-background border border-outline-variant rounded-lg focus:ring-1 focus:ring-secondary focus:border-secondary transition-all outline-none font-body-sm text-body-sm text-on-surface"
          />
        </div>
        <div className="flex gap-sm w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background border border-outline-variant text-on-surface rounded-lg px-md py-sm font-body-sm text-body-sm focus:ring-1 focus:ring-secondary outline-none"
          >
            <option>All Statuses</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-background border border-outline-variant text-on-surface rounded-lg px-md py-sm font-body-sm text-body-sm focus:ring-1 focus:ring-secondary outline-none"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Specific Range</option>
          </select>
        </div>
      </div>

      {/* Job grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
        {filtered.map((job) => (
          <JobCard key={job.key} job={job} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-xl flex justify-center items-center gap-sm">
        <button className="p-xs rounded-lg border border-outline-variant hover:border-secondary transition-all text-on-surface-variant hover:text-secondary">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="flex gap-xs">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={
                n === 1
                  ? 'w-10 h-10 rounded-lg bg-secondary text-on-secondary font-bold font-body-md'
                  : 'w-10 h-10 rounded-lg border border-outline-variant text-on-surface-variant hover:border-secondary transition-all font-body-md'
              }
            >
              {n}
            </button>
          ))}
          <span className="w-10 h-10 flex items-center justify-center text-on-surface-variant">
            ...
          </span>
          <button className="w-10 h-10 rounded-lg border border-outline-variant text-on-surface-variant hover:border-secondary transition-all font-body-md">
            12
          </button>
        </div>
        <button className="p-xs rounded-lg border border-outline-variant hover:border-secondary transition-all text-on-surface-variant hover:text-secondary">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </main>
  )
}
