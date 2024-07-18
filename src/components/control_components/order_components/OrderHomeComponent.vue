<script setup>
import { ref } from 'vue'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { get } from '@/utils/httpRequest'

import { FilterMatchMode } from 'primevue/api'

import ListComponent from '../content_components/ListComponent.vue'
import OrderInfoComponent from './OrderInfoComponent.vue'

const orderList = ref(null)
const orderCKList = ref(null)
const orderDMList = ref(null)
const orderOSList = ref(null)
const orderBVList = ref(null)

const orderInfoShow = ref(null)

const isOrderShow = ref(false)

const filtersCK = ref()
const filtersDM = ref()
const filtersOS = ref()
const filtersBV = ref()

const getOrders = async () => {
  let orders = await get('/order/order')
  orders = orders.reverse().map((o) => {
    o.timeNeeded = new Date(o.timeNeeded)
    o.state = states.find((s) => s.code == o.state)
    return o
  })
  orderList.value = orders
  orderCKList.value = orders.filter((o) => o.type == 'ck')
  orderDMList.value = orders.filter((o) => o.type == 'dm')
  orderOSList.value = orders.filter((o) => o.type == 'os')
  orderBVList.value = orders.filter((o) => o.type == 'bv')
}

const clearFiltersCK = () => {
  filtersCK.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const clearFiltersDM = () => {
  filtersDM.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const clearFiltersOS = () => {
  filtersOS.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const clearFiltersBV = () => {
  filtersBV.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const initFilters = () => {
  filtersCK.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
  filtersDM.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
  filtersOS.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
  filtersBV.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

initFilters()

const handleSeeOrder = (data) => {
  const order = orderList.value.find((o) => o._id == data._id)
  if (order) {
    orderInfoShow.value = order
    isOrderShow.value = true
  }
}

const states = [
  {
    code: 'inprogress',
    text: 'Đang thực hiện',
    severity: 'danger'
  },
  {
    code: 'completed',
    text: 'Đã hoàn thành',
    severity: 'success'
  }
]

const columns = [
  {
    header: 'Ảnh',
    width: '15%',
    type: 'image',
    urlFolder: 'order',
    param: 'photo'
  },
  {
    header: 'Mã đơn hàng',
    width: '15%',
    type: 'text',
    param: 'orderCode'
  },
  {
    header: 'Tên đơn hàng',
    width: '20%',
    type: 'text',
    param: 'orderName'
  },
  {
    header: 'Tên công ty',
    width: '15%',
    type: 'text',
    param: 'companyName'
  },
  {
    header: 'Trạng thái đơn hàng',
    width: '17.5%',
    type: 'tag',
    param: 'state.text',
    severity: 'state.severity'
  },
  {
    header: 'Xem',
    width: '17.5%',
    type: 'button',
    iconPos: 'right',
    severity: 'info',
    label: 'Xem thông tin đơn hàng',
    icon: 'pi pi-arrow-right',
    buttonFunction: (data) => {
      handleSeeOrder(data)
    }
  }
]

Promise.all([getOrders()])
</script>

<template>
  <div v-if="!isOrderShow" class="order__list card position-relative p-4 mb-6">
    <div
      style="text-transform: uppercase; color: #ccc; top: 20px; left: 20px; pointer-events: none"
      class="position-absolute fs-6 fw-bolder"
    >
      Đơn hàng thuộc loại cơ khí
    </div>
    <div class="d-flex flex-row-reverse mb-3">
      <div class="d-flex align-items-center me-4 border-3 border-info p-2">
        <div class="me-2">Số lượng đơn hàng cơ khí hiện tại:</div>
        <div>{{ orderCKList ? orderCKList.length : '' }}</div>
      </div>
    </div>
    <ListComponent
      v-if="orderList && orderCKList"
      v-model:filters="filtersCK"
      @clear-filter="clearFiltersCK"
      :items="orderCKList"
      :globalFilterFields="['orderCode', 'orderName', 'companyName', 'state.text']"
      :tableFor="'đơn hàng'"
      :columns="columns"
      :type="'info'"
    >
    </ListComponent>
  </div>
  <div v-if="!isOrderShow" class="order__list card position-relative p-4 mb-6">
    <div
      style="text-transform: uppercase; color: #ccc; top: 20px; left: 20px; pointer-events: none"
      class="position-absolute fs-6 fw-bolder"
    >
      Đơn hàng thuộc loại dệt may
    </div>
    <div class="d-flex flex-row-reverse mb-3">
      <div class="d-flex align-items-center me-4 border-3 border-info p-2">
        <div class="me-2">Số lượng đơn hàng dệt may hiện tại:</div>
        <div>{{ orderDMList ? orderDMList.length : '' }}</div>
      </div>
    </div>
    <ListComponent
      v-if="orderList && orderDMList"
      v-model:filters="filtersDM"
      @clearFilter="clearFiltersDM"
      :items="orderDMList"
      :globalFilterFields="['orderCode', 'orderName', 'companyName', 'state.text']"
      :tableFor="'đơn hàng'"
      :columns="columns"
      :type="'info'"
    >
    </ListComponent>
  </div>
  <div v-if="!isOrderShow" class="order__list card position-relative p-4 mb-6">
    <div
      style="text-transform: uppercase; color: #ccc; top: 20px; left: 20px; pointer-events: none"
      class="position-absolute fs-6 fw-bolder"
    >
      Đơn hàng thuộc loại giúp việc
    </div>
    <div class="d-flex flex-row-reverse mb-3">
      <div class="d-flex align-items-center me-4 border-3 border-info p-2">
        <div class="me-2">Số lượng đơn hàng giúp việc hiện tại:</div>
        <div>{{ orderOSList ? orderOSList.length : '' }}</div>
      </div>
    </div>
    <ListComponent
      v-if="orderList && orderOSList"
      v-model:filters="filtersOS"
      @clearFilter="clearFiltersOS"
      :items="orderOSList"
      :globalFilterFields="['orderCode', 'orderName', 'companyName', 'state.text']"
      :tableFor="'đơn hàng'"
      :columns="columns"
      :type="'info'"
    >
    </ListComponent>
  </div>
  <div v-if="!isOrderShow" class="order__list card position-relative p-4 mb-6">
    <div
      style="text-transform: uppercase; color: #ccc; top: 20px; left: 20px; pointer-events: none"
      class="position-absolute fs-6 fw-bolder"
    >
      Đơn hàng thuộc loại làm nông
    </div>
    <div class="d-flex flex-row-reverse mb-3">
      <div class="d-flex align-items-center me-4 border-3 border-info p-2">
        <div class="me-2">Số lượng đơn hàng làm nông hiện tại:</div>
        <div>{{ orderBVList ? orderBVList.length : '' }}</div>
      </div>
    </div>
    <ListComponent
      v-if="orderList && orderBVList"
      v-model:filters="filtersBV"
      @clearFilter="clearFiltersBV"
      :items="orderBVList"
      :globalFilterFields="['orderCode', 'orderName', 'companyName', 'state.text']"
      :tableFor="'đơn hàng'"
      :columns="columns"
      :type="'info'"
    >
    </ListComponent>
  </div>
  <div v-if="isOrderShow" class="card pt-3">
    <div class="d-flex justify-content-between my-2 pe-5">
      <div
        @click="
          async () => {
            getOrders()
            isOrderShow = false
          }
        "
        class="ms-4 mb-3 btn btn-danger rounded-circle text-light"
        style="height: 35px"
      >
        <font-awesome-icon :icon="faArrowLeft" />
      </div>
      <OrderInfoComponent :order="orderInfoShow"></OrderInfoComponent>
    </div>
  </div>
</template>

<style></style>
