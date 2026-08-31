<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'
import {
  Timer,
  Sparkles,
  Download,
  Copy,
  Check,
  Clock,
  Trash2,
  Calendar,
  Link2
} from 'lucide-vue-next'

interface ExpiringQrItem {
  id: string
  title: string
  targetUrl: string
  shortUrl: string
  expiresAt: string
  ttlHours: number
}

const targetUrl = ref('https://linkly.sh/event-pass-2025')
const ttlHours = ref(24)
const qrTitle = ref('VIP Pass QR')
const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
const copiedId = ref<string | null>(null)

const expiringQrCodes = ref<ExpiringQrItem[]>([
  {
    id: '1',
    title: 'Flash Event Entry Pass',
    targetUrl: 'https://linkly.sh/vip-entry-99',
    shortUrl: 'https://linkly.sh/eqr-vip-99',
    expiresAt: '2025-03-01 20:00',
    ttlHours: 12
  },
  {
    id: '2',
    title: 'One-time Discount Coupon',
    targetUrl: 'https://linkly.sh/coupon-50-off',
    shortUrl: 'https://linkly.sh/eqr-c50',
    expiresAt: '2025-03-02 18:00',
    ttlHours: 48
  }
])

const renderPreviewQr = async () => {
  if (!previewCanvasRef.value) return
  try {
    await QRCode.toCanvas(previewCanvasRef.value, targetUrl.value || 'https://linkly.sh', {
      width: 180,
      margin: 2,
      color: {
        dark: '#f43f5e',
        light: '#09090b'
      }
    })
  } catch (e) {
    console.error('QR preview rendering failed:', e)
  }
}

onMounted(() => renderPreviewQr())
watch([targetUrl], () => renderPreviewQr())

const handleGenerateExpiringQr = () => {
  if (!targetUrl.value.trim()) return

  const slug = 'eqr-' + Math.random().toString(36).substring(2, 7)
  const expiryDate = new Date(Date.now() + ttlHours.value * 3600 * 1000)

  const newQr: ExpiringQrItem = {
    id: Date.now().toString(),
    title: qrTitle.value.trim() || 'Temporary QR Code',
    targetUrl: targetUrl.value.trim(),
    shortUrl: `https://linkly.sh/${slug}`,
    expiresAt: expiryDate.toISOString().slice(0, 16).replace('T', ' '),
    ttlHours: ttlHours.value
  }

  expiringQrCodes.value.unshift(newQr)
}

const copyToClipboard = (shortUrl: string, id: string) => {
  navigator.clipboard.writeText(shortUrl)
  copiedId.value = id
  setTimeout(() => (copiedId.value = null), 2000)
}

const deleteQr = (id: string) => {
  expiringQrCodes.value = expiringQrCodes.value.filter(q => q.id !== id)
}

const downloadPreviewPNG = () => {
  if (!previewCanvasRef.value) return
  const dataUrl = previewCanvasRef.value.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `expiring-qr-${Date.now()}.png`
  link.href = dataUrl
  link.click()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-1">
      <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
        <Timer class="w-6 h-6 text-rose-500" />
        <span>Expiring QR Codes</span>
      </h1>
      <p class="text-xs sm:text-sm text-[var(--text-secondary)]">
        Create time-sensitive QR codes that expire automatically after a specified time duration.
      </p>
    </div>

    <!-- Generator & Preview Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Config Form -->
      <div class="lg:col-span-7 p-5 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
        <h3 class="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-rose-400" />
          <span>Configure Temporary QR Code</span>
        </h3>

        <form @submit.prevent="handleGenerateExpiringQr" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Label / Title</label>
            <input
              v-model="qrTitle"
              type="text"
              placeholder="e.g. VIP Entrance Pass"
              required
              class="w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm font-normal text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Destination URL</label>
            <input
              v-model="targetUrl"
              type="url"
              placeholder="https://..."
              required
              class="w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm font-normal font-mono text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <!-- Time-to-live slider -->
          <div>
            <div class="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1.5">
              <span class="flex items-center gap-1.5 font-semibold">
                <Clock class="w-3.5 h-3.5 text-rose-400" />
                Time to Live (TTL)
              </span>
              <span class="font-mono text-rose-400 font-bold">{{ ttlHours }} Hours</span>
            </div>
            <input
              type="range"
              v-model.number="ttlHours"
              min="1"
              max="168"
              step="1"
              class="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div class="flex justify-end pt-2">
            <button
              type="submit"
              class="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Timer class="w-4 h-4 text-rose-600" />
              <span>Create Expiring QR</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Preview Card -->
      <div class="lg:col-span-5 p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center justify-between space-y-4">
        <div class="text-center space-y-1">
          <h4 class="text-sm font-bold text-[var(--text-primary)]">QR Preview</h4>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/50 text-rose-400 border border-rose-800">
            Expires in {{ ttlHours }}h
          </span>
        </div>

        <div class="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
          <canvas ref="previewCanvasRef" class="block rounded"></canvas>
        </div>

        <button
          @click="downloadPreviewPNG"
          class="w-full py-2.5 px-4 bg-[var(--bg-primary)] hover:bg-zinc-800 text-zinc-200 border border-[var(--border-color)] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Download class="w-4 h-4" />
          <span>Download QR Image</span>
        </button>
      </div>
    </div>

    <!-- Active List -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold text-[var(--text-primary)]">Active Expiring QR Codes</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="item in expiringQrCodes"
          :key="item.id"
          class="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-3 flex flex-col justify-between"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <h4 class="text-sm font-bold text-[var(--text-primary)]">{{ item.title }}</h4>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                TTL: {{ item.ttlHours }}h
              </span>
            </div>

            <div class="flex items-center gap-1 text-xs text-rose-400 font-mono">
              <Link2 class="w-3.5 h-3.5" />
              <span>{{ item.shortUrl }}</span>
            </div>

            <div class="text-[11px] text-zinc-500 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5" />
              <span>Expires at: {{ item.expiresAt }}</span>
            </div>
          </div>

          <div class="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
            <button
              @click="copyToClipboard(item.shortUrl, item.id)"
              class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <Check v-if="copiedId === item.id" class="w-3.5 h-3.5 text-emerald-400" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copiedId === item.id ? 'Copied' : 'Copy Short URL' }}</span>
            </button>

            <button
              @click="deleteQr(item.id)"
              class="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition cursor-pointer"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
