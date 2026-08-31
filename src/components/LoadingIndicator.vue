<script setup lang="ts">
import { ref } from 'vue'

const isNavigating = ref(false)
const progress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const startLoading = () => {
  isNavigating.value = true
  progress.value = 10
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15
    }
  }, 100)
}

const finishLoading = () => {
  progress.value = 100
  if (timer) clearInterval(timer)
  setTimeout(() => {
    isNavigating.value = false
    progress.value = 0
  }, 200)
}

defineExpose({
  startLoading,
  finishLoading,
  isNavigating,
})
</script>

<template>
  <div>
    <!-- Top Progress Bar -->
    <div
      v-if="isNavigating"
      class="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 z-[100] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,99,235,0.8)]"
      :style="{ width: `${progress}%` }"
    ></div>

    <!-- Centered Loading Spinner Overlay for long tasks or page loads if needed -->
    <Transition name="fade">
      <div
        v-if="isNavigating"
        class="fixed inset-0 z-40 bg-zinc-950/20 dark:bg-zinc-950/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none"
      >
        <div class="p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 shadow-xl flex items-center gap-3">
          <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-xs font-semibold text-slate-700 dark:text-zinc-300">Loading...</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
