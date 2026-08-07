<script setup>
import { storeToRefs } from 'pinia'
import { usePresentationStore } from '../../stores/presentation.store.js'

const presentation = usePresentationStore()
const { slides, activeSlideId } = storeToRefs(presentation)

function setActive(slideId) {
  presentation.activeSlideId = slideId
}

function addNewSlide() {
  presentation.addSlide({
    background: '#161b22',
    elements: []
  })
}

function removeSlide(slideId) {
  if (slides.value.length <= 1) return
  presentation.removeSlide(slideId)
}

function duplicateSlide(slideId) {
  presentation.duplicateSlide(slideId)
}
</script>

<template>
  <div class="thumbnail-list">
    <h3 class="title">Slides</h3>

    <div
      v-for="(slide, idx) in slides"
      :key="slide.id"
      :class="['thumb-item', { active: slide.id === activeSlideId }]"
      @click="setActive(slide.id)"
    >
      <div class="thumb-preview" :style="{ background: slide.background }">
        <!-- Render first 3 elements as mock -->
        <div
          v-for="el in slide.elements.slice(0, 5)"
          :key="el.id"
          class="thumb-el"
          :style="{
            left: (el.x / 12.8 * 0.8) + '%',
            top: (el.y / 7.2 * 0.8) + '%',
            fontSize: Math.min((el.fontSize || 24) * 0.08, 6) + 'px',
            color: el.fill || '#fff',
            fontWeight: el.fontStyle === 'bold' ? 'bold' : 'normal'
          }"
        >
          {{ el.type === 'text' ? (el.text || '').slice(0, 15) : '■' }}
        </div>
      </div>
      <span class="thumb-label">Slide {{ idx + 1 }}</span>
      <div class="thumb-actions">
        <button class="mini-btn" @click.stop="duplicateSlide(slide.id)" title="Duplicate">⧉</button>
        <button
          v-if="slides.length > 1"
          class="mini-btn danger"
          @click.stop="removeSlide(slide.id)"
          title="Delete"
        >✕</button>
      </div>
    </div>

    <button class="add-slide-btn" @click="addNewSlide">+ Add Slide</button>
  </div>
</template>

<style scoped>
.thumbnail-list { display: flex; flex-direction: column; gap: 8px; }
.title { font-size: 14px; font-weight: 600; color: #8b949e; margin-bottom: 4px; }
.thumb-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
}
.thumb-item.active { border-color: #58a6ff; background: #1f6feb11; }
.thumb-item:hover { background: #21262d; }
.thumb-preview {
  width: 80px;
  height: 45px;
  border-radius: 2px;
  border: 1px solid #30363d;
  position: relative;
  overflow: hidden;
}
.thumb-el {
  position: absolute;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60px;
}
.thumb-label { font-size: 12px; color: #8b949e; flex: 1; }
.thumb-actions { display: flex; gap: 2px; }
.mini-btn {
  background: none;
  border: none;
  color: #8b949e;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 3px;
}
.mini-btn:hover { color: #f0f6fc; background: #30363d; }
.mini-btn.danger:hover { color: #f85149; }
.add-slide-btn {
  background: #21262d;
  border: 1px dashed #30363d;
  color: #58a6ff;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.add-slide-btn:hover { background: #30363d; }
</style>
