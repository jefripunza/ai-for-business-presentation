<script setup>
import { v4 as uuid } from 'uuid'
import { usePresentationStore } from '../../stores/presentation.store.js'
import { useEditorStore } from '../../stores/editor.store.js'
import { useHistoryStore } from '../../stores/history.store.js'

const presentation = usePresentationStore()
const history = useHistoryStore()

function addText() {
  history.saveState()
  presentation.addElement({
    id: uuid(),
    type: 'text',
    x: 200, y: 300,
    text: 'Double-click to edit',
    fontSize: 32,
    fill: '#f0f6fc',
    fontStyle: 'normal',
    align: 'left',
    width: 400,
  })
}

function addRect() {
  history.saveState()
  presentation.addElement({
    id: uuid(),
    type: 'rect',
    x: 200, y: 200,
    width: 200,
    height: 120,
    fill: '#238636',
    cornerRadius: 8,
  })
}

function addTitle() {
  history.saveState()
  presentation.addElement({
    id: uuid(),
    type: 'text',
    x: 100, y: 80,
    text: 'New Title',
    fontSize: 48,
    fill: '#f0f6fc',
    fontStyle: 'bold',
    align: 'left',
    width: 800,
  })
}
</script>

<template>
  <div class="toolbar">
    <h3 class="section-title">Insert</h3>
    <div class="tool-buttons">
      <button class="tool-btn" @click="addTitle" title="Add Title">📝 Title</button>
      <button class="tool-btn" @click="addText" title="Add Text Box">🔤 Text</button>
      <button class="tool-btn" @click="addRect" title="Add Rectangle">⬜ Shape</button>
    </div>
  </div>
</template>

<style scoped>
.toolbar { margin-bottom: 12px; }
.section-title { font-size: 12px; font-weight: 600; color: #484f58; text-transform: uppercase; margin-bottom: 6px; }
.tool-buttons { display: flex; flex-direction: column; gap: 4px; }
.tool-btn {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
}
.tool-btn:hover { background: #30363d; border-color: #58a6ff; }
</style>
