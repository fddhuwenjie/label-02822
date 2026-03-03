<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { createAuth } from '@/context/auth'

const { initFromStorage } = createAuth()
onMounted(() => {
  initFromStorage()
})
</script>

<style>
</style>
