<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'
import Paginator from 'primevue/paginator'
import { get } from '@/utils/httpRequest'
import StatisticChartComponent from '../chart_components/StatisticChartComponent.vue'

onMounted(async () => {
  getWorkerQuantityDoughnut()

  await getWorkerEfficiencyLine()
  await setChart()
})

const workerQuantityDoughnut = ref(null)
const colorsDoughnut = [
  'rgba(255, 99, 132, 1)', // Red
  'rgba(54, 162, 235, 1)', // Blue
  'rgba(255, 206, 86, 1)', // Yellow
  'rgba(75, 192, 192, 1)', // Green
  'rgba(0, 0, 0, 1)'
]

const colorsHoverDoughnut = [
  'rgba(255, 99, 132, 0.4)', // Red
  'rgba(54, 162, 235, 0.4)', // Blue
  'rgba(255, 206, 86, 0.4)', // Yellow
  'rgba(75, 192, 192, 0.4)', // Green
  'rgba(0, 0, 0, 0.4)'
]
const items = [
  'Đang đào tạo',
  'Chuẩn bị xuất cảnh',
  'Ở nước ngoài',
  'Đã về nước',
  'Trong danh sách đen'
]

const chartDataLine = ref()
const chartOptionsLine = ref()

const first = ref(0)
const efficiencies = ref([])
const workingWorkers = ref(null)
const defaultYear = import.meta.env.VITE_VUE_APP_YEAR_FOUNDED
const totalRecords = ref(new Date().getFullYear() - defaultYear + 1)

const getWorkerQuantityDoughnut = async () => {
  try {
    workerQuantityDoughnut.value = [0, 0, 0, 0, 0]
    let workers = await get('/working/worker', {})
    if (workers) {
      workers.forEach((w) => {
        if (w.isBanned) {
          workerQuantityDoughnut.value[4]++
        } else {
          if (w.state == 'training') workerQuantityDoughnut.value[0]++
          if (w.state == 'prepared') workerQuantityDoughnut.value[1]++
          if (w.state == 'abroad') workerQuantityDoughnut.value[2]++
          if (w.state == 'back') workerQuantityDoughnut.value[3]++
        }
      })
    }
  } catch (err) {
    console.log(err)
  }
}

const setChartDataLine = () => {
  return {
    labels: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12'
    ],
    datasets: [
      {
        label: 'Số buổi nghỉ trung bình',
        data: efficiencies.value[first.value].data.map((d) => d.offTimes),
        fill: false,
        tension: 0.4,
        borderColor: 'red',
        yAxisID: 'y1' // Chỉ định trục y1 cho dataset này
      },
      {
        label: 'Trung bình thái độ được đánh giá (%)',
        data: efficiencies.value[first.value].data.map((d) => d.attitude),
        fill: false,
        borderDash: [5, 5],
        tension: 0.4,
        borderColor: 'green',
        yAxisID: 'y' // Chỉ định trục y cho dataset này
      },
      {
        label: 'Trung bình KPI hoàn thành (%)',
        data: efficiencies.value[first.value].data.map((d) => d.percentKPIReached),
        fill: true,
        borderColor: 'gray',
        tension: 0.4,
        backgroundColor: '#b9b9b929',
        yAxisID: 'y' // Chỉ định trục y cho dataset này
      }
    ]
  }
}
const setChartOptionsLine = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
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
          color: textColorSecondary
        },
        grid: {
          display: true,
          drawBorder: true
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: textColorSecondary
        },
        grid: {
          display: true,
          drawBorder: true
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: textColorSecondary
        },
        grid: {
          drawOnChartArea: false,
          display: true,
          drawBorder: true
        }
      }
    }
  }
}

