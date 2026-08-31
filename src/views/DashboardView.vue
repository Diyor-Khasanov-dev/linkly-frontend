<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col lg:flex-row">
    <!-- Sidebar Navigation -->
    <Sidebar />

    <!-- Main Content Container -->
    <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div class="max-w-6xl mx-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>
