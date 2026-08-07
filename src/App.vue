<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'

let swiperInstance = null

const totalSlides = 10
const currentSlide = ref(0)
const swiperEl = ref(null)
const progressPercent = ref(0)

// Typewriter state: line1 → line2 → done (never resets)
const typeState = ref('line1')
const typeDone = ref(false)

onMounted(() => {
  nextTick(() => initSwiper())
  document.addEventListener('keydown', handleKeyboard)
  // Typewriter sequence — only once, never restart
  if (!typeDone.value) {
    setTimeout(() => { typeState.value = 'line2' }, 2200)
    setTimeout(() => { typeState.value = 'done'; typeDone.value = true }, 4400)
  }
})

const copyLabel = ref('📋 Copy Prompt!')

function copyPrompt() {
  const prompt = 'Buatkan website profesional untuk bisnis saya dengan ketentuan: (1) Tampilkan profil perusahaan, layanan, portofolio, dan kontak, (2) Desain modern, responsive mobile & desktop, (3) Optimasi SEO dasar, (4) Form kontak yang berfungsi, (5) Kecepatan loading cepat. Gunakan warna dan font yang sesuai dengan brand bisnis profesional.'
  navigator.clipboard?.writeText(prompt).then(() => {
    copyLabel.value = '📋 Copied!'
    setTimeout(() => { copyLabel.value = '📋 Copy Prompt!' }, 2000)
  })
}

onUnmounted(() => {
  if (swiperInstance) swiperInstance.destroy()
  document.removeEventListener('keydown', handleKeyboard)
})

function initSwiper() {
  if (!swiperEl.value) return
  swiperInstance = new Swiper(swiperEl.value, {
    direction: 'horizontal',
    loop: false,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 700,
    keyboard: { enabled: true },
    on: {
      slideChangeTransitionStart: (swiper) => {
        currentSlide.value = swiper.activeIndex
        progressPercent.value = ((swiper.activeIndex) / (totalSlides - 1)) * 100
      },
      slideChange: (swiper) => {
        currentSlide.value = swiper.activeIndex
        progressPercent.value = ((swiper.activeIndex) / (totalSlides - 1)) * 100
      },
    }
  })
}

function handleKeyboard(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') swiperInstance?.slideNext()
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') swiperInstance?.slidePrev()
  else if (e.key === 'f' || e.key === 'F') toggleFullscreen()
}

function goNext() { swiperInstance?.slideNext() }
function goPrev() { swiperInstance?.slidePrev() }

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {})
  else document.exitFullscreen()
}
</script>

