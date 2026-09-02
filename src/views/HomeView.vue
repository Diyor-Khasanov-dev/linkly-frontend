<script setup lang="ts">
import LinkShortenerWidget from '../components/LinkShortenerWidget.vue'
import Features from '../components/Features.vue'
import FaqSection from '../components/FaqSection.vue'
import { Sparkles, ArrowRight } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const { isAuthenticated } = useAuth()
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-900">
      <!-- Ambient background glow -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl rounded-full pointer-events-none"></div>

      <div class="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
        <!-- Top Tag Pill -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/80 text-xs font-medium text-zinc-300 shadow-sm">
          <span class="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>Linkly v1.0 Released</span>
          <Sparkles class="w-3.5 h-3.5 text-blue-500" />
        </div>

        <!-- Main Hero Headline -->
        <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-50 leading-[1.15] sm:leading-[1.1]">
          Shorten URLs.<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500">
            Organize Links.
          </span>
          <span class="text-blue-500 font-serif italic font-normal"> Generate QRs.</span>
        </h1>

        <!-- Value Subtitle -->
        <p class="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-400 font-normal leading-relaxed px-2">
          The minimalist link management platform built for modern creators, developers, and brands. Streamlined, privacy-first, and blazingly fast.
        </p>

        <!-- Interactive Shortener & QR Generator Widget -->
        <div class="pt-4 sm:pt-6">
          <LinkShortenerWidget />
        </div>

        <!-- Social Proof / Stats Strip -->
        <div class="pt-8 sm:pt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto border-t border-zinc-800 text-left">
          <div class="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 space-y-0.5 shadow-2xs">
            <div class="text-xl sm:text-2xl font-bold font-mono text-zinc-100">10M+</div>
            <div class="text-[11px] sm:text-xs text-zinc-400 font-medium">Links Shortened</div>
          </div>
          <div class="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 space-y-0.5 shadow-2xs">
            <div class="text-xl sm:text-2xl font-bold font-mono text-zinc-100">99.99%</div>
            <div class="text-[11px] sm:text-xs text-zinc-400 font-medium">Uptime SLA</div>
          </div>
          <div class="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 space-y-0.5 shadow-2xs">
            <div class="text-xl sm:text-2xl font-bold font-mono text-zinc-100">&lt;15ms</div>
            <div class="text-[11px] sm:text-xs text-zinc-400 font-medium">Global Latency</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <Features />

    <!-- FAQ Section -->
    <FaqSection />

    <!-- CTA Banner -->
    <section class="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/60">
      <div class="max-w-4xl mx-auto text-center space-y-6">
        <h2 class="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Ready to Streamline Your Links?
        </h2>
        <p class="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
          Join thousands of professionals using Linkly for fast link redirection, live click metrics, and customized QR codes.
        </p>
        <div class="flex items-center justify-center gap-4 pt-2">
          <router-link
            :to="isAuthenticated ? '/dashboard' : '/register'"
            class="px-6 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-sm hover:opacity-90 transition shadow-md flex items-center gap-2"
          >
            <span>Get Started Now</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
