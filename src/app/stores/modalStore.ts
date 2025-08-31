import { create } from 'zustand'

interface ModalState {
  // Modal visibility states
  feedbackModal: boolean
  observationModal: boolean
  batchModal: boolean
  addInternsModal: boolean
  deliveryModal: boolean
  
  // Actions
  openFeedbackModal: () => void
  closeFeedbackModal: () => void
  openObservationModal: () => void
  closeObservationModal: () => void
  openBatchModal: () => void
  closeBatchModal: () => void
  openAddInternsModal: () => void
  closeAddInternsModal: () => void
  openDeliveryModal: () => void
  closeDeliveryModal: () => void
  closeAllModals: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  // Initial state - all modals closed
  feedbackModal: false,
  observationModal: false,
  batchModal: false,
  addInternsModal: false,
  deliveryModal: false,
  
  // Actions
  openFeedbackModal: () => set({ feedbackModal: true }),
  closeFeedbackModal: () => set({ feedbackModal: false }),
  openObservationModal: () => set({ observationModal: true }),
  closeObservationModal: () => set({ observationModal: false }),
  openBatchModal: () => set({ batchModal: true }),
  closeBatchModal: () => set({ batchModal: false }),
  openAddInternsModal: () => set({ addInternsModal: true }),
  closeAddInternsModal: () => set({ addInternsModal: false }),
  openDeliveryModal: () => set({ deliveryModal: true }),
  closeDeliveryModal: () => set({ deliveryModal: false }),
  closeAllModals: () => set({ 
    feedbackModal: false,
    observationModal: false,
    batchModal: false,
    addInternsModal: false,
    deliveryModal: false
  })
}))