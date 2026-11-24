import { useEffect, useState } from 'react'
import Card from './components/Card.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Prose from './components/Prose.jsx'
import Section from './components/Section.jsx'
import { portfolio } from './lib/parsePortfolio.js'
import { safeUrl } from './lib/urls.js'
import { useReveal } from './lib/useReveal.js'
import './App.css'

const { site, profile, nav, sections, counts } = portfolio

function PillList({ items }) {
  if (!items.length) return null

  return (
    <div className="pill-list">
      {items.map((item) => (
        <span className="pill" key={item}>
          {item}
        </span>
      ))}
    </div>
  )
}

function App() {
  const [activeId, setActiveId] = useState(nav[0]?.id || 'top')
  const [progress, setProgress] = useState(0)
  const [projectFilter, setProjectFilter] = useState('All')

  const sectionMap = new Map(sections.map((section) => [section.id, section]))
  const projectSection = sectionMap.get('projects')

  const categories = (projectSection?.cards || [])
    .map((card) => card.category)
    .filter(Boolean)
  const projectCategories = ['All', ...new Set(categories)]

  const projectCards = projectSection?.cards || []
  const visibleProjects = projectFilter === 'All'
    ? projectCards
    : projectCards.filter((card) => card.category === projectFilter)

  useReveal()

  useEffect(() => {
    document.title = site.title

    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', site.description)
  }, [])

  useEffect(() => {
    const trackedIds = ['top', ...sections.map((section) => section.id), 'contact']

    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = maxScroll > 0
        ? Math.min(100, Math.max(0, Math.round((window.scrollY / maxScroll) * 100)))
        : 0

      setProgress(nextProgress)

      const marker = window.scrollY + window.innerHeight * 0.35
      let current = trackedIds[0]

      for (const id of trackedIds) {
        const element = document.getElementById(id)
        if (element && element.offsetTop <= marker) current = id
      }

      setActiveId(current)
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      window.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  const renderSection = (section) => {
    const common = {
      id: section.id,
      title: section.title,
      index: section.index,
    }

    if (section.id === 'about') {
      return (
        <Section {...common} kicker="Introduction" className="section--about">
          <div className="about-grid">
            <Prose>{section.bodyMd}</Prose>
            <aside className="fact-list" aria-label="Quick facts">
              <div>
                <span>Based in</span>
                <strong>{profile.location}</strong>
              </div>
              <div>
                <span>Focus</span>
                <strong>{profile.focus}</strong>
              </div>
              <div>
                <span>Email</span>
                <a href={profile.emailHref}>{profile.email}</a>
              </div>
              {safeUrl(profile.phoneHref) && (
                <div>
                  <span>Phone</span>
                  <a href={profile.phoneHref}>{profile.phone}</a>
                </div>
              )}
            </aside>
          </div>
        </Section>
      )
    }

    if (section.id === 'focus') {
      return (
        <Section {...common} kicker="Interests" className="section--focus">
          <div className="grid grid--focus">
            {section.cards.map((card, index) => (
              <Card key={card.title} title={card.title} index={index}>
                <Prose>{card.bodyMd}</Prose>
              </Card>
            ))}
          </div>
        </Section>
      )
    }

    if (section.id === 'skills') {
      return (
        <Section {...common} kicker="Toolkit" className="section--skills">
          <div className="grid grid--skills">
            {section.cards.map((card) => (
              <Card key={card.title} title={card.title} className="card--compact">
                {card.bullets.length ? (
                  <PillList items={card.bullets} />
                ) : (
                  <Prose>{card.bodyMd}</Prose>
                )}
              </Card>
            ))}
          </div>
        </Section>
      )
    }

    if (section.id === 'experience') {
      return (
        <Section {...common} kicker="Leadership" className="section--experience">
          <div className="timeline">
            {section.cards.map((card) => (
              <Card
                key={card.title}
                title={card.title}
                category={card.meta.type}
                tags={card.meta.area ? [card.meta.area] : []}
                className="card--timeline"
              >
                <Prose>{card.bodyMd}</Prose>
              </Card>
            ))}
          </div>
        </Section>
      )
    }

    if (section.id === 'projects') {
      return (
        <Section {...common} kicker="Selected work" className="section--projects">
          <div className="filters" role="group" aria-label="Filter projects">
            {projectCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`filter ${projectFilter === category ? 'filter--active' : ''}`.trim()}
                onClick={() => setProjectFilter(category)}
                aria-pressed={projectFilter === category}
              >
                {category}
                {category === 'All' && <span>{projectSection?.cards.length || 0}</span>}
              </button>
            ))}
          </div>

          <div className="grid grid--projects">
            {visibleProjects.map((card, index) => (
              <Card
                key={card.title}
                title={card.title}
                category={card.category}
                tags={card.tags}
                index={index}
              >
                <Prose>{card.bodyMd}</Prose>
              </Card>
            ))}
          </div>
        </Section>
      )
    }

    if (section.id === 'education') {
      return (
        <Section {...common} kicker="Background" className="section--education">
          <div className="timeline timeline--compact">
            {section.cards.map((card) => (
              <Card
                key={card.title}
                title={card.title}
                category={card.meta.location}
                className="card--timeline"
              >
                <Prose>{card.bodyMd}</Prose>
              </Card>
            ))}
          </div>
        </Section>
      )
    }

    if (section.id === 'workshops') {
      return (
        <Section {...common} kicker="Training" className="section--workshops">
          <div className="grid grid--workshops">
            {section.cards.map((card) => (
              <Card key={card.title} title={card.title} className="card--compact">
                <PillList items={card.bullets} />
                {!card.bullets.length && <Prose>{card.bodyMd}</Prose>}
              </Card>
            ))}
          </div>
        </Section>
      )
    }

    if (section.id === 'languages') {
      return (
        <Section {...common} kicker="Languages" className="section--languages">
          <div className="languages">
            <Prose>{section.bodyMd}</Prose>
          </div>
        </Section>
      )
    }

    return (
      <Section {...common} className="section--generic">
        <Prose>{section.bodyMd}</Prose>
      </Section>
    )
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header profile={profile} nav={nav} activeId={activeId} progress={progress} />

      <main id="main">
        <Hero profile={profile} counts={counts} />

        {sections.map((section) => (
          <div key={section.id}>{renderSection(section)}</div>
        ))}

        <section
          id="contact"
          className="section section--contact reveal"
          aria-labelledby="contact-title"
        >
          <header className="section-head">
            <span className="section-index">
              {String(sections.length + 1).padStart(2, '0')} / Contact
            </span>
            <h2 id="contact-title" className="section-title">
              Let’s build something useful
            </h2>
          </header>

          <div className="contact-card">
            <p>
              Open to conversations about power systems, robotics, embedded systems, and practical
              engineering projects.
            </p>
            <div className="contact-actions">
              <a className="button button--primary" href={profile.emailHref}>
                {profile.email}
              </a>
              {safeUrl(profile.phoneHref) && (
                <a className="button button--ghost" href={profile.phoneHref}>
                  {profile.phone}
                </a>
              )}
              {safeUrl(profile.resume) && (
                <a className="button button--ghost" href={profile.resume} target="_blank" rel="noreferrer">
                  View CV
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer profile={profile} />
    </>
  )
}

export default App
