<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import LoadingIndicator from './components/LoadingIndicator.vue'

const loadingRef = ref<InstanceType<typeof LoadingIndicator> | null>(null)
const router = useRouter()

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
    <Navbar />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>
