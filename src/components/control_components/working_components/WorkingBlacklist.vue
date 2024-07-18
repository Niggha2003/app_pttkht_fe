<script setup>
// import { get } from '@/utils/httpRequest'
import { onMounted, ref } from 'vue'
import { get, post } from '@/utils/httpRequest'

import { FilterMatchMode } from 'primevue/api'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import WorkerInfoComponent from './WorkerInfoComponent.vue'
import ListComponent from '../content_components/ListComponent.vue'

const workerList = ref(null)
const isWorkerShow = ref(false)
const workerInfoShow = ref(null)
const isDisabled = ref(true)
const filters = ref()

onMounted(() => {
  getWorkers()
})

const getWorkers = async () => {
  try {
    let workers = await get('/working/worker', {})
    if (workers) {
      workers = workers.map((w) => {
        w.accountTraining.person.birthDate = new Date(w.accountTraining.person.birthDate)
        return w
      })
      workers = workers.filter((w) => w.isBanned == true).reverse()
      workerList.value = workers
    }
  } catch (err) {
    console.log(err)
  }
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const handleSeeWorker = (data) => {
  const worker = workerList.value.find((w) => w._id == data._id)
  if (worker) {
    workerInfoShow.value = worker
    isWorkerShow.value = true
  }
}

const handleRemoveWorkerToBlackList = async (data) => {
  try {
    workerList.value = null
    await post(`/working/worker/${data._id}/update`, {
      isBanned: false
    })
    await getWorkers()
  } catch (e) {
    console.log(e)
  }
}

const columns = [
  {
    header: 'Ảnh',
    width: '25%',
    type: 'image',
    urlFolder: 'user',
    param: 'accountTraining.person.photo'
  },
  {
    header: 'Tên lao động',
    width: '25%',
    type: 'text',
    param: 'accountTraining.person.name'
  },
  {
    header: 'Ngày sinh',
    width: '20%',
    type: 'date',
    param: 'accountTraining.person.birthDate'
  },
  {
    header: 'Xem',
    width: '12.5%',
    type: 'button',
    iconPos: 'right',
    severity: 'contrast',
    label: 'Xem thông tin',
    icon: 'pi pi-arrow-right',
    buttonFunction: (data) => {
      handleSeeWorker(data)
    }
  },
  {
    header: 'Xóa khỏi danh sách đen',
    width: '17.5%',
    type: 'button',
    iconPos: 'left',
    label: 'Xóa khỏi danh sách đen',
    severity: 'success',
    icon: 'pi pi-times',
    buttonFunction: (data) => {
      handleRemoveWorkerToBlackList(data)
    }
  }
]
</script>

<template>
  <div v-if="!isWorkerShow" class="worker__list card p-4">
    <div class="d-flex flex-row-reverse mb-3">
      <div class="d-flex align-items-center me-2 border-3 border-contrast p-2">
        <div class="me-2">Số lượng công nhân trong danh sách đen:</div>
        <div>{{ workerList ? workerList.length : '' }}</div>
      </div>
    </div>
    <ListComponent
      v-if="workerList"
      v-model:filters="filters"
      @clearFilter="clearFilter"
      :items="workerList"
      :globalFilterFields="['accountTraining.person.name', 'accountTraining.person.birthDate']"
      :tableFor="'lao động'"
      :columns="columns"
      :type="'black'"
    >
    </ListComponent>
  </div>
  <div v-if="isWorkerShow" class="card pt-3 ps-4">
    <div class="d-flex justify-content-start pe-5">
      <div
        @click="
          async () => {
            await getWorkers()
            isWorkerShow = false
          }
        "
        class="my-2 btn btn-danger rounded-circle text-light"
      >
        <font-awesome-icon :icon="faArrowLeft" />
      </div>
    </div>
    <div>
      <worker-info-component
        v-model:isDisabled="isDisabled"
        :worker="workerInfoShow"
      ></worker-info-component>
    </div>
  </div>
</template>

<style scoped>
.custom-input:focus {
  outline: none; /* Tùy chọn: Bỏ viền outline mặc định khi focus */
}
</style>

<style>
.hoverToBlack:hover {
  color: black !important;
}
</style>
