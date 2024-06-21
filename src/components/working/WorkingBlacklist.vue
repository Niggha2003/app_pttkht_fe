<script setup>
// import { get } from '@/utils/httpRequest'
import { onMounted, ref } from 'vue'
import WorkerInfoComponent from './WorkerInfoComponent.vue'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import importImage from '@/helpers/importImage'
import modifyDate from '@/helpers/modifyDate'
import { post } from '@/utils/httpRequest'
import { useStore } from 'vuex'

const store = useStore()
const workerList = ref(null)
const isWorkerShow = ref(false)
const workerInfoShow = ref(null)
const isDisabled = ref(true)
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
  workers = workers.filter((w) => w.isBanned == true).reverse()
  workerList.value = workers
  // try {
  //   let workers = await get('/working/worker', {})
  //   if (workers) {
  //   workers = workers.map((w) => {
  //   w.accountTraining.person.birthDate = new Date(w.accountTraining.person.birthDate)
  //   return w
  // })
  // workers = workers.filter((w) => w.isBanned == true).reverse()
  // workerList.value = workers
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

const handleRemoveWorkerToBlackList = async (workerId) => {
  try {
    const updateResult = await post(`/working/worker/${workerId}/update`, {
      isBanned: false
    })
    store.commit('changeDataNeeded', {
      ...store.state.dataNeeded,
      worker_list: updateResult.data
    })
    getWorkers()
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div v-if="!isWorkerShow" class="worker__list card p-4">
    <div class="d-flex flex-row-reverse mb-3">
      <div class="d-flex align-items-center me-2 border-3 border-contrast p-2">
        <div class="me-2">Số lượng công nhân trong danh sách đen:</div>
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
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            severity="contrast"
            @click="clearFilter()"
            :pt="{
              root: { class: 'border-3' }
            }"
          />
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              class="custom-input"
              v-model="filters['global'].value"
              placeholder="Keyword Search"
            />
          </IconField>
        </div>
      </template>
      <template #empty> Không tìm thấy lao động nào có thông tin như vậy. </template>
      <Column
        field="image"
        header="Ảnh"
        style="width: 25%"
        :pt="{
          headerCell: {
            class: 'border-3',
            style: 'border-color: #ccc; background-color: #595959; color: white'
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
            style: 'border-color: #ccc; background-color: #595959; color: white'
          },
          filterMenuButton: {
            class: 'hoverToBlack',
            style: 'color: white'
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
            style: 'border-color: #ccc; background-color: #595959; color: white'
          },
          filterMenuButton: {
            class: 'hoverToBlack',
            style: 'color: white'
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
            style: 'border-color: #ccc; background-color: #595959; color: white'
          }
        }"
      >
        <template #body="{ data }">
          <Button
            label="Xem thông tin"
            icon="pi pi-arrow-right"
            iconPos="right"
            severity="info"
            @click="handleSeeWorker(data._id)"
            style="border-radius: 50px; font-size: 10px; border: none"
          />
        </template>
      </Column>
      <Column
        header="Xóa khỏi danh sách đen"
        style="width: 17.5%"
        :pt="{
          headerCell: {
            class: 'border-3',
            style: 'border-color: #ccc; background-color: #595959; color: white'
          }
        }"
      >
        <template #body="{ data }">
          <Button
            label="Xóa khỏi danh sách đen"
            icon="pi pi-times"
            iconPos="right"
            severity="danger"
            @click="handleRemoveWorkerToBlackList(data._id)"
            style="border-radius: 50px; font-size: 10px"
          />
        </template>
      </Column>
    </DataTable>
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
