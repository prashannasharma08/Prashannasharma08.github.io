import { safeUrl } from '../lib/urls.js'

export default function Footer({ profile }) {
  return (
    <footer className="footer reveal">
      <div>
        <span className="footer-name">{profile.name}</span>
        <span className="footer-tagline">{profile.tagline}</span>
      </div>

      <div className="footer-links">
        <a href={profile.emailHref}>{profile.email}</a>
        {safeUrl(profile.phoneHref) && <a href={profile.phoneHref}>{profile.phone}</a>}
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
