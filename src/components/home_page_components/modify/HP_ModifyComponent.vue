<script setup>
import { useStore } from 'vuex'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'

const toast = useToast()
const props = defineProps(['saveFunction'])
const state = defineModel('state')
const store = useStore()
const isHomePageModifyShow = store.state.isHomePageModifyShow
const save_function = props.saveFunction
</script>

<template>
  <div v-if="isHomePageModifyShow" style="position: fixed; bottom: 20px; right: 100px; z-index: 1">
    <!-- <div
      v-if="result != null"
      :class="
        result.status && result.status == 200 ? 'text-success fw-bolder' : 'text-danger fw-bolder'
      "
    >
      {{ result.status && result.status == 200 ? 'Lưu thành công!!!' : 'Lưu thất bại!!!' }}
    </div> -->
    <Toast />
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
            const result = await save_function()
            toast.add({
              severity: result.status && result.status == 200 ? 'success' : 'error',
              summary: result.status && result.status == 200 ? 'Lưu thành công' : 'Lưu thất bại',
              detail:
                result.status && result.status == 200
                  ? 'Bạn đã sửa thông tin thành công'
                  : 'Bạn đã sửa thông tin thất bại',
              life: 3000
            })
          }
        "
      ></Button>
    </div>
  </div>
</template>

<style></style>
