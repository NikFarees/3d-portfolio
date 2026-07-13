import { experience, devopsHighlights } from '../../data/experience'

export function ExperienceModal() {
  return (
    <>
      <h2>Work Experience</h2>
      <p className="modal-subtitle">Career timeline</p>
      {experience.map((e) => (
        <div className="entry" key={`${e.role}-${e.period}`}>
          <h3>{e.role}</h3>
          <p className="entry-meta">
            {e.company} · {e.period}
          </p>
          <p>{e.description}</p>
        </div>
      ))}
      <h3>DevOps & Infrastructure</h3>
      <ul>
        {devopsHighlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </>
  )
}
