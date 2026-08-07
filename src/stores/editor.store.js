import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEditorStore = defineStore('editor', () => {
  const selectedElementId = ref(null)
  const zoom = ref(1)

  // Transformer node reference (for programmatic updates)
  const transformerNode = ref(null)

  function selectElement(id) {
    selectedElementId.value = id
  }

  function deselectAll() {
    selectedElementId.value = null
  }

  function setZoom(z) {
    zoom.value = Math.min(Math.max(z, 0.25), 3)
  }

  return {
    selectedElementId,
    zoom,
    transformerNode,
    selectElement,
    deselectAll,
    setZoom,
  }
})
