import type { CSSProperties } from 'react'
import { useStore } from '../store/useStore'
import { useTimeOfDay } from '../hooks/useTimeOfDay'

function drawStyle(length: number, delay: number): CSSProperties {
  return {
    strokeDasharray: length,
    strokeDashoffset: length,
    animation: `doodle-draw 1.1s ease-out ${delay}s forwards`,
  }
}

/** Curvy arrow pointing down-right toward the room. */
function ArrowIntro({ delay }: { delay: number }) {
  return (
    <svg className="doodle-svg" viewBox="0 0 160 110" fill="none">
      <path
        d="M14 12 C 60 2, 104 30, 122 72"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        style={drawStyle(180, delay)}
      />
      <path
        d="M104 62 L 123 74 L 128 52"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={drawStyle(60, delay + 0.9)}
      />
    </svg>
  )
}

/** Small arrow pointing up-right toward the cat. */
function ArrowCat({ delay }: { delay: number }) {
  return (
    <svg className="doodle-svg" viewBox="0 0 120 80" fill="none">
      <path
        d="M10 68 C 44 66, 80 48, 102 16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        style={drawStyle(150, delay)}
      />
      <path
        d="M84 18 L 104 13 L 104 34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={drawStyle(55, delay + 0.9)}
      />
    </svg>
  )
}

/** Arrow curving down-left toward the medals wall. */
function ArrowMedals({ delay }: { delay: number }) {
  return (
    <svg className="doodle-svg" viewBox="0 0 140 90" fill="none">
      <path
        d="M126 14 C 90 10, 48 28, 26 62"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        style={drawStyle(160, delay)}
      />
      <path
        d="M44 54 L 24 65 L 42 76"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={drawStyle(55, delay + 0.9)}
      />
    </svg>
  )
}

/** Hand-drawn underline flourish. */
function Underline({ delay }: { delay: number }) {
  return (
    <svg className="doodle-svg doodle-underline" viewBox="0 0 180 18" fill="none">
      <path
        d="M6 10 C 50 4, 120 4, 174 8 M30 14 C 70 10, 120 10, 150 13"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        style={drawStyle(330, delay)}
      />
    </svg>
  )
}

/** Little heart. */
function Heart({ delay }: { delay: number }) {
  return (
    <svg className="doodle-svg doodle-heart" viewBox="0 0 40 36" fill="none">
      <path
        d="M20 31 C 6 20, 3 10, 10 6 C 15 3, 19 7, 20 11 C 21 7, 25 3, 30 6 C 37 10, 34 20, 20 31 Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        style={drawStyle(110, delay)}
      />
    </svg>
  )
}

function Star({ delay }: { delay: number }) {
  return (
    <svg className="doodle-svg doodle-star" viewBox="0 0 40 40" fill="none">
      <path
        d="M20 4 L 20 36 M6 20 L 34 20 M10 10 L 30 30 M30 10 L 10 30"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        style={drawStyle(150, delay)}
      />
    </svg>
  )
}

export function DoodleOverlay() {
  // Zoomed into an interactable or a modal is open — doodles get in the
  // way of the focused object, so fade them out and bring them back once
  // the camera returns to the default view.
  const zoomedIn = useStore((s) => s.focusedId !== null || s.modalId !== null)
  // Ink flips light/dark to stay legible against the scene background,
  // which itself swaps per phase (light by day, dark navy at night).
  const phase = useTimeOfDay()

  return (
    <div
      className={`doodle-overlay doodle-overlay--${phase}${zoomedIn ? ' doodle-overlay--hidden' : ''}`}
      aria-hidden="true"
    >
      {/* Intro block — top-left on desktop, top-center on mobile */}
      <div className="doodle doodle-sway doodle-intro">
        <span className="doodle-text doodle-title" style={{ animationDelay: '0.3s' }}>
          hi, i&apos;m Nik!
        </span>
        <Underline delay={0.8} />
        <span
          className="doodle-text doodle-sub doodle-only-desktop"
          style={{ animationDelay: '0.9s' }}
        >
          welcome to my room — click around!
        </span>
        <span
          className="doodle-text doodle-sub doodle-only-mobile"
          style={{ animationDelay: '0.9s' }}
        >
          welcome to my room — tap around!
        </span>
        <ArrowIntro delay={1.4} />
      </div>

      {/* Cat hint — bottom-left */}
      <div className="doodle doodle-sway doodle-cat" style={{ animationDelay: '1.2s' }}>
        <ArrowCat delay={2.4} />
        <span className="doodle-text doodle-sub" style={{ animationDelay: '2s' }}>
          psst... pet the cat
        </span>
      </div>

      {/* Medals pointer — right side */}
      <div className="doodle doodle-sway doodle-medals" style={{ animationDelay: '0.7s' }}>
        <span className="doodle-text doodle-sub" style={{ animationDelay: '1.6s' }}>
          shiny achievements
        </span>
        <ArrowMedals delay={2.0} />
      </div>

      {/* Credit — bottom-right */}
      <div className="doodle doodle-sway doodle-credit" style={{ animationDelay: '1.8s' }}>
        <span className="doodle-text doodle-credit-text" style={{ animationDelay: '2.6s' }}>
          made with react + three.js
        </span>
        <Heart delay={3.0} />
      </div>

      {/* Lone deco star — top-right */}
      <div className="doodle doodle-sway doodle-deco-star" style={{ animationDelay: '1s' }}>
        <Star delay={2.8} />
      </div>
    </div>
  )
}
