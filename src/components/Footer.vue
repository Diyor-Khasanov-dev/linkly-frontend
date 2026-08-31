<script setup lang="ts">
import { Link2, Github, Twitter, ArrowUpRight } from 'lucide-vue-next'
</script>

<template>
  <footer class="border-t border-slate-200 dark:border-[var(--border-color)] bg-slate-100/60 dark:bg-[var(--bg-secondary)] text-slate-600 dark:text-[var(--text-secondary)] py-12 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-[var(--border-color)]">
        <!-- Brand Info -->
        <div class="md:col-span-2 space-y-4">
          <a href="#" class="flex items-center gap-2.5 font-bold text-xl text-[var(--text-primary)]">
            <div class="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-100 dark:text-zinc-900 shadow-sm">
              <Link2 class="w-5 h-5 stroke-[2.5]" />
            </div>
            <span class="font-semibold text-lg">Linkly<span class="text-blue-600 dark:text-blue-500">.</span></span>
          </a>
          <p class="text-sm max-w-sm text-[var(--text-secondary)] leading-relaxed">
            Minimalist URL Shortener, Real-time Analytics, and Custom QR Code Generator. Built for speed, clarity, and precision.
          </p>
          <div class="flex items-center gap-3 pt-2">
            <a href="https://github.com/Diyor-Khasanov-dev/linkly-frontend" target="_blank" rel="noopener" class="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] transition">
              <Github class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Product Links -->
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">Product</h3>
          <ul class="space-y-2.5 text-sm">
            <li><a href="#shortener" class="hover:text-[var(--text-primary)] transition">URL Shortener</a></li>
            <li><a href="#analyzer" class="hover:text-[var(--text-primary)] transition">Link Analytics</a></li>
            <li><a href="#qr-generator" class="hover:text-[var(--text-primary)] transition">QR Code Studio</a></li>
            <li><a href="#features" class="hover:text-[var(--text-primary)] transition">Custom Aliases</a></li>
          </ul>
        </div>

        <!-- Solutions Links -->
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">Solutions</h3>
          <ul class="space-y-2.5 text-sm">
            <li><a href="#" class="hover:text-[var(--text-primary)] transition flex items-center gap-1">Developers <ArrowUpRight class="w-3 h-3 opacity-60" /></a></li>
            <li><a href="#" class="hover:text-[var(--text-primary)] transition flex items-center gap-1">Marketers <ArrowUpRight class="w-3 h-3 opacity-60" /></a></li>
            <li><a href="#" class="hover:text-[var(--text-primary)] transition flex items-center gap-1">Enterprise <ArrowUpRight class="w-3 h-3 opacity-60" /></a></li>
            <li><a href="#" class="hover:text-[var(--text-primary)] transition">API Documentation</a></li>
          </ul>
        </div>

        <!-- Company Links -->
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">Company</h3>
          <ul class="space-y-2.5 text-sm">
            <li><a href="#" class="hover:text-[var(--text-primary)] transition">About Linkly</a></li>
            <li><a href="/register" class="hover:text-[var(--text-primary)] transition">Get Started</a></li>
            <li><a href="#" class="hover:text-[var(--text-primary)] transition">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-[var(--text-primary)] transition">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-secondary)] gap-4">
        <p>&copy; {{ new Date().getFullYear() }} Linkly Inc. All rights reserved.</p>
        <p class="flex items-center gap-1">
          Designed with minimalist precision for modern web.
        </p>
      </div>
    </div>
  </footer>
</template>
