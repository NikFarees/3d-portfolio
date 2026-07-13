import { stack } from '../../data/stack'

export function StackModal() {
  return (
    <>
      <h2>My Fuel</h2>
      <p className="modal-subtitle">
        The stack that keeps things running (besides coffee)
      </p>
      {stack.map((group) => (
        <div key={group.label}>
          <h3>{group.label}</h3>
          <div className="tag-row">
            {group.items.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
