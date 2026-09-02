<script setup lang="ts">
import { Link2, Github, ArrowUpRight } from 'lucide-vue-next'
</script>

<template>
  <footer class="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] py-12 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 pb-12 border-b border-[var(--border-color)]">
        <!-- Brand Info -->
        <div class="col-span-2 sm:col-span-3 md:col-span-2 space-y-4">
          <a href="#" class="flex items-center gap-2.5 font-bold text-xl text-[var(--text-primary)]">
            <div class="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 shadow-sm">
              <Link2 class="w-5 h-5 stroke-[2.5]" />
            </div>
            <span class="font-semibold text-lg">Linkly<span class="text-blue-500">.</span></span>
          </a>
          <p class="text-xs sm:text-sm max-w-sm text-[var(--text-secondary)] leading-relaxed">
            Minimalist URL Shortener and Custom QR Code Generator. Built for speed, clarity, and precision.
          </p>
          <div class="flex items-center gap-3 pt-2">
            <a href="https://github.com/Diyor-Khasanov-dev/linkly-frontend" target="_blank" rel="noopener" class="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] transition">
              <Github class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Product Links -->
        <div class="col-span-1">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-3 sm:mb-4">Product</h3>
          <ul class="space-y-2 text-xs sm:text-sm">
            <li><a href="#shortener" class="hover:text-[var(--text-primary)] transition">URL Shortener</a></li>
            <li><a href="#qr-generator" class="hover:text-[var(--text-primary)] transition">QR Code Studio</a></li>
            <li><a href="#features" class="hover:text-[var(--text-primary)] transition">Custom Aliases</a></li>
          </ul>
        </div>

        <!-- Solutions Links -->
        <div class="col-span-1">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-3 sm:mb-4">Solutions</h3>
          <ul class="space-y-2 text-xs sm:text-sm">
            <li><a href="#" class="hover:text-[var(--text-primary)] transition flex items-center gap-1">Developers <ArrowUpRight class="w-3 h-3 opacity-60" /></a></li>
            <li><a href="#" class="hover:text-[var(--text-primary)] transition flex items-center gap-1">Marketers <ArrowUpRight class="w-3 h-3 opacity-60" /></a></li>
            <li><a href="#" class="hover:text-[var(--text-primary)] transition flex items-center gap-1">Enterprise <ArrowUpRight class="w-3 h-3 opacity-60" /></a></li>
            <li><a href="#" class="hover:text-[var(--text-primary)] transition">API Docs</a></li>
          </ul>
        </div>

        <!-- Company Links -->
        <div class="col-span-1">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-3 sm:mb-4">Company</h3>
          <ul class="space-y-2 text-xs sm:text-sm">
            <li><a href="#" class="hover:text-[var(--text-primary)] transition">About Linkly</a></li>
            <li><a href="/register" class="hover:text-[var(--text-primary)] transition">Get Started</a></li>
            <li><a href="#" class="hover:text-[var(--text-primary)] transition">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-[var(--text-primary)] transition">Terms</a></li>
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
