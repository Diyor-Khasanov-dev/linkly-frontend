<script setup lang="ts">
import { AlertCircle, Home, ArrowLeft } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950 via-[var(--bg-primary)] to-[var(--bg-primary)]">
    <div class="max-w-md w-full text-center space-y-6 bg-zinc-900/90 p-8 rounded-2xl border border-zinc-800 shadow-xl relative overflow-hidden">
      <!-- Glow effect -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Icon -->
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-950/40 text-red-400 border border-red-900/40 shadow-xs">
        <AlertCircle class="w-8 h-8 stroke-[2]" />
      </div>

      <!-- Status code & Text -->
      <div class="space-y-2">
        <span class="text-xs font-mono font-bold tracking-wider uppercase text-blue-400">Error 404</span>
        <h1 class="text-3xl font-extrabold text-zinc-50">Page Not Found</h1>
        <p class="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
      </div>

      <!-- Actions -->
      <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <router-link
          to="/"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-xs hover:opacity-90 transition shadow-sm flex items-center justify-center gap-2"
        >
          <Home class="w-4 h-4" />
          <span>Return Home</span>
        </router-link>

        <button
          @click="$router.back()"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-xs hover:bg-zinc-800 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  </div>
</template>
