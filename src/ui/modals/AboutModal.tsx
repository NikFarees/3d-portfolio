import { bio } from '../../data/bio'

export function AboutModal() {
  return (
    <>
      <h2>{bio.name}</h2>
      <p className="modal-subtitle">
        {bio.role} @ {bio.company} · {bio.location}
      </p>
      <p>{bio.headline}</p>
      <p>{bio.about}</p>
      <h3>Contact</h3>
      <ul>
        <li>
          <a href={`mailto:${bio.contact.email}`}>{bio.contact.email}</a>
        </li>
        <li>
          <a href={bio.contact.github} target="_blank" rel="noreferrer">
            {bio.contact.githubLabel}
          </a>
        </li>
        <li>
          <a href={bio.contact.linkedin} target="_blank" rel="noreferrer">
            {bio.contact.linkedinLabel}
          </a>
        </li>
        <li>
          <a href={bio.contact.website} target="_blank" rel="noreferrer">
            fareeslab.dev
          </a>
        </li>
      </ul>
    </>
  )
}
