import { parse as parseYaml } from 'yaml'
import portfolioMarkdown from '../../content/portfolio.md?raw'
import { phoneHref, safeUrl } from './urls.js'

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const normalizeKey = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

const splitTags = (value) => {
  if (!value) return []
  return String(value)
    .split(/[,|]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
}

const parseBullets = (markdown) => {
  const lines = markdown
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (!lines.length || !lines.every((line) => /^[-*]\s+/.test(line))) return []

  return lines.map((line) => line.replace(/^[-*]\s+/, ''))
}

const extractCardMeta = (lines) => {
  const bodyLines = [...lines]
  const meta = {}

  while (bodyLines.length && !bodyLines[0].trim()) bodyLines.shift()

  while (bodyLines.length) {
    const segments = bodyLines[0]
      .split('·')
      .map((segment) => segment.trim())
      .filter(Boolean)

    if (!segments.length) break

    let matched = 0

    for (const segment of segments) {
      const match = segment.match(/^\*\*([^*]+?):\*\*\s*(.+)$/)
      if (!match) continue
      meta[normalizeKey(match[1])] = match[2].trim()
      matched += 1
    }

    if (matched !== segments.length) break
    bodyLines.shift()
  }

  return { meta, bodyLines }
}

const parseCard = (title, lines) => {
  const { meta, bodyLines } = extractCardMeta(lines)
  const bodyMd = bodyLines.join('\n').trim()

  return {
    title,
    meta,
    category: meta.category || '',
    tags: splitTags(meta.tags),
    bullets: parseBullets(bodyMd),
    bodyMd,
  }
}

const parseSections = (markdown) => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const rawSections = []
  let section = null
  let card = null

  for (const line of lines) {
    const sectionMatch = line.match(/^##\s+(.+?)\s*$/)
    const cardMatch = line.match(/^###\s+(.+?)\s*$/)

    if (sectionMatch) {
      card = null
      section = {
        title: sectionMatch[1].trim(),
        lines: [],
        cards: [],
      }
      rawSections.push(section)
      continue
    }

    if (cardMatch) {
      if (!section) {
        section = { title: 'Overview', lines: [], cards: [] }
        rawSections.push(section)
      }

      card = { title: cardMatch[1].trim(), lines: [] }
      section.cards.push(card)
      continue
    }

    if (card) card.lines.push(line)
    else if (section) section.lines.push(line)
  }

  return rawSections.map((rawSection, index) => ({
    id: slugify(rawSection.title),
    title: rawSection.title,
    index,
    bodyMd: rawSection.lines.join('\n').trim(),
    cards: rawSection.cards.map((rawCard) => parseCard(rawCard.title, rawCard.lines)),
  }))
}

const buildNav = (rawNav, sections) => {
  const sectionTitles = new Map(sections.map((section) => [section.id, section.title]))
  const items = (Array.isArray(rawNav) ? rawNav : [])
    .map((item) => {
      if (typeof item === 'string') {
        return { id: slugify(item), label: item }
      }

      const id = slugify(item?.id || item?.label || '')
      return { id, label: item?.label || sectionTitles.get(id) || id }
    })
    .filter((item) => item.id && (sectionTitles.has(item.id) || item.id === 'contact'))

  if (!items.some((item) => item.id === 'contact')) {
    items.push({ id: 'contact', label: 'Contact' })
  }

  return items
}

const parseFrontmatter = (markdown) => {
  const normalized = markdown.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/)

  if (!match) return { data: {}, content: normalized }

  return {
    data: parseYaml(match[1]) || {},
    content: normalized.slice(match[0].length),
  }
}

const validate = (data, sections) => {
  const profile = data.profile || {}

  if (!profile.name) throw new Error('content/portfolio.md: profile.name is required')
  if (!profile.email) throw new Error('content/portfolio.md: profile.email is required')
  if (!profile.role) throw new Error('content/portfolio.md: profile.role is required')
  if (!sections.length) throw new Error('content/portfolio.md: at least one ## section is required')

  const ids = sections.map((section) => section.id)
  if (new Set(ids).size !== ids.length) {
    throw new Error('content/portfolio.md: section headings must have unique names')
  }
}

const { data, content } = parseFrontmatter(portfolioMarkdown)
const sections = parseSections(content)

validate(data, sections)

const profile = {
  ...data.profile,
  emailHref: `mailto:${data.profile?.email || ''}`,
  phoneHref: phoneHref(data.profile?.phone),
  initials: String(data.profile?.name || '')
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase(),
  socials: (Array.isArray(data.profile?.socials) ? data.profile.socials : [])
    .map((social) => ({
      label: social?.label || '',
      url: social?.url || '',
    }))
    .filter((social) => social.label && safeUrl(social.url)),
}

const countCards = (id) => sections.find((section) => section.id === id)?.cards.length || 0

export const portfolio = {
  site: {
    title: data.site?.title || `${profile.name} — Portfolio`,
    description: data.site?.description || '',
    theme: data.site?.theme || 'auto',
    accent: data.site?.accent || 'violet',
  },
  profile,
  nav: buildNav(data.nav, sections),
  sections,
  counts: {
    projects: countCards('projects'),
    experience: countCards('experience'),
    workshops: sections
      .find((section) => section.id === 'workshops')
      ?.cards.reduce((total, card) => total + card.bullets.length, 0) || 0,
  },
}
