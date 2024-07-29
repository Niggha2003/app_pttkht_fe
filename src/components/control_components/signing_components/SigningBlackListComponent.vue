<script setup>
import { ref } from 'vue'

import { get } from '@/utils/httpRequest'

import { FilterMatchMode } from 'primevue/api'

import ListComponent from '../content_components/ListComponent.vue'

const signingBlackList = ref(null)
const filtersHalt = ref(null)

const signingStateDropdown = ref([])

const getSignings = async () => {
  let applies = await get(`/signing/apply`)
  applies = applies.reverse().map((a) => {
    a.birthDate = new Date(a.birthDate)
    a.createAt = new Date(a.createAt)
    a.order.type = orderType[a.order.type]
    return a
  })
  signingBlackList.value = applies.filter((a) => a.state == 'halt')
}

const clearFiltersHalt = () => {
  filtersHalt.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const initFilters = () => {
  filtersHalt.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

initFilters()

const orderType = {
  ck: 'Cơ khí',
  dm: 'Dệt may',
  os: 'Giúp việc',
  bv: 'Làm nông'
}

const columns = [
  {
    header: 'Thời gian gửi đơn',
    width: '8%',
    type: 'date',
    param: 'createAt'
  },
  {
    header: 'Họ tên',
    width: '15%',
    type: 'text',
    param: 'name'
  },
  {
    header: 'Ngày sinh',
    width: '10%',
    type: 'date',
    param: 'birthDate'
  },
  {
    header: 'Số điện thoại',
    width: '11%',
    type: 'text',
    param: 'phoneNumber'
  },
  {
    header: 'Email',
    width: '10%',
    type: 'text',
    param: 'email'
  },
  {
    header: 'Mã đơn đăng kí',
    width: '15%',
    type: 'text',
    param: 'order.orderCode'
  },
  {
    header: 'Loại đơn đăng kí',
    width: '10%',
    type: 'text',
    param: 'order.type'
  },
  {
    header: 'Trạng thái đơn đăng kí',
    width: '15%',
    type: 'dropdownTag',
    param: 'state',
    label: 'text',
    key: 'code',
    value: signingStateDropdown,
    itemList: [{ code: 'halt', text: 'Cấm', severity: 'contrast' }],
    // eslint-disable-next-line no-unused-vars
    dropdownFunction: (data, newValue) => {}
  }
]

Promise.all([getSignings()])
</script>

<template>
  <TabView
    :pt="{
      inkbar: { style: 'background-color: #dc3545; height: 3px ' },
      navcontent: { class: 'mt-2' }
    }"
    class="card mb-6"
  >
    <TabPanel
      v-if="signingBlackList"
      header="Hồ sơ bị cấm"
      :pt="{
        headerAction: ({ context }) => ({
          style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
          class: 'tabPanelTagA'
        })
      }"
    >
      <div class="signing__list card position-relative p-4">
        <div
          style="
            text-transform: uppercase;
            color: #ccc;
            top: 20px;
            left: 20px;
            pointer-events: none;
          "
          class="position-absolute fs-6 fw-bolder"
        >
          Đơn đăng kí bị cấm
        </div>
        <div class="d-flex flex-row-reverse mb-3">
          <div class="d-flex align-items-center me-4 border-3 border-contrast p-2">
            <div class="me-2">Số lượng đơn đăng kí bị cấm hiện tại:</div>
            <div>{{ signingBlackList ? signingBlackList.length : '' }}</div>
          </div>
        </div>
        <ListComponent
          v-if="signingBlackList"
          v-model:filters="filtersHalt"
          @clearFilter="clearFiltersHalt"
          :items="signingBlackList"
          :globalFilterFields="[
            'name, birthDate, phoneNumber, email, order.orderCode, order.orderType'
          ]"
          :tableFor="'đơn đăng kí'"
          :columns="columns"
          :type="'black'"
        >
        </ListComponent>
      </div>
    </TabPanel>
  </TabView>
</template>

<style></style>
