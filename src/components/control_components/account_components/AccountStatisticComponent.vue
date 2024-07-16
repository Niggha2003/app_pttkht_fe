<script setup>
import { ref, onMounted } from 'vue'
import { get } from '@/utils/httpRequest'

import StatisticChartComponent from '../chart_components/StatisticChartComponent.vue'

onMounted(() => {
  getItemQuantity()
})

const itemQuantities = ref(null)
const colors = [
  'rgba(255, 99, 132, 1)', // Red
  'rgba(54, 162, 235, 1)', // Blue
  'rgba(75, 192, 192, 1)', // Green
  'rgba(0, 0, 0, 1)'
]
const colorsHover = [
  'rgba(255, 99, 132, 0.4)', // Red
  'rgba(54, 162, 235, 0.4)', // Blue
  'rgba(75, 192, 192, 0.4)', // Green
  'rgba(0, 0, 0, 0.4)'
]
const items = [
  'Nhân viên quản lí lao động',
  'Nhân viên quản lí đơn hàng',
  'Nhân viên quản lí đơn đăng kí',
  'Nhân viên admin'
]

const getItemQuantity = async () => {
  try {
    itemQuantities.value = [0, 0, 0, 0]
    let accounts = await get('/account/account_employee', {})
    if (accounts) {
      accounts.forEach((a) => {
        if (a.role == 'working') itemQuantities.value[0]++
        if (a.role == 'ordering') itemQuantities.value[1]++
        if (a.role == 'signing') itemQuantities.value[2]++
        if (a.role == 'admin') itemQuantities.value[3]++
      })
    }
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <StatisticChartComponent
    v-if="itemQuantities"
    title="Thống kê số lượng nhân viên"
    :items="items"
    :itemQuantities="itemQuantities"
    :itemColors="colors"
    :itemHoverColors="colorsHover"
  ></StatisticChartComponent>
</template>
