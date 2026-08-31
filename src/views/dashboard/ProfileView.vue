<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import {
  User,
  Mail,
  Key,
  Copy,
  Check,
  Sparkles,
  Save,
  RefreshCw
} from 'lucide-vue-next'

const { currentUser } = useAuth()

const name = ref(currentUser.value?.name || 'Alex Morgan')
const email = ref(currentUser.value?.email || 'alex@linkly.sh')
const apiKey = ref('lk_live_99a8b7c6d5e4f3a2b1')
const isSaved = ref(false)
const isCopiedKey = ref(false)

const handleSaveProfile = () => {
  isSaved.value = true
  setTimeout(() => {
    isSaved.value = false
  }, 2500)
}

const copyApiKey = () => {
  navigator.clipboard.writeText(apiKey.value)
  isCopiedKey.value = true
  setTimeout(() => {
    isCopiedKey.value = false
  }, 2000)
}

const regenerateKey = () => {
  apiKey.value = 'lk_live_' + Math.random().toString(36).substring(2, 18)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-1">
      <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
        <User class="w-6 h-6 text-blue-500" />
        <span>User Profile & Account</span>
      </h1>
      <p class="text-xs sm:text-sm text-[var(--text-secondary)]">
        Manage your personal account settings, security keys, and subscription plan.
      </p>
    </div>

    <!-- Personal Profile Card -->
    <div class="p-5 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
      <h3 class="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
        <User class="w-4 h-4 text-blue-400" />
        <span>Personal Details</span>
      </h3>

      <form @submit.prevent="handleSaveProfile" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Full Name</label>
            <div class="relative">
              <User class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                v-model="name"
                type="text"
                required
                class="w-full pl-9 pr-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Email Address</label>
            <div class="relative">
              <Mail class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                v-model="email"
                type="email"
                required
                class="w-full pl-9 pr-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span v-if="isSaved" class="text-xs font-medium text-emerald-400 flex items-center gap-1">
            <Check class="w-4 h-4" /> Profile updated successfully!
          </span>
          <span v-else></span>

          <button
            type="submit"
            class="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Save class="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>

    <!-- API Key Access Card -->
    <div class="p-5 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h3 class="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Key class="w-4 h-4 text-purple-400" />
          <span>Developer API Key</span>
        </h3>
        <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
          REST API v3
        </span>
      </div>

      <p class="text-xs text-[var(--text-secondary)]">
        Use your secret API key to authenticate programmatically with the Linkly API endpoints.
      </p>

      <div class="flex flex-col sm:flex-row items-center gap-3">
        <div class="w-full flex-1 relative">
          <input
            :value="apiKey"
            readonly
            type="text"
            class="w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs font-mono text-[var(--text-primary)] select-all focus:outline-none"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button
            @click="copyApiKey"
            class="flex-1 sm:flex-initial px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Check v-if="isCopiedKey" class="w-3.5 h-3.5 text-emerald-400" />
            <Copy v-else class="w-3.5 h-3.5" />
            <span>{{ isCopiedKey ? 'Copied' : 'Copy Key' }}</span>
          </button>

          <button
            @click="regenerateKey"
            class="p-2.5 bg-[var(--bg-primary)] hover:bg-zinc-800 border border-[var(--border-color)] text-zinc-300 rounded-xl text-xs font-medium transition cursor-pointer"
            title="Roll API Key"
          >
            <RefreshCw class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Subscription Plan Summary Card -->
    <div class="p-5 sm:p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl space-y-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-zinc-100">Pro Creator Plan</h4>
            <p class="text-xs text-zinc-400">Active billing cycle: Billed annually</p>
          </div>
        </div>

        <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Active Subscription
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
        <div class="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-1">
          <span class="text-zinc-400">Monthly Click Limit</span>
          <p class="font-mono font-bold text-zinc-100">100,000 / Unlimited</p>
        </div>
        <div class="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-1">
          <span class="text-zinc-400">Custom Domains</span>
          <p class="font-mono font-bold text-zinc-100">5 Active Domains</p>
        </div>
        <div class="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-1">
          <span class="text-zinc-400">QR Code Exports</span>
          <p class="font-mono font-bold text-zinc-100">Vector SVG & HD PNG</p>
        </div>
      </div>
    </div>
  </div>
</template>
