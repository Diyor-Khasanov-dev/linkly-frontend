<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, HelpCircle } from 'lucide-vue-next'

const openIndex = ref<number | null>(0)

const faqs = [
  {
    q: 'How does Linkly shorten URLs and track analytics?',
    a: 'When you create a shortened URL, Linkly generates a unique hash identifier. Our global edge servers instantly route visitors to your target URL while logging non-sensitive metrics like country origin, device type, and referral channel.'
  },
  {
    q: 'Can I customize my shortened link slug or use my custom domain?',
    a: 'Yes! You can specify custom slug aliases (e.g. linkly.sh/my-product). Pro and Enterprise users can also connect custom domains like link.yourbrand.com.'
  },
  {
    q: 'How do the QR codes work?',
    a: 'Our QR Studio creates high-precision vector (SVG) and raster (PNG) QR codes that route directly to your shortened links. You can customize colors and resolution directly from the dashboard.'
  },
  {
    q: 'Is there a limit on clicks or links on the Free plan?',
    a: 'The Free Starter plan includes up to 1,000 links per month with full access to standard link shorteners, QR generator, and 7-day click analytics. For higher limits, you can easily upgrade to Pro.'
  },
  {
    q: 'Are Linkly shortened links secure?',
    a: 'Security is paramount. All links pass through continuous threat detection scanning for phishing and malware. We also support optional password protection for sensitive destination links.'
  }
]

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="py-16 sm:py-24 border-t border-slate-200/80 dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] transition-colors duration-200" id="faq">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

      <!-- Header -->
      <div class="text-center space-y-3">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold">
          <HelpCircle class="w-3.5 h-3.5 text-blue-500" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Everything You Need to Know
        </h2>
        <p class="text-sm sm:text-base text-[var(--text-secondary)]">
          Got questions? We've got answers. If you need further help, feel free to contact us.
        </p>
      </div>

      <!-- FAQ Accordion List -->
      <div class="space-y-3">
        <div
          v-for="(faq, idx) in faqs"
          :key="idx"
          class="border border-slate-200 dark:border-[var(--border-color)] rounded-2xl bg-slate-50/70 dark:bg-[var(--bg-secondary)] overflow-hidden transition-all duration-200 shadow-2xs"
        >
          <button
            @click="toggleFaq(idx)"
            class="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[var(--text-primary)] hover:opacity-90 cursor-pointer"
          >
            <span>{{ faq.q }}</span>
            <ChevronDown
              :class="[
                'w-4 h-4 text-[var(--text-secondary)] shrink-0 transition-transform duration-200',
                openIndex === idx ? 'rotate-180' : ''
              ]"
            />
          </button>

          <div
            v-if="openIndex === idx"
            class="px-6 pb-5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)]/50 pt-3"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
