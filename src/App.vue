<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-main class="bg-app">
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
body {
  font-family: 'Noto Sans Thai', 'Noto Sans SC', 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #f7f6f2;
  color: #1e293b;
  margin: 0;
}

.v-application {
  font-family: 'Noto Sans Thai', 'Noto Sans SC', 'Inter', system-ui, -apple-system, sans-serif !important;
  background-color: #f7f6f2 !important;
}

.bg-app {
  background-color: #f7f6f2;
}
</style>