const getWorkerEfficiencyLine = async () => {
  // khởi tạo biến lưu trữ thông tin dữ liệu
  const thisDate = new Date()
  for (let i = defaultYear; i <= thisDate.getFullYear(); i++) {
    if (i == thisDate.getFullYear()) {
      efficiencies.value.unshift({
        year: i,
        data: (() => {
          const d = []
          for (let j = 0; j <= thisDate.getMonth(); j++) {
            d.push({
              month: j,
              quantity: 0,
              offTimes: null,
              attitude: null,
              percentKPIReached: null
            })
          }
          return d
        })()
      })
    } else {
      efficiencies.value.unshift({
        year: i,
        data: (() => {
          const d = []
          for (let j = 0; j < 12; j++) {
            d.push({
              month: j,
              quantity: 0,
              offTimes: null,
              attitude: null,
              percentKPIReached: null
            })
          }
          return d
        })()
      })
    }
  }
  // lấy dữ liệu các lao động tùy theo từng tháng
  try {
    let workers = await get('/working/worker', {})
    if (workers) {
      workingWorkers.value = workers.filter((w) => w.state == 'abroad' || w.state == 'back')
      workingWorkers.value.forEach((w) => {
        const goAbroadDate = new Date(w.timeGoAbroad)
        w.efficiency.forEach((ef) => {
          // thời gian sau khi xuất cảnh được ef.tháng
          const currentDate = goAbroadDate
          currentDate.setMonth(goAbroadDate.getMonth() + ef.month)
          const yearIndex = efficiencies.value.findIndex((c) => c.year == currentDate.getFullYear())
          if (yearIndex != -1) {
            const dataIndex = efficiencies.value[yearIndex].data.findIndex(
              (c) => c.month == currentDate.getMonth()
            )
            if (
              dataIndex != -1 &&
              ef.offTimes != null &&
              ef.attitude != null &&
              ef.percentKPIReached != null
            ) {
              efficiencies.value[yearIndex].data[dataIndex].quantity++
              const quantity = efficiencies.value[yearIndex].data[dataIndex].quantity
              efficiencies.value[yearIndex].data[dataIndex].offTimes =
                (efficiencies.value[yearIndex].data[dataIndex].offTimes * (quantity - 1) +
                  ef.offTimes) /
                quantity
              efficiencies.value[yearIndex].data[dataIndex].attitude =
                (efficiencies.value[yearIndex].data[dataIndex].attitude * (quantity - 1) +
                  ef.attitude) /
                quantity
              efficiencies.value[yearIndex].data[dataIndex].percentKPIReached =
                (efficiencies.value[yearIndex].data[dataIndex].percentKPIReached * (quantity - 1) +
                  ef.percentKPIReached) /
                quantity
            }
          }
        })
      })
    }
  } catch (err) {
    console.log(err)
  }
}

const setChart = async () => {
  chartDataLine.value = setChartDataLine()
  chartOptionsLine.value = setChartOptionsLine()
}
</script>

<template>
  <StatisticChartComponent
    v-if="workerQuantityDoughnut"
    title="Thống kê số lượng lao động"
    :items="items"
    :itemQuantities="workerQuantityDoughnut"
    :itemColors="colorsDoughnut"
    :itemHoverColors="colorsHoverDoughnut"
  ></StatisticChartComponent>
  <div
    class="mb-6 card position-relative d-flex justify-content-center align-items-start"
    style="background-color: #f2ddb8"
  >
    <div
      style="
        width: 100%;
        height: 10px;
        background-color: white;
        top: 3rem;
        left: 0;
        position: absolute;
      "
    ></div>
    <div
      class="fw-bolder fs-4 mt-4 ms-4 text-danger"
      style="
        padding: 10px 20px;
        background-color: white;
        display: inline-block;
        border-radius: 10px;
        z-index: 1;
      "
    >
      Thống kê lao động tùy theo năng xuất làm việc:
    </div>
    <Chart
      type="line"
      :data="chartDataLine"
      :options="chartOptionsLine"
      class="h-[30rem]"
      :height="450"
      style="width: 100%; padding: 20px 30px; margin-top: 20px"
    />
    <Paginator
      :rows="1"
      :totalRecords="totalRecords"
      class="my-3 align-self-center"
      v-model:first="first"
      template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      :currentPageReportTemplate="`Số liệu năm ${new Date().getFullYear() - first} của từ ${new Date().getFullYear() - totalRecords + 1} đến ${new Date().getFullYear()}`"
      @page="setChart"
    >
    </Paginator>
  </div>
</template>
