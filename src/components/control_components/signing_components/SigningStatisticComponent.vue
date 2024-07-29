<script setup>
import { ref, onMounted } from 'vue'
import { get } from '@/utils/httpRequest'
import Chart from 'primevue/chart'
import Paginator from 'primevue/paginator'
import StatisticChartComponent from '../chart_components/StatisticChartComponent.vue'

onMounted(async () => {
  getItemQuantity()

  await getSigningDataLine()
  await setChart()
})

const itemAllQuantities = ref(null)

const colors = [
  'rgba(255, 99, 132, 1)', // Red
  'rgba(54, 162, 235, 1)', // Blue
  'rgba(153, 102, 255, 1)', //purple
  'rgba(75, 192, 192, 1)', // Green
  'rgba(255, 159, 64, 1)', // orange
  'rgba(0, 0, 0, 1)'
]
const colorsHover = [
  'rgba(255, 99, 132, 0.4)', // Red
  'rgba(54, 162, 235, 0.4)', // Blue
  'rgba(153, 102, 255, 0.4)', //purple
  'rgba(75, 192, 192, 0.4)', // Green
  'rgba(255, 159, 64, 0.4)', // orange
  'rgba(0, 0, 0, 0.4)'
]
const items = [
  'Chưa liên hệ',
  'Đã liên hệ đang chờ gửi hồ sơ',
  'Đã nộp hồ sơ đang chờ kiểm tra',
  'Hồ sơ hợp lệ',
  'Hồ sơ không hợp lệ',
  'Cấm'
]

const getItemQuantity = async () => {
  try {
    itemAllQuantities.value = [0, 0, 0, 0, 0, 0]

    let signings = await get('/signing/apply')
    if (signings) {
      signings.forEach((s) => {
        if (s.state == 'hct') {
          itemAllQuantities.value[0]++
        }
        if (s.state == 'ipg') {
          itemAllQuantities.value[1]++
        }
        if (s.state == 'sent') {
          itemAllQuantities.value[2]++
        }
        if (s.state == 'passed') {
          itemAllQuantities.value[3]++
        }
        if (s.state == 'failed') {
          itemAllQuantities.value[4]++
        }
        if (s.state == 'halt') {
          itemAllQuantities.value[5]++
        }
      })
    }
  } catch (err) {
    console.log(err)
  }
}

const chartDataLine = ref()
const chartOptionsLine = ref()

const first = ref(0)
const signingData = ref([])
const defaultYear = import.meta.env.VITE_VUE_APP_YEAR_FOUNDED
const totalRecords = ref(new Date().getFullYear() - defaultYear + 1)

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
        label: 'Số lượng đơn đăng kí được gửi đến',
        data: signingData.value[first.value].data.map((d) => d.created),
        fill: false,
        tension: 0.4,
        borderColor: 'orange',
        yAxisID: 'y' // Chỉ định trục y1 cho dataset này
      },
      {
        label: 'Số lượng đơn đăng kí hợp lệ',
        data: signingData.value[first.value].data.map((d) => d.completed),
        fill: true,
        borderColor: 'success',
        tension: 0.4,
        yAxisID: 'y' // Chỉ định trục y cho dataset này
      },
      {
        label: 'Số lượng đơn đăng kí không hợp lệ',
        data: signingData.value[first.value].data.map((d) => d.created),
        fill: false,
        tension: 0.4,
        borderColor: 'gray',
        yAxisID: 'y' // Chỉ định trục y1 cho dataset này
      },
      {
        label: 'Số lượng đơn đăng kí bị cấm',
        data: signingData.value[first.value].data.map((d) => d.completed),
        fill: true,
        borderColor: 'black',
        tension: 0.4,
        backgroundColor: '#ccc',
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
      }
    }
  }
}

const getSigningDataLine = async () => {
  // khởi tạo biến lưu trữ thông tin dữ liệu
  const thisDate = new Date()
  for (let i = defaultYear; i <= thisDate.getFullYear(); i++) {
    if (i == thisDate.getFullYear()) {
      signingData.value.unshift({
        year: i,
        data: (() => {
          const d = []
          for (let j = 0; j <= thisDate.getMonth(); j++) {
            d.push({
              month: j,
              created: 0,
              passed: 0,
              failed: 0,
              halt: 0
            })
          }
          return d
        })()
      })
    } else {
      signingData.value.unshift({
        year: i,
        data: (() => {
          const d = []
          for (let j = 0; j < 12; j++) {
            d.push({
              month: j,
              created: 0,
              passed: 0,
              failed: 0,
              halt: 0
            })
          }
          return d
        })()
      })
    }
  }
  // lấy dữ liệu các đơn đăng kí tùy theo từng tháng
  try {
    let signings = await get('/signing/apply', {})
    if (signings) {
      signings.forEach((s) => {
        const timeModify = new Date(s.timeModify)
        const timeCreated = new Date(s.createAt)

        const yearIndex = signingData.value.findIndex((d) => d.year == timeModify.getFullYear())
        if (yearIndex != -1) {
          const dataIndex = signingData.value[yearIndex].data.findIndex(
            (d) => d.month == timeModify.getMonth()
          )
          if (dataIndex != -1) {
            if (s.state == 'passed') {
              signingData.value[yearIndex].data[dataIndex].passed++
            }
            if (s.state == 'failed') {
              signingData.value[yearIndex].data[dataIndex].failed++
            }
            if (s.state == 'halt') {
              signingData.value[yearIndex].data[dataIndex].halt++
            }
          }
        }
        const yearIndexCreated = signingData.value.findIndex(
          (d) => d.year == timeCreated.getFullYear()
        )
        if (yearIndexCreated != -1) {
          const dataIndexCreated = signingData.value[yearIndexCreated].data.findIndex(
            (d) => d.month == timeCreated.getMonth()
          )
          if (dataIndexCreated != -1) {
            signingData.value[yearIndexCreated].data[dataIndexCreated].created++
          }
        }
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
    v-if="itemAllQuantities"
    title="Thống kê số lượng tổng tất cả đơn đăng kí"
    :items="items"
    :itemQuantities="itemAllQuantities"
    :itemColors="colors"
    :itemHoverColors="colorsHover"
    style="height: 640px"
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
