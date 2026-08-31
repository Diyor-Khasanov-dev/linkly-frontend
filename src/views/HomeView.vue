<script setup lang="ts">
import LinkShortenerWidget from '../components/LinkShortenerWidget.vue'
import LinkAnalyzer from '../components/LinkAnalyzer.vue'
import Features from '../components/Features.vue'
import FaqSection from '../components/FaqSection.vue'
import { Sparkles, ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-100/70 via-[var(--bg-primary)] to-[var(--bg-primary)] dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900">
      <!-- Ambient background glow -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl rounded-full pointer-events-none"></div>

      <div class="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
        <!-- Top Tag Pill -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 text-xs font-medium text-slate-700 dark:text-zinc-300 shadow-sm">
          <span class="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
          <span>Linkly v3.5 Released — Shorten, Analyze & Custom QR Studio</span>
          <Sparkles class="w-3.5 h-3.5 text-blue-500" />
        </div>

        <!-- Main Hero Headline -->
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 leading-[1.1]">
          Shorten URLs.<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-500">
            Analyze Clicks.
          </span>
          <span class="text-blue-600 dark:text-blue-500 font-serif italic font-normal"> Generate QRs.</span>
        </h1>

        <!-- Value Subtitle -->
        <p class="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-zinc-400 font-normal leading-relaxed">
          The minimalist link management platform built for modern creators, developers, and brands. Streamlined, privacy-first, and blazingly fast.
        </p>

        <!-- Interactive Shortener & QR Generator Widget -->
        <div class="pt-4 sm:pt-6">
          <LinkShortenerWidget />
        </div>

        <!-- Social Proof / Stats Strip -->
        <div class="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-200 dark:border-zinc-800 text-left">
          <div class="p-3 rounded-xl bg-white/60 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 space-y-0.5 shadow-2xs">
            <div class="text-2xl font-bold font-mono text-slate-900 dark:text-zinc-100">10M+</div>
            <div class="text-xs text-slate-500 dark:text-zinc-400 font-medium">Links Shortened</div>
          </div>
          <div class="p-3 rounded-xl bg-white/60 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 space-y-0.5 shadow-2xs">
            <div class="text-2xl font-bold font-mono text-slate-900 dark:text-zinc-100">99.99%</div>
            <div class="text-xs text-slate-500 dark:text-zinc-400 font-medium">Uptime SLA</div>
          </div>
          <div class="p-3 rounded-xl bg-white/60 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 space-y-0.5 shadow-2xs">
            <div class="text-2xl font-bold font-mono text-slate-900 dark:text-zinc-100">&lt;15ms</div>
            <div class="text-xs text-slate-500 dark:text-zinc-400 font-medium">Global Latency</div>
          </div>
          <div class="p-3 rounded-xl bg-white/60 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 space-y-0.5 shadow-2xs">
            <div class="text-2xl font-bold font-mono text-slate-900 dark:text-zinc-100">150k+</div>
            <div class="text-xs text-slate-500 dark:text-zinc-400 font-medium">Active Analytics</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Real-time Link Analyzer Section -->
    <LinkAnalyzer />

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
            to="/register"
            class="px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-semibold text-sm hover:opacity-90 transition shadow-md flex items-center gap-2"
          >
            <span>Get Started Now</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
