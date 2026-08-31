<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  BarChart3,
  Globe,
  Smartphone,
  Search,
  MousePointerClick,
  Clock,
  TrendingUp,
  Shield,
  ArrowUpRight,
  Sparkles
} from 'lucide-vue-next'

const searchQuery = ref('linkly.sh/v3-5-release')
const activeTimeRange = ref<'7d' | '30d' | '90d'>('7d')

// Sample dataset reflecting rich realistic analytics
const mockAnalytics = ref({
  shortUrl: 'linkly.sh/v3-5-release',
  destination: 'https://github.com/vuejs/core/releases/tag/v3.5.0',
  createdAt: '2025-02-10',
  totalClicks: 14820,
  uniqueVisitors: 11340,
  avgClickTime: '120ms',
  botTrafficPercent: '1.2%',
  clicksByDay: [
    { day: 'Mon', count: 1200 },
    { day: 'Tue', count: 1950 },
    { day: 'Wed', count: 2400 },
    { day: 'Thu', count: 3100 },
    { day: 'Fri', count: 2800 },
    { day: 'Sat', count: 1850 },
    { day: 'Sun', count: 1520 }
  ],
  topCountries: [
    { code: 'US', name: 'United States', percentage: 42, count: '6,224' },
    { code: 'DE', name: 'Germany', percentage: 18, count: '2,667' },
    { code: 'UK', name: 'United Kingdom', percentage: 14, count: '2,074' },
    { code: 'JP', name: 'Japan', percentage: 11, count: '1,630' },
    { code: 'CA', name: 'Canada', percentage: 8, count: '1,185' }
  ],
  topDevices: [
    { type: 'Desktop', percentage: 64, color: 'bg-zinc-900 dark:bg-zinc-100' },
    { type: 'Mobile', percentage: 31, color: 'bg-blue-600 dark:bg-blue-500' },
    { type: 'Tablet', percentage: 5, color: 'bg-zinc-400 dark:bg-zinc-600' }
  ],
  topReferrers: [
    { name: 'Twitter / X', domain: 'x.com', clicks: 5420, percent: '36.5%' },
    { name: 'GitHub', domain: 'github.com', clicks: 4210, percent: '28.4%' },
    { name: 'Direct Search', domain: 'direct', clicks: 2890, percent: '19.5%' },
    { name: 'LinkedIn', domain: 'linkedin.com', clicks: 1400, percent: '9.4%' },
    { name: 'Others', domain: 'various', clicks: 900, percent: '6.2%' }
  ]
})

const maxClickCount = computed(() => {
  return Math.max(...mockAnalytics.value.clicksByDay.map(d => d.count))
})

const isAnalyzing = ref(false)

const handleAnalyzeSearch = () => {
  window.location.href = '/register'
}
</script>

