<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'
import {
  User,
  Mail,
  Check,
  Save,
  Building2,
  ShieldCheck
} from 'lucide-vue-next'

const { currentUser, fetchUser } = useAuth()

const workspaceName = ref(currentUser.value?.workspaceName || 'My Workspace')
const email = ref(currentUser.value?.email || '')
const isSaved = ref(false)

onMounted(async () => {
  await fetchUser()
  if (currentUser.value) {
    workspaceName.value = currentUser.value.workspaceName || 'My Workspace'
    email.value = currentUser.value.email || ''
  }
})

watch(currentUser, (newUser) => {
  if (newUser) {
    workspaceName.value = newUser.workspaceName || 'My Workspace'
    email.value = newUser.email || ''
  }
})

const handleSaveProfile = () => {
  isSaved.value = true
  setTimeout(() => {
    isSaved.value = false
  }, 2500)
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
      <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h3 class="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <User class="w-4 h-4 text-blue-400" />
          <span>Personal & Workspace Details</span>
        </h3>
        <span v-if="currentUser?.isEmailVerified || currentUser?.isVerificated" class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          <ShieldCheck class="w-3.5 h-3.5" /> Verified
        </span>
      </div>

      <form @submit.prevent="handleSaveProfile" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Workspace Name</label>
            <div class="relative">
              <Building2 class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                v-model="workspaceName"
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
                readonly
                disabled
                class="w-full pl-9 pr-3.5 py-2.5 bg-[var(--bg-primary)]/50 border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-secondary)] cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span v-if="isSaved" class="text-xs font-medium text-emerald-400 flex items-center gap-1">
            <Check class="w-4 h-4" /> Profile saved!
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

  </div>
</template>
