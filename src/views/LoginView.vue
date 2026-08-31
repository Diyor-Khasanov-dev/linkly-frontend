<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { Link2, Mail, Lock, LogIn, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { login, isLoading } = useAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password'
    return
  }

  const res = await login(email.value, password.value)
  if (res.success) {
    const redirectPath = (route.query.redirect as string) || '/dashboard'
    router.push(redirectPath)
  } else {
    errorMessage.value = 'Invalid email or password'
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-[var(--bg-primary)] to-[var(--bg-primary)] dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900/90 p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
      <!-- Glow effect -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 shadow-md mb-2">
          <Link2 class="w-6 h-6 stroke-[2.5]" />
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
          Welcome back
        </h2>
        <p class="text-xs text-slate-500 dark:text-zinc-400">
          Sign in to your Linkly account to access your dashboard.
        </p>
      </div>

      <!-- Error alert -->
      <div v-if="errorMessage" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-600 dark:text-red-400">
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-1">
          <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300">Email address</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail class="w-4 h-4" />
            </div>
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 transition"
            />
          </div>
        </div>

        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300">Password</label>
            <a href="#" class="text-xs text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</a>
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock class="w-4 h-4" />
            </div>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-semibold text-sm hover:opacity-90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <LogIn v-if="!isLoading" class="w-4 h-4" />
          <span v-if="!isLoading">Sign In</span>
          <span v-else>Signing in...</span>
        </button>
      </form>

      <!-- Footer navigation -->
      <div class="text-center text-xs text-slate-500 dark:text-zinc-400 pt-2">
        Don't have an account?
        <router-link to="/register" class="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 mt-1">
          <span>Create an account</span>
          <ArrowRight class="w-3 h-3" />
        </router-link>
      </div>
    </div>
  </div>
</template>
