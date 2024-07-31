<!-- eslint-disable no-constant-condition -->
<script setup>
import { ref } from 'vue'

import modifyDate from '@/helpers/modifyDate'

const props = defineProps(['flight'])
const flight = ref(props.flight)

// khởi tạo các giá trị hiển thị
const flightImg = flight.value.pictureBase64
</script>

<template>
  <div class="flight__info ms-2">
    <div class="my-6"></div>
    <form class="pe-4">
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 mb-3 fw-bolder">Ảnh chụp vé máy bay</legend>
        <div class="col-12 p-0 border-0">
          <label class="mb-4 w-full d-flex justify-content-center" for="fileInput">
            <img
              :src="flightImg"
              alt="Click to upload"
              style="width: 100%; height: 200px; border-radius: 20px"
            />
          </label>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin chuyến bay</legend>
        <div
          :class="[
            'row d-flex justify-content-between border-1 p-3 mb-4 ms-2 rounded',
            { 'border-danger': new Date() > new Date(flight.time) },
            { 'border-success': new Date() < new Date(flight.time) }
          ]"
        >
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Tên hãng bay: </label>
              <span>{{ flight.airlineName }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Số hiệu chuyến bay: </label>
              <span>{{ flight.flightNumber }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Hạng vé: </label>
              <span>{{ flight.ticketClass }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Bay từ: </label>
              <span>{{ flight.from }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Bay đến: </label>
              <span>{{ flight.to }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Thời gian: </label>
              <span>{{ modifyDate(flight.time, true) }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Cổng số: </label>
              <span>{{ flight.airlineGateway }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Ghế ngồi: </label>
              <span>{{ flight.flightSeat }}</span>
            </div>
          </div>
          <Tag
            v-if="new Date() > new Date(flight.time)"
            severity="danger"
            value="Vé chưa bay"
            rounded
          ></Tag>
          <Tag
            v-if="new Date() < new Date(flight.time)"
            severity="success"
            value="Vé đã bay"
            rounded
          ></Tag>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin chuyến bay</legend>
        <div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Tên lao động bay: </label>
              <span
                >{{
                  `
                  Tên: 
                    ${flight.worker.accountTraining.person.name}  -  
                    Ngày sinh: ${modifyDate(flight.worker.accountTraining.person.birthDate)}
                  `
                }}
              </span>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>
