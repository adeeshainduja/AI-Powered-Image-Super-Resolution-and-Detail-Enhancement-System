export async function enhanceImage(file, { scale, denoise, sharpen }) {
  const form = new FormData()
  form.append('file', file)
  const params = new URLSearchParams({
    scale: String(scale),
    denoise: String(denoise),
    sharpen: String(sharpen),
  })
  const res = await fetch(`/enhance?${params.toString()}`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const detail = await res
      .json()
      .then((j) => j.detail)
      .catch(() => res.statusText)
    throw new Error(`Enhance failed (${res.status}): ${detail}`)
  }
  return res.json()
}

export async function getJobStatus(jobId) {
  const res = await fetch(`/status/${jobId}`)
  if (!res.ok) throw new Error(`Status failed (${res.status})`)
  return res.json()
}

export function getResultUrl(jobId) {
  return `/result/${jobId}`
}

export async function fetchResultBlob(jobId) {
  const res = await fetch(getResultUrl(jobId))
  if (!res.ok) throw new Error(`Result failed (${res.status})`)
  return res.blob()
}
