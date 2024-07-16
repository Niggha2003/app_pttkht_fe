<script setup>
import { ref } from 'vue'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { get } from '@/utils/httpRequest'

import { FilterMatchMode, FilterOperator } from 'primevue/api'

import PeopleInfoComponent from './PeopleInfoComponent.vue'
import ListComponent from '../content_components/ListComponent.vue'

const accountList = ref(null)
const accountInfoShow = ref(null)

const isAccountShow = ref(false)

const filters = ref()

const getAccounts = async () => {
  let accounts = await get('/account/account_employee')
  accounts = accounts.map((a) => {
    a.person.birthDate = new Date(a.person.birthDate)
    return a
  })
  accountList.value = accounts
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'person.photo': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    'person.name': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    'person.birthDate': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
    }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const handleSeeAccount = (data) => {
  const account = accountList.value.find((a) => a._id == data._id)
  if (account) {
    accountInfoShow.value = account
    isAccountShow.value = true
  }
}

const columns = [
  { header: 'Ảnh', width: '25%', filterField: null, type: 'image', param: 'person.photo' },
  {
    header: 'Tên lao động',
    width: '25%',
    filterField: 'person.name',
    type: 'text',
    param: 'person.name'
  },
  {
    header: 'Ngày sinh',
    width: '20%',
    filterField: 'person.birthDate',
    type: 'date',
    param: 'person.birthDate'
  },
  {
    header: 'Xem',
    width: '12.5%',
    filterField: null,
    type: 'button',
    severity: 'danger',
    label: 'Xem thông tin tài khoản',
    icon: 'pi pi-arrow-right',
    buttonFunction: (data) => {
      handleSeeAccount(data)
    }
  }
]

Promise.all([getAccounts()])
</script>

<template>
  <div v-if="!isAccountShow" class="account__list card p-4">
    <div class="d-flex flex-row-reverse mb-3">
      <Button
        icon="pi pi-plus"
        severity="info"
        style="border-radius: 50%; height: 35px"
        aria-label="Filter"
        @click="isWorkerAdd = true"
      />
      <div class="d-flex align-items-center me-4 border-3 border-info p-2">
        <div class="me-2">Số lượng nhân viên hiện tại:</div>
        <div>{{ accountList ? accountList.length : '' }}</div>
      </div>
    </div>
    <ListComponent
      v-if="accountList"
      v-model:filters="filters"
      @clearFilter="clearFilter"
      :items="accountList"
      :globalFilterFields="['person.name', 'person.birthDate']"
      :tableFor="'nhân viên'"
      :columns="columns"
      :type="'info'"
    >
    </ListComponent>
  </div>
  <div v-if="isAccountShow" class="card pt-3">
    <div class="d-flex justify-content-between my-2 pe-5">
      <div
        @click="
          async () => {
            getAccounts()
            isAccountShow = false
          }
        "
        class="ms-4 mb-3 btn btn-danger rounded-circle text-light"
        style="height: 35px"
      >
        <font-awesome-icon :icon="faArrowLeft" />
      </div>
      <PeopleInfoComponent :account="accountInfoShow"></PeopleInfoComponent>
    </div>
  </div>
</template>

<style></style>
