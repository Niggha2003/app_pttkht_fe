<script setup>
import { ref } from 'vue'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { get } from '@/utils/httpRequest'

import { FilterMatchMode } from 'primevue/api'

import PeopleInfoComponent from './PeopleInfoComponent.vue'
import ListComponent from '../content_components/ListComponent.vue'

const accountList = ref(null)
const accountWorkingControls = ref([])
const accountOrderingControls = ref([])
const accountSigningControls = ref([])
const accountAdminControls = ref([])

const accountInfoShow = ref(null)

const isAccountShow = ref(false)

const filtersWorking = ref()
const filtersOrdering = ref()
const filtersSigning = ref()
const filtersAdmin = ref()

const getAccounts = async () => {
  let accounts = await get('/account/account_employee')
  accounts = accounts.reverse().map((a) => {
    a.person.birthDate = new Date(a.person.birthDate)
    return a
  })
  accountList.value = accounts
  accountWorkingControls.value = accounts.filter((a) => a.role == 'working')
  accountOrderingControls.value = accounts.filter((a) => a.role == 'ordering')
  accountSigningControls.value = accounts.filter((a) => a.role == 'signing')
  accountAdminControls.value = accounts.filter((a) => a.role == 'admin')
}

const clearFiltersWorking = () => {
  filtersWorking.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const clearFiltersOrdering = () => {
  filtersOrdering.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const clearFiltersSigning = () => {
  filtersSigning.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const clearFiltersAdmin = () => {
  filtersAdmin.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const initFilters = () => {
  filtersWorking.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
  filtersOrdering.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
  filtersSigning.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
  filtersAdmin.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

initFilters()

const handleSeeAccount = (data) => {
  const account = accountList.value.find((a) => a._id == data._id)
  if (account) {
    accountInfoShow.value = account
    isAccountShow.value = true
  }
}

const columns = [
  {
    header: 'Ảnh',
    width: '25%',
    type: 'image',
    urlFolder: 'user',
    param: 'person.photo'
  },
  {
    header: 'Tên lao động',
    width: '25%',
    type: 'text',
    param: 'person.name'
  },
  {
    header: 'Ngày sinh',
    width: '20%',
    type: 'date',
    param: 'person.birthDate'
  },
  {
    header: 'Xem',
    width: '12.5%',
    type: 'button',
    iconPos: 'right',
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
  <div v-if="!isAccountShow" class="account__list card position-relative p-4 mb-6">
    <div
      style="text-transform: uppercase; color: #ccc; top: 20px; left: 20px; pointer-events: none"
      class="position-absolute fs-6 fw-bolder"
    >
      Nhân viên quản lí lao động
    </div>
    <div class="d-flex flex-row-reverse mb-3">
      <div class="d-flex align-items-center me-4 border-3 border-info p-2">
        <div class="me-2">Số lượng nhân viên quản lí lao động hiện tại:</div>
        <div>{{ accountWorkingControls ? accountWorkingControls.length : '' }}</div>
      </div>
    </div>
    <ListComponent
      v-if="accountList && accountWorkingControls"
      v-model:filters="filtersWorking"
      @clearFilter="clearFiltersWorking"
      :items="accountWorkingControls"
      :globalFilterFields="['person.name', 'person.birthDate']"
      :tableFor="'nhân viên'"
      :columns="columns"
      :type="'info'"
    >
    </ListComponent>
  </div>
  <div v-if="!isAccountShow" class="account__list card position-relative p-4 mb-6">
    <div
      style="text-transform: uppercase; color: #ccc; top: 20px; left: 20px; pointer-events: none"
      class="position-absolute fs-6 fw-bolder"
    >
      Nhân viên quản lí đơn hàng
    </div>
    <div class="d-flex flex-row-reverse mb-3">
      <div class="d-flex align-items-center me-4 border-3 border-info p-2">
        <div class="me-2">Số lượng nhân viên quản lí đơn hàng hiện tại:</div>
        <div>{{ accountOrderingControls ? accountOrderingControls.length : '' }}</div>
      </div>
    </div>
    <ListComponent
      v-if="accountList && accountOrderingControls"
      v-model:filters="filtersOrdering"
      @clearFilter="clearFiltersOrdering"
      :items="accountOrderingControls"
      :globalFilterFields="['person.name', 'person.birthDate']"
      :tableFor="'nhân viên'"
      :columns="columns"
      :type="'info'"
    >
    </ListComponent>
  </div>
  <div v-if="!isAccountShow" class="account__list card position-relative p-4 mb-6">
    <div
      style="text-transform: uppercase; color: #ccc; top: 20px; left: 20px; pointer-events: none"
      class="position-absolute fs-6 fw-bolder"
    >
      Nhân viên quản lí đơn đăng kí
    </div>
    <div class="d-flex flex-row-reverse mb-3">
      <div class="d-flex align-items-center me-4 border-3 border-info p-2">
        <div class="me-2">Số lượng nhân viên quản lí đơn đăng kí hiện tại:</div>
        <div>{{ accountSigningControls ? accountSigningControls.length : '' }}</div>
      </div>
    </div>
    <ListComponent
      v-if="accountList && accountSigningControls"
      v-model:filters="filtersSigning"
      @clearFilter="clearFiltersSigning"
      :items="accountSigningControls"
      :globalFilterFields="['person.name', 'person.birthDate']"
      :tableFor="'nhân viên'"
      :columns="columns"
      :type="'info'"
    >
    </ListComponent>
  </div>
  <div v-if="!isAccountShow" class="account__list card position-relative p-4 mb-6">
    <div
      style="text-transform: uppercase; color: #ccc; top: 20px; left: 20px; pointer-events: none"
      class="position-absolute fs-6 fw-bolder"
    >
      Nhân viên admin
    </div>
    <div class="d-flex flex-row-reverse mb-3">
      <div class="d-flex align-items-center me-4 border-3 border-info p-2">
        <div class="me-2">Số lượng nhân viên admin hiện tại:</div>
        <div>{{ accountAdminControls ? accountAdminControls.length : '' }}</div>
      </div>
    </div>
    <ListComponent
      v-if="accountList && accountAdminControls"
      v-model:filters="filtersAdmin"
      @clearFilter="clearFiltersAdmin"
      :items="accountAdminControls"
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