<template>
  <div class="presentation-root">
    <!-- Progress Bar -->
    <div class="progress-bar-track">
      <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <div ref="swiperEl" class="swiper">
      <div class="swiper-wrapper">

        <!-- ===== SLIDE 1: TITLE ===== -->
        <div class="swiper-slide slide slide-center" style="background: radial-gradient(ellipse at 50% 30%, #0a1628 0%, #0d1117 70%);">
          <div class="slide-content center hero-layout">
            <div class="anim-item" style="--i:0">
              <h1 class="hero-title">AI for Business</h1>
            </div>
            <div class="anim-item" style="--i:1">
              <p :class="['typewriter-text', { 'typewriter-done': typeState !== 'line1' }]">Dari Bingung ke Untung</p>
            </div>
            <div class="anim-item" style="--i:2">
              <p :class="['typewriter-text', 'typewriter-line2', { 'typewriter-active': typeState === 'line2', 'typewriter-done': typeState === 'done' }]">Strategi Praktis Adopsi AI untuk Bisnis Anda</p>
            </div>
          </div>
          <div class="particles">
            <div v-for="n in 20" :key="'p'+n" class="particle"
              :style="{
                left: (Math.sin(n * 47) * 0.4 + 0.5) * 100 + '%',
                top: (Math.cos(n * 31) * 0.4 + 0.5) * 100 + '%',
                animationDelay: (n * 0.7) + 's',
                animationDuration: (4 + Math.sin(n) * 3) + 's',
                width: (2 + n % 3) + 'px',
                height: (2 + n % 3) + 'px',
                opacity: 0.15 + n % 3 * 0.1
              }"
            ></div>
          </div>
        </div>

        <!-- ===== SLIDE 2: PERKENALAN ===== -->
        <div class="swiper-slide slide" style="background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%);">
          <div class="slide-content" style="max-width: 900px;">
            <div class="intro-two-col">
              <!-- LEFT: photo + identity -->
              <div class="anim-item intro-left" style="--i:0">
                <div class="intro-photo-wrap">
                  <img src="/jefri.jpg" alt="Jefri Herdi Triyanto" class="intro-photo" />
                </div>
                <h2 class="slide-title" style="margin-top: 14px; text-align: center;">Jefri Herdi Triyanto, S.T., C.Me</h2>
                <p style="font-size: 15px; color: #8b949e; text-align: center; margin-top: 6px;">
                  <strong style="color: #e6edf3;">Principal Software Engineer</strong><br>CEO Sawang Tech
                </p>
                <div class="intro-skills" style="margin-top: 12px;">
                  <span class="skill-tag">AI/ML</span><span class="skill-tag">Docker</span><span class="skill-tag">CI/CD</span><span class="skill-tag">Coolify</span><span class="skill-tag">Cloud</span><span class="skill-tag">Cyber Security</span><span class="skill-tag">Vue/Node</span><span class="skill-tag">Python</span>
                </div>
              </div>
              <!-- RIGHT: experience -->
              <div class="anim-item intro-right" style="--i:1">
                <h3 style="font-size: 18px; color: #58a6ff; margin-bottom: 10px;">Experience</h3>
                <div class="exp-list" style="font-size: 12px;">
                  <div class="exp-item"><span class="exp-date">09/2024 — Present</span><strong>CEO</strong> · Sawang Teknologi Indonesia<div class="exp-sub">Yogyakarta</div></div>
                  <div class="exp-item"><span class="exp-date">11/2023 — 09/2024</span><strong>Principal Engineer</strong> · PT. Cloufina Nata Karya<div class="exp-sub">Yogyakarta · Onsite</div></div>
                  <div class="exp-item"><span class="exp-date">09/2023 — 11/2023</span><strong>Software Engineer</strong> · Vestis Labs S.A.R.L<div class="exp-sub">Luxembourg · Remote</div></div>
                  <div class="exp-item"><span class="exp-date">08/2023 — 11/2023</span><strong>Python Developer</strong> · PT. Cloufina Nata Karya<div class="exp-sub">Yogyakarta · Remote</div></div>
                  <div class="exp-item"><span class="exp-date">11/2022 — 07/2023</span><strong>Sr. Backend Engineer</strong> · Berijalan (Astra Group)<div class="exp-sub">Yogyakarta · Remote</div></div>
                  <div class="exp-item"><span class="exp-date">08/2022 — 09/2023</span><strong>Software Engineer</strong> · PT. Global Urban Esensial (Dexa)<div class="exp-sub">Tangerang Selatan · Remote</div></div>
                  <div class="exp-item"><span class="exp-date">01/2022 — 07/2022</span><strong>Mid Software Dev (NodeJS)</strong> · PT. Infosys Solusi Terpadu<div class="exp-sub">Yogyakarta · Onsite</div></div>
                  <div class="exp-item"><span class="exp-date">2021</span><strong>Full-Stack Dev</strong> · Lapak Merangin (Self-Project)<div class="exp-sub">Jambi · Hybrid</div></div>
                  <div class="exp-item"><span class="exp-date">2019 — 2020</span><strong>Programmer</strong> · BMKG Muaro Jambi<div class="exp-sub">Jambi · Onsite</div></div>
                  <div class="exp-item" style="background: rgba(88,166,255,0.06); border-color: rgba(88,166,255,0.15);">
                    <span class="exp-date">🎓 2015 — 2019</span><strong>S.T. Teknik Sipil</strong> · Universitas Jambi
                    <div class="exp-sub">📜 C.Me — Mediator · Universitas Gadjah Mada (2024)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== SLIDE 3: KENAPA AI BUKAN PILIHAN ===== -->
        <div class="swiper-slide slide" style="background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%);">
          <div class="slide-content">
            <div class="anim-item" style="--i:0">
              <div class="section-label">REALITAS 2026</div>
              <h2 class="slide-title">AI Bukan Lagi Pilihan,<br>Tapi <span class="text-gradient">Keharusan</span></h2>
            </div>
            <div class="feature-grid-2col" style="margin-top: 30px;">
              <div class="anim-item feature-card-v2" style="--i:1">
                <div class="fc-icon">🏃</div>
                <div class="fc-body">
                  <h4>Kompetitor Sudah Mulai</h4>
                  <p>73% bisnis di Asia Pasifik sudah mengadopsi AI dalam operasional harian. Yang diam akan tertinggal.</p>
                </div>
              </div>
              <div class="anim-item feature-card-v2" style="--i:2">
                <div class="fc-icon">📊</div>
                <div class="fc-body">
                  <h4>Efisiensi 40-60%</h4>
                  <p>Studi McKinsey: AI bisa menghemat 40-60% waktu kerja administratif. Itu berarti tim Anda bisa fokus ke hal strategis.</p>
                </div>
              </div>
              <div class="anim-item myth-card" style="--i:3">
                <div class="myth-label">❌ MITOS</div>
                <div class="myth-row"><span>AI itu mahal</span><span class="myth-arrow">→</span><span class="fact">Mulai dari Rp 0 dengan tools gratis</span></div>
                <div class="myth-row"><span>Harus punya tim IT</span><span class="myth-arrow">→</span><span class="fact">Cukup bisa chat/prompt</span></div>
                <div class="myth-row"><span>Ribet setup</span><span class="myth-arrow">→</span><span class="fact">5 menit langsung jalan</span></div>
              </div>
              <div class="anim-item feature-card-v2" style="--i:4;">
                <div class="fc-icon">✅</div>
                <div class="fc-body">
                  <h4>FAKTA</h4>
                  <p>Bukan soal teknologi canggih — tapi soal bisnis yang bertahan. AI adalah alat, bukan tujuan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== SLIDE 3: MASALAH NYATA ===== -->
        <div class="swiper-slide slide" style="background: linear-gradient(135deg, #0b0d17 0%, #0d1117 100%);">
          <div class="slide-content">
            <div class="anim-item" style="--i:0">
              <div class="section-label">PAIN POINTS</div>
              <h2 class="slide-title">Masalah Nyata yang<br><span class="text-gradient">Dihadapi Pelaku Bisnis</span></h2>
            </div>
            <div class="pain-grid">
              <div class="anim-item pain-card" style="--i:1">
                <div class="pain-num">01</div>
                <div class="pain-body">
                  <h4>⏰ Waktu habis untuk kerjaan berulang</h4>
                  <p>Balas chat, input data, follow-up — menghabiskan 3-4 jam per hari untuk hal yang sama</p>
                </div>
              </div>
              <div class="anim-item pain-card" style="--i:2">
                <div class="pain-num">02</div>
                <div class="pain-body">
                  <h4>🐌 Keputusan bisnis lambat</h4>
                  <p>Data tersebar di WhatsApp, Excel, nota — tidak terbaca jadi insight</p>
                </div>
              </div>
              <div class="anim-item pain-card" style="--i:3">
                <div class="pain-num">03</div>
                <div class="pain-body">
                  <h4>📈 Tim terbatas, tuntutan tinggi</h4>
                  <p>Pelanggan makin demanding — respon cepat, personal, 24/7</p>
                </div>
              </div>
              <div class="anim-item pain-card" style="--i:4">
                <div class="pain-num">04</div>
                <div class="pain-body">
                  <h4>🌐 Hambatan bikin produk digital</h4>
                  <p>Butuh developer, butuh server, butuh waktu setup — dulu. Sekarang?</p>
                </div>
              </div>
            </div>
            <div class="anim-item" style="--i:5">
              <p class="engage-text">🙋 Siapa di sini yang masih mengalami ini?</p>
            </div>
          </div>
        </div>

        <!-- ===== SLIDE 4: KERANGKA BERPIKIR ===== -->
        <div class="swiper-slide slide" style="background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);">
          <div class="slide-content center">
            <div class="anim-item" style="--i:0">
              <div class="section-label">FRAMEWORK</div>
              <h2 class="slide-title">Di Mana AI Bisa Masuk ke<br><span class="text-gradient">Proses Bisnis Anda?</span></h2>
            </div>
            <div class="biz-flow">
              <div class="anim-item biz-box" style="--i:1">
                <div class="biz-icon">📣</div>
                <div class="biz-label">Akuisisi</div>
                <div class="biz-detail">Marketing,<br>Lead Gen</div>
              </div>
              <div class="anim-item flow-arrow" style="--i:2">→</div>
              <div class="anim-item biz-box hot" style="--i:3">
                <div class="biz-icon">💬</div>
                <div class="biz-label">Layanan</div>
                <div class="biz-detail">CS, Support,<br>Follow-up</div>
                <div class="biz-badge">⭐ Mulai di sini</div>
              </div>
              <div class="anim-item flow-arrow" style="--i:4">→</div>
              <div class="anim-item biz-box" style="--i:5">
                <div class="biz-icon">⚙️</div>
                <div class="biz-label">Operasional</div>
                <div class="biz-detail">Admin, Data,<br>Dokumen</div>
              </div>
              <div class="anim-item flow-arrow" style="--i:6">→</div>
              <div class="anim-item biz-box" style="--i:7">
                <div class="biz-icon">📊</div>
                <div class="biz-label">Keputusan</div>
                <div class="biz-detail">Analisis,<br>Forecasting</div>
              </div>
            </div>
            <div class="anim-item" style="--i:8">
              <div class="principle-box">
                <div class="principle-icon">💡</div>
                <div>
                  <strong>Prinsip utama:</strong> Mulai dari <em>masalah</em>, bukan dari teknologi.<br>
                  <span style="color: #8b949e; font-size: 15px;">Titik termurah untuk diotomatisasi duluan → yang paling banyak menyita waktu.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== SLIDE 5: GONG — OPENCLAW ===== -->
        <div class="swiper-slide slide" style="background: linear-gradient(135deg, #0d1117 0%, #0b0d17 50%, #0d1117 100%);">
          <div class="slide-content center">
            <div class="anim-item" style="--i:0">
              <div class="section-label">THE SOLUTION</div>
              <h2 class="slide-title"><span class="text-gradient">OpenClaw</span><br>Jawaban Praktis untuk Bisnis Anda</h2>
            </div>
            <div class="anim-item" style="--i:1">
              <div class="hero-emoji" style="font-size:90px;margin:20px 0;">🦞</div>
            </div>
            <div class="gong-grid">
              <div class="anim-item gong-card" style="--i:2">
                <div class="gong-icon">🏠</div>
                <h4>Self-hosted</h4>
                <p>Jalan di server Anda sendiri. Data 100% milik Anda. Zero telemetry.</p>
              </div>
              <div class="anim-item gong-card" style="--i:3">
                <div class="gong-icon">🔌</div>
                <h4>Multi-channel</h4>
                <p>Satu Gateway: Telegram, WhatsApp, Discord, Slack, dan 10+ lainnya.</p>
              </div>
              <div class="anim-item gong-card" style="--i:4">
                <div class="gong-icon">🧠</div>
                <h4>AI Agent</h4>
                <p>Bangun website, jawab customer, analisis data — dari chat saja.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== SLIDE 6: SAWANG CLOUD ===== -->
        <div class="swiper-slide slide" style="background: linear-gradient(135deg, #0a1628 0%, #0d1117 50%, #0a1628 100%);">
          <div class="slide-content center">
            <div class="anim-item" style="--i:0">
              <div class="section-label">PRODUCT SHOWCASE</div>
              <h2 class="slide-title">Perkenalkan <span class="text-gradient">Sawang Cloud</span></h2>
            </div>
            <div class="anim-item" style="--i:1">
              <p class="slide-desc" style="max-width: 650px; margin: 12px auto 28px;">
                Platform infrastruktur digital berbasis AI — tiga produk inti untuk mengakselerasi bisnis Anda.
              </p>
            </div>
            <div class="sawang-grid-v2">
              <div class="anim-item sawang-product-card" style="--i:2">
                <div class="sp-icon">🦞</div>
                <div class="sp-badge">AI Agent Gateway</div>
                <h3>OpenClaw</h3>
                <p>Bangun & deploy AI agent dari chat. Multi-channel: Telegram, WhatsApp, Discord. Self-hosted, zero telemetry.</p>
                <a class="sp-link" href="https://openclaw.ai" target="_blank">openclaw.ai →</a>
              </div>
              <div class="anim-item sawang-product-card" style="--i:3">
                <div class="sp-icon">⚡</div>
                <div class="sp-badge">Workflow Automation</div>
                <h3>N8N</h3>
                <p>Otomatisasi workflow visual. Integrasikan 400+ layanan. Dari form → AI → database → notifikasi, semua otomatis.</p>
                <a class="sp-link" href="https://n8n.io" target="_blank">n8n.io →</a>
              </div>
              <div class="anim-item sawang-product-card" style="--i:4">
                <div class="sp-icon">🧠</div>
                <div class="sp-badge">AI Model Router</div>
                <h3>9Router</h3>
                <p>Satu API endpoint untuk semua model AI. Auto-failover, load balancing, cost optimization. OpenAI, Claude, Gemini, Llama — satu gateway.</p>
                <a class="sp-link" href="https://ai.jefripunza.com" target="_blank">ai.jefripunza.com →</a>
              </div>
            </div>
            <div class="anim-item" style="--i:5; margin-top: 22px;">
              <a class="cta-link" href="https://sawang.cloud" target="_blank">🌐 sawang.cloud</a>
            </div>
          </div>
        </div>

        <!-- ===== SLIDE 7: STUDI KASUS LIVE ===== -->
        <div class="swiper-slide slide" style="background: radial-gradient(ellipse at 30% 50%, #0a1628 0%, #0d1117 70%);">
          <div class="slide-content">
            <div class="anim-item" style="--i:0">
              <div class="section-label">LIVE DEMO</div>
              <h2 class="slide-title">Studi Kasus: Website<br><span class="text-gradient">Dari Nol → Online</span></h2>
            </div>
            <div class="case-study-grid">
              <div class="anim-item case-step" style="--i:1">
                <div class="case-icon">💬</div>
                <div class="case-body">
                  <h4>1. Prompt / Instruksi</h4>
                  <p>Deskripsikan website yang Anda inginkan dalam bahasa sehari-hari. Tidak perlu coding.</p>
                </div>
              </div>
              <div class="anim-item case-step" style="--i:2">
                <div class="case-icon">🏗️</div>
                <div class="case-body">
                  <h4>2. Build Otomatis</h4>
                  <p>AI langsung membangun website lengkap — desain, konten, responsive, semuanya.</p>
                </div>
              </div>
              <div class="anim-item case-step" style="--i:3">
                <div class="case-icon">🚀</div>
                <div class="case-body">
                  <h4>3. Deploy + Online</h4>
                  <p>Hosting & tunnel di-setup otomatis. Domain publik dalam hitungan menit.</p>
                </div>
              </div>
            </div>
            <div class="anim-item" style="--i:4">
              <div class="time-badge">
                ⏱️ Total waktu: <strong>dari ide → live di internet ~15 menit</strong>
              </div>
            </div>
            <div class="anim-item" style="--i:5">
              <div class="reflect-box">
                <strong>🤔 Refleksi:</strong> Apa yang biasanya jadi hambatan? Developer? Server? Waktu setup?<br>
                <span style="color: #7ee787;">Semua itu hilang dengan pendekatan ini.</span>
              </div>
            </div>
            <div class="anim-item" style="--i:6">
              <button class="copy-prompt-btn" @click="copyPrompt">{{ copyLabel }}</button>
            </div>
          </div>
        </div>

        <!-- ===== SLIDE 7: CARA MULAI ===== -->
        <div class="swiper-slide slide" style="background: linear-gradient(135deg, #161b22 0%, #0d1117 100%);">
          <div class="slide-content">
            <div class="anim-item" style="--i:0">
              <div class="section-label">ACTIONABLE</div>
              <h2 class="slide-title">Cara Mulai —<br><span class="text-gradient">Minggu Ini Juga</span></h2>
            </div>
            <div class="steps-v2">
              <div class="anim-item step-v2" style="--i:1">
                <div class="step-v2-num">01</div>
                <div class="step-v2-body">
                  <h4>Identifikasi 1 proses yang paling boros waktu</h4>
                  <p style="color:#8b949e;font-size:14px;">Pilih satu — balas chat customer, input data, atau bikin konten. Jangan semua sekaligus.</p>
                </div>
              </div>
              <div class="anim-item step-v2" style="--i:2">
                <div class="step-v2-num">02</div>
                <div class="step-v2-body">
                  <h4>Coba AI untuk proses itu selama 1 minggu</h4>
                  <p style="color:#8b949e;font-size:14px;">Gunakan prompt sederhana. Ukur hasilnya: berapa jam yang dihemat?</p>
                </div>
              </div>
              <div class="anim-item step-v2" style="--i:3">
                <div class="step-v2-num">03</div>
                <div class="step-v2-body">
                  <h4>Scale up dengan tools yang tepat</h4>
                  <p style="color:#8b949e;font-size:14px;">Kalau sudah terbukti, baru investasi di tool seperti OpenClaw untuk automasi penuh.</p>
                </div>
              </div>
            </div>
            <div class="anim-item" style="--i:4">
              <div class="mistakes-box">
                <strong>⚠️ Hindari kesalahan umum:</strong>
                <ul>
                  <li>❌ Mulai dari teknologi, bukan dari masalah</li>
                  <li>❌ Ingin otomatisasi semuanya sekaligus</li>
                  <li>❌ Tidak mengukur hasil sebelum & sesudah</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== SLIDE 9: CLOSING ===== -->
        <div class="swiper-slide slide slide-center" style="background: radial-gradient(ellipse at 50% 50%, #1a1a3e 0%, #0d1117 70%);">
          <div class="slide-content center hero-layout">
            <div class="anim-item" style="--i:0">
              <h1 class="hero-title" style="font-size: clamp(36px, 8vw, 60px);">Terima Kasih</h1>
            </div>
            <div class="anim-item" style="--i:1">
              <p style="font-size: clamp(16px, 3vw, 24px); color: #8b949e; margin-top: 16px;">
                Saatnya mulai adopsi AI untuk bisnis Anda.
              </p>
            </div>
            <div class="anim-item" style="--i:2">
              <p class="closing-text" style="margin-top: 32px; font-size: 26px; color: #58a6ff; font-weight: 700;">
                Q&A / Diskusi 🎤
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Navigation -->
    <div class="nav-bar">
      <button class="nav-btn-v2 fullscreen-btn" @click="toggleFullscreen" title="Fullscreen (F)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
      </button>
      <div class="nav-center">
        <button class="nav-btn-v2" @click="goPrev" :disabled="currentSlide === 0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="nav-dots">
          <span v-for="i in totalSlides" :key="i"
            :class="['nav-dot', { active: i - 1 === currentSlide }]"
            @click="swiperInstance?.slideTo(i - 1)"
          ></span>
        </div>
        <button class="nav-btn-v2" @click="goNext" :disabled="currentSlide >= totalSlides - 1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <span class="nav-page-indicator">{{ currentSlide + 1 }} / {{ totalSlides }}</span>
    </div>
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { width: 100%; height: 100%; overflow: hidden; font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif; background: #0d1117; color: #c9d1d9; }
.swiper { width: 100%; height: 100%; }
.swiper-wrapper { width: 100%; height: 100%; }
.swiper-slide { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }

/* Animations */
.anim-item { opacity: 0; transform: translateY(30px); transition: opacity 0.6s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1), filter 0.6s cubic-bezier(0.22, 0.61, 0.36, 1); filter: blur(3px); transition-delay: calc(var(--i, 0) * 0.1s); }
.swiper-slide-active .anim-item { opacity: 1; transform: translateY(0); filter: blur(0); }
.swiper-slide-active .benefit-card-v2, .swiper-slide-active .feature-card-v2, .swiper-slide-active .channel-tile, .swiper-slide-active .pain-card, .swiper-slide-active .case-step, .swiper-slide-active .gong-card { transition-delay: calc(var(--i, 0) * 0.08s + 0.1s); }
@keyframes floatParticle { 0%,100% { transform: translateY(0) translateX(0); } 25% { transform: translateY(-15px) translateX(8px); } 50% { transform: translateY(-5px) translateX(-5px); } 75% { transform: translateY(-20px) translateX(3px); } }
@keyframes pulse { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

.progress-bar-track { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: rgba(255,255,255,0.05); z-index: 200; pointer-events: none; }
.progress-bar-fill { height: 100%; background: linear-gradient(90deg, #58a6ff, #7ee787, #d2a8ff); background-size: 200% 100%; animation: shimmer 3s ease infinite; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 0 2px 2px 0; }
</style>

<style scoped>
.presentation-root { width: 100vw; height: 100vh; position: relative; background: #000; }

/* Hero */
.hero-layout { max-width: 900px; }
.hero-emoji { font-size: clamp(80px, 12vw, 140px); margin-bottom: 10px; filter: drop-shadow(0 0 60px rgba(88,166,255,0.3)); animation: pulse 3s ease-in-out infinite; }
.hero-title { font-size: clamp(38px, 7vw, 72px); font-weight: 800; color: #f0f6fc; letter-spacing: -0.03em; background: linear-gradient(135deg, #f0f6fc 0%, #58a6ff 50%, #d2a8ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-subtitle { font-size: clamp(18px, 3vw, 28px); color: #8b949e; margin-top: 12px; font-weight: 300; letter-spacing: 0.02em; }
.hero-tags { display: flex; gap: 14px; margin-top: 30px; flex-wrap: wrap; justify-content: center; }
.hero-tag { padding: 8px 20px; border-radius: 100px; font-size: 15px; font-weight: 500; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); backdrop-filter: blur(10px); color: #c9d1d9; transition: all 0.3s; }
.hero-tag:hover { border-color: #58a6ff; background: rgba(88,166,255,0.1); }

/* Section */
.section-label { font-size: 12px; font-weight: 700; letter-spacing: 0.15em; color: #58a6ff; text-transform: uppercase; margin-bottom: 8px; }
.text-gradient { background: linear-gradient(135deg, #58a6ff, #d2a8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

/* Typography */
.slide-content { width: 100%; max-width: 1100px; padding: 5vw 6vw; position: relative; z-index: 1; }
.slide-content.center { display: flex; flex-direction: column; align-items: center; text-align: center; }
.slide-title { font-size: clamp(26px, 4.5vw, 46px); font-weight: 800; color: #f0f6fc; line-height: 1.15; margin-bottom: 16px; letter-spacing: -0.02em; }

/* Feature cards (slide 2) */
.feature-grid-2col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 1000px; }
.feature-card-v2 { display: flex; gap: 16px; align-items: flex-start; padding: 20px 22px; border-radius: 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s ease; }
.feature-card-v2:hover { border-color: rgba(88,166,255,0.3); background: rgba(88,166,255,0.04); transform: translateY(-2px); }
.fc-icon { font-size: 32px; flex-shrink: 0; }
.fc-body h4 { font-size: 17px; font-weight: 700; color: #f0f6fc; margin-bottom: 4px; }
.fc-body p { font-size: 13px; color: #8b949e; line-height: 1.5; }

/* Myth card */
.myth-card { grid-column: 1 / -1; padding: 20px 24px; border-radius: 14px; background: rgba(248,81,73,0.06); border: 1px solid rgba(248,81,73,0.2); }
.myth-label { font-size: 13px; font-weight: 700; color: #f85149; margin-bottom: 10px; }
.myth-row { display: flex; gap: 12px; align-items: center; padding: 6px 0; font-size: 15px; color: #c9d1d9; }
.myth-arrow { color: #8b949e; font-weight: 700; }
.fact { color: #7ee787; font-weight: 600; }

/* Pain grid (slide 3) */
.pain-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin: 28px 0; }
.pain-card { display: flex; gap: 16px; padding: 22px 24px; border-radius: 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s; }
.pain-card:hover { border-color: rgba(88,166,255,0.25); transform: translateX(4px); }
.pain-num { font-size: 36px; font-weight: 800; background: linear-gradient(135deg, #58a6ff, #d2a8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; min-width: 52px; line-height: 1; padding-right: 4px; flex-shrink: 0; }
.pain-body h4 { font-size: 17px; font-weight: 700; color: #f0f6fc; margin-bottom: 6px; }
.pain-body p { font-size: 14px; color: #8b949e; line-height: 1.5; }
.engage-text { text-align: center; font-size: 20px; color: #58a6ff; margin-top: 8px; font-weight: 600; }

/* Biz flow (slide 4) */
.biz-flow { display: flex; align-items: flex-start; justify-content: center; gap: 0; margin: 30px 0 24px; flex-wrap: wrap; }
.biz-box { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 20px 24px; border-radius: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); min-width: 130px; transition: all 0.3s; position: relative; }
.biz-box.hot { border-color: rgba(88,166,255,0.4); background: rgba(31,111,235,0.1); box-shadow: 0 0 24px rgba(31,111,235,0.12); }
.biz-icon { font-size: 34px; }
.biz-label { font-size: 15px; font-weight: 700; color: #f0f6fc; }
.biz-detail { font-size: 12px; color: #8b949e; text-align: center; line-height: 1.4; }
.biz-badge { position: absolute; bottom: -10px; font-size: 11px; background: #238636; color: #fff; padding: 3px 10px; border-radius: 100px; font-weight: 600; white-space: nowrap; }
.flow-arrow { font-size: 32px; color: #484f58; padding: 18px 6px; }
.principle-box { display: flex; gap: 14px; align-items: flex-start; padding: 18px 24px; border-radius: 14px; background: rgba(88,166,255,0.05); border: 1px solid rgba(88,166,255,0.15); font-size: 16px; color: #c9d1d9; line-height: 1.5; max-width: 700px; }
.principle-icon { font-size: 28px; flex-shrink: 0; }

/* Intro / Perkenalan */
.intro-photo-wrap {
  width: clamp(160px, 28vw, 240px);
  height: clamp(160px, 28vw, 240px);
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(88,166,255,0.3);
  box-shadow: 0 0 40px rgba(88,166,255,0.15);
  margin: 12px auto;
}
.intro-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.intro-badges { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 12px; max-width: 620px; }
.intro-badge { padding: 6px 14px; border-radius: 20px; background: rgba(88,166,255,0.08); border: 1px solid rgba(88,166,255,0.2); font-size: 13px; color: #a5d6ff; font-weight: 500; }
.intro-skills { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 10px; }
.skill-tag { padding: 4px 12px; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #8b949e; }

/* Intro two-column layout */
.intro-two-col { display: flex; gap: 40px; align-items: center; }
.intro-left { flex: 1; display: flex; flex-direction: column; align-items: center; }
.intro-right { flex: 1.2; }
.exp-list { display: flex; flex-direction: column; gap: 6px; max-height: 430px; overflow-y: auto; padding-right: 4px; }
.exp-list::-webkit-scrollbar { width: 4px; }
.exp-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
.exp-item { padding: 7px 12px; border-radius: 8px; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #c9d1d9; transition: all 0.25s; }
.exp-item:hover { border-color: rgba(88,166,255,0.2); background: rgba(88,166,255,0.03); }
.exp-item strong { color: #f0f6fc; font-size: 13px; }
.exp-date { font-size: 11px; color: #58a6ff; font-weight: 600; margin-right: 6px; font-family: 'SF Mono', monospace; }
.exp-sub { font-size: 11px; color: #8b949e; margin-top: 2px; }

/* Case study (slide 5) */
.case-study-grid { display: flex; flex-direction: column; gap: 18px; margin: 30px 0; max-width: 750px; }
.case-step { display: flex; gap: 18px; align-items: flex-start; padding: 20px 24px; border-radius: 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s; }
.case-step:hover { border-color: rgba(88,166,255,0.3); transform: translateX(6px); }
.case-icon { font-size: 38px; flex-shrink: 0; }
.case-body h4 { font-size: 18px; font-weight: 700; color: #f0f6fc; margin-bottom: 6px; }
.case-body p { font-size: 14px; color: #8b949e; line-height: 1.5; }
.time-badge { text-align: center; padding: 14px 24px; border-radius: 14px; background: rgba(35,134,54,0.08); border: 1px solid rgba(35,134,54,0.3); font-size: 18px; color: #7ee787; margin-top: 4px; }
.reflect-box { padding: 16px 22px; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); font-size: 15px; color: #c9d1d9; line-height: 1.6; margin-top: 18px; }

/* Gong (slide 6) */
.gong-grid { display: flex; gap: 20px; margin-top: 28px; flex-wrap: wrap; justify-content: center; }
.gong-card { flex: 1; min-width: 220px; max-width: 280px; padding: 28px 22px; border-radius: 18px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); text-align: center; transition: all 0.35s; }
.gong-card:hover { border-color: rgba(88,166,255,0.3); background: rgba(88,166,255,0.03); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
.gong-icon { font-size: 42px; margin-bottom: 12px; }

/* Steps (slide 7) */
.steps-v2 { display: flex; flex-direction: column; gap: 18px; margin: 28px 0; max-width: 800px; }
.step-v2 { display: flex; gap: 20px; align-items: flex-start; padding: 22px 26px; border-radius: 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s; }
.step-v2:hover { border-color: rgba(88,166,255,0.3); transform: translateX(6px); }
.step-v2-num { font-size: 30px; font-weight: 800; background: linear-gradient(135deg, #58a6ff, #d2a8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; min-width: 45px; }
.step-v2-body h4 { font-size: 18px; font-weight: 700; color: #f0f6fc; margin-bottom: 4px; }
.mistakes-box { padding: 18px 24px; border-radius: 14px; background: rgba(248,81,73,0.05); border: 1px solid rgba(248,81,73,0.18); font-size: 15px; line-height: 1.6; max-width: 800px; }
.mistakes-box ul { margin: 6px 0 0 16px; }
.mistakes-box li { color: #8b949e; margin: 4px 0; }

/* CTA */
.cta-link { display: inline-flex; align-items: center; gap: 8px; font-size: 19px; color: #58a6ff; text-decoration: none; padding: 12px 22px; border-radius: 12px; border: 1px solid rgba(88,166,255,0.2); background: rgba(88,166,255,0.05); transition: all 0.3s; }
.cta-link:hover { background: rgba(88,166,255,0.12); border-color: rgba(88,166,255,0.4); transform: scale(1.03); }
.closing-text { font-size: 17px; color: #8b949e; }
.closing-quote { font-size: 15px; color: #484f58; margin-top: 16px; font-style: italic; }

/* Copy prompt button */
.copy-prompt-btn {
  display: inline-block;
  margin-top: 14px;
  padding: 12px 28px;
  font-size: 17px;
  font-weight: 700;
  color: #f0f6fc;
  background: linear-gradient(135deg, #238636, #2ea043);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}
.copy-prompt-btn:hover { background: linear-gradient(135deg, #2ea043, #3fb950); transform: scale(1.05); box-shadow: 0 6px 24px rgba(46,160,67,0.35); }

/* Sawang Cloud 3-product grid */
.sawang-grid-v2 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 900px; margin-top: 6px; }
.sawang-product-card {
  padding: 28px 22px;
  border-radius: 18px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  text-align: center;
  transition: all 0.35s;
}
.sawang-product-card:hover { border-color: rgba(88,166,255,0.3); background: rgba(88,166,255,0.04); transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.4); }
.sp-icon { font-size: 48px; margin-bottom: 8px; }
.sp-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(88,166,255,0.12); border: 1px solid rgba(88,166,255,0.25); font-size: 12px; font-weight: 700; color: #58a6ff; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
.sawang-product-card h3 { font-size: 22px; font-weight: 700; color: #f0f6fc; margin-bottom: 8px; }
.sawang-product-card p { font-size: 14px; color: #8b949e; line-height: 1.6; }
.sp-link { display: inline-block; margin-top: 12px; font-size: 14px; color: #58a6ff; text-decoration: none; font-weight: 600; transition: color 0.2s; }
.sp-link:hover { color: #a5d6ff; }

/* Typewriter effect for slide 1 subtitles */
.typewriter-text {
  font-size: clamp(18px, 3vw, 28px);
  color: #8b949e;
  margin-top: 8px;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace;
  font-weight: 400;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
  border-right: 2px solid #58a6ff;
  animation: typewriter 2s steps(28, end) forwards, blink 0.8s step-end infinite;
}
.typewriter-text.typewriter-done {
  border-right-color: transparent;
  animation: typewriter 2s steps(28, end) forwards;
}
.typewriter-line2 {
  font-size: clamp(16px, 2.5vw, 22px);
  color: #58a6ff;
  margin-top: 0;
  width: 0;
  border-right-color: transparent;
  animation: none;
}
.typewriter-line2.typewriter-active {
  width: auto;
  border-right-color: #58a6ff;
  animation: typewriter 2.5s steps(32, end) forwards, blink 0.8s steps(1, end) infinite;
}
/* After typewriter completes: keep text visible + cursor blinking */
.typewriter-line2.typewriter-done {
  width: auto;
  border-right-color: #58a6ff;
  animation: blink 0.8s steps(1, end) infinite;
}
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes blink {
  0%, 100% { border-right-color: #58a6ff; }
  50% { border-right-color: transparent; }
}

/* Nav bar */
.nav-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; z-index: 100; background: linear-gradient(transparent, rgba(13,17,23,0.95) 40%); pointer-events: none; }
.nav-bar > * { pointer-events: auto; }
.nav-center { display: flex; align-items: center; gap: 14px; }
.nav-btn-v2 { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12); background: rgba(22,27,34,0.7); backdrop-filter: blur(10px); color: rgba(255,255,255,0.65); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.nav-btn-v2:hover:not(:disabled) { background: rgba(31,111,235,0.25); border-color: rgba(88,166,255,0.5); color: #fff; transform: scale(1.08); }
.nav-btn-v2:disabled { opacity: 0.2; cursor: default; }
.nav-dots { display: flex; gap: 7px; }
.nav-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; transition: all 0.3s; }
.nav-dot.active { background: #58a6ff; box-shadow: 0 0 8px rgba(88,166,255,0.5); width: 22px; border-radius: 4px; }
.nav-dot:hover:not(.active) { background: rgba(255,255,255,0.3); }
.nav-page-indicator { font-size: 13px; color: rgba(255,255,255,0.35); font-variant-numeric: tabular-nums; user-select: none; }

/* Particles */
.particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.particle { position: absolute; border-radius: 50%; background: rgba(88,166,255,0.5); animation: floatParticle 6s ease-in-out infinite; }

/* ============================================= RESPONSIVE ============================================= */
@media (max-width: 1024px) {
  .slide-content { padding: 5vw 5vw; }
  .hero-title { font-size: clamp(32px, 8vw, 50px); }
  .hero-emoji { font-size: clamp(60px, 14vw, 100px); }
  .hero-subtitle { font-size: clamp(15px, 2.8vw, 22px); }
  .hero-tags { gap: 8px; }
  .hero-tag { font-size: 13px; padding: 7px 14px; }
  .slide-title { font-size: clamp(22px, 5vw, 34px); }
  .section-label { font-size: 10px; }
  .feature-grid-2col { gap: 12px; max-width: 100%; }
  .feature-card-v2 { padding: 16px 18px; gap: 12px; }
  .fc-icon { font-size: 26px; }
  .fc-body h4 { font-size: 15px; }
  .fc-body p { font-size: 12px; }
  .myth-row { font-size: 13px; }
  .pain-grid { gap: 12px; }
  .pain-card { padding: 16px 18px; }
  .biz-box { padding: 16px 18px; min-width: 110px; }
  .biz-icon { font-size: 28px; }
  .flow-arrow { font-size: 24px; padding: 14px 4px; }
  .gong-card { flex: 1; min-width: 180px; padding: 22px 18px; }
  .gong-icon { font-size: 34px; }
  .nav-bar { height: 52px; padding: 0 12px; }
  .nav-center { gap: 8px; }
  .nav-btn-v2 { width: 36px; height: 36px; }
}

@media (max-width: 640px) {
  .swiper-slide { overflow-y: auto; -webkit-overflow-scrolling: touch; }
  .swiper-slide.slide-center { align-items: center; justify-content: center; }
  .slide-content { padding: 24px 16px 80px; }
  .hero-layout { max-width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 100%; }
  .hero-layout .swiper-slide { align-items: center; justify-content: center; }
  .typewriter-text { white-space: normal !important; word-break: break-word; text-align: center; }
  .typewriter-line2 { white-space: normal !important; text-align: center; }
  .hero-emoji { font-size: 60px; margin-bottom: 0; }
  .hero-title { font-size: clamp(28px, 8vw, 40px); }
  .hero-subtitle { font-size: 16px; margin-top: 6px; }
  .hero-tags { flex-direction: column; align-items: center; gap: 6px; margin-top: 18px; }
  .slide-title { font-size: 22px; margin-bottom: 10px; }
  .feature-grid-2col { grid-template-columns: 1fr; gap: 10px; }
  .pain-grid { grid-template-columns: 1fr; gap: 10px; }
  .pain-num { font-size: 28px; min-width: 32px; }
  .pain-body h4 { font-size: 15px; }
  .engage-text { font-size: 16px; }
  .biz-flow { flex-direction: column; align-items: center; gap: 8px; }
  .flow-arrow { transform: rotate(90deg); padding: 0; font-size: 20px; }
  .biz-box { flex-direction: row; width: 100%; gap: 12px; padding: 14px 16px; }
  .principle-box { flex-direction: column; font-size: 14px; }
  .case-study-grid { gap: 12px; }
  .case-step { padding: 14px 16px; gap: 12px; }
  .case-icon { font-size: 30px; }
  .case-body h4 { font-size: 16px; }
  .time-badge { font-size: 15px; padding: 10px 16px; }
  .gong-grid { flex-direction: column; align-items: center; }
  .gong-card { max-width: 100%; min-width: 0; width: 100%; }
  .steps-v2 { gap: 10px; }
  .step-v2 { padding: 14px 16px; gap: 12px; flex-direction: column; }
  .nav-bar { height: 48px; padding: 0 8px; }
  .nav-btn-v2 { width: 32px; height: 32px; }
  .nav-btn-v2 svg { width: 14px; height: 14px; }
  .cta-link { font-size: 15px; padding: 10px 14px; }
}

@media (max-width: 380px) {
  .swiper-slide { overflow-y: auto; align-items: flex-start; -webkit-overflow-scrolling: touch; }
  .slide-content { padding: 16px 10px 70px; }
  .hero-emoji { font-size: 44px; }
  .hero-title { font-size: 22px; }
  .hero-subtitle { font-size: 13px; }
  .slide-title { font-size: 18px; }
  .nav-bar { padding: 0 4px; }
  .nav-btn-v2 { width: 28px; height: 28px; }
  .nav-center { gap: 4px; }
}
</style>
