import { create } from 'zustand'

interface ModalState {
  // Modal visibility states
  feedbackModal: boolean
  observationModal: boolean
  batchModal: boolean
  addInternsModal: boolean
  deliveryModalFeedbackId: number | null // Track which feedback's delivery modal is open
  
  // Actions
  openFeedbackModal: () => void
  closeFeedbackModal: () => void
  openObservationModal: () => void
  closeObservationModal: () => void
  openBatchModal: () => void
  closeBatchModal: () => void
  openAddInternsModal: () => void
  closeAddInternsModal: () => void
  openDeliveryModal: (feedbackId: number) => void
  closeDeliveryModal: () => void
  closeAllModals: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  // Initial state - all modals closed
  feedbackModal: false,
  observationModal: false,
  batchModal: false,
  addInternsModal: false,
  deliveryModalFeedbackId: null,
  
  // Actions
  openFeedbackModal: () => set({ feedbackModal: true }),
  closeFeedbackModal: () => set({ feedbackModal: false }),
  openObservationModal: () => set({ observationModal: true }),
  closeObservationModal: () => set({ observationModal: false }),
  openBatchModal: () => set({ batchModal: true }),
  closeBatchModal: () => set({ batchModal: false }),
  openAddInternsModal: () => set({ addInternsModal: true }),
  closeAddInternsModal: () => set({ addInternsModal: false }),
  openDeliveryModal: (feedbackId: number) => set({ deliveryModalFeedbackId: feedbackId }),
  closeDeliveryModal: () => set({ deliveryModalFeedbackId: null }),
  closeAllModals: () => set({ 
    feedbackModal: false,
    observationModal: false,
    batchModal: false,
    addInternsModal: false,
    deliveryModalFeedbackId: null
  })
}))