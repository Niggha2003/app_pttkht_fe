<!-- eslint-disable no-constant-condition -->
<script setup>
import { ref } from 'vue'
import { post, get } from '@/utils/httpRequest'
import { onMounted } from 'vue'

import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'

import modifyDate from '@/helpers/modifyDate'

const addResult = ref(null)
const addResultVisible = ref(false)

const workerFlights = ref(null)

// các options lựa chọn
const ticketClassOptions = [
  { text: 'vé hạng phổ thông', code: 'economy' },
  { text: 'phổ thông đặc biệt', code: 'premium' },
  { text: 'vé hạng thương gia', code: 'business' },
  { text: 'vé hạng nhất', code: 'first' }
]

const flight = ref({
  airlineName: null,
  flightNumber: null,
  ticketClass: null,
  from: null,
  to: null,
  time: null,
  airlineGateway: null,
  flightSeat: null,
  pictureBase64: null,
  worker: null
})
const imageFlight = ref(null)
let handleImageChange

const handleAddFlight = async () => {
  try {
    addResult.value = await post(`/order/flight/create`, {
      flight: {
        ...flight.value,
        ticketClass: flight.value.ticketClass.code,
        worker: flight.value.worker._id
      }
    })
    addResultVisible.value = true
  } catch (e) {
    addResult.value = { response: { status: 500 } }
    addResultVisible.value = true
  }
}

const resetAddFlight = async () => {
  // reset kết quả thêm
  addResult.value = null

  // reset giá trị tài khoản
  flight.value = {
    airlineName: null,
    flightNumber: null,
    ticketClass: null,
    from: null,
    to: null,
    time: null,
    airlineGateway: null,
    flightSeat: null,
    pictureBase64: null,
    worker: null
  }

  // reset ảnh
  imageFlight.value = null
}

// lấy danh sách lao động để lựa chọn người sử dụng vé bay này
const getWorkerFlight = async () => {
  let workers = await get('/working/worker')
  workers = workers.map((w) => ({
    _id: w._id,
    name: w.accountTraining.person.name,
    birthDate: modifyDate(w.accountTraining.person.birthDate)
  }))
  workerFlights.value = workers
}

// thay đổi hình ảnh
onMounted(() => {
  getWorkerFlight()
  resetAddFlight()
  handleImageChange = (e) => {
    const fileInput = e.target
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader()

      reader.onload = function (e) {
        imageFlight.value.src = e.target.result
        flight.value.pictureBase64 = e.target.result
      }

      reader.readAsDataURL(fileInput.files[0])
    }
  }
})
</script>

<template>
  <div class="card p-4 mb-6">
    <div class="order__info ms-5">
      <Dialog
        v-if="addResult"
        v-model:visible="addResultVisible"
        modal
        header="Kết quả thêm mới vé máy bay"
        :style="{
          width: '25rem',
          'font-weight': 'bold',
          'text-align': 'center'
        }"
      >
        <div :style="{ color: addResult.status === 200 ? 'green' : 'red' }">
          {{
            addResult.status && addResult.status == 200
              ? 'Thêm thành công'
              : addResult.response.status === 409
                ? 'Mã đơn hàng đã tồn tại'
                : 'Cần nhập đầy đủ trường thông tin'
          }}!!!
        </div>
      </Dialog>
      <div
        v-if="!(addResult && addResult.status && addResult.status == 200)"
        class="modify__choice d-flex flex-row-reverse"
      >
        <div class="btn btn-success me-1" style="width: 100px" @click="handleAddFlight">Thêm</div>
      </div>
      <form v-if="!(addResult && addResult.status && addResult.status == 200)" class="pe-4">
        <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
          <legend class="p-0 mb-4 fs-5 fw-bolder">Ảnh vé máy bay</legend>
          <div class="col-12 p-0 border-0">
            <input type="file" id="fileInput" class="d-none" @change="handleImageChange" />
            <label class="w-full mb-4 d-flex justify-content-center" for="fileInput">
              <img
                :class="'hoverOpacity'"
                ref="imageFlight"
                alt="Click to upload"
                style="width: 100%; height: 200px"
              />
            </label>
          </div>
        </fieldset>
        <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
          <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin vé máy bay</legend>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="airlineName">Tên hãng bay: </label>
              <InputText id="airlineName" v-model="flight.airlineName" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="flightNumber">Số hiệu chuyến bay: </label>
              <InputText id="flightNumber" v-model="flight.flightNumber" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="ticketClass">Hạng vé: </label>
              <Dropdown
                v-model="flight.ticketClass"
                :options="ticketClassOptions"
                optionLabel="text"
                input-id="ticketClass"
                checkmark
                :highlightOnSelect="false"
                class="w-full"
              />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="from">Bay từ: </label>
              <InputText id="from" v-model="flight.from" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="to">Bay đến: </label>
              <InputText id="to" v-model="flight.to" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="flightSeat">Ghế ngồi: </label>
              <InputText id="flightSeat" v-model="flight.flightSeat" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="airlineGateway">Cổng số: </label>
              <InputText id="airlineGateway" v-model="flight.airlineGateway" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="time">Thời gian bay: </label>
              <div class="flex-auto">
                <Calendar
                  v-model="flight.time"
                  showIcon
                  :showOnFocus="false"
                  inputId="time"
                  dateFormat="dd/mm/yy"
                  showTime
                  hourFormat="24"
                  :minDate="new Date()"
                  :pt="{
                    root: {
                      style: 'width: 100%'
                    }
                  }"
                />
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
          <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin lao động bay</legend>
          <div class="col-5 p-0" v-if="workerFlights">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="worker">Danh sách lao động: </label>
              <Dropdown
                v-model="flight.worker"
                :options="workerFlights"
                input-id="worker"
                checkmark
                :highlightOnSelect="false"
                class="w-full"
              >
                <template #option="slotProps">
                  <span>{{ slotProps.option.name }} - {{ slotProps.option.birthDate }}</span>
                </template>
                <template #value="slotProps">
                  <span v-if="slotProps.value">
                    {{ slotProps.value.name }} - {{ slotProps.value.birthDate }}
                  </span>
                  <span v-else style="color: #ccc">Lao động sử dụng vé máy bay này </span>
                </template>
              </Dropdown>
            </div>
          </div>
        </fieldset>
      </form>
      <div
        v-if="addResult && addResult.status && addResult.status == 200"
        class="d-flex justify-content-center py-2"
      >
        <Button
          label="Tiếp tục thêm mới vé máy bay"
          severity="secondary"
          icon="pi pi-user-plus"
          iconPos="right"
          @click="resetAddFlight()"
        ></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hoverOpacity:hover {
  opacity: 0.6;
  cursor: pointer;
}
</style>
