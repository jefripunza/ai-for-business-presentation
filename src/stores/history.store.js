import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePresentationStore } from './presentation.store.js'

export const useHistoryStore = defineStore('history', () => {
  const undoStack = ref([])
  const redoStack = ref([])
  const maxHistory = 50

  function saveState() {
    const store = usePresentationStore()
    const snapshot = store.getSnapshot()

    undoStack.value.push(snapshot)
    if (undoStack.value.length > maxHistory) {
      undoStack.value.shift() // remove oldest
    }
    // Clear redo stack when new action is taken
    redoStack.value = []
  }

  function undo() {
    if (undoStack.value.length === 0) return false

    const store = usePresentationStore()
    const current = store.getSnapshot()
    redoStack.value.push(current)

    const previous = undoStack.value.pop()
    store.restoreSnapshot(previous)
    return true
  }

  function redo() {
    if (redoStack.value.length === 0) return false

    const store = usePresentationStore()
    const current = store.getSnapshot()
    undoStack.value.push(current)

    const next = redoStack.value.pop()
    store.restoreSnapshot(next)
    return true
  }

  return { undoStack, redoStack, saveState, undo, redo }
})
