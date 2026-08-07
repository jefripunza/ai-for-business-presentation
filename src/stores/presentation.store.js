import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuid } from 'uuid'

export const usePresentationStore = defineStore('presentation', () => {
  const slides = ref([])
  const activeSlideId = ref(null)

  const activeSlide = computed(() =>
    slides.value.find(s => s.id === activeSlideId.value) || null
  )

  const activeElements = computed(() =>
    activeSlide.value?.elements || []
  )

  function addSlide(data) {
    const slide = {
      id: data?.id || uuid(),
      background: data?.background || '#ffffff',
      elements: data?.elements || []
    }
    slides.value.push(slide)
    if (!activeSlideId.value) activeSlideId.value = slide.id
    return slide
  }

  function removeSlide(slideId) {
    const idx = slides.value.findIndex(s => s.id === slideId)
    if (idx === -1) return
    slides.value.splice(idx, 1)
    if (activeSlideId.value === slideId) {
      activeSlideId.value = slides.value[Math.min(idx, slides.value.length - 1)]?.id || null
    }
  }

  function duplicateSlide(slideId) {
    const source = slides.value.find(s => s.id === slideId)
    if (!source) return
    const newSlide = JSON.parse(JSON.stringify(source))
    newSlide.id = uuid()
    newSlide.elements.forEach(el => { el.id = uuid() })
    const idx = slides.value.findIndex(s => s.id === slideId)
    slides.value.splice(idx + 1, 0, newSlide)
    activeSlideId.value = newSlide.id
  }

  function addElement(element) {
    if (!activeSlide.value) return
    activeSlide.value.elements.push(element)
  }

  function updateElement(elementId, updates) {
    if (!activeSlide.value) return
    const el = activeSlide.value.elements.find(e => e.id === elementId)
    if (el) Object.assign(el, updates)
  }

  function removeElement(elementId) {
    if (!activeSlide.value) return
    const idx = activeSlide.value.elements.findIndex(e => e.id === elementId)
    if (idx !== -1) activeSlide.value.elements.splice(idx, 1)
  }

  function clearAll() {
    slides.value = []
    activeSlideId.value = null
  }

  // Serialize for undo/redo snapshot
  function getSnapshot() {
    return JSON.parse(JSON.stringify({ slides: slides.value, activeSlideId: activeSlideId.value }))
  }

  function restoreSnapshot(snap) {
    slides.value = snap.slides
    activeSlideId.value = snap.activeSlideId
  }

  return {
    slides,
    activeSlideId,
    activeSlide,
    activeElements,
    addSlide,
    removeSlide,
    duplicateSlide,
    addElement,
    updateElement,
    removeElement,
    clearAll,
    getSnapshot,
    restoreSnapshot,
  }
})
