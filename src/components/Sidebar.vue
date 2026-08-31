<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import {
  Link2,
  Bookmark,
  QrCode,
  Clock,
  Timer,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
const { currentUser, logout } = useAuth()
const isMobileOpen = ref(false)

const navigation = [
  {
    name: 'URL Shortener',
    href: '/dashboard/shortener',
    icon: Link2,
    badge: 'Popular'
  },
  {
    name: 'URL Saver',
    href: '/dashboard/saver',
    icon: Bookmark,
  },
  {
    name: 'QR Code Generator',
    href: '/dashboard/qr-generator',
    icon: QrCode,
  },
  {
    name: 'Expiring URL',
    href: '/dashboard/expiring-url',
    icon: Clock,
  },
  {
    name: 'Expiring QR Codes',
    href: '/dashboard/expiring-qr',
    icon: Timer,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
]

const handleLogout = () => {
  logout()
  isMobileOpen.value = false
  router.push('/login')
}
</script>

<template>
  <div>
    <!-- Mobile top bar header with trigger button -->
    <div class="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
      <router-link to="/" class="flex items-center gap-2 font-bold text-lg text-[var(--text-primary)]">
        <div class="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 shadow-sm">
          <Link2 class="w-4 h-4 stroke-[2.5]" />
        </div>
        <span>Linkly<span class="text-blue-500">.</span></span>
      </router-link>

      <button
        @click="isMobileOpen = !isMobileOpen"
        class="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition cursor-pointer"
        aria-label="Toggle Navigation Menu"
      >
        <Menu v-if="!isMobileOpen" class="w-5 h-5" />
        <X v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Mobile Drawer Overlay -->
    <div
      v-if="isMobileOpen"
      @click="isMobileOpen = false"
      class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
    ></div>

    <!-- Sidebar Container -->
    <aside
      :class="[
        'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[var(--bg-primary)] border-r border-[var(--border-color)] flex flex-col justify-between transition-transform duration-300 ease-in-out',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Top Section: Logo & Nav items -->
      <div class="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <!-- Logo Branding Header -->
        <div class="p-5 flex items-center justify-between border-b border-[var(--border-color)]">
          <router-link to="/" class="flex items-center gap-2.5 font-bold text-xl tracking-tight text-[var(--text-primary)]">
            <div class="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shadow-sm">
              <Link2 class="w-5 h-5 stroke-[2.5]" />
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-lg leading-none">Linkly<span class="text-blue-500">.</span></span>
              <span class="text-[10px] text-zinc-400 font-mono tracking-wider uppercase mt-0.5">Workspace</span>
            </div>
          </router-link>

          <button
            @click="isMobileOpen = false"
            class="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Navigation Links List -->
        <nav class="p-3 space-y-1">
          <div class="px-3 py-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Main Features
          </div>

          <router-link
            v-for="item in navigation"
            :key="item.href"
            :to="item.href"
            @click="isMobileOpen = false"
            v-slot="{ isActive }"
          >
            <div
              :class="[
                'group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer',
                isActive
                  ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              ]"
            >
              <div class="flex items-center gap-3">
                <component
                  :is="item.icon"
                  :class="[
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-zinc-950' : 'text-zinc-400 group-hover:text-zinc-200'
                  ]"
                />
                <span>{{ item.name }}</span>
              </div>

              <div class="flex items-center gap-1.5">
                <span
                  v-if="item.badge"
                  :class="[
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                    isActive ? 'bg-zinc-900 text-zinc-100' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  ]"
                >
                  {{ item.badge }}
                </span>
                <ChevronRight
                  :class="[
                    'w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity',
                    isActive ? 'opacity-100 text-zinc-950' : 'text-zinc-400'
                  ]"
                />
              </div>
            </div>
          </router-link>
        </nav>

        <!-- Pro Upgrade Box Banner -->
        <div class="m-3 p-3.5 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800/90 border border-zinc-800 text-xs space-y-2 mt-auto">
          <div class="flex items-center gap-2 text-zinc-100 font-semibold">
            <Sparkles class="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span>Linkly Pro</span>
          </div>
          <p class="text-[11px] text-zinc-400 leading-relaxed">
            Unlock custom branded domains, unlimited QR downloads & deep analytics.
          </p>
        </div>
      </div>

      <!-- Bottom User Profile Bar -->
      <div class="p-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
        <div class="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
              {{ (currentUser?.name || currentUser?.email || 'User').charAt(0) }}
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-semibold text-[var(--text-primary)] truncate">
                {{ currentUser?.name || 'Account' }}
              </span>
              <span class="text-[11px] text-[var(--text-secondary)] truncate">
                {{ currentUser?.email || 'user@linkly.com' }}
              </span>
            </div>
          </div>

          <button
            @click="handleLogout"
            title="Log out"
            class="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition cursor-pointer"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>
