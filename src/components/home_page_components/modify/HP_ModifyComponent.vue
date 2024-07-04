<script setup>
import { useStore } from 'vuex'

import Button from 'primevue/button'
const emits = defineEmits(['saveFunction'])
const state = defineModel('state')
const result = defineModel('result')
const store = useStore()
</script>

<template>
  <div style="position: fixed; bottom: 20px; right: 100px; z-index: 1">
    <div
      v-if="result != null"
      :class="
        result.status && result.status == 200 ? 'text-success fw-bolder' : 'text-danger fw-bolder'
      "
    >
      {{ result.status && result.status == 200 ? 'Lưu thành công!!!' : 'Lưu thất bại!!!' }}
    </div>
    <div class="d-flex justify-content-around flex-row-reverse" style="width: 250px; height: 35px">
      <Button
        style="width: 100px"
        v-if="!state"
        class="rounded"
        label="Sửa"
        severity="info"
        @click="
          () => {
            state = true
            store.commit('setHomePageModify', true)
          }
        "
      ></Button>
      <Button
        style="width: 100px"
        class="rounded"
        v-if="state"
        label="Tắt sửa"
        severity="contrast"
        @click="
          () => {
            state = false
            store.commit('setHomePageModify', false)
          }
        "
      ></Button>
      <Button
        style="width: 100px"
        class="rounded"
        v-if="state"
        label="Lưu"
        severity="success"
        @click="
          async () => {
            await emits('saveFunction')
          }
        "
      ></Button>
    </div>
  </div>
</template>

<style></style>
