<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBusinessCard, THEMES, type BusinessCard } from '../composables/useBusinessCard'
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Share2,
  QrCode,
  UserPlus,
  ExternalLink,
  Check,
  Copy,
  Building2,
  X,
  Download
} from 'lucide-vue-next'

const route = useRoute()
const { getCardBySlug, downloadVCard, generateCardQrCode, getPublicCardUrl } = useBusinessCard()

const cardSlug = computed(() => (route.params.slug as string) || 'alex-morgan')
const card = ref<BusinessCard>(getCardBySlug(cardSlug.value))
const activeTheme = computed(() => THEMES[card.value.theme] || THEMES.modernDark)

const showQrModal = ref(false)
const qrCodeDataUrl = ref('')
const copied = ref(false)

const enabledSocials = computed(() => card.value.socials.filter(s => s.enabled && s.url))
const enabledCustomLinks = computed(() => card.value.customLinks.filter(l => l.enabled && l.url))

const cardPublicUrl = computed(() => getPublicCardUrl(card.value.slug))

onMounted(async () => {
  card.value = getCardBySlug(cardSlug.value)
  qrCodeDataUrl.value = await generateCardQrCode(cardPublicUrl.value)
})

const handleSaveContact = () => {
  downloadVCard(card.value)
}

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(cardPublicUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch (err) {
    console.error('Failed to copy share link', err)
  }
}

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case 'email': return Mail
    case 'phone': return Phone
    case 'website': return Globe
    default: return Globe
  }
}
</script>

