import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero.jsx";
import EnhancementPanel from "../components/EnhancementPanel.jsx";
import DropZone from "../components/DropZone.jsx";

import { enhanceImage } from "../api/client.js";

export default function HomePage() {
  const navigate = useNavigate();

  const [scale, setScale] = useState(4);
  const [denoise, setDenoise] = useState(false);
  const [sharpen, setSharpen] = useState(false);
  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleEnhance = async () => {
    if (!file || uploading) return;

    setUploading(true);
    setError(null);

    try {
      const data = await enhanceImage(file, {
        scale,
        denoise,
        sharpen,
      });

      const jobId = data.job?.jobId || data.job_id;
      const resultUrl = data.resultUrl || data.result_url || `/result/${jobId}`;

      if (!jobId) {
        throw new Error("Job ID was not returned from backend.");
      }

      sessionStorage.setItem(
        `job:${jobId}`,
        JSON.stringify({
          filename: file.name,
          scale,
          denoise,
          sharpen,
          resultUrl,
          originalSize: data.job?.originalSize || data.original_size,
          finalSize: data.job?.finalSize || data.final_size,
          processingTime: data.job?.processingTime || data.processing_time,
        })
      );

      navigate(`/job/${jobId}`, {
        state: {
          inputUrl: URL.createObjectURL(file),
          resultUrl,
          filename: file.name,
          scale,
          denoise,
          sharpen,
        },
      });
    } catch (e) {
      setError(e.message || "Image enhancement failed.");
    } finally {
      setUploading(false);
    }
  };

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
          </div>
        </div>
      </section>
    </main>
  );
}
