<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import LoadingIndicator from './components/LoadingIndicator.vue'

const loadingRef = ref<InstanceType<typeof LoadingIndicator> | null>(null)
const router = useRouter()
const route = useRoute()

const isDashboard = computed(() => route.path.startsWith('/dashboard'))

router.beforeEach((_to, _from, next) => {
  if (loadingRef.value) {
    loadingRef.value.startLoading()
  }
  next()
})

router.afterEach(() => {
  if (loadingRef.value) {
    loadingRef.value.finishLoading()
  }
})
</script>

<template>
  <div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased font-sans flex flex-col selection:bg-white selection:text-zinc-900">
    <LoadingIndicator ref="loadingRef" />
    <Navbar v-if="!isDashboard" />
    <main class="flex-1 flex flex-col min-h-0 min-w-0">
      <router-view />
    </main>
    <Footer v-if="!isDashboard" />
  </div>
</template>
