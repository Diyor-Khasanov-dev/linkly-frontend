<script setup lang="ts">
import { ref } from 'vue'
import {
  BarChart3,
  TrendingUp,
  Globe,
  MousePointerClick,
  Link2,
  Calendar
} from 'lucide-vue-next'

const timeframe = ref<'7d' | '30d' | '90d'>('7d')

const metrics = [
  { title: 'Total Clicks', value: '48,290', change: '+14.2%', icon: MousePointerClick, color: 'text-blue-500' },
  { title: 'Active Links', value: '1,284', change: '+8.1%', icon: Link2, color: 'text-emerald-500' },
  { title: 'Unique Visitors', value: '31,450', change: '+18.6%', icon: TrendingUp, color: 'text-purple-500' },
  { title: 'Avg. CTR', value: '4.8%', change: '+0.6%', icon: Globe, color: 'text-amber-500' },
]

const topLinks = [
  { shortUrl: 'linkly.sh/mdn-js-guide', clicks: 12450, percentage: 38 },
  { shortUrl: 'linkly.sh/vue3-guide', clicks: 9810, percentage: 28 },
  { shortUrl: 'linkly.sh/tailwind-docs', clicks: 6540, percentage: 19 },
  { shortUrl: 'linkly.sh/creative-studio', clicks: 4120, percentage: 12 },
]

const countryStats = [
  { country: 'United States', code: 'US', clicks: 18400, share: '38%' },
  { country: 'Germany', code: 'DE', clicks: 8200, share: '17%' },
  { country: 'United Kingdom', code: 'UK', clicks: 6100, share: '13%' },
  { country: 'Japan', code: 'JP', clicks: 4300, share: '9%' },
]

</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
          <BarChart3 class="w-6 h-6 text-emerald-500" />
          <span>Analytics</span>
        </h1>
        <p class="text-xs sm:text-sm text-[var(--text-secondary)]">
          Real-time performance metrics, audience demographics, and traffic channels.
        </p>
      </div>

      <!-- Timeframe selector -->
      <div class="flex items-center gap-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-1 rounded-xl self-start">
        <button
          v-for="tf in (['7d', '30d', '90d'] as const)"
          :key="tf"
          @click="timeframe = tf"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer',
            timeframe === tf
              ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          ]"
        >
          Last {{ tf }}
        </button>
      </div>
    </div>

    <!-- Stat Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="m in metrics"
        :key="m.title"
        class="p-4 sm:p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-2 shadow-2xs"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-[var(--text-secondary)]">{{ m.title }}</span>
          <component :is="m.icon" :class="['w-4 h-4', m.color]" />
        </div>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-bold font-mono text-[var(--text-primary)]">{{ m.value }}</span>
          <span class="text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
            {{ m.change }}
          </span>
        </div>
      </div>
    </div>

    <!-- Chart Visualizer Strip -->
    <div class="p-5 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h3 class="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <TrendingUp class="w-4 h-4 text-emerald-400" />
          <span>Click Velocity Trends</span>
        </h3>
        <span class="text-xs text-[var(--text-secondary)] flex items-center gap-1">
          <Calendar class="w-3.5 h-3.5" /> Live Traffic
        </span>
      </div>

      <!-- Simulated Graph Bars -->
      <div class="h-44 flex items-end justify-between gap-2 pt-4 px-2">
        <div v-for="(val, i) in [35, 42, 68, 55, 84, 72, 95, 88, 64, 90, 100, 78]" :key="i" class="flex-1 flex flex-col items-center gap-2">
          <div
            class="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-sm transition-all duration-500 hover:opacity-90"
            :style="{ height: `${val}%` }"
          ></div>
          <span class="text-[10px] text-zinc-500 font-mono">D{{ i + 1 }}</span>
        </div>
      </div>
    </div>

    <!-- Two-column breakdown (Top Links vs Devices & Countries) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Performing Links -->
      <div class="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
        <h3 class="text-sm font-bold text-[var(--text-primary)]">Top Performing Links</h3>

        <div class="space-y-3">
          <div v-for="link in topLinks" :key="link.shortUrl" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="text-blue-400 font-semibold truncate">{{ link.shortUrl }}</span>
              <span class="text-zinc-300 font-bold">{{ link.clicks.toLocaleString() }} clicks</span>
            </div>
            <div class="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div class="bg-blue-500 h-full rounded-full" :style="{ width: `${link.percentage}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Country Breakdown -->
      <div class="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-4">
        <h3 class="text-sm font-bold text-[var(--text-primary)]">Geographic Breakdown</h3>

        <div class="divide-y divide-[var(--border-color)]">
          <div v-for="c in countryStats" :key="c.code" class="py-2.5 flex items-center justify-between text-xs">
            <span class="font-medium text-[var(--text-primary)]">{{ c.country }}</span>
            <div class="flex items-center gap-3">
              <span class="font-mono text-zinc-400">{{ c.clicks.toLocaleString() }}</span>
              <span class="font-mono font-bold text-emerald-400 w-10 text-right">{{ c.share }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
