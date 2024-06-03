<template>
  <div class="card flex justify-content-center">
    <InputText v-model="value" :disabled="isDisabled" placeholder="Disabled" />
    <Button label="Submit" @click="handle" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(null)
const isDisabled = ref(true)

const handle = () => {
  isDisabled.value = !isDisabled.value
  console.log('test', isDisabled)
}
</script>
