import { safeUrl } from '../lib/urls.js'

const inlinePattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g

const renderInline = (text, prefix) =>
  String(text)
    .split(inlinePattern)
    .filter(Boolean)
    .map((part, index) => {
      const key = `${prefix}-${index}`

      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={key}>{part.slice(2, -2)}</strong>
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={key}>{part.slice(1, -1)}</code>
      }

      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) {
        const label = link[1]
        const href = link[2]

        if (!safeUrl(href)) return <span key={key}>{label}</span>

        const external = /^https?:\/\//i.test(href)

        return (
          <a
            key={key}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
          >
            {label}
          </a>
        )
      }

      return part
    })

const parseBlocks = (markdown) => {
  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let paragraph = []
  let list = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() })
    paragraph = []
  }

  const flushList = () => {
    if (!list.length) return
    blocks.push({ type: 'list', items: [...list] })
    list = []
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph()
      list.push(trimmed.replace(/^[-*]\s+/, ''))
      continue
    }

    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    flushList()
    paragraph.push(trimmed)
  }

  flushParagraph()
  flushList()

  return blocks
}

export default function Prose({ children, className = '' }) {
  const blocks = parseBlocks(children)

  return (
    <div className={`prose ${className}`.trim()}>
      {blocks.map((block, index) =>
        block.type === 'list' ? (
          <ul key={`list-${index}`}>
            {block.items.map((item, itemIndex) => (
              <li key={`item-${index}-${itemIndex}`}>{renderInline(item, `item-${index}-${itemIndex}`)}</li>
            ))}
          </ul>
        ) : (
          <p key={`paragraph-${index}`}>{renderInline(block.text, `paragraph-${index}`)}</p>
        ),
      )}
    </div>
  )
}
