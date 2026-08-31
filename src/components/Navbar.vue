<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Link2, Sun, Moon, ArrowRight, Menu, X } from 'lucide-vue-next'

const isDark = ref(false)
const mobileMenuOpen = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[var(--bg-primary)]/80 border-b border-slate-200/80 dark:border-[var(--border-color)] transition-colors duration-200 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Logo -->
      <a href="#" class="flex items-center gap-2.5 font-bold text-xl tracking-tight text-[var(--text-primary)] hover:opacity-90 transition">
        <div class="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-100 dark:text-zinc-900 shadow-sm">
          <Link2 class="w-5 h-5 stroke-[2.5]" />
        </div>
        <span class="font-semibold text-lg">Linkly<span class="text-blue-600 dark:text-blue-500">.</span></span>
      </a>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
        <a href="#shortener" class="hover:text-[var(--text-primary)] transition-colors">Shortener</a>
        <a href="#analyzer" class="hover:text-[var(--text-primary)] transition-colors">Analyzer</a>
        <a href="#qr-generator" class="hover:text-[var(--text-primary)] transition-colors">QR Code</a>
        <a href="#features" class="hover:text-[var(--text-primary)] transition-colors">Features</a>
        <a href="#faq" class="hover:text-[var(--text-primary)] transition-colors">FAQ</a>
      </nav>

      <!-- Right Action Controls -->
      <div class="hidden md:flex items-center gap-3">
        <button
          @click="toggleDark"
          class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer"
          aria-label="Toggle theme"
        >
          <Sun v-if="isDark" class="w-4 h-4" />
          <Moon v-else class="w-4 h-4" />
        </button>

        <a
          href="/register"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
        >
          <span>Get Started</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <div class="flex items-center gap-2 md:hidden">
        <button
          @click="toggleDark"
          class="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[var(--text-secondary)]"
        >
          <Sun v-if="isDark" class="w-4 h-4" />
          <Moon v-else class="w-4 h-4" />
        </button>
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[var(--text-primary)]"
        >
          <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Dropdown -->
    <div v-if="mobileMenuOpen" class="md:hidden border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 pt-2 pb-6 space-y-3">
      <a @click="mobileMenuOpen = false" href="#shortener" class="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Shortener</a>
      <a @click="mobileMenuOpen = false" href="#analyzer" class="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Analyzer</a>
      <a @click="mobileMenuOpen = false" href="#qr-generator" class="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">QR Code</a>
      <a @click="mobileMenuOpen = false" href="#features" class="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Features</a>
      <a @click="mobileMenuOpen = false" href="#faq" class="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">FAQ</a>
      <a
        @click="mobileMenuOpen = false"
        href="/register"
        class="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900"
      >
        <span>Get Started</span>
        <ArrowRight class="w-4 h-4" />
      </a>
    </div>
  </header>
</template>
