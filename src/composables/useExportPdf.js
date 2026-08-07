import { jsPDF } from 'jspdf'

export function useExportPdf() {
  async function exportToPdf(slides, filename = 'presentation.pdf') {
    // We'll use DOM-based rendering for each slide
    const STAGE_W = 1280
    const STAGE_H = 720

    // PDF in landscape orientation, custom size matching 16:9 ratio
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [STAGE_W, STAGE_H],
    })

    // Create a hidden container to render slides
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;left:-9999px;top:0;width:1280px;height:720px;overflow:hidden;'

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]

      // Render slide as HTML
      const slideDiv = document.createElement('div')
      slideDiv.style.cssText = `width:${STAGE_W}px;height:${STAGE_H}px;background:${slide.background};position:relative;font-family:sans-serif;`

      for (const el of slide.elements) {
        const elDiv = document.createElement('div')
        elDiv.style.cssText = `position:absolute;left:${el.x}px;top:${el.y}px;`

        if (el.type === 'text') {
          elDiv.style.cssText += `font-size:${el.fontSize}px;color:${el.fill};`
          elDiv.style.cssText += `font-weight:${el.fontStyle === 'bold' ? 'bold' : 'normal'};`
          elDiv.style.cssText += `font-style:${el.fontStyle === 'italic' ? 'italic' : 'normal'};`
          elDiv.style.cssText += `text-align:${el.align || 'left'};`
          if (el.width) elDiv.style.cssText += `width:${el.width}px;`
          elDiv.style.cssText += `white-space:pre-wrap;line-height:1.3;`
          elDiv.textContent = el.text
        } else if (el.type === 'rect') {
          elDiv.style.cssText += `width:${el.width}px;height:${el.height}px;background:${el.fill};border-radius:${el.cornerRadius || 0}px;`
          if (el.stroke) elDiv.style.cssText += `border:${el.strokeWidth || 1}px solid ${el.stroke};`
        }

        slideDiv.appendChild(elDiv)
      }

      container.innerHTML = ''
      container.appendChild(slideDiv)

      // Add to DOM briefly for rendering
      // Note: html2canvas would be better here, but for simplicity
      // we'll save the slides directly as pages
      if (i > 0) pdf.addPage()
    }

    // For now, just add placeholder pages (actual canvas-to-image pipeline
    // requires a real DOM render which needs html2canvas or konva.toDataURL)
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]

      // Draw slide background
      pdf.setFillColor(hexToRgb(slide.background))
      pdf.rect(0, 0, STAGE_W, STAGE_H, 'F')

      // Draw each element
      for (const el of slide.elements) {
        if (el.type === 'text') {
          const size = Math.round(el.fontSize * 0.75) // px to pt approx
          pdf.setFontSize(size)
          pdf.setTextColor(hexToRgb(el.textFill || el.fill))
          const style = el.fontStyle === 'bold' ? 'bold' : el.fontStyle === 'italic' ? 'italic' : 'normal'
          pdf.setFont('helvetica', style || 'normal')
          // Adjust y to account for jsPDF coordinate system
          pdf.text(el.text || '', el.x, el.y + (el.fontSize || 24), {
            maxWidth: el.width || STAGE_W - el.x - 20,
            align: el.align || 'left',
          })
        } else if (el.type === 'rect') {
          const { r, g, b } = hexToRgb(el.fill)
          // Handle alpha in hex
          if (el.fill.length === 9) {
            // hex with alpha — skip semi-transparent fills
            pdf.setFillColor(r, g, b)
            pdf.setDrawColor(r, g, b)
          } else {
            pdf.setFillColor(r, g, b)
            pdf.setDrawColor(r, g, b)
          }
          pdf.roundedRect(el.x, el.y, el.width, el.height, el.cornerRadius || 0, el.cornerRadius || 0, el.fill !== 'transparent' ? 'F' : 'D')
        }
      }

      if (i < slides.length - 1) pdf.addPage()
    }

    pdf.save(filename)
    return true
  }

  function hexToRgb(hex) {
    if (!hex || hex === 'transparent') return { r: 0, g: 0, b: 0 }
    hex = hex.replace('#', '')
    // Handle shorthand like #fff
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    }
  }

  return { exportToPdf }
}
