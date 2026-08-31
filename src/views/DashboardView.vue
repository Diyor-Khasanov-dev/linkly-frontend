<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
</script>

<template>
  <div class="h-[100dvh] w-full max-w-full overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col lg:flex-row">
    <!-- Sidebar Navigation -->
    <Sidebar />

    <!-- Main Content Container -->
    <main class="flex-1 min-w-0 h-full overflow-y-auto p-3 sm:p-6 lg:p-8">
      <div class="max-w-6xl mx-auto pb-12">
        <router-view />
      </div>
    </main>
  </div>
</template>
