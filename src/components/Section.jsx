export default function Section({ id, title, index, kicker, className = '', children }) {
  return (
    <section id={id} className={`section reveal ${className}`.trim()} aria-labelledby={`${id}-title`}>
      <header className="section-head">
        <span className="section-index">
          {String(index + 1).padStart(2, '0')} / {kicker || 'Section'}
        </span>
        <h2 id={`${id}-title`} className="section-title">
          {title}
        </h2>
      </header>
      <div className="section-body">{children}</div>
    </section>
  )
}
