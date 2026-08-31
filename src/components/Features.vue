<script setup lang="ts">
import {
  Zap,
  BarChart2,
  QrCode,
  ShieldCheck,
  Globe,
  Layers,
  Sparkles
} from 'lucide-vue-next'

const featuresList = [
  {
    icon: Zap,
    title: 'Sub-Millisecond Redirects',
    description: 'Powered by global edge network caching to ensure instant routing for every single visitor worldwide without delay.'
  },
  {
    icon: BarChart2,
    title: 'Granular Link Analytics',
    description: 'Track real-time click counts, country origins, device breakdown, and traffic sources with complete privacy compliance.'
  },
  {
    icon: QrCode,
    title: 'Customizable QR Code Studio',
    description: 'Generate high-res vector (SVG) and raster (PNG) QR codes with custom brand colors, logos, and margin controls.'
  },
  {
    icon: Globe,
    title: 'Branded Custom Domains',
    description: 'Connect your custom domain (e.g., link.yourbrand.com) to maintain brand recognition and trust across channels.'
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Security & Filtering',
    description: 'Automated malware scanning, phishing link detection, and password-protected link capabilities.'
  },
  {
    icon: Layers,
    title: 'API & Developer Tools',
    description: 'Seamless RESTful API integration for bulk link generation, webhook triggers, and automated marketing workflows.'
  }
]
</script>

<template>
  <section class="py-16 sm:py-24 border-t border-[var(--border-color)] bg-[var(--bg-primary)] transition-colors duration-200" id="features">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold">
          <Sparkles class="w-3.5 h-3.5 text-blue-500" />
          <span>Engineered for Perfection</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Everything You Need in One Unified Link Platform
        </h2>
        <p class="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Clean architecture, lightning speed, and clear metrics designed specifically for modern teams and creators.
        </p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(feature, idx) in featuresList"
          :key="idx"
          class="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 space-y-4 group"
        >
          <div class="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] group-hover:scale-105 transition-transform shadow-xs">
            <component :is="feature.icon" class="w-5 h-5" />
          </div>
          <div class="space-y-1.5">
            <h3 class="text-base font-semibold text-[var(--text-primary)]">
              {{ feature.title }}
            </h3>
            <p class="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
