<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { ShieldCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { verifyOtp, pendingEmail, isLoading } = useAuth()

const digits = ref(['', '', '', '', '', ''])
const inputRefs = ref<(HTMLInputElement | null)[]>([])
const targetEmail = ref('')
const errorMessage = ref('')
const resendSuccess = ref(false)

onMounted(() => {
  targetEmail.value = (route.query.email as string) || pendingEmail.value || 'user@linkly.com'
})

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  if (value.length > 1) {
    // If pasted multi-character code
    const chars = value.slice(0, 6).split('')
    chars.forEach((char, i) => {
      if (i < 6) digits.value[i] = char
    })
    const lastIdx = Math.min(chars.length, 5)
    inputRefs.value[lastIdx]?.focus()
  } else {
    digits.value[index] = value
    if (value && index < 5) {
      inputRefs.value[index + 1]?.focus()
    }
  }
}

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const handleVerify = async () => {
  errorMessage.value = ''
  const code = digits.value.join('')
  if (code.length < 4) {
    errorMessage.value = 'Please enter at least 4 digits'
    return
  }

  const res = await verifyOtp(code)
  if (res.success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = res.error || 'Verification failed. Please try again.'
  }
}

const handleResend = () => {
  resendSuccess.value = true
  setTimeout(() => {
    resendSuccess.value = false
  }, 3000)
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950 via-[var(--bg-primary)] to-[var(--bg-primary)]">
    <div class="max-w-md w-full space-y-8 bg-zinc-900/90 p-8 rounded-2xl border border-zinc-800 shadow-xl relative overflow-hidden text-center">
      <!-- Glow effect -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Icon Header -->
      <div class="space-y-2">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-900/30 text-blue-400 border border-blue-800/50 shadow-xs mb-2">
          <ShieldCheck class="w-6 h-6 stroke-[2.2]" />
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-zinc-100">
          Two-Step Verification
        </h2>
        <p class="text-xs text-zinc-400 max-w-xs mx-auto">
          We sent a 6-digit verification code to
          <span class="font-semibold text-zinc-200">{{ targetEmail }}</span>
        </p>
      </div>

      <!-- Error / Resend alert -->
      <div v-if="errorMessage" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400">
        {{ errorMessage }}
      </div>

      <div v-if="resendSuccess" class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 flex items-center justify-center gap-1.5">
        <CheckCircle2 class="w-4 h-4" />
        <span>New code sent to your email! (Default: 123456)</span>
      </div>

      <!-- OTP Form -->
      <form class="mt-6 space-y-6" @submit.prevent="handleVerify">
        <!-- 6-Digit Code Inputs -->
        <div class="flex items-center justify-center gap-2">
          <input
            v-for="(_, idx) in digits"
            :key="idx"
            :ref="(el) => { if (el) inputRefs[idx] = el as HTMLInputElement }"
            v-model="digits[idx]"
            type="text"
            maxlength="1"
            class="w-11 h-12 text-center text-xl font-bold font-mono bg-zinc-800/80 border border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-zinc-100 transition"
            @input="handleInput(idx, $event)"
            @keydown="handleKeyDown(idx, $event)"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-sm hover:opacity-90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span v-if="!isLoading">Verify & Access Dashboard</span>
          <span v-else>Verifying code...</span>
          <ArrowRight v-if="!isLoading" class="w-4 h-4" />
        </button>
      </form>

      <!-- Resend trigger -->
      <div class="pt-2 text-xs text-zinc-400 flex items-center justify-center gap-1">
        <span>Didn't receive the code?</span>
        <button
          type="button"
          @click="handleResend"
          class="font-medium text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw class="w-3 h-3" />
          <span>Resend code</span>
        </button>
      </div>

      <!-- Back to login -->
      <div class="text-center text-xs text-zinc-400">
        Need to change email?
        <router-link to="/register" class="font-medium text-blue-400 hover:underline">
          Back to Register
        </router-link>
      </div>
    </div>
  </div>
</template>
