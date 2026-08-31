<script setup lang="ts">
import { ref } from 'vue'
import {
  Link2,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Search,
  BarChart2,
  ArrowUpRight
} from 'lucide-vue-next'

interface ShortenedUrlItem {
  id: string
  originalUrl: string
  shortUrl: string
  alias: string
  createdAt: string
  clicks: number
}

const originalUrl = ref('')
const customAlias = ref('')
const searchQuery = ref('')
const copiedId = ref<string | null>(null)

const history = ref<ShortenedUrlItem[]>([
  {
    id: '1',
    originalUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    shortUrl: 'https://linkly.sh/mdn-js-guide',
    alias: 'mdn-js-guide',
    createdAt: '2025-02-28',
    clicks: 142
  },
  {
    id: '2',
    originalUrl: 'https://tailwindcss.com/docs/installation',
    shortUrl: 'https://linkly.sh/tailwind-docs',
    alias: 'tailwind-docs',
    createdAt: '2025-02-27',
    clicks: 89
  },
  {
    id: '3',
    originalUrl: 'https://vuejs.org/guide/introduction.html',
    shortUrl: 'https://linkly.sh/vue3-guide',
    alias: 'vue3-guide',
    createdAt: '2025-02-25',
    clicks: 310
  }
])

const handleCreateShortUrl = () => {
  if (!originalUrl.value.trim()) return

  const slug = customAlias.value.trim() || Math.random().toString(36).substring(2, 8)
  const newLink: ShortenedUrlItem = {
    id: Date.now().toString(),
    originalUrl: originalUrl.value,
    shortUrl: `https://linkly.sh/${slug}`,
    alias: slug,
    createdAt: new Date().toISOString().split('T')[0],
    clicks: 0
  }

  history.value.unshift(newLink)
  originalUrl.value = ''
  customAlias.value = ''
}

const copyToClipboard = (shortUrl: string, id: string) => {
  navigator.clipboard.writeText(shortUrl)
  copiedId.value = id
  setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

const deleteLink = (id: string) => {
  history.value = history.value.filter((item) => item.id !== id)
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

    <!-- Creation Card Form -->
    <div class="p-4 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xs space-y-4">
      <form @submit.prevent="handleCreateShortUrl" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="md:col-span-2 relative min-w-0">
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Destination URL</label>
            <div class="relative">
              <input
                v-model="originalUrl"
                type="url"
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
            class="w-full sm:w-auto px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Sparkles class="w-4 h-4 text-blue-600" />
            <span>Shorten Link</span>
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
        <div class="divide-y divide-[var(--border-color)]">
          <div
            v-for="item in history.filter(i => i.alias.includes(searchQuery) || i.originalUrl.includes(searchQuery))"
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
                  {{ item.createdAt }}
                </span>
              </div>
              <p class="text-xs text-[var(--text-secondary)] truncate">
                {{ item.originalUrl }}
              </p>
            </div>

            <!-- Stats & Controls -->
            <div class="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
              <div class="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-950/40 px-2.5 py-1.5 rounded-lg border border-zinc-800">
                <BarChart2 class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span class="font-semibold text-zinc-200">{{ item.clicks }}</span>
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

                <button
                  @click="deleteLink(item.id)"
                  class="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer"
                  title="Delete Link"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="history.length === 0" class="p-8 text-center text-xs text-zinc-500">
            No shortened links created yet. Shorten your first link above!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
