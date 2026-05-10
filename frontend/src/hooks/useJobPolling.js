import { useEffect, useState } from 'react'
import { getJobStatus } from '../api/client.js'

const TERMINAL = new Set(['SUCCESS', 'FAILURE'])
const INITIAL_DELAY = 1000
const MAX_DELAY = 5000

export function useJobPolling(jobId) {
  const [status, setStatus] = useState('PENDING')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!jobId) return
    let cancelled = false
    let timer = null
    let delay = INITIAL_DELAY

    const tick = async () => {
      if (cancelled) return
      try {
        const data = await getJobStatus(jobId)
        if (cancelled) return
        setStatus(data.status)
        setError(null)
        if (TERMINAL.has(data.status)) return
        delay = Math.min(Math.round(delay * 1.5), MAX_DELAY)
      } catch (e) {
        if (cancelled) return
        setError(e.message)
        delay = MAX_DELAY
      }
      timer = setTimeout(tick, delay)
    }

    tick()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [jobId])

  return { status, error }
}
