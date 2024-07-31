<script setup>
import { onBeforeMount, ref } from 'vue'
import { post } from '@/utils/httpRequest'

import Toast from 'primevue/toast'
import Calendar from 'primevue/calendar'
import Slider from 'primevue/slider'
import InputNumber from 'primevue/inputnumber'
import Chart from 'primevue/chart'

import getMonthDifference from '@/helpers/getMonthDifference'
import { useToast } from 'primevue/usetoast'

const emit = defineEmits(['saveWorker'])
const props = defineProps(['worker'])
const worker = ref(props.worker)
const isDisabled = defineModel('isDisabled')
const toast = useToast()

const updateResult = ref(null)
const isSumCalculate = ref(false)

const calendarDate = ref()
const calendarMinDate = ref()

const currentEfficiency = ref()
const currentEfficiencyIndex = ref()

const chartData = ref()
const chartOptions = ref()

// khởi tạo các giá trị cho biểu đồ
const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    labels: worker.value.efficiency
      .sort((a, b) => a.month - b.month)
      .map((ef) => {
        const startDate = new Date(worker.value.timeGoAbroad)
        startDate.setMonth(startDate.getMonth() + ef.month)
        return startDate.toLocaleString('vi-VN', { month: 'long' })
      }),
    datasets: [
      {
        label: 'Số buổi nghỉ',
        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data: worker.value.efficiency.sort((a, b) => a.month - b.month).map((ef) => ef.offTimes)
      },
      {
        label: 'Thái độ làm việc (%)',
        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
        borderColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: worker.value.efficiency.sort((a, b) => a.month - b.month).map((ef) => ef.attitude)
      },
      {
        label: 'KPI đạt được (%)',
        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
        borderColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: worker.value.efficiency
          .sort((a, b) => a.month - b.month)
          .map((ef) => ef.percentKPIReached)
      }
    ]
  }
}
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500
          }
        },
        grid: {
          display: true,
          drawBorder: true
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          display: true,
          drawBorder: true
        }
      }
    }
  }
}

// Xử lí thay đổi dữ liệu tháng xem khi người dùng chọn tháng mới
const handleMonthSelect = (value) => {
  const monthGap = getMonthDifference(value, calendarMinDate.value)
  currentEfficiencyIndex.value = worker.value.efficiency.findIndex((eff) => eff.month == monthGap)
  if (currentEfficiencyIndex.value != -1) {
    currentEfficiency.value = worker.value.efficiency[currentEfficiencyIndex.value]
  } else {
    currentEfficiency.value = {
      month: monthGap,
      offTimes: null,
      attitude: null,
      percentKPIReached: null
    }
    worker.value.efficiency.push(currentEfficiency.value)
  }
}

// khởi tạo các tháng năng xuất cho lao động
const setDateInfo = () => {
  if (worker.value.timeGoAbroad) {
    calendarDate.value = new Date(worker.value.timeGoAbroad)
    calendarMinDate.value = new Date(worker.value.timeGoAbroad)
    let monthGap
    if (worker.value.timeGoBack) {
      monthGap = getMonthDifference(new Date(worker.value.timeGoBack), calendarMinDate.value)
      let check = worker.value.efficiency.findIndex((eff) => eff.month > monthGap)
      while (check != -1) {
        worker.value.efficiency.splice(check, 1)
        check = worker.value.efficiency.findIndex((eff) => eff.month > monthGap)
      }
    } else {
      monthGap = getMonthDifference(new Date(), calendarMinDate.value)
    }
    for (let i = 0; i <= monthGap; i++) {
      const check = worker.value.efficiency.findIndex((eff) => eff.month == i)
      if (check == -1) {
        currentEfficiency.value = {
          month: i,
          offTimes: null,
          attitude: null,
          percentKPIReached: null
        }
        worker.value.efficiency.push(currentEfficiency.value)
      }
    }
    currentEfficiencyIndex.value = worker.value.efficiency.findIndex((eff) => eff.month == 0)
    currentEfficiency.value = worker.value.efficiency[currentEfficiencyIndex.value]
  }
}

