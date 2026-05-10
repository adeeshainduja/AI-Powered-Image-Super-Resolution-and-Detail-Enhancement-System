const FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'Support', 'Status']

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full py-xl px-lg border-t border-outline-variant/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center max-w-container-max mx-auto">
        <div>
          <div className="font-display-md text-body-lg font-black text-on-surface mb-xs">
            ImageSR AI
          </div>
          <p className="text-on-surface-variant font-body-sm text-body-sm">
            © 2024 ImageSR AI. Precision processing for the near future.
          </p>
        </div>
        <div className="flex flex-wrap md:justify-end gap-md">
          {FOOTER_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-on-surface-variant font-label-xs text-label-xs hover:text-secondary transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
