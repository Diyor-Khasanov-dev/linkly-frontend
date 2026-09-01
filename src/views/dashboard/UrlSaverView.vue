<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Bookmark,
  Plus,
  Search,
  Tag,
  ExternalLink,
  Trash2,
  Globe,
  Loader2,
  AlertCircle
} from 'lucide-vue-next'
import { useLinks } from '../../composables/useLinks'

interface SavedBookmark {
  id: string
  shortCode?: string
  title: string
  url: string
  shortUrl?: string
  category: string
  notes: string
  savedAt: string
}

const STORAGE_KEY = 'linkly_saved_bookmarks_meta'

const { createShortLink, deleteShortLink, fetchUserLinks, linksList, isLoading: isApiLoading } = useLinks()

const newTitle = ref('')
const newUrl = ref('')
const newCategory = ref('Work')
const newNotes = ref('')
const selectedCategoryFilter = ref('All')
const searchQuery = ref('')
const errorMsg = ref('')
const isFetching = ref(false)

const categories = ['Work', 'Research', 'Tools', 'Personal']
const savedLinks = ref<SavedBookmark[]>([])

const getStoredMeta = (): Record<string, { title?: string; category?: string; notes?: string }> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

const saveStoredMeta = (metaMap: Record<string, { title?: string; category?: string; notes?: string }>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metaMap))
  } catch (e) {
    console.error('Failed to save metadata to localStorage', e)
  }
}

const syncSavedBookmarks = async () => {
  isFetching.value = true
  await fetchUserLinks()
  const metaMap = getStoredMeta()

  const combined: SavedBookmark[] = linksList.value.map(link => {
    const meta = metaMap[link.id] || metaMap[link.shortCode] || {}
    return {
      id: link.id,
      shortCode: link.shortCode,
      title: meta.title || link.destinationUrl,
      url: link.destinationUrl,
      shortUrl: link.shortUrl,
      category: meta.category || 'Work',
      notes: meta.notes || '',
      savedAt: link.createdAt ? new Date(link.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }
  })

  savedLinks.value = combined
  isFetching.value = false
}

onMounted(() => {
  syncSavedBookmarks()
})

const formatUrl = (input: string): string => {
  let trimmed = input.trim()
  if (!trimmed) return ''
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed
  }
  return trimmed
}

const handleAddBookmark = async () => {
  errorMsg.value = ''
  if (!newTitle.value.trim() || !newUrl.value.trim()) return

  const validUrl = formatUrl(newUrl.value)
  const result = await createShortLink(validUrl)

  if (result.success && result.link) {
    const metaMap = getStoredMeta()
    metaMap[result.link.id] = {
      title: newTitle.value.trim(),
      category: newCategory.value,
      notes: newNotes.value.trim()
    }
    saveStoredMeta(metaMap)

    newTitle.value = ''
    newUrl.value = ''
    newNotes.value = ''
    await syncSavedBookmarks()
  } else {
    errorMsg.value = result.error || 'Failed to save URL to backend.'
  }
}

const deleteBookmark = async (id: string, shortCode?: string) => {
  errorMsg.value = ''
  if (shortCode) {
    const res = await deleteShortLink(shortCode)
    if (!res.success) {
      errorMsg.value = res.error || 'Failed to delete URL from backend.'
      return
    }
  }

  const metaMap = getStoredMeta()
  delete metaMap[id]
  if (shortCode) delete metaMap[shortCode]
  saveStoredMeta(metaMap)

  savedLinks.value = savedLinks.value.filter(b => b.id !== id)
}

const filteredBookmarks = () => {
  return savedLinks.value.filter(item => {
    const matchesCategory = selectedCategoryFilter.value === 'All' || item.category === selectedCategoryFilter.value
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          item.url.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          item.notes.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="space-y-1">
      <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
        <Bookmark class="w-6 h-6 text-amber-500" />
        <span>URL Saver</span>
      </h1>
      <p class="text-xs sm:text-sm text-[var(--text-secondary)]">
        Save, organize, and catalog essential web links into custom workspace collections.
      </p>
    </div>

    <!-- Save New Link Form -->
    <div class="p-5 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xs space-y-4">
      <h3 class="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
        <Plus class="w-4 h-4 text-blue-400" />
        <span>Save New URL</span>
      </h3>

      <form @submit.prevent="handleAddBookmark" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Title / Label</label>
            <input
              v-model="newTitle"
              type="text"
              placeholder="e.g. Design System Documentation"
              required
              class="w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm font-normal text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Target URL</label>
            <input
              v-model="newUrl"
              type="url"
              placeholder="https://..."
              required
              class="w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm font-normal text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Category Tag</label>
            <select
              v-model="newCategory"
              class="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none"
            >
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Notes / Description (Optional)</label>
            <input
              v-model="newNotes"
              type="text"
              placeholder="Key notes or summary..."
              class="w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        </div>

        <p v-if="errorMsg" class="text-xs text-red-500 font-medium bg-red-950/20 p-2.5 rounded-lg border border-red-900/50 flex items-center gap-2">
          <AlertCircle class="w-4 h-4 text-red-400" />
          <span>{{ errorMsg }}</span>
        </p>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isApiLoading"
            class="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Loader2 v-if="isApiLoading" class="w-4 h-4 text-amber-600 animate-spin" />
            <Bookmark v-else class="w-4 h-4 fill-zinc-900" />
            <span>{{ isApiLoading ? 'Saving...' : 'Save URL' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Collection Filter & Search -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <!-- Category Filter Tabs -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="selectedCategoryFilter = 'All'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer',
              selectedCategoryFilter === 'All'
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            ]"
          >
            All Links ({{ savedLinks.length }})
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategoryFilter = cat"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer',
              selectedCategoryFilter === cat
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative w-full sm:w-64">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter saved links..."
            class="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none"
          />
        </div>
      </div>

      <!-- Saved Links Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="bookmark in filteredBookmarks()"
          :key="bookmark.id"
          class="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-3 flex flex-col justify-between hover:border-zinc-700 transition"
        >
          <div class="space-y-2">
            <div class="flex items-start justify-between gap-2">
              <span class="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Tag class="w-3 h-3" />
                {{ bookmark.category }}
              </span>
              <span class="text-[10px] text-zinc-500 font-mono">{{ bookmark.savedAt }}</span>
            </div>

            <h4 class="text-sm font-bold text-[var(--text-primary)] leading-tight">
              {{ bookmark.title }}
            </h4>

            <p v-if="bookmark.notes" class="text-xs text-[var(--text-secondary)] line-clamp-2">
              {{ bookmark.notes }}
            </p>
          </div>

          <div class="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
            <a
              :href="bookmark.url"
              target="_blank"
              class="text-xs text-blue-400 hover:underline flex items-center gap-1 font-mono truncate max-w-[220px]"
            >
              <Globe class="w-3.5 h-3.5 shrink-0" />
              <span class="truncate">{{ bookmark.url }}</span>
              <ExternalLink class="w-3 h-3 shrink-0" />
            </a>

            <button
              @click="deleteBookmark(bookmark.id, bookmark.shortCode)"
              class="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition cursor-pointer"
              title="Remove Bookmark"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="filteredBookmarks().length === 0" class="col-span-full p-8 text-center text-xs text-zinc-500">
          No saved links match your filter.
        </div>
      </div>
    </div>
  </div>
</template>
