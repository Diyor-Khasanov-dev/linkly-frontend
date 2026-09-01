<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode'
import {
  QrCode,
  Download,
  Settings2,
  Copy,
  Check,
  Link2,
  Palette,
  Maximize2
} from 'lucide-vue-next'
import { useLinks } from '../../composables/useLinks'

const route = useRoute()
const { getBackendQrCodeUrl } = useLinks()

const inputUrl = ref('https://linkly.sh/creative-studio')
const qrCanvasRef = ref<HTMLCanvasElement | null>(null)
const qrFgColor = ref('#000000')
const qrBgColor = ref('#ffffff')
const qrSize = ref(220)
const copied = ref(false)
const isGenerating = ref(false)

const formatUrl = (input: string): string => {
  let trimmed = input.trim()
  if (!trimmed) return ''
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed
  }
  return trimmed
}

const generateQRCode = async () => {
  if (!qrCanvasRef.value) return
  isGenerating.value = true

  const urlToEncode = formatUrl(inputUrl.value) || 'https://linkly.sh'

  try {
    await QRCode.toCanvas(qrCanvasRef.value, urlToEncode, {
      width: qrSize.value,
      margin: 2,
      color: {
        dark: qrFgColor.value,
        light: qrBgColor.value
      }
    })
  } catch (err) {
    console.error('Failed to generate QR Code:', err)
  } finally {
    isGenerating.value = false
  }
}

onMounted(() => {
  if (route.query.url && typeof route.query.url === 'string') {
    inputUrl.value = route.query.url
  }
  generateQRCode()
})

watch([inputUrl, qrFgColor, qrBgColor, qrSize], () => {
  generateQRCode()
})

const downloadPNG = () => {
  if (qrCanvasRef.value) {
    const dataUrl = qrCanvasRef.value.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'linkly-qrcode.png'
    link.href = dataUrl
    link.click()
  } else {
    const urlToEncode = formatUrl(inputUrl.value) || 'https://linkly.sh'
    const imgUrl = getBackendQrCodeUrl(urlToEncode, {
      size: qrSize.value,
      dark: qrFgColor.value,
      light: qrBgColor.value
    })
    window.open(imgUrl, '_blank')
  }
}

const downloadSVG = () => {
  const urlToEncode = formatUrl(inputUrl.value) || 'https://linkly.sh'
  QRCode.toString(urlToEncode, {
    type: 'svg',
    width: qrSize.value,
    margin: 2,
    color: {
      dark: qrFgColor.value,
      light: qrBgColor.value
    }
  }).then(svgString => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'linkly-qrcode.svg'
    link.click()
    URL.revokeObjectURL(link.href)
  }).catch(err => {
    console.error('Failed to export SVG', err)
  })
}

const copyUrl = () => {
  navigator.clipboard.writeText(inputUrl.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-1">
      <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
        <QrCode class="w-6 h-6 text-purple-500" />
        <span>QR Code Generator</span>
      </h1>
      <p class="text-xs sm:text-sm text-[var(--text-secondary)]">
        Generate customized high-resolution QR codes from any web link or URL.
      </p>
    </div>

    <!-- Main Workspace Studio -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Config Controls -->
      <div class="lg:col-span-7 space-y-5">
        <!-- Input URL Card -->
        <div class="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-3">
          <label class="block text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
            <Link2 class="w-4 h-4 text-blue-400" />
            <span>Target URL to Encode</span>
          </label>
          <div class="relative">
            <input
              v-model="inputUrl"
              type="text"
              placeholder="https://yourdomain.com/landing-page"
              class="w-full pl-3.5 pr-10 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
            />
            <button
              @click="copyUrl"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
              title="Copy URL"
            >
              <Check v-if="copied" class="w-4 h-4 text-emerald-400" />
              <Copy v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Customization Controls Card -->
        <div class="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-5">
          <h3 class="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Settings2 class="w-4 h-4 text-purple-400" />
            <span>Style & Resolution Settings</span>
          </h3>

          <!-- Color Pickers -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl space-y-2">
              <span class="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                <Palette class="w-3.5 h-3.5 text-purple-400" />
                Foreground Color
              </span>
              <div class="flex items-center gap-3">
                <input
                  type="color"
                  v-model="qrFgColor"
                  class="w-8 h-8 rounded border border-[var(--border-color)] cursor-pointer bg-transparent"
                />
                <span class="text-xs font-mono font-semibold uppercase text-[var(--text-primary)]">{{ qrFgColor }}</span>
              </div>
            </div>

            <div class="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl space-y-2">
              <span class="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                <Palette class="w-3.5 h-3.5 text-zinc-400" />
                Background Color
              </span>
              <div class="flex items-center gap-3">
                <input
                  type="color"
                  v-model="qrBgColor"
                  class="w-8 h-8 rounded border border-[var(--border-color)] cursor-pointer bg-transparent"
                />
                <span class="text-xs font-mono font-semibold uppercase text-[var(--text-primary)]">{{ qrBgColor }}</span>
              </div>
            </div>
          </div>

          <!-- Size Resolution Slider -->
          <div class="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl space-y-2">
            <div class="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span class="flex items-center gap-1.5 font-medium">
                <Maximize2 class="w-3.5 h-3.5 text-blue-400" />
                QR Canvas Resolution
              </span>
              <span class="font-mono text-[var(--text-primary)] font-bold">{{ qrSize }} x {{ qrSize }} px</span>
            </div>
            <input
              type="range"
              v-model.number="qrSize"
              min="140"
              max="360"
              step="20"
              class="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <!-- Right Preview & Export Panel -->
      <div class="lg:col-span-5 flex flex-col items-center justify-between p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-6">
        <div class="text-center space-y-1">
          <h4 class="text-sm font-bold text-[var(--text-primary)]">Live QR Preview</h4>
          <p class="text-[11px] text-[var(--text-secondary)]">Scan with any smartphone camera to test</p>
        </div>

        <!-- Canvas Output -->
        <div class="p-5 rounded-2xl border border-[var(--border-color)] shadow-inner flex items-center justify-center bg-zinc-950/50">
          <canvas ref="qrCanvasRef" class="rounded shadow-md block max-w-full"></canvas>
        </div>

        <!-- Encoded URL Snippet -->
        <p class="text-[11px] font-mono text-[var(--text-secondary)] text-center truncate max-w-full px-2">
          {{ inputUrl || 'https://linkly.sh' }}
        </p>

        <!-- Download Action Buttons -->
        <div class="w-full flex items-center gap-3">
          <button
            @click="downloadPNG"
            class="flex-1 py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Download class="w-4 h-4" />
            <span>PNG</span>
          </button>
          <button
            @click="downloadSVG"
            class="flex-1 py-3 px-4 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
          >
            <Download class="w-4 h-4" />
            <span>SVG</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
