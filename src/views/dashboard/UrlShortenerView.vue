<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Link2,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Search,
  BarChart2,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  QrCode
} from 'lucide-vue-next'
import { useLinks, type ShortLink } from '../../composables/useLinks'

const { createShortLink, fetchUserLinks, deleteShortLink, isLoading, linksList } = useLinks()

const originalUrl = ref('')
const customAlias = ref('')
const searchQuery = ref('')
const copiedId = ref<string | null>(null)
const errorMsg = ref('')
const successMsg = ref('')
const isFetching = ref(false)

onMounted(async () => {
  isFetching.value = true
  await fetchUserLinks()
  isFetching.value = false
})

const formatUrl = (input: string): string => {
  let trimmed = input.trim()
  if (!trimmed) return ''
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed
  }
  return trimmed
}

const handleCreateShortUrl = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (!originalUrl.value.trim()) return

  const validUrl = formatUrl(originalUrl.value)
  originalUrl.value = validUrl

  const result = await createShortLink(validUrl, customAlias.value)

  if (result.success && result.link) {
    successMsg.value = 'Link shortened successfully!'
    originalUrl.value = ''
    customAlias.value = ''
    await fetchUserLinks()
    setTimeout(() => {
      successMsg.value = ''
    }, 3000)
  } else {
    errorMsg.value = result.error || 'Failed to shorten link.'
  }
}

const copyToClipboard = (shortUrl: string, id: string) => {
  navigator.clipboard.writeText(shortUrl)
  copiedId.value = id
  setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

const deleteLink = async (shortCode: string) => {
  errorMsg.value = ''
  const result = await deleteShortLink(shortCode)
  if (result.success) {
    await fetchUserLinks()
  } else {
    errorMsg.value = result.error || 'Failed to delete link.'
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toISOString().split('T')[0]
  } catch {
    return dateStr
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-1">
      <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
        <Link2 class="w-6 h-6 text-blue-500" />
        <span>URL Shortener</span>
      </h1>
      <p class="text-xs sm:text-sm text-[var(--text-secondary)]">
        Create clean, branded short links with custom aliases and real-time tracking.
      </p>
    </div>

    <!-- Feedback messages -->
    <div v-if="errorMsg" class="p-3 bg-red-950/30 border border-red-800 text-red-400 rounded-xl text-xs flex items-center gap-2">
      <AlertCircle class="w-4 h-4 shrink-0" />
      <span>{{ errorMsg }}</span>
    </div>

    <div v-if="successMsg" class="p-3 bg-emerald-950/30 border border-emerald-800 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
      <Check class="w-4 h-4 shrink-0" />
      <span>{{ successMsg }}</span>
    </div>

    <!-- Creation Card Form -->
    <div class="p-4 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xs space-y-4">
      <form @submit.prevent="handleCreateShortUrl" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="md:col-span-2 relative min-w-0">
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Destination URL</label>
            <div class="relative">
              <input
                v-model="originalUrl"
                type="text"
                placeholder="https://your-long-website-link.com/page..."
                required
                class="w-full pl-3.5 pr-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm font-normal text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="min-w-0">
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Custom Alias (Optional)</label>
            <div class="flex items-center bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 min-w-0">
              <span class="text-xs text-zinc-500 font-mono shrink-0">linkly.sh/</span>
              <input
                v-model="customAlias"
                type="text"
                placeholder="alias"
                class="w-full min-w-0 bg-transparent text-xs font-mono text-[var(--text-primary)] focus:outline-none ml-1"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full sm:w-auto px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 text-blue-600 animate-spin" />
            <Sparkles v-else class="w-4 h-4 text-blue-600" />
            <span>{{ isLoading ? 'Shortening...' : 'Shorten Link' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Link History & Management -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 class="text-lg font-bold text-[var(--text-primary)]">Your Shortened Links</h2>
        <div class="relative w-full sm:w-64">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search links..."
            class="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none"
          />
        </div>
      </div>

      <!-- Table / Cards List -->
      <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xs">
        <div v-if="isFetching" class="p-8 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
          <Loader2 class="w-4 h-4 animate-spin text-blue-500" />
          <span>Loading links from backend...</span>
        </div>

        <div v-else class="divide-y divide-[var(--border-color)]">
          <div
            v-for="item in linksList.filter((i: ShortLink) => (i.shortCode || '').includes(searchQuery) || (i.destinationUrl || '').includes(searchQuery))"
            :key="item.id"
            class="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 hover:bg-[var(--bg-primary)]/50 transition"
          >
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap min-w-0">
                <a
                  :href="item.shortUrl"
                  target="_blank"
                  class="text-xs sm:text-sm font-semibold font-mono text-blue-400 hover:underline flex items-center gap-1 truncate max-w-full"
                >
                  <span class="truncate">{{ item.shortUrl }}</span>
                  <ArrowUpRight class="w-3.5 h-3.5 shrink-0" />
                </a>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono shrink-0">
                  {{ formatDate(item.createdAt) }}
                </span>
              </div>
              <p class="text-xs text-[var(--text-secondary)] truncate">
                {{ item.destinationUrl }}
              </p>
            </div>

            <!-- Stats & Controls -->
            <div class="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
              <div class="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-950/40 px-2.5 py-1.5 rounded-lg border border-zinc-800">
                <BarChart2 class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span class="font-semibold text-zinc-200">{{ item.clicks || 0 }}</span>
                <span>clicks</span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="copyToClipboard(item.shortUrl, item.id)"
                  class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Check v-if="copiedId === item.id" class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <Copy v-else class="w-3.5 h-3.5 shrink-0" />
                  <span>{{ copiedId === item.id ? 'Copied' : 'Copy' }}</span>
                </button>

                <router-link
                  :to="{ path: '/dashboard/qr-generator', query: { url: item.shortUrl } }"
                  class="p-1.5 rounded-lg text-zinc-400 hover:text-purple-400 hover:bg-purple-950/30 transition"
                  title="Generate QR Code"
                >
                  <QrCode class="w-4 h-4" />
                </router-link>

                <button
                  @click="deleteLink(item.shortCode)"
                  class="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer"
                  title="Delete Link"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="linksList.length === 0" class="p-8 text-center text-xs text-zinc-500">
            No shortened links created yet. Shorten your first link above!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
