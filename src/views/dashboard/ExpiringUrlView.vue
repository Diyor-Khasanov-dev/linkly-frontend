<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Clock,
  Sparkles,
  Copy,
  Check,
  ArrowUpRight,
  Trash2,
  Calendar,
  MousePointerClick,
  Loader2,
  AlertCircle
} from 'lucide-vue-next'
import { useLinks } from '../../composables/useLinks'

interface ExpiringUrlItem {
  id: string
  shortCode: string
  originalUrl: string
  shortUrl: string
  expiresAt: string | null
  maxClicks: number | null
  currentClicks: number
  status: 'active' | 'expired'
}

const { createShortLink, deleteShortLink, fetchUserLinks, linksList, isLoading: isApiLoading } = useLinks()

const targetUrl = ref('')
const expireDate = ref('')
const clickLimit = ref<number | null>(50)
const copiedId = ref<string | null>(null)
const errorMsg = ref('')
const isFetching = ref(false)

const expiringLinks = ref<ExpiringUrlItem[]>([])

const formatUrl = (input: string): string => {
  let trimmed = input.trim()
  if (!trimmed) return ''
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed
  }
  return trimmed
}

const loadExpiringLinks = async () => {
  isFetching.value = true
  await fetchUserLinks()

  const list: ExpiringUrlItem[] = linksList.value
    .filter(link => link.expiresAt || link.maxClicks || link.isExpired)
    .map(link => {
      const isExpiredByTime = link.expiresAt ? new Date(link.expiresAt).getTime() < Date.now() : false
      const isExpiredByClicks = link.maxClicks ? link.clicks >= link.maxClicks : false
      const isExpired = link.isExpired || isExpiredByTime || isExpiredByClicks

      return {
        id: link.id,
        shortCode: link.shortCode,
        originalUrl: link.destinationUrl,
        shortUrl: link.shortUrl,
        expiresAt: link.expiresAt ? link.expiresAt.replace('T', ' ').slice(0, 16) : null,
        maxClicks: link.maxClicks || null,
        currentClicks: link.clicks || 0,
        status: isExpired ? 'expired' : 'active'
      }
    })

  expiringLinks.value = list
  isFetching.value = false
}

onMounted(() => {
  loadExpiringLinks()
})

const handleCreateExpiringUrl = async () => {
  errorMsg.value = ''
  if (!targetUrl.value.trim()) return

  const validUrl = formatUrl(targetUrl.value)
  let isoExpiresAt: string | undefined

  if (expireDate.value) {
    isoExpiresAt = new Date(expireDate.value).toISOString()
  } else {
    // Default 48h expiration
    isoExpiresAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString()
  }

  const result = await createShortLink(validUrl, {
    expiresAt: isoExpiresAt,
    maxClicks: clickLimit.value || undefined
  })

  if (result.success && result.link) {
    targetUrl.value = ''
    expireDate.value = ''
    await loadExpiringLinks()
  } else {
    errorMsg.value = result.error || 'Failed to create expiring link.'
  }
}

const copyToClipboard = (shortUrl: string, id: string) => {
  navigator.clipboard.writeText(shortUrl)
  copiedId.value = id
  setTimeout(() => (copiedId.value = null), 2000)
}

const deleteItem = async (shortCode: string) => {
  errorMsg.value = ''
  const res = await deleteShortLink(shortCode)
  if (res.success) {
    await loadExpiringLinks()
  } else {
    errorMsg.value = res.error || 'Failed to delete expiring link.'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-1">
      <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
        <Clock class="w-6 h-6 text-rose-500" />
        <span>Expiring URL</span>
      </h1>
      <p class="text-xs sm:text-sm text-[var(--text-secondary)]">
        Generate temporary links that automatically self-destruct after a scheduled date or max click threshold.
      </p>
    </div>

    <!-- Creation Card -->
    <div class="p-5 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
      <h3 class="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-rose-400" />
        <span>Create Temporary Short Link</span>
      </h3>

      <form @submit.prevent="handleCreateExpiringUrl" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Destination URL</label>
          <input
            v-model="targetUrl"
            type="url"
            placeholder="https://your-confidential-document-or-promo.com..."
            required
            class="w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm font-normal text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5 text-rose-400" />
              <span>Expiration Date & Time</span>
            </label>
            <input
              v-model="expireDate"
              type="datetime-local"
              class="w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1">
              <MousePointerClick class="w-3.5 h-3.5 text-amber-400" />
              <span>Click Limit Threshold</span>
            </label>
            <input
              v-model.number="clickLimit"
              type="number"
              min="1"
              max="10000"
              placeholder="e.g. 50 clicks"
              class="w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        </div>

        <p v-if="errorMsg" class="text-xs text-red-500 font-medium bg-red-950/20 p-2.5 rounded-lg border border-red-900/50 flex items-center gap-2">
          <AlertCircle class="w-4 h-4 text-red-400" />
          <span>{{ errorMsg }}</span>
        </p>

        <div class="flex justify-end pt-2">
          <button
            type="submit"
            :disabled="isApiLoading"
            class="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Loader2 v-if="isApiLoading" class="w-4 h-4 text-rose-600 animate-spin" />
            <Clock v-else class="w-4 h-4 text-rose-600" />
            <span>{{ isApiLoading ? 'Creating...' : 'Generate Expiring Link' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Active Expiring Links List -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold text-[var(--text-primary)]">Active & Expired Temporary Links</h2>

      <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xs">
        <div class="divide-y divide-[var(--border-color)]">
          <div
            v-for="item in expiringLinks"
            :key="item.id"
            class="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--bg-primary)]/50 transition"
          >
            <div class="space-y-1.5 min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <a
                  :href="item.shortUrl"
                  target="_blank"
                  class="text-sm font-semibold font-mono text-rose-400 hover:underline flex items-center gap-1"
                >
                  <span>{{ item.shortUrl }}</span>
                  <ArrowUpRight class="w-3.5 h-3.5" />
                </a>

                <span
                  :class="[
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                    item.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  ]"
                >
                  {{ item.status === 'active' ? 'Active' : 'Expired / Limit Reached' }}
                </span>
              </div>

              <p class="text-xs text-[var(--text-secondary)] truncate">
                Target: {{ item.originalUrl }}
              </p>

              <div class="flex items-center gap-4 text-[11px] text-zinc-400 pt-1">
                <span v-if="item.expiresAt" class="flex items-center gap-1">
                  <Calendar class="w-3 h-3 text-zinc-500" />
                  Expires: {{ item.expiresAt }}
                </span>
                <span v-if="item.maxClicks" class="flex items-center gap-1">
                  <MousePointerClick class="w-3 h-3 text-zinc-500" />
                  Clicks: {{ item.currentClicks }} / {{ item.maxClicks }}
                </span>
                <span v-else class="flex items-center gap-1">
                  <MousePointerClick class="w-3 h-3 text-zinc-500" />
                  Clicks: {{ item.currentClicks }}
                </span>
              </div>
            </div>

            <!-- Controls -->
            <div class="flex items-center gap-3">
              <button
                @click="copyToClipboard(item.shortUrl, item.id)"
                :disabled="item.status === 'expired'"
                class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-100 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <Check v-if="copiedId === item.id" class="w-3.5 h-3.5 text-emerald-400" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedId === item.id ? 'Copied' : 'Copy' }}</span>
              </button>

              <button
                @click="deleteItem(item.shortCode)"
                class="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer"
                title="Delete item"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div v-if="expiringLinks.length === 0" class="p-8 text-center text-xs text-zinc-500">
            No expiring links created yet.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
