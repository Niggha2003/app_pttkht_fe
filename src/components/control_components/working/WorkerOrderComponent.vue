<script setup>
import { onMounted, ref } from 'vue'
import { post, get } from '@/utils/httpRequest'
import { useStore } from 'vuex'

import modifyDate from '@/helpers/modifyDate'

import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Steps from 'primevue/steps'
import Tag from 'primevue/tag'

import { faCircle } from '@fortawesome/free-solid-svg-icons'

const store = useStore()
const emit = defineEmits(['saveWorker'])
const props = defineProps(['worker'])
const worker = ref(props.worker)
const isDisabled = defineModel('isDisabled')

const orders = ref(null)
const orderInfo = ref('')
const flight = ref(null)

const updateResult = ref(null)
const workerStates = ref([
  {
    code: 'training',
    label: 'Đang đào tạo'
  },
  {
    code: 'prepared',
    label: 'Chuẩn bị xuất cảnh'
  },
  {
    code: 'abroad',
    label: 'Ở nước ngoài'
  },
  {
    code: 'back',
    label: 'Đã về nước'
  }
])

// khởi tạo các giá trị
const workerStateIndex = ref(workerStates.value.findIndex((s) => s.code == worker.value.state))
const calendarGoAbroadDate = ref()
const calendarGoBackDate = ref()
if (worker.value.timeGoAbroad) {
  calendarGoAbroadDate.value = new Date(worker.value.timeGoAbroad)
}
if (worker.value.timeGoBack) {
  calendarGoBackDate.value = new Date(worker.value.timeGoBack)
}

// gửi dữ liệu update
const handleUpdateInfo = async () => {
  try {
    updateResult.value = await post(`/working/worker/${worker.value._id}/update`, {
      state: workerStates.value[workerStateIndex.value].code,
      orderId: worker.value.order._id,
      ...((workerStateIndex.value == 2 || workerStateIndex.value == 3) && {
        timeGoAbroad: calendarGoAbroadDate.value
      }),
      ...(workerStateIndex.value == 3 && { timeGoBack: calendarGoBackDate.value })
    })
    store.commit('changeDataNeeded', {
      ...store.state.dataNeeded,
      worker_list: updateResult.value.data
    })
  } catch (e) {
    updateResult.value = e
  }
  emit('saveWorker', worker.value._id, 1)
  setTimeout(() => {
    updateResult.value = null
  }, 1000)
}

// lấy danh sách đơn hàng
const getOrders = async () => {
  try {
    orders.value = await get('order/order/', {})
  } catch (e) {
    console.log(e)
  }
}

// lấy danh sách chuyến bay
const getFlight = async () => {
  try {
    flight.value = await get('order/flight/', { workerId: worker.value._id })
  } catch (e) {
    console.log(e)
  }
}

// thay đổi giá trị orderInfo
const setOrderInfo = (order) => {
  if (order == null) orderInfo.value = 'Lao động chưa chọn đơn hàng'
  orderInfo.value = `Tên đơn hàng: ${order.orderName};\nTên công ty: ${order.companyName};\nMô tả: ${order.jobDescription};\nĐịa chỉ: ${order.companyAddress}`
}

onMounted(async () => {
  await getOrders()
  await getFlight()
  setOrderInfo(worker.value.order)
})
</script>

