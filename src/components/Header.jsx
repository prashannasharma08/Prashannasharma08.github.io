import ThemeToggle from './ThemeToggle.jsx'

export default function Header({ profile, nav, activeId, progress }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label={`${profile.name}, back to top`}>
          <span className="brand-mark">{profile.initials}</span>
          <span className="brand-name">{profile.name}</span>
        </a>

        <nav className="nav" aria-label="Main navigation">
          {nav.map((item) => (
            <a
              key={item.id}
              className={`nav-link ${activeId === item.id ? 'nav-link--active' : ''}`.trim()}
              href={`#${item.id}`}
              aria-current={activeId === item.id ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <ThemeToggle />
      </div>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
    </header>
  )
}
