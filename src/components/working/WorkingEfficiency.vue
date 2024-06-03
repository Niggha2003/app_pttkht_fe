<template>
  <div class="card flex justify-content-center">
    <Password v-model="value" toggleMask />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Password from 'primevue/password'
const value = ref(null)
</script>
