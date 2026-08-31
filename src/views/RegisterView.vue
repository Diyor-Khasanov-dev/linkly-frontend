<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { Link2, Mail, Lock, Building2, ArrowRight, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const { register, isLoading } = useAuth()

const workspaceName = ref('')
const email = ref('')
const password = ref('')
const agreeTerms = ref(true)
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters'
    return
  }

  const res = await register(workspaceName.value || 'My Workspace', email.value, password.value)
  if (res.success) {
    router.push({ path: '/login', query: { email: email.value } })
  } else {
    errorMessage.value = res.error || 'Registration failed. Please try again.'
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950 via-[var(--bg-primary)] to-[var(--bg-primary)]">
    <div class="max-w-md w-full space-y-8 bg-zinc-900/90 p-8 rounded-2xl border border-zinc-800 shadow-xl relative overflow-hidden">
      <!-- Glow effect -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 shadow-md mb-2">
          <Link2 class="w-6 h-6 stroke-[2.5]" />
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-zinc-100">
          Create your account
        </h2>
        <p class="text-sm text-zinc-400">
          Start shortening links, generating QRs, and analyzing clicks in seconds.
        </p>
      </div>

      <!-- Error alert -->
      <div v-if="errorMessage" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400">
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <form class="mt-6 space-y-4" @submit.prevent="handleRegister">
        <div class="space-y-1">
          <label class="block text-xs font-semibold text-zinc-300">Workspace Name</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Building2 class="w-4 h-4" />
            </div>
            <input
              v-model="workspaceName"
              type="text"
              placeholder="Acme Workspace"
              class="w-full pl-9 pr-3 py-2.5 bg-zinc-800/80 border border-zinc-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-100 placeholder-zinc-500 transition"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-xs font-semibold text-zinc-300">Email address *</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Mail class="w-4 h-4" />
            </div>
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full pl-9 pr-3 py-2.5 bg-zinc-800/80 border border-zinc-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-100 placeholder-zinc-500 transition"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-xs font-semibold text-zinc-300">Password *</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Lock class="w-4 h-4" />
            </div>
            <input
              v-model="password"
              type="password"
              required
              minlength="8"
              placeholder="••••••••"
              class="w-full pl-9 pr-3 py-2.5 bg-zinc-800/80 border border-zinc-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-100 placeholder-zinc-500 transition"
            />
          </div>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <input
            id="terms"
            v-model="agreeTerms"
            type="checkbox"
            class="rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500 cursor-pointer"
          />
          <label for="terms" class="text-xs text-zinc-400 cursor-pointer select-none">
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-sm hover:opacity-90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span v-if="!isLoading">Create Account</span>
          <span v-else>Creating account...</span>
          <ArrowRight v-if="!isLoading" class="w-4 h-4" />
        </button>
      </form>

      <!-- Account perks -->
      <div class="pt-4 border-t border-zinc-800/80 space-y-2">
        <div class="flex items-center gap-2 text-xs text-zinc-400">
          <CheckCircle2 class="w-3.5 h-3.5 text-blue-500" />
          <span>No credit card required for free tier</span>
        </div>
      </div>

      <!-- Footer navigation -->
      <div class="text-center text-xs text-zinc-400">
        Already have an account?
        <router-link to="/login" class="font-medium text-blue-400 hover:underline">
          Sign in
        </router-link>
      </div>
    </div>
  </div>
</template>
