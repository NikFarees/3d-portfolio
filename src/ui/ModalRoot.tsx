import type { ComponentType } from 'react'
import { useStore } from '../store/useStore'
import type { FocusableId } from '../types'
import { AboutModal } from './modals/AboutModal'
import { ProjectsModal } from './modals/ProjectsModal'
import { AchievementsModal } from './modals/AchievementsModal'
import { EducationModal } from './modals/EducationModal'
import { ExperienceModal } from './modals/ExperienceModal'
import { StackModal } from './modals/StackModal'

const MODAL_CONTENT: Record<FocusableId, ComponentType> = {
  picture: AboutModal,
  laptop: ProjectsModal,
  medals: AchievementsModal,
  album: EducationModal,
  metalCase: ExperienceModal,
  coffee: StackModal,
}

export function ModalRoot() {
  const modalId = useStore((s) => s.modalId)
  const closeModal = useStore((s) => s.closeModal)
  if (!modalId) return null
  const Content = MODAL_CONTENT[modalId]
  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal} aria-label="Close">
          ×
        </button>
        <Content />
      </div>
    </div>
  )
}