<template>
  <div :class="['min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-300', activeTheme.bgClass]">

    <!-- Main Card Container -->
    <div :class="['w-full max-w-md rounded-3xl border p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-md', activeTheme.cardBgClass]">

      <!-- Top Decorative Glow -->
      <div class="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Profile Header -->
      <div class="text-center space-y-3 relative z-10">
        <div class="relative inline-block">
          <img
            :src="card.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'"
            :alt="card.name"
            class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover mx-auto shadow-lg border-2 border-white/20"
          />
        </div>

        <div>
          <h1 :class="['text-2xl sm:text-3xl font-extrabold tracking-tight', activeTheme.textPrimaryClass]">
            {{ card.name || 'Your Name' }}
          </h1>
          <p v-if="card.title || card.company" :class="['text-sm font-medium mt-1 flex items-center justify-center gap-1.5', activeTheme.textSecondaryClass]">
            <span>{{ card.title }}</span>
            <span v-if="card.title && card.company">•</span>
            <span v-if="card.company" class="inline-flex items-center gap-1">
              <Building2 class="w-3.5 h-3.5 opacity-80" /> {{ card.company }}
            </span>
          </p>
        </div>

        <p v-if="card.bio" :class="['text-xs sm:text-sm max-w-xs mx-auto leading-relaxed', activeTheme.textSecondaryClass]">
          {{ card.bio }}
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="grid grid-cols-2 gap-3 pt-2">
        <button
          @click="handleSaveContact"
          :class="['w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-md', activeTheme.accentClass]"
        >
          <UserPlus class="w-4 h-4" />
          <span>Save Contact</span>
        </button>

        <button
          @click="showQrModal = true"
          :class="['w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer', activeTheme.buttonClass]"
        >
          <QrCode class="w-4 h-4" />
          <span>Share QR</span>
        </button>
      </div>

      <!-- Direct Contact Info Badges -->
      <div class="space-y-2 pt-2 border-t" :class="activeTheme.borderClass">
        <a
          v-if="card.email"
          :href="`mailto:${card.email}`"
          :class="['flex items-center gap-3 p-3 rounded-xl transition', activeTheme.buttonClass]"
        >
          <div class="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
            <Mail class="w-4 h-4" />
          </div>
          <div class="min-w-0 text-left">
            <p class="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">Email</p>
            <p :class="['text-xs font-medium truncate', activeTheme.textPrimaryClass]">{{ card.email }}</p>
          </div>
        </a>

        <a
          v-if="card.phone"
          :href="`tel:${card.phone}`"
          :class="['flex items-center gap-3 p-3 rounded-xl transition', activeTheme.buttonClass]"
        >
          <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <Phone class="w-4 h-4" />
          </div>
          <div class="min-w-0 text-left">
            <p class="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">Phone</p>
            <p :class="['text-xs font-medium truncate', activeTheme.textPrimaryClass]">{{ card.phone }}</p>
          </div>
        </a>

        <div
          v-if="card.location"
          :class="['flex items-center gap-3 p-3 rounded-xl', activeTheme.buttonClass]"
        >
          <div class="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
            <MapPin class="w-4 h-4" />
          </div>
          <div class="min-w-0 text-left">
            <p class="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">Location</p>
            <p :class="['text-xs font-medium truncate', activeTheme.textPrimaryClass]">{{ card.location }}</p>
          </div>
        </div>
      </div>

      <!-- Social Networks Links Grid -->
      <div v-if="enabledSocials.length > 0" class="space-y-2 pt-2 border-t" :class="activeTheme.borderClass">
        <p :class="['text-[11px] font-bold uppercase tracking-wider text-left mb-2', activeTheme.textSecondaryClass]">
          Connect & Socials
        </p>
        <div class="flex flex-wrap gap-2">
          <a
            v-for="s in enabledSocials"
            :key="s.platform"
            :href="s.url"
            target="_blank"
            rel="noopener noreferrer"
            :class="['px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 capitalize transition hover:opacity-90', activeTheme.buttonClass]"
          >
            <component :is="getSocialIcon(s.platform)" class="w-3.5 h-3.5 text-blue-400" />
            <span>{{ s.platform }}</span>
            <ExternalLink class="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      <!-- Custom Links List -->
      <div v-if="enabledCustomLinks.length > 0" class="space-y-2.5 pt-2 border-t" :class="activeTheme.borderClass">
        <p :class="['text-[11px] font-bold uppercase tracking-wider text-left mb-2', activeTheme.textSecondaryClass]">
          Featured Links
        </p>
        <a
          v-for="link in enabledCustomLinks"
          :key="link.id"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          :class="['group flex items-center justify-between p-3.5 rounded-xl transition duration-150 hover:scale-[1.01]', activeTheme.buttonClass]"
        >
          <div class="min-w-0 text-left">
            <p :class="['text-xs sm:text-sm font-semibold truncate', activeTheme.textPrimaryClass]">
              {{ link.title }}
            </p>
            <p v-if="link.description" :class="['text-[11px] truncate mt-0.5', activeTheme.textSecondaryClass]">
              {{ link.description }}
            </p>
          </div>
          <ExternalLink class="w-4 h-4 opacity-50 group-hover:opacity-100 transition shrink-0 ml-2" />
        </a>
      </div>

      <!-- Copy Card Link Footer -->
      <div class="pt-2 border-t flex items-center justify-between" :class="activeTheme.borderClass">
        <button
          @click="copyShareLink"
          :class="['w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer', activeTheme.buttonClass]"
        >
          <Check v-if="copied" class="w-4 h-4 text-emerald-400" />
          <Copy v-else class="w-4 h-4" />
          <span>{{ copied ? 'Link Copied!' : 'Copy Business Card Link' }}</span>
        </button>
      </div>

      <!-- Powered by Linkly Branding -->
      <div class="text-center pt-1">
        <a href="/" target="_blank" class="text-[11px] opacity-60 hover:opacity-100 transition font-medium inline-flex items-center gap-1">
          Powered by <span class="font-bold">Linkly.</span>
        </a>
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
            <X class="w-4 h-4" />
          </button>

          <h3 class="text-lg font-bold text-zinc-100">Digital Business Card QR Code</h3>
          <p class="text-xs text-zinc-400">Scan this QR code with any smartphone camera to open this digital business card.</p>

          <div class="p-4 bg-white rounded-2xl inline-block border border-zinc-200 shadow-inner">
            <img :src="qrCodeDataUrl" alt="QR Code" class="w-48 h-48 mx-auto" />
          </div>

          <div class="flex items-center justify-center gap-2">
            <a
              :href="qrCodeDataUrl"
              :download="`${card.slug}_qr.png`"
              class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2"
            >
              <Download class="w-4 h-4" />
              <span>Download PNG</span>
            </a>
            <button
              @click="copyShareLink"
              class="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs rounded-xl flex items-center gap-2"
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
