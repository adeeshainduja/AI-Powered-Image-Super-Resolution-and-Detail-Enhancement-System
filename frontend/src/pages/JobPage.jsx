import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import JobHeader from '../components/JobHeader.jsx'
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx'
import ParametersGrid from '../components/ParametersGrid.jsx'
import StatusTimeline from '../components/StatusTimeline.jsx'
import ExportPanel from '../components/ExportPanel.jsx'
import { useJobPolling } from '../hooks/useJobPolling.js'
import { fetchResultBlob, getResultUrl } from '../api/client.js'

const STAGE_BY_STATUS = {
  PENDING: { upload: 'done', queue: 'active', inference: 'waiting', progress: 0 },
  STARTED: { upload: 'done', queue: 'done', inference: 'active', progress: 0.6 },
  SUCCESS: { upload: 'done', queue: 'done', inference: 'done', progress: 1 },
  FAILURE: { upload: 'done', queue: 'done', inference: 'error', progress: 1 },
}

function readMeta(jobId) {
  try {
    return JSON.parse(sessionStorage.getItem(`job:${jobId}`) || '{}')
  } catch {
    return {}
  }
}

export default function JobPage() {
  const { jobId } = useParams()
  const location = useLocation()
  const { status, error } = useJobPolling(jobId)

  const meta = useMemo(() => readMeta(jobId), [jobId])
  const inputUrl = location.state?.inputUrl ?? null

  const [outputUrl, setOutputUrl] = useState(null)
  const [resultError, setResultError] = useState(null)

  useEffect(() => {
    if (status !== 'SUCCESS') return
    let url = null
    let cancelled = false
    fetchResultBlob(jobId)
      .then((blob) => {
        if (cancelled) return
        url = URL.createObjectURL(blob)
        setOutputUrl(url)
      })
      .catch((e) => !cancelled && setResultError(e.message))
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [status, jobId])

  const stages = STAGE_BY_STATUS[status] ?? STAGE_BY_STATUS.PENDING
  const isProcessing = status === 'PENDING' || status === 'STARTED'

  const params = {
    model: 'SwinIR',
    scale: meta.scale ? `${meta.scale}x` : '-',
    denoise: meta.denoise ? 'Enabled' : 'Disabled',
    sharpen: meta.sharpen ? 'Enabled' : 'Disabled',
  }

  return (
    <main className="max-w-container-max mx-auto px-lg py-lg grid grid-cols-12 gap-lg">
      <div className="col-span-12">
        <JobHeader
          jobId={jobId}
          filename={meta.filename || 'Untitled image'}
          status={status}
        />
      </div>

      <div className="col-span-12 lg:col-span-8 space-y-md">
        {(error || resultError) && (
          <div className="p-md rounded-lg bg-error-container/40 border border-error/40 text-error font-body-sm text-body-sm">
            {error || resultError}
          </div>
        )}

        <BeforeAfterSlider
          beforeSrc={inputUrl}
          afterSrc={outputUrl}
          isProcessing={isProcessing}
          status={status}
        />
        <ParametersGrid params={params} />
      </div>

      <aside className="col-span-12 lg:col-span-4 space-y-lg">
        <StatusTimeline stages={stages} />
        <ExportPanel
          ready={status === 'SUCCESS' && outputUrl}
          downloadUrl={outputUrl ?? getResultUrl(jobId)}
          filename={
            meta.filename
              ? `${meta.filename.replace(/\.[^.]+$/, '')}_${meta.scale ?? 4}x.png`
              : `${jobId}.png`
          }
        />
      </aside>
    </main>
  )
}
