import { usePresentationStore } from '../stores/presentation.store.js'
import { useEditorStore } from '../stores/editor.store.js'
import { useHistoryStore } from '../stores/history.store.js'

export function useKeyboardShortcuts() {
  let handler = null

  function register() {
    handler = (e) => {
      const isCtrl = e.ctrlKey || e.metaKey
      const pres = usePresentationStore()
      const editor = useEditorStore()
      const history = useHistoryStore()

      if (isCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        history.undo()
      }

      if ((isCtrl && e.key === 'Z') || (isCtrl && e.shiftKey && e.key === 'z') || (isCtrl && e.key === 'y')) {
        e.preventDefault()
        history.redo()
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Don't delete if typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return
        e.preventDefault()
        if (editor.selectedElementId) {
          history.saveState()
          pres.removeElement(editor.selectedElementId)
          editor.deselectAll()
        }
      }

      if (isCtrl && e.key === 'd') {
        e.preventDefault()
        if (pres.activeSlideId) {
          pres.duplicateSlide(pres.activeSlideId)
        }
      }
    }

    document.addEventListener('keydown', handler)
  }

  function unregister() {
    if (handler) {
      document.removeEventListener('keydown', handler)
      handler = null
    }
  }

  return { register, unregister }
}
