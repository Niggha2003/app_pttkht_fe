<script setup>
import { onMounted, ref } from 'vue'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { get } from '@/utils/httpRequest'
import { post } from '@/utils/httpRequest'
import importImage from '@/helpers/importImage'
import modifyDate from '@/helpers/modifyDate'
import { useStore } from 'vuex'

import WorkerInfoComponent from './WorkerInfoComponent.vue'
import WorkerAddComponent from './WorkerAddComponent.vue'
import WorkerEfficiencyComponent from './WorkerEfficiencyComponent.vue'
import WorkerOrderComponent from './WorkerOrderComponent.vue'

import { FilterMatchMode, FilterOperator } from 'primevue/api'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

const store = useStore()

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

const getWorkers = () => {
  let workers = store.state.dataNeeded.worker_list
  workers = workers.map((w) => {
    w.accountTraining.person.birthDate = new Date(w.accountTraining.person.birthDate)
    return w
  })
  workers = workers.filter((w) => w.isBanned == false).reverse()
  workerList.value = workers
  // try {
  //   let workers = await get('/working/worker', {})
  //   if (workers) {
  //     workers = workers.map((w) => {
  //       w.accountTraining.person.birthDate = new Date(w.accountTraining.person.birthDate)
  //       return w
  //     })
  //     workers = workers.filter((w) => w.isBanned == false).reverse()
  //     workerList.value = workers
  //   }
  // } catch (err) {
  //   console.log(err)
  // }
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'accountTraining.person.photo': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    'accountTraining.person.name': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    'accountTraining.person.birthDate': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
    }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const handleSeeWorker = (id) => {
  const worker = workerList.value.find((w) => w._id == id)
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

const handleAddWorkerToBlackList = async (workerId) => {
  try {
    const updateResult = await post(`/working/worker/${workerId}/update`, {
      isBanned: true
    })
    store.commit('changeDataNeeded', { ...store.state.dataNeeded, worker_list: updateResult.data })
    getWorkers()
  } catch (e) {
    console.log(e)
  }
}

// các hàm xử lí bật tắt chế độ sửa
const handleChangeModifyMode = (state) => {
  isDisabled.value = state
}
</script>

<template>
  <div v-if="!isWorkerShow && !isWorkerAdd" class="worker__list card p-4">
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
    <DataTable
      v-model:filters="filters"
      :value="workerList"
      paginator
      :rows="5"
      dataKey="id"
      filterDisplay="menu"
      :globalFilterFields="['accountTraining.person.name', 'accountTraining.person.birthDate']"
      :pt="{
        column: {
          bodycell: {
            class: { 'border-2': true },
            style: { 'text-align': 'center', 'border-color': '#ccc' }
          }
        }
      }"
    >
      <template #header>
        <div class="flex justify-content-between mb-2">
          <Button
            type="button"
            severity="info"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            @click="clearFilter()"
            :pt="{
              root: { class: 'border-3' }
            }"
          />
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </IconField>
        </div>
      </template>
      <template #empty> Không tìm thấy lao động. </template>
      <Column
        field="image"
        header="Ảnh"
        style="width: 25%"
        :pt="{
          headerCell: {
            class: 'border-3',
            style: 'border-color: #ccc; background-color: rgb(230, 234, 243);'
          }
        }"
      >
        <template #body="{ data }">
          <img
            :src="importImage('user', data.accountTraining.person.photo)"
            :alt="data.accountTraining.person.name"
            style="width: 100px; height: 100px"
          />
        </template>
      </Column>
      <Column
        header="Tên lao động"
        filterField="accountTraining.person.name"
        style="width: 25%"
        :pt="{
          headerCell: {
            class: 'border-3',
            style: 'border-color: #ccc; background-color: rgb(230, 234, 243);'
          }
        }"
      >
        <template #body="{ data }">
          {{ data.accountTraining.person.name }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Nhập tên để tìm kiếm"
          />
        </template>
        <template #filterclear="{ filterCallback }">
          <Button
            type="button"
            icon="pi pi-times"
            @click="filterCallback()"
            severity="secondary"
          ></Button>
        </template>
        <template #filterapply="{ filterCallback }">
          <Button
            type="button"
            icon="pi pi-check"
            @click="filterCallback()"
            severity="success"
          ></Button>
        </template>
      </Column>
      <Column
        header="Ngày sinh"
        filterField="accountTraining.person.birthDate"
        dataType="date"
        style="width: 20%"
        :pt="{
          headerCell: {
            class: 'border-3',
            style: 'border-color: #ccc; background-color: rgb(230, 234, 243);'
          }
        }"
      >
        <template #body="{ data }">
          {{ modifyDate(data.accountTraining.person.birthDate.toISOString()) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar
            v-model="filterModel.value"
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yyyy"
            mask="99/99/9999"
          />
        </template>
      </Column>
      <Column
        header="Xem"
        style="width: 12.5%"
        :pt="{
          headerCell: {
            class: 'border-3',
            style: 'border-color: #ccc; background-color: rgb(230, 234, 243);'
          }
        }"
      >
        <template #body="{ data }">
          <Button
            label="Xem thông tin"
            icon="pi pi-arrow-right"
            iconPos="right"
            severity="danger"
            @click="handleSeeWorker(data._id)"
            style="border-radius: 50px; font-size: 10px"
          />
        </template>
      </Column>
      <Column
        header="Thêm vào danh sách đen"
        style="width: 17.5%"
        :pt="{
          headerCell: {
            class: 'border-3',
            style: 'border-color: #ccc; background-color: rgb(230, 234, 243);'
          }
        }"
      >
        <template #body="{ data }">
          <Button
            label="Thêm vào danh sách đen"
            icon="pi pi-times"
            iconPos="right"
            severity="contrast"
            @click="handleAddWorkerToBlackList(data._id)"
            style="border-radius: 50px; font-size: 10px; background-color: #595959; border: none"
          />
        </template>
      </Column>
    </DataTable>
  </div>
  <div v-if="isWorkerAdd" class="card p-4">
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
  <div v-if="isWorkerShow" class="card pt-3">
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
        v-if="isDisabled"
        class="btn btn-danger me-1"
        style="width: 100px; height: 35px"
        @click="handleChangeModifyMode(false)"
      >
        Sửa
      </div>
    </div>
    <TabView :pt="{ inkbar: { style: 'background-color: #dc3545' } }">
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

<style>
.tabPanelTagA:hover {
  color: #dc3545 !important;
}
</style>
