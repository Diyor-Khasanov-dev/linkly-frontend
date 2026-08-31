<script setup lang="ts">
import { ref } from 'vue'
import { Check, ArrowRight, Sparkles } from 'lucide-vue-next'

const billingCycle = ref<'monthly' | 'yearly'>('yearly')

const plans = [
  {
    name: 'Free Starter',
    badge: 'Free Forever',
    priceMonthly: '$0',
    priceYearly: '$0',
    period: 'forever',
    description: 'Perfect for personal links, social profiles, and lightweight projects.',
    features: [
      'Up to 1,000 links / month',
      'Basic click analytics (7 days retention)',
      'PNG QR Code generator',
      'Standard linkly.sh domain',
      'Community support'
    ],
    cta: 'Get Started Free',
    highlight: false
  },
  {
    name: 'Pro Creator',
    badge: 'Most Popular',
    priceMonthly: '$12',
    priceYearly: '$9',
    period: 'per month',
    description: 'Designed for professionals, growth marketers, and active creators.',
    features: [
      'Unlimited shortened links',
      'Advanced real-time analytics (1 year retention)',
      'Custom SVG & PNG QR Codes with branding',
      'Connect up to 3 Custom Domains',
      'Custom link aliases & password protection',
      'Priority email support'
    ],
    cta: 'Start 14-Day Free Trial',
    highlight: true
  },
  {
    name: 'Enterprise',
    badge: 'Custom',
    priceMonthly: '$49',
    priceYearly: '$39',
    period: 'per month',
    description: 'For high-volume teams requiring bulk APIs, SSO, and dedicated SLAs.',
    features: [
      'Everything in Pro Creator',
      'Unlimited custom domains',
      'Full REST API & Webhooks access',
      'SSO & SAML Authentication',
      'Team workspace & granular RBAC',
      '99.99% Uptime SLA & Dedicated Manager'
    ],
    cta: 'Contact Sales',
    highlight: false
  }
]
</script>

<template>
  <section class="py-16 sm:py-24 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/40 transition-colors duration-200" id="pricing">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold">
          <span>Flexible Plans</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Simple, Transparent Pricing
        </h2>
        <p class="text-sm sm:text-base text-[var(--text-secondary)]">
          No hidden fees. Upgrade, downgrade, or cancel anytime.
        </p>

        <!-- Monthly / Yearly toggle -->
        <div class="pt-2 flex items-center justify-center gap-3 text-xs font-medium">
          <span :class="billingCycle === 'monthly' ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]'">Monthly</span>
          <button
            @click="billingCycle = billingCycle === 'monthly' ? 'yearly' : 'monthly'"
            class="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-300 dark:bg-zinc-700 transition-colors cursor-pointer"
          >
            <span
              :class="billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-900 transition-transform"
            />
          </button>
          <span :class="billingCycle === 'yearly' ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]'" class="flex items-center gap-1.5">
            Yearly
            <span class="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold">Save 25%</span>
          </span>
        </div>
      </div>

      <!-- Pricing Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <div
          v-for="plan in plans"
          :key="plan.name"
          :class="[
            'rounded-2xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-200 relative',
            plan.highlight
              ? 'bg-[var(--bg-primary)] border-zinc-900 dark:border-zinc-100 shadow-xl ring-1 ring-zinc-900 dark:ring-zinc-100'
              : 'bg-[var(--bg-primary)] border-[var(--border-color)]'
          ]"
        >
          <!-- Badge -->
          <div v-if="plan.highlight" class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles class="w-3 h-3 text-blue-400 dark:text-blue-600" />
            <span>{{ plan.badge }}</span>
          </div>

          <div class="space-y-6">
            <!-- Plan Header -->
            <div>
              <h3 class="text-lg font-bold text-[var(--text-primary)]">{{ plan.name }}</h3>
              <p class="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">{{ plan.description }}</p>
            </div>

            <!-- Price -->
            <div class="flex items-baseline gap-1">
              <span class="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-primary)]">
                {{ billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly }}
              </span>
              <span class="text-xs text-[var(--text-secondary)] font-medium">/ {{ plan.period }}</span>
            </div>

            <!-- Feature list -->
            <ul class="space-y-3 pt-4 border-t border-[var(--border-color)] text-xs sm:text-sm">
              <li v-for="(feat, fIdx) in plan.features" :key="fIdx" class="flex items-start gap-2.5 text-[var(--text-secondary)]">
                <Check class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{{ feat }}</span>
              </li>
            </ul>
          </div>

          <!-- CTA Button -->
          <div class="pt-8">
            <a
              href="#shortener"
              :class="[
                'w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer',
                plan.highlight
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-zinc-200 dark:hover:bg-zinc-800'
              ]"
            >
              <span>{{ plan.cta }}</span>
              <ArrowRight class="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
