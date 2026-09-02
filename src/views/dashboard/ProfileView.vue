<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'
import {
  User,
  Mail,
  Check,
  Save,
  Building2,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2
} from 'lucide-vue-next'

const { currentUser, fetchUser, updateProfile, isLoading } = useAuth()

const workspaceName = ref(currentUser.value?.workspaceName || 'My Workspace')
const email = ref(currentUser.value?.email || '')
const password = ref('')
const showPassword = ref(false)

const isSaved = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const syncUserData = () => {
  if (currentUser.value) {
    workspaceName.value = currentUser.value.workspaceName || 'My Workspace'
    email.value = currentUser.value.email || ''
  }
}

onMounted(async () => {
  await fetchUser()
  syncUserData()
})

watch(currentUser, () => {
  syncUserData()
})

const handleSaveProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (password.value && password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.'
    return
  }

  const payload: { workspaceName?: string; password?: string } = {
    workspaceName: workspaceName.value.trim()
  }

  if (password.value) {
    payload.password = password.value
  }

  const result = await updateProfile(payload)

  if (result.success) {
    isSaved.value = true
    successMessage.value = result.message || 'Profile updated successfully!'
    password.value = ''
    setTimeout(() => {
      isSaved.value = false
      successMessage.value = ''
    }, 3000)
  } else {
    errorMessage.value = result.error || 'Failed to update profile.'
  }
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
        Manage your workspace name, email address, and security credentials.
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

      <!-- Feedback Banners -->
      <div v-if="errorMessage" class="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs sm:text-sm text-rose-400 flex items-center gap-2">
        <AlertCircle class="w-4 h-4 flex-shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>

      <div v-if="isSaved" class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs sm:text-sm text-emerald-400 flex items-center gap-2">
        <Check class="w-4 h-4 flex-shrink-0" />
        <span>{{ successMessage }}</span>
      </div>

      <form @submit.prevent="handleSaveProfile" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Workspace Name (Editable) -->
          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Workspace Name <span class="text-xs text-blue-400">(Editable)</span>
            </label>
            <div class="relative">
              <Building2 class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                v-model="workspaceName"
                type="text"
                required
                placeholder="Enter workspace name"
                class="w-full pl-9 pr-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Email Address (ReadOnly / Not Editable) -->
          <div>
            <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Email Address <span class="text-xs text-zinc-500">(Not editable)</span>
            </label>
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

        <!-- Password Field (Editable) -->
        <div>
          <label class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
            New Password <span class="text-xs text-blue-400">(Editable - leave blank to keep current password)</span>
          </label>
          <div class="relative">
            <Lock class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter new password (min. 8 characters)"
              class="w-full pl-9 pr-10 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[var(--text-primary)] focus:outline-none"
            >
              <EyeOff v-if="showPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span v-if="isSaved" class="text-xs font-medium text-emerald-400 flex items-center gap-1">
            <Check class="w-4 h-4" /> Profile saved!
          </span>
          <span v-else></span>

          <button
            type="submit"
            :disabled="isLoading"
            class="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 text-zinc-900 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            <span>{{ isLoading ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
