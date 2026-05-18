const NAV_SECTIONS = [
  {
    label: 'Documentation',
    links: [
      { href: '#introduction', icon: 'info', label: 'Introduction', active: true },
      { href: '#how-it-works', icon: 'psychology', label: 'How it works' },
      { href: '#rest-api', icon: 'api', label: 'API Reference' },
      { href: '#faq', icon: 'quiz', label: 'FAQ' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { href: '#', icon: 'terminal', label: 'SDKs' },
      { href: '#', icon: 'forum', label: 'Community' },
    ],
  },
]

const REQUEST_BODY = `{
  "image_url": "https://cdn.imagesr.ai/samples/input_01.jpg",
  "factor": 4,
  "model": "high_fidelity_v2",
  "denoise": 0.15,
  "webhook_url": "https://yourdomain.com/callbacks/images"
}`

const RESPONSE_BODY = `{
  "id": "job_9x22_44a1",
  "status": "processing",
  "estimated_time": "0.45s",
  "output_dimensions": "3840x2160"
}`

const FAQ_ITEMS = [
  {
    question: 'What image formats are supported?',
    answer:
      'We support JPEG, PNG, WEBP, and TIFF up to 25MB per file. Pro users can process high-bitrate RAW files.',
  },
  {
    question: 'Is there a rate limit for the API?',
    answer:
      'Free tier accounts are limited to 10 requests per minute. Enterprise keys feature unlimited throughput with prioritized queue access.',
  },
]

export default function DocsPage() {
  return (
    <main className="max-w-container-max mx-auto px-lg py-xl flex flex-col md:flex-row gap-lg">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-[100px] flex flex-col gap-sm">
          {NAV_SECTIONS.map((section, si) => (
            <div key={section.label}>
              {si > 0 && <div className="mt-md" />}
              <p className="font-label-xs text-label-xs text-outline tracking-widest uppercase pb-base border-b border-outline-variant/20 mb-xs">
                {section.label}
              </p>
              {section.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={
                    link.active
                      ? 'flex items-center gap-xs px-sm py-xs rounded-lg bg-surface-container-high text-primary font-bold border-l-2 border-primary'
                      : 'flex items-center gap-xs px-sm py-xs rounded-lg hover:bg-surface-bright/50 text-on-surface-variant transition-all'
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 max-w-4xl">
        {/* Introduction */}
        <section className="mb-xl" id="introduction">
          <h1 className="font-display-lg text-display-lg mb-md text-on-surface">
            ImageSR Core Model
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg leading-relaxed">
            ImageSR leverages state-of-the-art Generative Adversarial Networks (GANs) and
            Transformer-based architectures to reconstruct missing textures and high-frequency
            details. It&apos;s designed for the professional workflow where precision meets
            high-throughput requirements.
          </p>
          <div className="glass-panel rounded-xl overflow-hidden mb-xl">
            <img
              className="w-full h-80 object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhlQlIycj7VgvyFsJHdRhbO7yitpa-ljzSFgeYwGk9KANPERpgXMUvDKKKQGqUpWEnt9ncoZxdUOtvCZSG_UW-JZvS_OCJ_NlFuRrwOVSGOTHiTfG1Q1-wcHDBYdRzmcKfBhs-W9suZIe4xJ7g3CgcQzLdyGie0q5OFUGmbZ6GCsltoEyyM1E5Ee89cjbL6ECRNUccbGC3pFOCzoqJB5gXrTF9jEIan2ZVH9FVSEcnIeKFNPf0kqPHk3BOF5qvUVpNYinZnYDoI0g"
              alt="Split-screen comparison: pixelated low-res image on left vs AI-enhanced crystal-clear version on right"
            />
            <div className="p-md bg-surface-container/50 border-t border-outline-variant/30">
              <span className="font-label-xs text-label-xs text-secondary mb-xs block">
                AI CAPABILITY
              </span>
              <p className="font-body-md text-body-md text-on-surface">
                Reconstructs up to 8x resolution with 99.4% structural integrity retention.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-xl" id="how-it-works">
          <h2 className="font-display-md text-display-md mb-md text-primary">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
            <div className="p-md rounded-xl bg-surface-container border border-outline-variant/30 inner-glow">
              <span
                className="material-symbols-outlined text-secondary mb-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                dataset
              </span>
              <h3 className="font-headline-sm text-headline-sm mb-xs">Neural Upscaling</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                The model predicts pixel values by analyzing local and global patterns in the input
                image, generating data that wasn&apos;t previously there.
              </p>
            </div>
            <div className="p-md rounded-xl bg-surface-container border border-outline-variant/30">
              <span
                className="material-symbols-outlined text-primary mb-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shutter_speed
              </span>
              <h3 className="font-headline-sm text-headline-sm mb-xs">Latency Control</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Optimized CUDA kernels ensure that 4K upscaling takes less than 200ms per frame on
                enterprise hardware.
              </p>
            </div>
          </div>
        </section>

        {/* REST API */}
        <section className="mb-xl" id="rest-api">
          <h2 className="font-display-md text-display-md mb-md text-on-surface">
            REST API Reference
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-md">
            Our API is built on standard HTTP verbs and returns JSON. You can process images via URL
            or direct base64 upload.
          </p>

          <div className="mb-md">
            <div className="flex items-center gap-xs mb-xs">
              <span className="font-label-xs text-label-xs px-xs py-base bg-secondary/20 text-secondary rounded">
                POST
              </span>
              <span className="font-code-md text-code-md text-on-surface">
                /v1/process/upscale
              </span>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30">
              <pre className="font-code-md text-code-md text-on-secondary-container overflow-x-auto whitespace-pre">
                <code>{REQUEST_BODY}</code>
              </pre>
            </div>
          </div>

          <div className="mb-md">
            <p className="font-label-xs text-label-xs text-outline mb-xs">RESPONSE</p>
            <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30">
              <pre className="font-code-md text-code-md text-secondary-fixed-dim overflow-x-auto whitespace-pre">
                <code>{RESPONSE_BODY}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-xl" id="faq">
          <h2 className="font-display-md text-display-md mb-md text-on-surface">
            Frequently Asked Questions
          </h2>
          <div className="space-y-md">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group border-b border-outline-variant/20 pb-md"
              >
                <summary className="flex justify-between items-center cursor-pointer list-none font-headline-sm text-on-surface">
                  {item.question}
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="mt-sm font-body-md text-on-surface-variant">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
