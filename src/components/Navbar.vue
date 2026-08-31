<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { Link2, ArrowRight, Menu, X, LogOut, LayoutDashboard } from 'lucide-vue-next'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()

const mobileMenuOpen = ref(false)

const handleLogout = () => {
  logout()
  mobileMenuOpen.value = false
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--border-color)] transition-colors duration-200 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2.5 font-bold text-xl tracking-tight text-[var(--text-primary)] hover:opacity-90 transition">
        <div class="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 shadow-sm">
          <Link2 class="w-5 h-5 stroke-[2.5]" />
        </div>
        <span class="font-semibold text-lg">Linkly<span class="text-blue-500">.</span></span>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
        <router-link to="/#shortener" class="hover:text-[var(--text-primary)] transition-colors">Shortener</router-link>
        <router-link to="/#analyzer" class="hover:text-[var(--text-primary)] transition-colors">Analyzer</router-link>
        <router-link to="/#qr-generator" class="hover:text-[var(--text-primary)] transition-colors">QR Code</router-link>
        <router-link to="/#features" class="hover:text-[var(--text-primary)] transition-colors">Features</router-link>
        <router-link to="/#faq" class="hover:text-[var(--text-primary)] transition-colors">FAQ</router-link>
      </nav>

      <!-- Right Action Controls -->
      <div class="hidden md:flex items-center gap-3">
        <template v-if="isAuthenticated">
          <router-link
            to="/dashboard"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-900/30 text-blue-400 border border-blue-800/50 hover:bg-blue-900/50 transition"
          >
            <LayoutDashboard class="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </router-link>

          <button
            @click="handleLogout"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
          >
            <LogOut class="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </template>

        <template v-else>
          <router-link
            to="/login"
            class="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          >
            Sign In
          </router-link>

          <router-link
            to="/register"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-all shadow-sm"
          >
            <span>Get Started</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <div class="flex items-center gap-2 md:hidden">
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 rounded-lg hover:bg-zinc-800 text-[var(--text-primary)]"
        >
          <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Dropdown -->
    <div v-if="mobileMenuOpen" class="md:hidden border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 pt-2 pb-6 space-y-3">
      <router-link @click="mobileMenuOpen = false" to="/#shortener" class="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Shortener</router-link>
      <router-link @click="mobileMenuOpen = false" to="/#analyzer" class="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Analyzer</router-link>
      <router-link @click="mobileMenuOpen = false" to="/#qr-generator" class="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">QR Code</router-link>
      <router-link @click="mobileMenuOpen = false" to="/#features" class="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Features</router-link>
      <router-link @click="mobileMenuOpen = false" to="/#faq" class="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">FAQ</router-link>

      <div class="pt-2 border-t border-zinc-800 space-y-2">
        <template v-if="isAuthenticated">
          <router-link
            @click="mobileMenuOpen = false"
            to="/dashboard"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white"
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>Dashboard</span>
          </router-link>
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-800 text-zinc-300"
          >
            <LogOut class="w-4 h-4" />
            <span>Logout</span>
          </button>
        </template>

        <template v-else>
          <router-link
            @click="mobileMenuOpen = false"
            to="/login"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-800 text-zinc-300"
          >
            <span>Sign In</span>
          </router-link>
          <router-link
            @click="mobileMenuOpen = false"
            to="/register"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-900"
          >
            <span>Get Started</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>
