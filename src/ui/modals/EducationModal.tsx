import { education } from '../../data/education'

export function EducationModal() {
  return (
    <>
      <h2>Education History</h2>
      <p className="modal-subtitle">Academic background</p>
      {education.map((e) => (
        <div className="entry" key={e.qualification}>
          <h3>{e.qualification}</h3>
          <p className="entry-meta">
            {e.institution} · {e.period}
          </p>
          <p>{e.result}</p>
        </div>
      ))}
    </>
  )
}
