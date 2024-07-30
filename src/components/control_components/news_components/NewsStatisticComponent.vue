<script setup>
import { ref, onMounted } from 'vue'
import { get } from '@/utils/httpRequest'
import Chart from 'primevue/chart'
import Paginator from 'primevue/paginator'
import StatisticChartComponent from '../chart_components/StatisticChartComponent.vue'

onMounted(async () => {
  getItemQuantity()

  await getNewsDataLine()
  await setChart()
})

const itemAllQuantities = ref(null)

const colors = [
  'rgba(255, 99, 132, 1)', // Red
  'rgba(75, 192, 192, 1)' // Green
]
const colorsHover = [
  'rgba(255, 99, 132, 0.4)', // Red
  'rgba(75, 192, 192, 0.4)' // Green
]
const items = ['Tin tức trong nước', 'Tin tức nước ngoài']

const getItemQuantity = async () => {
  try {
    itemAllQuantities.value = [0, 0]

    let news = await get('/news')
    if (news) {
      news.forEach((n) => {
        if (!n.isForeignNews) {
          itemAllQuantities.value[0]++
        } else {
          itemAllQuantities.value[1]++
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
const newsData = ref([])
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
        label: 'Số lượng tin tức trong nước được tạo',
        data: newsData.value[first.value].data.map((d) => d.indoorCreated),
        fill: false,
        tension: 0.4,
        borderColor: 'red',
        yAxisID: 'y1' // Chỉ định trục y1 cho dataset này
      },
      {
        label: 'Số lượng tin tức nước ngoài được tạo',
        data: newsData.value[first.value].data.map((d) => d.outdoorCreated),
        fill: false,
        tension: 0.4,
        borderColor: 'green',
        yAxisID: 'y1' // Chỉ định trục y1 cho dataset này
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

const getNewsDataLine = async () => {
  // khởi tạo biến lưu trữ thông tin dữ liệu
  const thisDate = new Date()
  for (let i = defaultYear; i <= thisDate.getFullYear(); i++) {
    if (i == thisDate.getFullYear()) {
      newsData.value.unshift({
        year: i,
        data: (() => {
          const d = []
          for (let j = 0; j <= thisDate.getMonth(); j++) {
            d.push({
              month: j,
              indoorCreated: 0,
              outdoorCreated: 0
            })
          }
          return d
        })()
      })
    } else {
      newsData.value.unshift({
        year: i,
        data: (() => {
          const d = []
          for (let j = 0; j < 12; j++) {
            d.push({
              month: j,
              indoorCreated: 0,
              outdoorCreated: 0
            })
          }
          return d
        })()
      })
    }
  }
  // lấy dữ liệu các đơn hàng tùy theo từng tháng
  try {
    let news = await get('/news', {})
    if (news) {
      news.forEach((n) => {
        const timeRelease = new Date(n.timeRelease)

        const yearIndex = newsData.value.findIndex((d) => d.year == timeRelease.getFullYear())
        if (yearIndex != -1) {
          const dataIndex = newsData.value[yearIndex].data.findIndex(
            (d) => d.month == timeRelease.getMonth()
          )
          if (dataIndex != -1) {
            if (n.isForeignNews) {
              newsData.value[yearIndex].data[dataIndex].outdoorCreated++
            } else {
              newsData.value[yearIndex].data[dataIndex].indoorCreated++
            }
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
    title="Thống kê số lượng tổng tất cả đơn hàng"
    :items="items"
    :itemQuantities="itemAllQuantities"
    :itemColors="colors"
    :itemHoverColors="colorsHover"
  ></StatisticChartComponent>
  <StatisticChartComponent
    class="mt-6"
    v-if="itemInprogressQuantities"
    title="Thống kê số lượng đơn hàng chưa hoàn thành"
    :items="items"
    :itemQuantities="itemInprogressQuantities"
    :itemColors="colors"
    :itemHoverColors="colorsHover"
  ></StatisticChartComponent>
  <StatisticChartComponent
    class="mt-6"
    v-if="itemCompletedQuantities"
    title="Thống kê số lượng đơn hàng đã hoàn thành"
    :items="items"
    :itemQuantities="itemCompletedQuantities"
    :itemColors="colors"
    :itemHoverColors="colorsHover"
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
