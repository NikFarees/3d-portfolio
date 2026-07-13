import { awards, certifications } from '../../data/achievements'

export function AchievementsModal() {
  return (
    <>
      <h2>Achievements</h2>
      <p className="modal-subtitle">Awards, milestones, and certifications</p>
      <h3>Awards</h3>
      <ul>
        {awards.map((a) => (
          <li key={a.title}>
            <strong>{a.title}</strong>
            {a.detail ? ` — ${a.detail}` : ''}
          </li>
        ))}
      </ul>
      <h3>Certifications</h3>
      <ul>
        {certifications.map((c) => (
          <li key={c.title}>
            <strong>{c.title}</strong>
            {c.detail ? ` — ${c.detail}` : ''}
          </li>
        ))}
      </ul>
    </>
  )
}
