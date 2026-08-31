<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import {
  Link2,
  QrCode,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Download,
  Settings2,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isAuthenticated } = useAuth()

const longUrl = ref('')
const customAlias = ref('')
const selectedTab = ref<'shorten' | 'qr'>('shorten')
const autoCopy = ref(true)

const shortenedLink = ref<string | null>(null)
const copied = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

// QR code generation state
const qrCanvasRef = ref<HTMLCanvasElement | null>(null)
const qrFgColor = ref('#fafafa')
const qrBgColor = ref('#121215')
const qrSize = ref(200)

// Pre-fill default demo URL
onMounted(() => {
  longUrl.value = 'https://github.com/vuejs/core/releases/tag/v3.5.0'
  generateQRCode()
})

const handleWidgetAction = () => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  } else {
    router.push('/register')
  }
}

const handleShorten = () => {
  handleWidgetAction()
}

const handleRedirectToRegister = () => {
  handleWidgetAction()
}

const generateQRCode = async () => {
  if (!qrCanvasRef.value) return
  const urlToEncode = shortenedLink.value || longUrl.value || 'https://linkly.sh'

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
    console.error('QR code generation failed', err)
  }
}

watch([shortenedLink, qrFgColor, qrBgColor, selectedTab], () => {
  if (selectedTab.value === 'qr' || shortenedLink.value) {
    setTimeout(generateQRCode, 50)
  }
})

