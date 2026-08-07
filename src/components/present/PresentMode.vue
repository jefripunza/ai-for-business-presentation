<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { usePresentationStore } from '../../stores/presentation.store.js'

const emit = defineEmits(['close'])
const presentation = usePresentationStore()

const currentIndex = ref(0)
const totalSlides = ref(0)

onMounted(() => {
  totalSlides.value = presentation.slides.length
  currentIndex.value = presentation.slides.findIndex(s => s.id === presentation.activeSlideId)
  if (currentIndex.value < 0) currentIndex.value = 0
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(e) {
  if (e.key === 'Escape') { emit('close'); return }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { nextSlide(); return }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { prevSlide(); return }
}

function nextSlide() {
  if (currentIndex.value < totalSlides.value - 1) currentIndex.value++
}

function prevSlide() {
  if (currentIndex.value > 0) currentIndex.value--
}
</script>

<template>
  <div class="present-overlay">
    <div class="present-header">
      <span class="slide-counter">{{ currentIndex + 1 }} / {{ totalSlides }}</span>
      <button class="close-btn" @click="emit('close')">✕ Exit</button>
    </div>

    <div class="present-content">
      <button class="nav-btn prev" @click="prevSlide" :disabled="currentIndex === 0">◀</button>

      <div class="slide-display">
        <template v-for="(slide, idx) in presentation.slides" :key="slide.id">
          <div v-if="idx === currentIndex" class="present-slide" :style="{ background: slide.background }">
            <!-- Render elements as positioned divs (read-only) -->
            <template v-for="el in slide.elements" :key="el.id">
              <!-- Text element -->
              <div
                v-if="el.type === 'text'"
                class="present-el"
                :style="{
                  left: el.x + 'px',
                  top: el.y + 'px',
                  fontSize: el.fontSize + 'px',
                  color: el.fill,
                  fontWeight: el.fontStyle === 'bold' ? 'bold' : 'normal',
                  fontStyle: el.fontStyle === 'italic' ? 'italic' : 'normal',
                  textAlign: el.align || 'left',
                  width: el.width ? el.width + 'px' : 'auto',
                  transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                }"
              >{{ el.text }}</div>

              <!-- Rect element -->
              <div
                v-else-if="el.type === 'rect'"
                class="present-el"
                :style="{
                  left: el.x + 'px',
                  top: el.y + 'px',
                  width: el.width + 'px',
                  height: el.height + 'px',
                  background: el.fill,
                  borderRadius: (el.cornerRadius || 0) + 'px',
                  border: el.stroke ? `${el.strokeWidth || 1}px solid ${el.stroke}` : 'none',
                  transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                }"
              />
            </template>
          </div>
        </template>
      </div>

      <button class="nav-btn next" @click="nextSlide" :disabled="currentIndex >= totalSlides - 1">▶</button>
    </div>
  </div>
</template>

<style scoped>
.present-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 9999;
  background: #000;
  display: flex;
  flex-direction: column;
}
.present-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
}
.slide-counter { color: #8b949e; font-size: 14px; }
.close-btn {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.close-btn:hover { background: #30363d; }
.present-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px;
}
.nav-btn {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-btn:hover:not(:disabled) { background: #30363d; }
.nav-btn:disabled { opacity: 0.3; cursor: default; }
.slide-display {
  position: relative;
  width: 1280px;
  height: 720px;
  overflow: hidden;
}
.present-slide {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.present-slide {
  /* Scale to fit */
  max-width: 100%;
  max-height: 100%;
}
.present-el {
  position: absolute;
  pointer-events: none;
  white-space: pre-wrap;
  line-height: 1.3;
}
</style>
