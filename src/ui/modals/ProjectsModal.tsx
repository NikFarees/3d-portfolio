import { projects } from '../../data/projects'

export function ProjectsModal() {
  return (
    <>
      <h2>Projects</h2>
      <p className="modal-subtitle">
        Client and personal work — {projects.length} shipped systems
      </p>
      {projects.map((p) => (
        <div className="entry" key={p.slug}>
          <h3>
            {p.title}
            {p.subtitle ? ` — ${p.subtitle}` : ''}
          </h3>
          <p className="entry-meta">
            {p.category} · {p.role}
          </p>
          <p>{p.description}</p>
          <div className="tag-row">
            {p.stack.map((s) => (
              <span className="tag" key={s}>
                {s}
              </span>
            ))}
          </div>
          {p.links && (
            <p>
              {p.links.live && (
                <a href={p.links.live} target="_blank" rel="noreferrer">
                  Live ↗
                </a>
              )}{' '}
              {p.links.github && (
                <a href={p.links.github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              )}
            </p>
          )}
        </div>
      ))}
    </>
  )
}
