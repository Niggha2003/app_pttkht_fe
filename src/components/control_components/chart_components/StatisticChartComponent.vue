<script setup>
import { ref, onMounted } from 'vue'
// import { get } from '@/utils/httpRequest'
import Chart from 'primevue/chart'

onMounted(() => {
  chartDataDoughnut.value = setChartDataDoughnut()
  chartOptionsDoughnut.value = setChartOptionsDoughnut()
})

const chartDataDoughnut = ref()
const chartOptionsDoughnut = ref(null)

const props = defineProps(['title', 'itemQuantities', 'itemColors', 'items', 'itemHoverColors'])
const itemQuantities = ref(props.itemQuantities)
const title = props.title
const itemColors = props.itemColors
  ? props.itemColors
  : [
      'rgba(255, 99, 132, 1)', // Red
      'rgba(54, 162, 235, 1)', // Blue
      'rgba(255, 206, 86, 1)', // Yellow
      'rgba(75, 192, 192, 1)', // Green
      'rgba(0, 0, 0, 1)'
    ]

const setChartDataDoughnut = () => {
  return {
    labels: props.items,
    datasets: [
      {
        data: itemQuantities.value,
        hoverBackgroundColor: props.itemHoverColors
          ? props.itemHoverColors
          : [
              'rgba(255, 99, 132, 0.4)', // Red
              'rgba(54, 162, 235, 0.4)', // Blue
              'rgba(255, 206, 86, 0.4)', // Yellow
              'rgba(75, 192, 192, 0.4)', // Green
              'rgba(0, 0, 0, 0.4)'
            ],
        backgroundColor: itemColors,
        borderWidth: 0
      }
    ]
  }
}

const setChartOptionsDoughnut = () => {
  return {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          color: 'rgb(255, 99, 132)'
        }
      }
    },
    cutout: '40%',
    padding: 20
  }
}
</script>

<template>
  <div
    class="card mb-6 position-relative d-flex justify-content-center align-items-end"
    style="background-color: #f2ddb8"
  >
    <div
      style="
        width: 100%;
        height: 10px;
        background-color: white;
        top: 9.5%;
        left: 0;
        position: absolute;
      "
    ></div>
    <div style="position: absolute; left: 2.5%; top: 5%; width: 100%">
      <div
        class="fw-bolder fs-4 text-danger"
        style="
          padding: 10px 20px;
          background-color: white;
          display: inline-block;
          border-radius: 10px;
          z-index: 1;
        "
      >
        {{ title }}:
      </div>
      <div
        class="mt-5 ps-2 fs-6 d-flex flex-wrap justify-content-between align-item-"
        style="width: 40%; font-weight: 500"
      >
        <p class="quantity__item">
          <span class="quantity__item__border" :style="`background-color: #ccc`"></span>
          <span class="fs-3 fw-bolder">Tổng :</span>
          <span
            style="position: absolute; right: 5%; bottom: 5px"
            class="text-danger fw-bolder fs-3 ms-3"
            >{{
              (() => {
                const sum = itemQuantities.reduce(function (total, q) {
                  return total + q
                }, 0)
                return sum
              })()
            }}</span
          >
        </p>
        <p v-for="(item, index) in items" :key="index" class="quantity__item">
          <span
            class="quantity__item__border"
            :style="`background-color: ${itemColors[index]}`"
          ></span>
          {{ item }}:
          <span
            style="position: absolute; right: 5%; bottom: 5px"
            class="text-danger fw-bolder fs-3"
            >{{ itemQuantities[index] }}</span
          >
        </p>
      </div>
    </div>

    <Chart
      type="doughnut"
      :data="chartDataDoughnut"
      :options="chartOptionsDoughnut"
      class=":w-[30rem]"
      style="width: 500px; height: 500px; padding: 1%"
    />
  </div>
</template>

<style scoped>
.quantity__item {
  padding: 5px 15px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  width: 200px;
  height: 100px;
  margin-bottom: 30px;
  position: relative;
  background-color: white;
  box-shadow: 0 0 3px #ccc;
}

.quantity__item__border {
  width: 15px;
  display: block;
  height: 100%;
  border-radius: 100px;
  position: absolute;
  top: 0;
  left: -7.5px;
  background-color: blue;
}
</style>