const copyToClipboard = () => {
  if (!shortenedLink.value) return
  navigator.clipboard.writeText(shortenedLink.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto" id="shortener">
    <!-- Main Box Container -->
    <div class="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-none transition-all duration-300">

      <!-- Mode Tabs (Shortener vs QR Generator) -->
      <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-6">
        <div class="flex items-center gap-2 bg-[var(--bg-secondary)] p-1 rounded-xl">
          <button
            @click="selectedTab = 'shorten'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer',
              selectedTab === 'shorten'
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            ]"
          >
            <Link2 class="w-4 h-4" />
            <span>URL Shortener</span>
          </button>

          <button
            @click="selectedTab = 'qr'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer',
              selectedTab === 'qr'
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            ]"
            id="qr-generator"
          >
            <QrCode class="w-4 h-4" />
            <span>QR Studio</span>
          </button>
        </div>

        <!-- Badges -->
        <div class="hidden sm:flex items-center gap-4 text-xs text-[var(--text-secondary)] font-medium">
          <span class="flex items-center gap-1">
            <Zap class="w-3.5 h-3.5 text-amber-500" /> Fast Redirect
          </span>
          <span class="flex items-center gap-1">
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" /> Encrypted
          </span>
        </div>
      </div>

      <!-- URL Shortener Tab Body -->
      <div v-if="selectedTab === 'shorten'" class="space-y-5">
        <!-- Input Form -->
        <form @submit.prevent="handleShorten" class="space-y-4">
          <div class="relative flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-secondary)]">
                <Link2 class="w-5 h-5" />
              </div>
              <input
                v-model="longUrl"
                type="text"
                placeholder="Paste your long link here (e.g. https://example.com/very-long-path)..."
                class="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-normal text-[var(--text-primary)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-100 transition shadow-2xs"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-none disabled:opacity-50"
            >
              <Sparkles v-if="!isLoading" class="w-4 h-4 text-blue-600" />
              <span>{{ isLoading ? 'Shortening...' : 'Shorten Link' }}</span>
              <ArrowRight v-if="!isLoading" class="w-4 h-4" />
            </button>
          </div>

          <!-- Advanced Custom Alias Option -->
          <div class="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <span class="whitespace-nowrap font-medium text-[var(--text-primary)]">Custom Alias:</span>
              <div class="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5">
                <span class="text-zinc-500 select-none">linkly.sh/</span>
                <input
                  v-model="customAlias"
                  type="text"
                  placeholder="my-custom-name"
                  class="bg-transparent border-none text-[var(--text-primary)] focus:outline-none w-32 text-xs font-mono"
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" v-model="autoCopy" class="rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500" />
                <span>Auto-copy result</span>
              </label>
            </div>
          </div>
        </form>

        <p v-if="errorMsg" class="text-xs text-red-500 mt-1 font-medium">{{ errorMsg }}</p>

        <!-- Result Box -->
        <div v-if="shortenedLink" class="mt-6 pt-6 border-t border-[var(--border-color)] space-y-4">
          <div class="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
                  Ready
                </span>
                <span class="text-xs text-[var(--text-secondary)] truncate">Original: {{ longUrl }}</span>
              </div>
              <div class="text-base sm:text-lg font-mono font-bold text-[var(--text-primary)] tracking-tight truncate flex items-center gap-2">
                <a :href="shortenedLink" target="_blank" class="hover:underline hover:text-blue-400 flex items-center gap-1.5">
                  {{ shortenedLink }}
                  <ExternalLink class="w-4 h-4 opacity-70" />
                </a>
              </div>
            </div>

            <!-- Copy Action -->
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <button
                @click="copyToClipboard"
                class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-100 text-zinc-900 font-medium text-xs transition cursor-pointer"
              >
                <Check v-if="copied" class="w-4 h-4 text-emerald-600" />
                <Copy v-else class="w-4 h-4" />
                <span>{{ copied ? 'Copied!' : 'Copy Link' }}</span>
              </button>

              <button
                @click="selectedTab = 'qr'"
                class="px-3 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <QrCode class="w-4 h-4" />
                <span class="hidden sm:inline">QR Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- QR Generator Tab Body -->
      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- Canvas Display -->
          <div class="flex flex-col items-center justify-center p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
            <div class="p-4 bg-[var(--bg-secondary)] rounded-xl shadow-inner border border-[var(--border-color)]">
              <canvas ref="qrCanvasRef" class="block rounded"></canvas>
            </div>
            <p class="mt-4 text-xs font-mono text-[var(--text-secondary)] text-center truncate max-w-xs">
              {{ shortenedLink || longUrl || 'https://linkly.sh' }}
            </p>
          </div>

          <!-- Controls & Download -->
          <div class="space-y-5">
            <div>
              <h4 class="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Settings2 class="w-4 h-4" />
                <span>Customize QR Code</span>
              </h4>
              <p class="text-xs text-[var(--text-secondary)] mt-1">
                Customize appearance colors and download high-resolution QR formats for print or digital usage.
              </p>
            </div>

            <!-- Color controls -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Foreground Color</label>
                <div class="flex items-center gap-2">
                  <input type="color" v-model="qrFgColor" class="w-8 h-8 rounded border border-[var(--border-color)] cursor-pointer bg-transparent" />
                  <span class="text-xs font-mono text-[var(--text-primary)] uppercase">{{ qrFgColor }}</span>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Background Color</label>
                <div class="flex items-center gap-2">
                  <input type="color" v-model="qrBgColor" class="w-8 h-8 rounded border border-[var(--border-color)] cursor-pointer bg-transparent" />
                  <span class="text-xs font-mono text-[var(--text-primary)] uppercase">{{ qrBgColor }}</span>
                </div>
              </div>
            </div>

            <!-- Size Slider -->
            <div>
              <div class="flex justify-between items-center text-xs text-[var(--text-secondary)] mb-1.5">
                <span>Size Resolution</span>
                <span class="font-mono">{{ qrSize }}px</span>
              </div>
              <input
                type="range"
                v-model.number="qrSize"
                min="120"
                max="320"
                step="20"
                class="w-full accent-zinc-100 cursor-pointer"
              />
            </div>

            <!-- Download Buttons -->
            <div class="pt-2 flex items-center gap-3">
              <button
                @click="handleRedirectToRegister"
                class="flex-1 py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Download class="w-4 h-4" />
                <span>Download PNG</span>
              </button>
              <button
                @click="handleRedirectToRegister"
                class="flex-1 py-2.5 px-4 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
              >
                <Download class="w-4 h-4" />
                <span>Download SVG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