onBeforeMount(async () => {
  // khởi tạo dữ năng xuất
  setDateInfo()

  // khởi tạo dữ liệu biểu đồ thống kê
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

// gửi dữ liệu update
const handleUpdateInfo = async () => {
  try {
    updateResult.value = await post(`/working/worker/${worker.value._id}/update`, {
      efficiency: worker.value.efficiency
    })
  } catch (e) {
    updateResult.value = e
  }
  emit('saveWorker', worker.value._id, 2)
  setTimeout(() => {
    updateResult.value = null
  }, 3000)

  // khởi tạo dữ liệu biểu đồ thống kê
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
}
</script>

<template>
  <Toast />

  <div v-if="worker.state == 'abroad' || worker.state == 'back'" class="worker__orderInfo ms-2">
    <div class="modify__choice d-flex flex-row-reverse">
      <div
        v-if="!isDisabled && !isSumCalculate"
        class="btn btn-success me-1"
        style="width: 100px"
        @click="
          async () => {
            await handleUpdateInfo()
            toast.add({
              severity:
                updateResult && updateResult.status && !isDisabled && updateResult.status == 200
                  ? 'success'
                  : 'error',
              summary:
                updateResult && updateResult.status && !isDisabled && updateResult.status == 200
                  ? 'Lưu thành công'
                  : 'Lưu thất bại',
              detail:
                updateResult && updateResult.status && !isDisabled && updateResult.status == 200
                  ? 'Bạn đã sửa thông tin thành công'
                  : 'Bạn đã sửa thông tin thất bại',
              life: 3000
            })
          }
        "
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
        <legend class="p-0 fs-5 fw-bolder mb-3">Chọn thời gian</legend>
        <div class="col-8 p-0">
          <div class="d-flex gap-4 mb-3 flex-column">
            <Button
              :label="isSumCalculate ? 'Trong thời gian làm việc' : 'Theo tháng'"
              severity="secondary"
              outlined
              style="width: 30%; height: 35px"
              @click="isSumCalculate = !isSumCalculate"
            />
          </div>
        </div>
        <div v-if="!isSumCalculate" class="col-5 p-0">
          <div class="d-flex flex-column gap-2 mb-3 mt-1">
            <label>Chọn tháng muốn xem năng xuất</label>
            <div class="flex-auto">
              <Calendar
                v-model="calendarDate"
                :minDate="calendarMinDate"
                :maxDate="worker.timeGoBack ? new Date(worker.timeGoBack) : new Date()"
                showIcon
                :showOnFocus="false"
                view="month"
                dateFormat="mm/yy"
                :pt="{
                  root: {
                    style: 'width: 100%'
                  }
                }"
                @date-select="handleMonthSelect"
              />
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 fw-bolder my-2 pb-1">Các thông tin năng xuất</legend>
        <div class="col-5 p-0">
          <div class="d-flex align-items-center gap-4 mb-3">
            <label
              >Số buổi nghỉ {{ isSumCalculate ? 'trong thời gian làm việc' : 'trong tháng' }}:
            </label>
            <InputNumber
              v-if="!isSumCalculate"
              v-model="currentEfficiency.offTimes"
              showButtons
              buttonLayout="horizontal"
              style="width: 3rem"
              :min="0"
              :max="62"
              placeholder="Chưa có dữ liệu"
              :disabled="isDisabled"
            >
              <template #incrementbuttonicon>
                <span class="pi pi-plus" />
              </template>
              <template #decrementbuttonicon>
                <span class="pi pi-minus" />
              </template>
            </InputNumber>
            <div v-else class="fs-4 text-danger">
              {{
                (() => {
                  const sum = worker.efficiency.reduce(function (total, ef) {
                    return total + ef.offTimes
                  }, 0)
                  return sum
                })()
              }}
            </div>
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex align-items-center gap-4 mb-3">
            <label
              >Thái độ
              {{ isSumCalculate ? 'trung bình trong thời gian làm việc' : 'làm việc trong tháng' }}
              (độ tích cực):
            </label>
            <div class="d-flex flex-column gap-4" v-if="!isSumCalculate">
              <InputNumber
                v-model="currentEfficiency.attitude"
                :min="0"
                :max="100"
                suffix="%"
                :disabled="isDisabled"
              />
              <Slider v-model="currentEfficiency.attitude" :disabled="isDisabled" />
            </div>
            <div v-else class="fs-4 text-danger">
              {{
                (() => {
                  const sum = worker.efficiency.reduce(function (total, ef) {
                    return total + ef.attitude
                  }, 0)
                  return sum / worker.efficiency.length
                })()
              }}%
            </div>
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex align-items-center gap-4 mb-3">
            <label
              >Chỉ tiêu KPI đạt được
              {{ isSumCalculate ? 'trung bình trong thời gian làm việc' : 'trong tháng' }}:
            </label>
            <InputNumber
              v-if="!isSumCalculate"
              v-model="currentEfficiency.percentKPIReached"
              inputId="percent"
              suffix="%"
              :min="0"
              :max="100"
              placeholder="Chưa có dữ liệu"
              :disabled="isDisabled"
            />
            <div v-else class="fs-4 text-danger">
              {{
                (() => {
                  const sum = worker.efficiency.reduce(function (total, ef) {
                    return total + ef.percentKPIReached
                  }, 0)
                  return sum / worker.efficiency.length
                })()
              }}%
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset
        v-if="isSumCalculate"
        class="row d-flex border-bottom justify-content-between my-2 pb-4"
      >
        <legend class="p-0 fs-5 ms-2 mb-3 fw-bolder">Biểu đồ chi tiết các tháng</legend>
        <div class="col-12 p-0">
          <div class="card">
            <Chart
              type="bar"
              :data="chartData"
              :options="chartOptions"
              class="h-[30rem]"
              :height="300"
            />
          </div>
        </div>
      </fieldset>
    </form>
  </div>
  <div v-else class="worker__orderInfo ms-2">
    <div
      style="width: 100%; height: 70vh"
      class="d-flex justify-content-center align-items-center text-danger fw-bolder fs-6"
    >
      Lao động chưa xuất cảnh
    </div>
  </div>
</template>

<style></style>