<template>
  <div class="worker__orderInfo ms-2">
    <div class="modify__choice d-flex flex-row-reverse">
      <div
        v-if="!isDisabled"
        class="btn btn-success me-1"
        style="width: 100px"
        @click="handleUpdateInfo"
      >
        Lưu
      </div>
      <div
        v-if="updateResult && updateResult.status && !isDisabled"
        style="color: green; font-weight: bold; margin-right: 20px"
      >
        {{ updateResult.status == 200 ? 'Lưu thành công' : 'Lưu không thành công' }}!!!
      </div>
    </div>
    <form class="pe-4">
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 fw-bolder my-2">Trạng thái lao động</legend>
        <div class="col-8 p-0">
          <div class="d-flex gap-4 mb-3 flex-column">
            <Steps
              :model="workerStates"
              class="custom-steps"
              :readonly="isDisabled"
              v-model:activeStep="workerStateIndex"
              :pt="{
                menu: ({ state }) => {
                  workerStateIndex = state.d_activeStep
                  return { class: 'ps-0' }
                },
                menuitem: ({ context }) => ({
                  class: {
                    animationForPseudoBefore: true,
                    animationForActivePseudoBefore: context.index <= workerStateIndex
                  },
                  style: 'flex: 1; height: 100px; cursor: pointer; overflow: visible'
                }),
                step: ({ context }) => {
                  context.disabled = true
                }
              }"
            >
              <template #item="{ label, index }">
                <span class="inline-flex flex-column justify-content-center align-items-center">
                  <span
                    :class="[
                      'inline-flex align-items-center justify-content-center border-circle border-secondary-subtle border-1 h-4rem w-4rem z-1 cursor-pointer',
                      {
                        'bg-primary border-primary': index <= workerStateIndex,
                        'surface-overlay text-primary': index > workerStateIndex
                      }
                    ]"
                    style="width: 30px !important; height: 30px !important"
                  >
                    <font-awesome-icon
                      :class="index <= workerStateIndex ? '' : 'd-none'"
                      :icon="faCircle"
                      style="width: 10px; height: 10px"
                    />
                  </span>
                  <span
                    :class="[
                      'inline-flex align-items-center justify-content-center align-items-center mt-3',
                      { 'text-primary': index <= workerStateIndex }
                    ]"
                  >
                    {{ label }}
                  </span>
                </span>
              </template>
            </Steps>
          </div>
        </div>
        <div class="col-5 p-0" v-if="workerStateIndex == 2 || workerStateIndex == 3">
          <div class="d-flex flex-column gap-1 mb-3">
            <label>Ngày xuất cảnh</label>
            <div class="flex-auto">
              <Calendar
                v-model="calendarGoAbroadDate"
                :disabled="isDisabled"
                showIcon
                :showOnFocus="false"
                dateFormat="dd/mm/yy"
                placeholder="Select a date"
                :pt="{
                  root: {
                    style: 'width: 100%'
                  }
                }"
                :maxDate="new Date()"
              />
            </div>
          </div>
        </div>
        <div class="col-5 p-0" v-if="workerStateIndex == 3">
          <div class="d-flex flex-column gap-1 mb-3">
            <label>Ngày về nước</label>
            <div class="flex-auto">
              <Calendar
                v-model="calendarGoBackDate"
                :disabled="isDisabled"
                showIcon
                :showOnFocus="false"
                dateFormat="dd/mm/yy"
                placeholder="Select a date"
                :pt="{
                  root: {
                    style: 'width: 100%'
                  }
                }"
                :maxDate="new Date()"
              />
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 fw-bolder my-2 pb-1">Thông tin đơn hàng</legend>
        <div class="col-5 p-0">
          <div class="d-flex gap-4 mb-3">
            <label>Mã đơn hàng:</label>
            <Dropdown
              v-model="worker.order"
              :options="orders"
              filter
              optionLabel="orderCode"
              placeholder="Chọn mã đơn hàng"
              class="w-full md:w-14rem"
              :disabled="isDisabled"
              @change="setOrderInfo(worker.order)"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value.orderCode }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <div>{{ slotProps.option.orderCode }}</div>
                </div>
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex gap-4 mb-3">
            <label>Đơn hàng:</label>
            <Textarea disabled rows="5" cols="30" :value="orderInfo" />
          </div>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin các chuyến bay</legend>
        <div
          v-for="(f, index) in flight"
          :key="index"
          :class="[
            'row d-flex justify-content-between border-1 p-2 mb-4 ms-2',
            { 'border-danger': new Date() > new Date(f.time) },
            { 'border-success': new Date() < new Date(f.time) }
          ]"
        >
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Tên hãng bay: </label>
              <span>{{ f.airlineName }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Số hiệu chuyến bay: </label>
              <span>{{ f.flightNumber }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Hạng vé: </label>
              <span>{{ f.ticketClass }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Bay từ: </label>
              <span>{{ f.from }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Bay đến: </label>
              <span>{{ f.to }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Thời gian: </label>
              <span>{{ modifyDate(f.time, true) }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Cổng số: </label>
              <span>{{ f.airlineGateway }}</span>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex gap-3 mb-3">
              <label>Ghế ngồi: </label>
              <span>{{ f.flightSeat }}</span>
            </div>
          </div>
          <Tag
            v-if="new Date() > new Date(f.time)"
            severity="danger"
            value="Vé đã bay"
            rounded
          ></Tag>
          <Tag
            v-if="new Date() < new Date(f.time)"
            severity="success"
            value="Vé chưa bay"
            rounded
          ></Tag>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style>
.animationForPseudoBefore::before {
  width: 100%;
  border: none;
  height: 2px;
  background-color: #ccc;
  transform: none;
  left: -50%;
}

.animationForPseudoBefore:first-child::before {
  display: none;
}

.animationForActivePseudoBefore::before {
  background-color: #10b981;
  transition: background 0.4s linear;
}
</style>
