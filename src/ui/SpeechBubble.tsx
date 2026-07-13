export function SpeechBubble({
  text,
  onClose,
}: {
  text: string
  onClose?: () => void
}) {
  return (
    <div className="speech-bubble">
      {text}
      {onClose && (
        <button
          className="bubble-close"
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
