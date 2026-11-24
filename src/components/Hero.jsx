import { useState } from 'react'
import { safeUrl } from '../lib/urls.js'

export default function Hero({ profile, counts }) {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = profile.emailHref
    }
  }

  return (
    <section className="hero reveal" id="top" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            {profile.role}
          </p>
          <h1 id="hero-title">{profile.name}</h1>
          <p className="hero-focus">
            {profile.focus} <span aria-hidden="true">·</span> {profile.location}
          </p>
          <p className="hero-tagline">{profile.tagline}</p>

          <div className="hero-actions">
            <a className="button button--primary" href="#projects">
              View projects
              <span aria-hidden="true">↓</span>
            </a>
            {safeUrl(profile.resume) && (
              <a className="button button--ghost" href={profile.resume} target="_blank" rel="noreferrer">
                Download CV
              </a>
            )}
            <button type="button" className="button button--ghost" onClick={copyEmail}>
              {copied ? 'Email copied' : 'Copy email'}
            </button>
          </div>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>

          <div className="hero-stats" aria-label="Portfolio highlights">
            <div className="stat">
              <strong>{counts.projects}</strong>
              <span>Projects</span>
            </div>
            <div className="stat">
              <strong>{counts.experience}</strong>
              <span>Leadership roles</span>
            </div>
            <div className="stat">
              <strong>{counts.workshops}</strong>
              <span>Workshops</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit--one" />
          <div className="orbit orbit--two" />
          <div className="monogram">{profile.initials}</div>
          <span className="spark spark--one" />
          <span className="spark spark--two" />
          <span className="spark spark--three" />
        </div>
      </div>

      <div className="hero-links" aria-label="Contact links">
        {profile.socials.map((social) => (
          <a key={social.label} href={social.url} target={social.url.startsWith('http') ? '_blank' : undefined} rel={social.url.startsWith('http') ? 'noreferrer' : undefined}>
            {social.label}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  )
}
