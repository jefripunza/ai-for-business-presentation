<script setup>
import { computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePresentationStore } from '../../stores/presentation.store.js'
import { useEditorStore } from '../../stores/editor.store.js'
import { useHistoryStore } from '../../stores/history.store.js'

const presentation = usePresentationStore()
const editor = useEditorStore()
const history = useHistoryStore()

const { activeSlide } = storeToRefs(presentation)
const { selectedElementId } = storeToRefs(editor)

const selectedElement = computed(() => {
  if (!selectedElementId.value || !activeSlide.value) return null
  return activeSlide.value.elements.find(e => e.id === selectedElementId.value) || null
})

// Local form state (debounced to avoid reactivity flood)
const formText = ref('')
const formFontSize = ref(24)
const formFill = ref('#f0f6fc')
const formBgFill = ref('#238636')
const formFontStyle = ref('normal')

watch(selectedElement, (el) => {
  if (!el) return
  formText.value = el.type === 'text' ? el.text || '' : ''
  formFontSize.value = el.fontSize || 24
  formFill.value = el.type === 'text' ? el.fill || '#000' : el.fill || '#ff0000'
  formBgFill.value = el.type !== 'text' ? el.fill || '#ff0000' : '#238636'
  formFontStyle.value = el.fontStyle || 'normal'
}, { immediate: true })

function updateProp(key, value) {
  if (!selectedElementId.value) return
  history.saveState()
  presentation.updateElement(selectedElementId.value, { [key]: value })
}

function deleteSelected() {
  if (!selectedElementId.value) return
  history.saveState()
  presentation.removeElement(selectedElementId.value)
  editor.deselectAll()
}

// Background color picker
const bgColor = ref('#0d1117')
watch(bgColor, (val) => {
  if (activeSlide.value) {
    history.saveState()
    activeSlide.value.background = val
  }
})
watch(() => activeSlide.value?.background, (val) => {
  if (val) bgColor.value = val
})
</script>

<template>
  <div class="properties-panel">
    <h3 class="section-title">Properties</h3>

    <!-- Slide Background -->
    <div class="prop-group">
      <label class="prop-label">Background</label>
      <div class="color-row">
        <input type="color" v-model="bgColor" class="color-input" />
        <span class="color-value">{{ bgColor }}</span>
      </div>
    </div>

    <!-- Selected Element Properties -->
    <template v-if="selectedElement">
      <hr class="divider" />

      <div class="prop-group">
        <label class="prop-label">{{ selectedElement.type === 'text' ? 'Text' : 'Shape' }} Element</label>

        <!-- Position -->
        <div class="prop-row">
          <span>X: {{ Math.round(selectedElement.x) }}</span>
          <span>Y: {{ Math.round(selectedElement.y) }}</span>
        </div>

        <!-- Text properties -->
        <template v-if="selectedElement.type === 'text'">
          <label class="prop-label" style="margin-top:8px">Content</label>
          <textarea
            v-model="formText"
            class="prop-input"
            rows="3"
            @change="updateProp('text', formText)"
          />

          <label class="prop-label" style="margin-top:8px">Font Size</label>
          <input
            type="number"
            v-model.number="formFontSize"
            class="prop-input"
            min="8"
            max="200"
            @change="updateProp('fontSize', formFontSize)"
          />

          <label class="prop-label" style="margin-top:8px">Color</label>
          <input
            type="color"
            :value="formFill"
            class="color-input"
            @change="updateProp('fill', ($event.target).value)"
          />

          <label class="prop-label" style="margin-top:8px">Style</label>
          <select v-model="formFontStyle" class="prop-input" @change="updateProp('fontStyle', formFontStyle)">
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="italic">Italic</option>
          </select>
        </template>

        <!-- Shape properties -->
        <template v-if="selectedElement.type === 'rect'">
          <label class="prop-label" style="margin-top:8px">Color</label>
          <input
            type="color"
            :value="formBgFill"
            class="color-input"
            @change="updateProp('fill', ($event.target).value)"
          />

          <label class="prop-label" style="margin-top:8px">Corner Radius</label>
          <input
            type="range"
            min="0"
            max="40"
            :value="selectedElement.cornerRadius || 0"
            class="prop-range"
            @input="updateProp('cornerRadius', parseInt(($event.target).value))"
          />
          <span>{{ selectedElement.cornerRadius || 0 }}px</span>
        </template>

        <button class="delete-btn" @click="deleteSelected">
          🗑️ Delete Element
        </button>
      </div>
    </template>

    <div v-else class="no-selection">
      <p>Click an element on canvas to edit</p>
    </div>
  </div>
</template>

<style scoped>
.properties-panel { }
.section-title { font-size: 12px; font-weight: 600; color: #484f58; text-transform: uppercase; margin-bottom: 8px; }
.prop-group { margin-bottom: 12px; }
.prop-label { display: block; font-size: 12px; color: #8b949e; margin-bottom: 4px; }
.prop-row { display: flex; justify-content: space-between; font-size: 12px; color: #c9d1d9; }
.prop-input {
  width: 100%;
  background: #0d1117;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 13px;
}
textarea.prop-input { resize: vertical; }
.color-row { display: flex; align-items: center; gap: 8px; }
.color-input { width: 32px; height: 24px; border: none; cursor: pointer; border-radius: 4px; }
.color-value { font-size: 12px; color: #8b949e; font-family: monospace; }
.prop-range { width: 100%; accent-color: #58a6ff; }
.divider { border: none; border-top: 1px solid #21262d; margin: 8px 0; }
.delete-btn {
  width: 100%;
  margin-top: 12px;
  background: #da363322;
  border: 1px solid #f8514933;
  color: #f85149;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.delete-btn:hover { background: #da363344; }
.no-selection { font-size: 12px; color: #484f58; text-align: center; padding: 20px 0; }
select.prop-input { cursor: pointer; }
</style>
