<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  useBusinessCard,
  THEMES,
  type BusinessCard
} from '../../composables/useBusinessCard'
import {
  Contact,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Download,
  Share2,
  Save,
  Eye,
  Sparkles,
  Smartphone,
  Palette,
  Link,
  AtSign
} from 'lucide-vue-next'

const { getCardBySlug, saveCard, generateCardQrCode, getPublicCardUrl } = useBusinessCard()

// Local state for card being edited
const card = ref<BusinessCard>(getCardBySlug('alex-morgan'))

const isSaved = ref(false)
const copied = ref(false)
const showQrModal = ref(false)
const qrDataUrl = ref('')

const publicCardUrl = computed(() => getPublicCardUrl(card.value.slug))
const activeTheme = computed(() => THEMES[card.value.theme] || THEMES.modernDark)

const activeTab = ref<'profile' | 'contacts' | 'socials' | 'links' | 'themes'>('profile')

onMounted(async () => {
  card.value = getCardBySlug('alex-morgan')
  qrDataUrl.value = await generateCardQrCode(publicCardUrl.value)
})

const handleSave = async () => {
  const success = saveCard(card.value)
  if (success) {
    isSaved.value = true
    qrDataUrl.value = await generateCardQrCode(publicCardUrl.value)
    setTimeout(() => {
      isSaved.value = false
    }, 3000)
  }
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(publicCardUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}

const addCustomLink = () => {
  const newId = Date.now().toString()
  card.value.customLinks.push({
    id: newId,
    title: 'My Custom Link',
    url: 'https://example.com',
    description: 'Add description here',
    enabled: true
  })
}

const removeCustomLink = (id: string) => {
  card.value.customLinks = card.value.customLinks.filter(l => l.id !== id)
}

const enabledSocials = computed(() => card.value.socials.filter(s => s.enabled && s.url))
const enabledCustomLinks = computed(() => card.value.customLinks.filter(l => l.enabled && l.url))
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2.5">
          <Contact class="w-6 h-6 text-blue-500" />
          <span>Digital Business Card</span>
        </h1>
        <p class="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Create, customize, and share your personal digital profile card with contacts & social links.
        </p>
      </div>

      <!-- Header Action Buttons -->
      <div class="flex items-center gap-2">
        <a
          :href="`/card/${card.slug}`"
          target="_blank"
          class="px-3.5 py-2 bg-[var(--bg-secondary)] hover:bg-zinc-800 border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] rounded-xl flex items-center gap-1.5 transition"
        >
          <Eye class="w-4 h-4 text-zinc-400" />
          <span>View Public Page</span>
          <ExternalLink class="w-3.5 h-3.5 opacity-60 ml-0.5" />
        </a>

        <button
          @click="showQrModal = true"
          class="px-3.5 py-2 bg-[var(--bg-secondary)] hover:bg-zinc-800 border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          <QrCode class="w-4 h-4 text-blue-400" />
          <span>Get QR</span>
        </button>

        <button
          @click="handleSave"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Check v-if="isSaved" class="w-4 h-4 text-emerald-300" />
          <Save v-else class="w-4 h-4" />
          <span>{{ isSaved ? 'Saved!' : 'Save Card' }}</span>
        </button>
      </div>
    </div>

    <!-- Quick URL Share Banner -->
    <div class="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0 w-full sm:w-auto">
        <div class="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl shrink-0">
          <Sparkles class="w-5 h-5" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-[var(--text-secondary)]">Your Public Digital Card URL</p>
          <p class="text-xs sm:text-sm font-mono font-semibold text-[var(--text-primary)] truncate">{{ publicCardUrl }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
        <button
          @click="copyUrl"
          class="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium rounded-xl flex items-center gap-1.5 transition cursor-pointer text-zinc-100"
        >
          <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-400" />
          <Copy v-else class="w-3.5 h-3.5" />
          <span>{{ copied ? 'Copied' : 'Copy Link' }}</span>
        </button>
      </div>
    </div>

    <!-- Main Workspace Split Grid: Editor (Left) & Mobile Live Preview (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      <!-- Editor Controls Column (Left) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Editor Tabs Navigation -->
        <div class="flex items-center gap-1 border-b border-[var(--border-color)] overflow-x-auto pb-2 scrollbar-none">
          <button
            @click="activeTab = 'profile'"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer',
              activeTab === 'profile'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            ]"
          >
            <User class="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            @click="activeTab = 'contacts'"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer',
              activeTab === 'contacts'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            ]"
          >
            <AtSign class="w-3.5 h-3.5" />
            <span>Contacts</span>
          </button>

          <button
            @click="activeTab = 'socials'"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer',
              activeTab === 'socials'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            ]"
          >
            <Globe class="w-3.5 h-3.5" />
            <span>Socials</span>
          </button>

          <button
            @click="activeTab = 'links'"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer',
              activeTab === 'links'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            ]"
          >
            <Link class="w-3.5 h-3.5" />
            <span>Custom Links</span>
          </button>

          <button
            @click="activeTab = 'themes'"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer',
              activeTab === 'themes'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            ]"
          >
            <Palette class="w-3.5 h-3.5" />
            <span>Themes</span>
          </button>
        </div>

        <!-- TAB 1: Profile Info -->
        <div v-if="activeTab === 'profile'" class="p-5 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
          <h3 class="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <User class="w-4 h-4 text-blue-400" />
            <span>Personal Profile & Bio</span>
          </h3>

          <div class="space-y-3.5">
            <div>
              <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Custom Slug / URL</label>
              <div class="flex items-center">
                <span class="px-3 py-2 bg-zinc-800 border border-r-0 border-[var(--border-color)] text-xs text-zinc-400 rounded-l-xl font-mono">
                  /card/
                </span>
                <input
                  v-model="card.slug"
                  type="text"
                  class="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-r-xl text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Full Name</label>
                <input
                  v-model="card.name"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  class="w-full px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Job Title</label>
                <input
                  v-model="card.title"
                  type="text"
                  placeholder="e.g. Senior Full-Stack Engineer"
                  class="w-full px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Company / Organization</label>
              <input
                v-model="card.company"
                type="text"
                placeholder="e.g. Linkly Inc."
                class="w-full px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Profile Photo Image URL</label>
              <input
                v-model="card.avatarUrl"
                type="text"
                placeholder="https://..."
                class="w-full px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Short Bio</label>
              <textarea
                v-model="card.bio"
                rows="3"
                placeholder="Write a brief introduction about yourself..."
                class="w-full px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- TAB 2: Contact Details -->
        <div v-if="activeTab === 'contacts'" class="p-5 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
          <h3 class="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <AtSign class="w-4 h-4 text-emerald-400" />
            <span>Contact Information</span>
          </h3>

          <div class="space-y-3.5">
            <div>
              <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Email Address</label>
              <div class="relative">
                <Mail class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  v-model="card.email"
                  type="email"
                  placeholder="alex@example.com"
                  class="w-full pl-9 pr-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Phone Number</label>
              <div class="relative">
                <Phone class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  v-model="card.phone"
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  class="w-full pl-9 pr-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Location / Address</label>
              <div class="relative">
                <MapPin class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  v-model="card.location"
                  type="text"
                  placeholder="San Francisco, CA"
                  class="w-full pl-9 pr-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Website URL</label>
              <div class="relative">
                <Globe class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  v-model="card.website"
                  type="text"
                  placeholder="https://yourwebsite.com"
                  class="w-full pl-9 pr-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: Social Links -->
        <div v-if="activeTab === 'socials'" class="p-5 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
          <h3 class="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Globe class="w-4 h-4 text-purple-400" />
            <span>Social Media Accounts</span>
          </h3>

          <div class="space-y-3">
            <div
              v-for="social in card.socials"
              :key="social.platform"
              class="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl flex items-center gap-3"
            >
              <input
                type="checkbox"
                v-model="social.enabled"
                class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-zinc-800 border-zinc-700 cursor-pointer"
              />
              <span class="w-24 text-xs font-semibold capitalize text-[var(--text-primary)]">{{ social.platform }}</span>
              <input
                v-model="social.url"
                type="text"
                :placeholder="`https://${social.platform}.com/username`"
                class="flex-1 px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- TAB 4: Custom Links Manager -->
        <div v-if="activeTab === 'links'" class="p-5 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Link class="w-4 h-4 text-amber-400" />
              <span>Custom Links</span>
            </h3>

            <button
              @click="addCustomLink"
              class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="link in card.customLinks"
              :key="link.id"
              class="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl space-y-2.5 relative"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="link.enabled"
                    class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-zinc-800 border-zinc-700 cursor-pointer"
                  />
                  <span class="text-xs font-bold text-[var(--text-primary)]">Enabled</span>
                </div>

                <button
                  @click="removeCustomLink(link.id)"
                  class="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  v-model="link.title"
                  type="text"
                  placeholder="Link Title"
                  class="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs font-semibold text-[var(--text-primary)] focus:outline-none"
                />
                <input
                  v-model="link.url"
                  type="text"
                  placeholder="https://..."
                  class="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <input
                v-model="link.description"
                type="text"
                placeholder="Optional description"
                class="w-full px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-secondary)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <!-- TAB 5: Themes -->
        <div v-if="activeTab === 'themes'" class="p-5 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
          <h3 class="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Palette class="w-4 h-4 text-cyan-400" />
            <span>Card Theme & Color Presets</span>
          </h3>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="t in THEMES"
              :key="t.id"
              @click="card.theme = t.id"
              :class="[
                'p-3.5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer relative overflow-hidden',
                t.bgClass,
                card.theme === t.id ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-zinc-800 hover:border-zinc-700'
              ]"
            >
              <div class="space-y-1">
                <p :class="['text-xs font-bold', t.textPrimaryClass]">{{ t.name }}</p>
                <div class="flex items-center gap-1.5 mt-2">
                  <div class="w-3.5 h-3.5 rounded-full bg-blue-500"></div>
                  <div class="w-3.5 h-3.5 rounded-full bg-cyan-500"></div>
                  <div class="w-3.5 h-3.5 rounded-full bg-purple-500"></div>
                </div>
              </div>
              <span v-if="card.theme === t.id" class="absolute top-2 right-2 p-1 bg-blue-500 text-white rounded-full">
                <Check class="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Live Mobile Phone Preview Column (Right) -->
      <div class="lg:col-span-5 sticky top-6">
        <div class="flex items-center justify-between mb-3 px-1">
          <span class="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Smartphone class="w-4 h-4 text-blue-400" /> Real-Time Preview
          </span>
          <span class="text-[11px] text-zinc-500">Updates live as you type</span>
        </div>

        <!-- Mock Phone Frame -->
        <div class="p-3 sm:p-4 bg-zinc-900 border-4 border-zinc-800 rounded-[2.5rem] shadow-2xl max-w-sm mx-auto relative overflow-hidden">

          <!-- Phone Camera Notch -->
          <div class="w-28 h-4 bg-zinc-800 rounded-full mx-auto mb-3"></div>

          <!-- Phone Inner Screen -->
          <div :class="['rounded-2xl p-5 space-y-4 transition-colors duration-300 min-h-[500px]', activeTheme.bgClass]">

            <div :class="['rounded-2xl p-5 space-y-4 border text-center relative overflow-hidden shadow-xl', activeTheme.cardBgClass]">

              <!-- Avatar -->
              <img
                :src="card.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'"
                :alt="card.name"
                class="w-20 h-20 rounded-2xl object-cover mx-auto shadow-md border"
              />

              <!-- Name & Title -->
              <div>
                <h2 :class="['text-xl font-bold tracking-tight', activeTheme.textPrimaryClass]">
                  {{ card.name || 'Your Name' }}
                </h2>
                <p v-if="card.title || card.company" :class="['text-xs font-medium mt-1', activeTheme.textSecondaryClass]">
                  {{ card.title }} <span v-if="card.company">• {{ card.company }}</span>
                </p>
              </div>

              <!-- Bio -->
              <p v-if="card.bio" :class="['text-[11px] leading-relaxed', activeTheme.textSecondaryClass]">
                {{ card.bio }}
              </p>

              <!-- Main Save Contact Button -->
              <div :class="['py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm', activeTheme.accentClass]">
                <User class="w-3.5 h-3.5" />
                <span>Save Contact</span>
              </div>

              <!-- Contacts -->
              <div class="space-y-1.5 text-left text-xs pt-1">
                <div v-if="card.email" :class="['p-2 rounded-lg flex items-center gap-2 truncate', activeTheme.buttonClass]">
                  <Mail class="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span class="truncate text-[11px]">{{ card.email }}</span>
                </div>
                <div v-if="card.phone" :class="['p-2 rounded-lg flex items-center gap-2 truncate', activeTheme.buttonClass]">
                  <Phone class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span class="truncate text-[11px]">{{ card.phone }}</span>
                </div>
              </div>

              <!-- Social Links -->
              <div v-if="enabledSocials.length > 0" class="flex flex-wrap gap-1.5 justify-center pt-1">
                <span
                  v-for="s in enabledSocials"
                  :key="s.platform"
                  :class="['px-2.5 py-1 rounded-lg text-[10px] font-medium capitalize', activeTheme.buttonClass]"
                >
                  {{ s.platform }}
                </span>
              </div>

              <!-- Custom Links -->
              <div v-if="enabledCustomLinks.length > 0" class="space-y-1.5 text-left pt-1">
                <div
                  v-for="l in enabledCustomLinks"
                  :key="l.id"
                  :class="['p-2 rounded-xl flex items-center justify-between', activeTheme.buttonClass]"
                >
                  <span class="text-xs font-semibold truncate">{{ l.title }}</span>
                  <ExternalLink class="w-3 h-3 opacity-60 shrink-0" />
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>

    <!-- QR Code Share Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showQrModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
          <button
            @click="showQrModal = false"
            class="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/50 hover:bg-zinc-800"
          >
            ✕
          </button>

          <h3 class="text-lg font-bold text-zinc-100">Digital Card QR Code</h3>
          <p class="text-xs text-zinc-400">Share or print this QR code to quickly share your digital business card.</p>

          <div class="p-4 bg-white rounded-2xl inline-block border border-zinc-200">
            <img :src="qrDataUrl" alt="QR Code" class="w-48 h-48 mx-auto" />
          </div>

          <div class="flex items-center justify-center gap-2">
            <a
              :href="qrDataUrl"
              :download="`${card.slug}_qr.png`"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Download class="w-4 h-4" />
              <span>Download</span>
            </a>
            <button
              @click="copyUrl"
              class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Share2 class="w-4 h-4" />
              <span>Copy URL</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>
