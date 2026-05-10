import { Link, NavLink, useLocation } from 'react-router-dom'

const LINKS = [
  { label: 'History', to: '/history', matchPaths: ['/history', '/job'] },
  { label: 'Docs', to: '/docs' },
  { label: 'API', to: '/api' },
  { label: 'Gallery', to: '/gallery' },
]

export default function TopNav() {
  const { pathname } = useLocation()

  const isActive = (link) => {
    if (link.matchPaths) {
      return link.matchPaths.some((p) => pathname.startsWith(p))
    }
    return pathname === link.to
  }

  return (
    <header className="bg-surface-container/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30 w-full">
      <nav className="flex justify-between items-center w-full px-lg py-sm max-w-container-max mx-auto">
        <div className="flex items-center gap-md">
          <Link
            to="/"
            className="font-display-md text-headline-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          >
            ImageSR
          </Link>
          <div className="hidden md:flex gap-md ml-lg">
            {LINKS.map((link) => {
              const active = isActive(link)
              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={
                    active
                      ? 'text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md'
                      : 'text-on-surface-variant font-medium hover:text-on-surface transition-colors font-body-md text-body-md'
                  }
                >
                  {link.label}
                </NavLink>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-sm">
          <button className="px-md py-xs font-label-xs text-label-xs text-on-surface-variant hover:text-on-surface transition-all">
            API Key
          </button>
          <button className="px-md py-xs bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container rounded-lg font-label-xs text-label-xs font-bold hover:brightness-110 active:scale-95 transition-all">
            Sign In
          </button>
        </div>
      </nav>
    </header>
  )
}
