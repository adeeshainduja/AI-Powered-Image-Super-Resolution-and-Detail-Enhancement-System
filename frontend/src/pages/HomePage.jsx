import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import EnhancementPanel from '../components/EnhancementPanel.jsx'
import DropZone from '../components/DropZone.jsx'
import ComparisonPreview from '../components/ComparisonPreview.jsx'
import { enhanceImage } from '../api/client.js'

export default function HomePage() {
  const navigate = useNavigate()
  const [scale, setScale] = useState(4)
  const [denoise, setDenoise] = useState(true)
  const [sharpen, setSharpen] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleEnhance = async () => {
    if (!file || uploading) return
    setUploading(true)
    setError(null)
    try {
      const { job_id } = await enhanceImage(file, { scale, denoise, sharpen })
      sessionStorage.setItem(
        `job:${job_id}`,
        JSON.stringify({
          filename: file.name,
          scale,
          denoise,
          sharpen,
        })
      )
      navigate(`/job/${job_id}`, {
        state: { inputUrl: URL.createObjectURL(file) },
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />

      <Hero />

      <section className="max-w-container-max mx-auto px-lg pb-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
          <div className="lg:col-span-4 flex flex-col gap-md">
            <EnhancementPanel
              scale={scale}
              onScaleChange={setScale}
              denoise={denoise}
              onDenoiseChange={setDenoise}
              sharpen={sharpen}
              onSharpenChange={setSharpen}
              onEnhance={handleEnhance}
              uploading={uploading}
              disabled={!file}
            />
          </div>

          <div className="lg:col-span-8 h-full min-h-[500px]">
            <DropZone file={file} onFileSelect={setFile} error={error} />
            <ComparisonPreview />
          </div>
        </div>
      </section>
    </main>
  )
}
