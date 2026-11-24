export default function Card({ title, category, tags = [], index, className = '', children }) {
  return (
    <article className={`card ${className}`.trim()}>
      {(category || typeof index === 'number') && (
        <div className="card-top">
          {category && <span className="card-eyebrow">{category}</span>}
          {typeof index === 'number' && (
            <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
          )}
        </div>
      )}

      <h3 className="card-title">{title}</h3>
      {children}

      {tags.length > 0 && (
        <div className="tags" aria-label={`${title} tags`}>
          {tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
