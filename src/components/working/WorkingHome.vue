<script setup>
import { get } from '@/utils/httpRequest'
import { onMounted, ref } from 'vue'
// import WorkerComponent from './WorkerComponent.vue'
import WorkerInfoComponent from './WorkerInfoComponent.vue'
import WorkerAddComponent from './WorkerAddComponent.vue'
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons'

const workerList = ref(null)
const isWorkerShow = ref(false)
const isWorkerAdd = ref(false)
const workerInfoShow = ref(null)

const getWorkers = async () => {
  try {
    const workers = await get('/working/worker', {})
    if (workers) {
      workerList.value = workers
    }
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  await getWorkers()
})

const handleSeeWorker = async (id) => {
  try {
    const worker = await get(`/working/worker/${id}`, {})
    if (worker) {
      workerInfoShow.value = worker
    }
    isWorkerShow.value = true
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <div v-if="!isWorkerShow && !isWorkerAdd" class="worker__list">
    <div class="d-flex flex-row-reverse mb-3">
      <div @click="isWorkerAdd = true" class="ms-2 btn btn-danger rounded-circle text-light">
        <font-awesome-icon :icon="faPlus" />
      </div>
      <div>Số lượng công nhân hiện tại: {{ workerList ? workerList.length : '' }}</div>
    </div>
    <template v-for="(worker, index) in workerList" :key="index">
      <worker-component @click="handleSeeWorker(worker._id)" :props="{ worker }"></worker-component>
    </template>
  </div>
  <div v-if="isWorkerAdd">
    <div @click="isWorkerAdd = false" class="ms-4 btn btn-danger rounded-circle text-light">
      <font-awesome-icon :icon="faArrowLeft" />
    </div>
    <keep-alive>
      <worker-add-component> </worker-add-component>
    </keep-alive>
  </div>
  <div v-if="isWorkerShow">
    <div @click="isWorkerShow = false" class="ms-4 btn btn-danger rounded-circle text-light">
      <font-awesome-icon :icon="faArrowLeft" />
    </div>
    <keep-alive>
      <worker-info-component :worker="workerInfoShow"></worker-info-component>
    </keep-alive>
  </div>
</template>
