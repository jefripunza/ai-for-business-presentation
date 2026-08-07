<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { usePresentationStore } from '../../stores/presentation.store.js'
import { useEditorStore } from '../../stores/editor.store.js'
import { useHistoryStore } from '../../stores/history.store.js'

const presentation = usePresentationStore()
const editor = useEditorStore()
const history = useHistoryStore()

const { activeSlide, activeSlideId } = storeToRefs(presentation)

// Stage config: 1280x720 (16:9)
const STAGE_WIDTH = 1280
const STAGE_HEIGHT = 720

const stageConfig = computed(() => ({
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
}))

const konvaStage = ref(null)

// Scale canvas to fit container responsively
const containerRef = ref(null)
const canvasScale = ref(1)

function updateScale() {
  if (!containerRef.value) return
  const { clientWidth, clientHeight } = containerRef.value
  const scaleX = clientWidth / STAGE_WIDTH
  const scaleY = clientHeight / STAGE_HEIGHT
  canvasScale.value = Math.min(scaleX, scaleY, 1.5) // max 150%
}

// Watch resize
onMounted(() => {
  if (containerRef.value && typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(updateScale)
    observer.observe(containerRef.value)
    updateScale()
  } else {
    updateScale()
  }
})

// Konva event handlers
function handleStageClick(e) {
  // Click on empty area deselects
  if (e.target === e.target.getStage()) {
    editor.deselectAll()
  }
}

function handleDragEnd(elId, e) {
  history.saveState()
  presentation.updateElement(elId, {
    x: e.target.x(),
    y: e.target.y()
  })
}

function handleTransformEnd(elId, e) {
  history.saveState()
  const node = e.target
  presentation.updateElement(elId, {
    x: node.x(),
    y: node.y(),
    width: node.width() * node.scaleX(),
    height: node.height() * node.scaleY(),
    rotation: node.rotation()
  })
  // Reset scale
  node.scaleX(1)
  node.scaleY(1)
}

function handleElementSelect(elId) {
  editor.selectElement(elId)
}

// Element type to Konva component mapping
function getElementProps(el) {
  const base = {
    id: el.id,
    x: el.x,
    y: el.y,
    rotation: el.rotation || 0,
    draggable: true,
  }

  switch (el.type) {
    case 'text':
      return {
        ...base,
        text: el.text || '',
        fontSize: el.fontSize || 24,
        fill: el.fill || '#000',
        fontStyle: el.fontStyle || 'normal',
        align: el.align || 'left',
        width: el.width || 400,
      }
    case 'rect':
      return {
        ...base,
        width: el.width || 100,
        height: el.height || 60,
        fill: el.fill || '#ff0000',
        stroke: el.stroke || undefined,
        strokeWidth: el.strokeWidth || undefined,
        cornerRadius: el.cornerRadius || 0,
      }
    case 'image':
      return {
        ...base,
        width: el.width || 200,
        height: el.height || 150,
        src: el.src || '',
        image: undefined, // will be loaded by Konva
      }
    default:
      return base
  }
}
</script>

<template>
  <div ref="containerRef" class="stage-container">
    <div
      class="stage-scaler"
      :style="{ transform: `scale(${canvasScale})`, transformOrigin: 'center center' }"
    >
      <v-stage
        v-if="activeSlide"
        ref="konvaStage"
        :config="stageConfig"
        @click="handleStageClick"
        @tap="handleStageClick"
      >
        <!-- Background layer -->
        <v-layer>
          <v-rect
            :config="{
              x: 0, y: 0,
              width: STAGE_WIDTH, height: STAGE_HEIGHT,
              fill: activeSlide.background || '#ffffff'
            }"
          />
        </v-layer>

        <!-- Elements layer -->
        <v-layer ref="elementsLayer">
          <template v-for="el in activeSlide.elements" :key="el.id">
            <!-- Text element -->
            <v-text
              v-if="el.type === 'text'"
              :config="getElementProps(el)"
              @dragend="(e) => handleDragEnd(el.id, e)"
              @transformend="(e) => handleTransformEnd(el.id, e)"
              @click="() => handleElementSelect(el.id)"
              @tap="() => handleElementSelect(el.id)"
            />

            <!-- Rect element -->
            <v-rect
              v-else-if="el.type === 'rect'"
              :config="getElementProps(el)"
              @dragend="(e) => handleDragEnd(el.id, e)"
              @transformend="(e) => handleTransformEnd(el.id, e)"
              @click="() => handleElementSelect(el.id)"
              @tap="() => handleElementSelect(el.id)"
            />

            <!-- Image element -->
            <v-image
              v-else-if="el.type === 'image'"
              :config="getElementProps(el)"
              @dragend="(e) => handleDragEnd(el.id, e)"
              @transformend="(e) => handleTransformEnd(el.id, e)"
              @click="() => handleElementSelect(el.id)"
              @tap="() => handleElementSelect(el.id)"
            />
          </template>

          <!-- Transformer for selected element -->
          <v-transformer
            v-if="activeSlide.elements.length > 0"
            ref="transformer"
            :config="{
              boundBoxFunc: (oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) return oldBox
                return newBox
              }
            }"
          />
        </v-layer>
      </v-stage>
      <div v-else class="no-slide">
        <p>No slides yet. Click "Add Slide" to start.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stage-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.stage-scaler {
  display: inline-block;
}
.no-slide {
  color: #484f58;
  font-size: 18px;
  text-align: center;
}
</style>
