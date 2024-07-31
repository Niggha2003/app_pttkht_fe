<script setup>
import { ref } from 'vue'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { get } from '@/utils/httpRequest'

import { FilterMatchMode } from 'primevue/api'

import ListComponent from '../content_components/ListComponent.vue'
import FlightInfoComponent from './FlightInfoComponent.vue'

const flightList = ref(null)

const flightInfoShow = ref(null)

const isFlightShow = ref(false)

const filtersFlight = ref()

const getFlights = async () => {
  let flights = await get(`/order/flight`)
  flights = flights.reverse().map((fl) => {
    if (new Date(fl.time) < new Date()) {
      fl.isFly = { code: false, text: 'Chưa bay', severity: 'danger' }
    } else {
      fl.isFly = { code: true, text: 'Đã bay', severity: 'success' }
    }
    fl.time = new Date(fl.time)
    return fl
  })
  flightList.value = flights
}

const clearFiltersFlight = () => {
  filtersFlight.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const initFilters = () => {
  filtersFlight.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

initFilters()

const handleSeeFlight = (data) => {
  const flight = flightList.value.find((f) => f._id == data._id)
  if (flight) {
    flightInfoShow.value = flight
    isFlightShow.value = true
  }
}

const columns = [
  {
    header: 'Ảnh',
    width: '10%',
    type: 'image',
    param: 'pictureBase64'
  },
  {
    header: 'Tên hãng bay',
    width: '15%',
    type: 'text',
    param: 'airlineName'
  },
  {
    header: 'Số hiệu chuyến bay',
    width: '23%',
    type: 'text',
    param: 'flightNumber'
  },
  {
    header: 'Số ghế',
    width: '10%',
    type: 'text',
    param: 'flightSeat'
  },
  {
    header: 'Tên lao động',
    width: '10%',
    type: 'text',
    param: 'worker.accountTraining.person.name'
  },
  {
    header: 'Thời gian bay',
    width: '15%',
    type: 'date',
    includeTime: true,
    param: 'time'
  },
  {
    header: 'Đã bay?',
    width: '12%',
    type: 'tag',
    param: 'isFly.text',
    severity: 'isFly.severity'
  },
  {
    header: 'Xem',
    width: '5%',
    type: 'button',
    iconPos: 'right',
    severity: 'info',
    label: 'Xem',
    icon: 'pi pi-arrow-right',
    buttonFunction: (data) => {
      handleSeeFlight(data)
    }
  }
]

Promise.all([getFlights()])
</script>

<template>
  <TabView
    v-if="!isFlightShow"
    :pt="{
      inkbar: { style: 'background-color: #dc3545; height: 3px ' },
      navcontent: { class: 'mt-2' }
    }"
    class="card mb-6"
  >
    <TabPanel
      header="Danh sách vé máy bay"
      :pt="{
        headerAction: ({ context }) => ({
          style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
          class: 'tabPanelTagA'
        })
      }"
    >
      <div class="flight__list card position-relative p-4">
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
          Danh sách vé máy bay
        </div>
        <div class="d-flex flex-row-reverse mb-3">
          <div class="d-flex align-items-center me-4 border-3 border-info p-2">
            <div class="me-2">Số lượng vé máy bay hiện tại:</div>
            <div>{{ flightList ? flightList.length : '' }}</div>
          </div>
        </div>
        <ListComponent
          v-if="flightList"
          v-model:filters="filtersFlight"
          @clear-filter="clearFiltersFlight"
          :items="flightList"
          :globalFilterFields="[
            'airlineName',
            'flightNumber',
            'flightSeat',
            'worker.accountTraining.person.name',
            'time',
            'isFly.text'
          ]"
          :tableFor="'vé máy bay'"
          :columns="columns"
          :type="'info'"
        >
        </ListComponent>
      </div>
    </TabPanel>
  </TabView>

  <div v-if="isFlightShow" class="card pt-3">
    <div class="d-flex justify-content-between my-2 pe-5">
      <div
        @click="
          async () => {
            await getFlights()
            isFlightShow = false
          }
        "
        class="ms-4 mb-3 btn btn-danger rounded-circle text-light"
        style="height: 35px"
      >
        <font-awesome-icon :icon="faArrowLeft" />
      </div>
      <FlightInfoComponent :flight="flightInfoShow"></FlightInfoComponent>
    </div>
  </div>
</template>

<style></style>
