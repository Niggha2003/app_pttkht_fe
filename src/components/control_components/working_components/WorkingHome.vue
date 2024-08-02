<script setup>
import { onMounted, ref } from 'vue'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { get } from '@/utils/httpRequest'
import { post } from '@/utils/httpRequest'

import ListComponent from '../content_components/ListComponent.vue'
import WorkerInfoComponent from './WorkerInfoComponent.vue'
import WorkerAddComponent from './WorkerAddComponent.vue'
import WorkerEfficiencyComponent from './WorkerEfficiencyComponent.vue'
import WorkerOrderComponent from './WorkerOrderComponent.vue'

import { FilterMatchMode } from 'primevue/api'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

const workerList = ref(null)
const workerInfoShow = ref(null)

const isWorkerShow = ref(false)
const isWorkerAdd = ref(false)
const isDisabled = ref(true)
const isUpDating = ref([false, false, false])

const filters = ref()

onMounted(() => {
  getWorkers()
})

const getWorkers = async () => {
  try {
    workerList.value = null

    let workers = await get('/working/worker', {})
    if (workers) {
      workers = workers.map((w) => {
        w.accountTraining.person.birthDate = new Date(w.accountTraining.person.birthDate)
        return w
      })
      workers = workers.filter((w) => w.isBanned == false).reverse()
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
  // try {
  //   const worker = await get(`/working/worker/${id}`, {})
  //   if (worker) {
  //     workerInfoShow.value = worker
  //   }
  //   isWorkerShow.value = true
  // } catch (err) {
  //   console.log(err)
  // }
}

const handleSaveWorkerInfo = async (id, updateIndex) => {
  isUpDating.value.forEach((up, i) => {
    if (i != updateIndex) {
      isUpDating.value[i] = true
    }
  })
  try {
    const worker = await get(`/working/worker/${id}`, {})
    if (worker) {
      workerInfoShow.value = worker
      isUpDating.value.forEach((up, i) => {
        if (i != updateIndex) {
          isUpDating.value[i] = false
        }
      })
    }
    isWorkerShow.value = true
  } catch (err) {
    console.log(err)
  }
}

const handleAddWorkerToBlackList = async (data) => {
  try {
    workerList.value = null
    await post(`/working/worker/${data._id}/update`, {
      isBanned: true
    })
    getWorkers()
  } catch (e) {
    console.log(e)
  }
}

// các hàm xử lí bật tắt chế độ sửa
const handleChangeModifyMode = (state) => {
  isDisabled.value = state
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
    severity: 'info',
    label: 'Xem thông tin',
    icon: 'pi pi-arrow-right',
    buttonFunction: (data) => {
      handleSeeWorker(data)
    }
  },
  {
    header: 'Thêm vào danh sách đen',
    width: '17.5%',
    type: 'button',
    iconPos: 'left',
    label: 'Thêm vào danh sách đen',
    severity: 'danger',
    icon: 'pi pi-times',
    buttonFunction: (data) => {
      handleAddWorkerToBlackList(data)
    }
  }
]
</script>

<template>
  <div v-if="!isWorkerShow && !isWorkerAdd" class="worker__list card p-4 mb-6">
    <div class="d-flex flex-row-reverse mb-3">
      <Button
        icon="pi pi-plus"
        severity="info"
        style="border-radius: 50%; height: 35px"
        aria-label="Filter"
        @click="isWorkerAdd = true"
      />
      <div class="d-flex align-items-center me-4 border-3 border-info p-2">
        <div class="me-2">Số lượng công nhân hiện tại:</div>
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
      :type="'info'"
    >
    </ListComponent>
  </div>
  <div v-if="isWorkerAdd" class="card p-4 mb-6">
    <div class="d-flex justify-content-start pe-5">
      <div
        @click="
          async () => {
            getWorkers()
            isWorkerAdd = false
          }
        "
        class="ms-4 btn btn-danger rounded-circle text-light"
      >
        <font-awesome-icon :icon="faArrowLeft" />
      </div>
    </div>
    <keep-alive>
      <worker-add-component> </worker-add-component>
    </keep-alive>
  </div>
  <div v-if="isWorkerShow" class="card pt-3 mb-6">
    <div class="d-flex justify-content-between my-2 pe-5">
      <div
        @click="
          async () => {
            getWorkers()
            isWorkerShow = false
            isDisabled = true
          }
        "
        class="ms-4 mb-3 btn btn-danger rounded-circle text-light"
      >
        <font-awesome-icon :icon="faArrowLeft" />
      </div>
      <div
        v-if="!isDisabled"
        class="btn btn-secondary me-1"
        style="width: 100px; height: 35px"
        @click="handleChangeModifyMode(true)"
      >
        Tắt sửa
      </div>
      <div
        v-if="workerInfoShow.state != 'back' && isDisabled"
        class="btn btn-danger me-1"
        style="width: 100px; height: 35px"
        @click="handleChangeModifyMode(false)"
      >
        Sửa
      </div>
    </div>
    <TabView :pt="{ inkbar: { style: 'background-color: #dc3545; height: 3px ' } }">
      <TabPanel
        header="Thông tin cơ bản"
        :pt="{
          headerAction: ({ context }) => ({
            style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
            class: 'tabPanelTagA'
          })
        }"
      >
        <keep-alive>
          <worker-info-component
            v-if="!isUpDating[0]"
            v-model:isDisabled="isDisabled"
            :worker="workerInfoShow"
            @save-worker="handleSaveWorkerInfo"
          ></worker-info-component>
        </keep-alive>
      </TabPanel>
      <TabPanel
        header="Thông tin đơn hàng và xuất cảnh"
        :pt="{
          headerAction: ({ context }) => ({
            style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
            class: 'tabPanelTagA'
          })
        }"
      >
        <worker-order-component
          v-if="!isUpDating[1]"
          v-model:isDisabled="isDisabled"
          :worker="workerInfoShow"
          @save-worker="handleSaveWorkerInfo"
        ></worker-order-component>
      </TabPanel>
      <TabPanel
        header="Thông tin năng xuất lao động"
        :pt="{
          headerAction: ({ context }) => ({
            style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
            class: 'tabPanelTagA'
          })
        }"
      >
        <worker-efficiency-component
          v-if="!isUpDating[2]"
          v-model:isDisabled="isDisabled"
          :worker="workerInfoShow"
          @save-worker="handleSaveWorkerInfo"
        ></worker-efficiency-component>
      </TabPanel>
    </TabView>
  </div>
</template>