<template>
  <section class="py-16 sm:py-24 border-t border-slate-200/80 dark:border-[var(--border-color)] bg-slate-50/70 dark:bg-[var(--bg-secondary)]/50 transition-colors duration-200" id="analyzer">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <BarChart3 class="w-3.5 h-3.5" />
          <span>Real-time Link Intelligence</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Deep Link Analytics & Insights
        </h2>
        <p class="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Inspect click performance, user geography, referrer channels, and device distributions for any Linkly short URL instantly.
        </p>
      </div>

      <!-- Search Input for Analyzer -->
      <div class="max-w-xl mx-auto">
        <form @submit.prevent="handleAnalyzeSearch" class="relative flex items-center">
          <Search class="w-4 h-4 absolute left-4 text-slate-400 dark:text-[var(--text-secondary)]" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Enter any linkly.sh short URL to analyze..."
            class="w-full pl-11 pr-28 py-3 bg-white dark:bg-[var(--bg-primary)] border border-slate-200 dark:border-[var(--border-color)] rounded-xl text-sm text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-zinc-100 transition shadow-sm"
          />
          <button
            type="submit"
            :disabled="isAnalyzing"
            class="absolute right-1.5 px-4 py-1.5 bg-blue-600 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-blue-700 dark:hover:bg-zinc-200 transition cursor-pointer shadow-xs"
          >
            <span>{{ isAnalyzing ? 'Analyzing...' : 'Analyze' }}</span>
          </button>
        </form>
      </div>

      <!-- Dashboard Grid Box -->
      <div class="bg-white dark:bg-[var(--bg-primary)] border border-slate-200 dark:border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8">

        <!-- Header Metrics & Time Filters -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Active Stream</span>
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h3 class="text-lg font-bold font-mono text-[var(--text-primary)] mt-1 flex items-center gap-2">
              {{ mockAnalytics.shortUrl }}
              <a :href="mockAnalytics.destination" target="_blank" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
                <ArrowUpRight class="w-4 h-4" />
              </a>
            </h3>
            <p class="text-xs text-[var(--text-secondary)] mt-0.5 truncate max-w-md">
              Target: {{ mockAnalytics.destination }}
            </p>
          </div>

          <!-- Time range tabs -->
          <div class="flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)]">
            <button
              v-for="range in (['7d', '30d', '90d'] as const)"
              :key="range"
              @click="activeTimeRange = range"
              :class="[
                'px-3 py-1 rounded transition cursor-pointer',
                activeTimeRange === range ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] font-semibold shadow-xs' : 'hover:text-[var(--text-primary)]'
              ]"
            >
              Last {{ range }}
            </button>
          </div>
        </div>

        <!-- 4 Metric Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
            <div class="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Total Clicks</span>
              <MousePointerClick class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="text-2xl font-bold font-mono text-[var(--text-primary)]">
              {{ mockAnalytics.totalClicks.toLocaleString() }}
            </div>
            <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp class="w-3 h-3" /> +18.4% from last period
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
            <div class="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Unique Visitors</span>
              <Globe class="w-4 h-4 text-purple-500" />
            </div>
            <div class="text-2xl font-bold font-mono text-[var(--text-primary)]">
              {{ mockAnalytics.uniqueVisitors.toLocaleString() }}
            </div>
            <div class="text-[11px] text-[var(--text-secondary)]">
              76.5% unique ratio
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
            <div class="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Avg Redirect Time</span>
              <Clock class="w-4 h-4 text-amber-500" />
            </div>
            <div class="text-2xl font-bold font-mono text-[var(--text-primary)]">
              {{ mockAnalytics.avgClickTime }}
            </div>
            <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Edge cached globally
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
            <div class="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Security Status</span>
              <Shield class="w-4 h-4 text-emerald-500" />
            </div>
            <div class="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              Verified
            </div>
            <div class="text-[11px] text-[var(--text-secondary)]">
              Malware & Spam scanned
            </div>
          </div>
        </div>

        <!-- Clicks Over Time Visual Bar Chart -->
        <div class="space-y-3 pt-2">
          <div class="flex justify-between items-center text-xs font-semibold text-[var(--text-primary)]">
            <span class="flex items-center gap-1.5">
              <BarChart3 class="w-4 h-4 text-blue-500" /> Clicks Volume Timeline
            </span>
            <span class="text-[var(--text-secondary)] font-normal">Updated 2m ago</span>
          </div>

          <div class="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div class="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-4">
              <div
                v-for="item in mockAnalytics.clicksByDay"
                :key="item.day"
                class="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div class="text-[10px] font-mono text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ item.count }}
                </div>
                <div class="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-sm h-36 flex items-end overflow-hidden">
                  <div
                    class="w-full bg-zinc-900 dark:bg-zinc-100 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-all rounded-t-sm"
                    :style="{ height: `${(item.count / maxClickCount) * 100}%` }"
                  ></div>
                </div>
                <span class="text-xs text-[var(--text-secondary)] font-medium">{{ item.day }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Breakdown Grid (Geography, Devices, Referrers) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">

          <!-- Top Geographic Locations -->
          <div class="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 space-y-4">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <Globe class="w-3.5 h-3.5" /> Top Countries
            </h4>
            <div class="space-y-3">
              <div v-for="country in mockAnalytics.topCountries" :key="country.code" class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="font-medium text-[var(--text-primary)]">{{ country.name }}</span>
                  <span class="font-mono text-[var(--text-secondary)]">{{ country.count }} ({{ country.percentage }}%)</span>
                </div>
                <div class="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div class="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full" :style="{ width: `${country.percentage}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Device Breakdown -->
          <div class="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 space-y-4">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <Smartphone class="w-3.5 h-3.5" /> Devices & Platforms
            </h4>
            <div class="space-y-3">
              <div v-for="device in mockAnalytics.topDevices" :key="device.type" class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="font-medium text-[var(--text-primary)]">{{ device.type }}</span>
                  <span class="font-mono text-[var(--text-secondary)]">{{ device.percentage }}%</span>
                </div>
                <div class="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div class="h-full rounded-full" :class="device.color" :style="{ width: `${device.percentage}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Referrers -->
          <div class="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 space-y-4">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles class="w-3.5 h-3.5" /> Top Referrers
            </h4>
            <div class="space-y-2.5">
              <div v-for="ref in mockAnalytics.topReferrers" :key="ref.name" class="flex items-center justify-between text-xs py-1 border-b border-[var(--border-color)] last:border-none">
                <span class="font-medium text-[var(--text-primary)] truncate max-w-[120px]">{{ ref.name }}</span>
                <span class="font-mono text-[var(--text-secondary)]">{{ ref.clicks.toLocaleString() }} ({{ ref.percent }})</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>
