<script setup>
import { ref, onMounted } from 'vue'
import { get } from '@/utils/httpRequest'

import { RouterLink } from 'vue-router'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'

const orders = ref()

onMounted(async () => {
  await getOrders()
})

// lấy danh sách đơn hàng đang hot
const getOrders = async () => {
  try {
    orders.value = await get('order/order/', {})
    orders.value = orders.value.filter((order) => order.isHot).reverse()
  } catch (e) {
    console.log(e)
  }
}

const formatCurrency = (value) => {
  value = value * 1000
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}
</script>

<template>
  <div>
    <div
      class="d-flex flex-column justify-content-center align-items-center"
      style="width: 500px; margin: auto auto 80px; color: #8b8a8a"
    >
      <span class="pi pi-search mb-4 fs-1 fw-bolder"></span>
      <span class="fs-2 fw-bolder">Tuyển dụng đơn hàng</span>
    </div>
    <div class="card container">
      <DataTable
        :value="orders"
        tableStyle="min-width: 50rem"
        :pt="{
          column: {
            bodycell: {
              class: { 'border-1': true },
              style: { 'text-align': 'left', 'border-color': '#ccc' }
            }
          },
          footer: {
            class: 'd-flex justify-content-between my-5'
          }
        }"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="fs-3 font-bold text-danger my-3">Các đơn hàng lao động nổi bật</span>
          </div>
        </template>
        <Column
          field="orderName"
          header="Thông tin đơn hàng"
          style="width: 45%"
          :pt="{
            headerCell: {
              class: 'border-1 fs-5',
              style: { 'border-color': '#ccc' }
            }
          }"
        >
          <template #body="slotProps">
            {{ slotProps.data.orderName }}
            <Tag icon="pi pi-bolt" value="HOT" severity="danger" />
          </template>
        </Column>
        <Column
          field="salary"
          header="Lương tháng"
          style="width: 15%"
          :pt="{
            headerCell: {
              class: 'border-1 fs-5',
              style: { 'border-color': '#ccc' }
            }
          }"
        >
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.salary) }}
          </template>
        </Column>
        <Column
          field="companyName"
          header="Tên công ty"
          style="width: 15%"
          :pt="{
            headerCell: {
              class: 'border-1 fs-5',
              style: { 'border-color': '#ccc' }
            }
          }"
        ></Column>
        <Column
          field="companyAddress"
          header="Địa chỉ"
          style="width: 25%"
          :pt="{
            headerCell: {
              class: 'border-1 fs-5',
              style: { 'border-color': '#ccc' }
            }
          }"
        ></Column>
        <template #footer>
          <div class="text-info">Xem thêm đơn hàng lao động.</div>
          <RouterLink
            :to="{
              name: 'hp_form_view'
            }"
          >
            <Button
              icon="pi pi-pen-to-square"
              label="Đăng kí ứng tuyển"
              severity="danger"
              class="rounded"
              style="height: 40px"
            ></Button>
          </RouterLink>
        </template>
      </DataTable>
    </div>
  </div>
</template>
