<script setup>
import { ref, onMounted } from 'vue'
import { get, post } from '@/utils/httpRequest'

import { RouterLink } from 'vue-router'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import HP_NewsMultiSelectComponent from '@/components/home_page_components/news/HP_NewsMultiSelectComponent.vue'

const orders = ref()
const ordersHot = ref()

const isHomePageModify = defineModel('isHomePageModify')

// giá trị function được truyền ra ngoài cho component home có thể thực thi
let updateFunction = defineModel('updateFunction')

onMounted(async () => {
  await getOrders()
})

// lấy danh sách đơn hàng đang hot
const getOrders = async () => {
  try {
    orders.value = await get('order/order/', {})
    orders.value = orders.value.reverse()
    ordersHot.value = orders.value.filter((order) => order.isHot)
  } catch (e) {
    console.log(e)
  }
}

const formatCurrency = (value) => {
  value = value * 1000
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

// thay đổi updateFunction để truyền ra ngoài cho component home thực thi mỗi khi chọn update
updateFunction.value = async () => {
  let result
  for (const order of orders.value) {
    if (order.isHot) {
      result = await post(`/order/order/${order._id}/update`, { order: { ...order, isHot: false } })
    }
  }
  for (const order of ordersHot.value) {
    result = await post(`/order/order/${order._id}/update`, { order: { ...order, isHot: true } })
  }
  return result
}
</script>

<template>
  <div>
    <div
      class="d-flex flex-column justify-content-center align-items-center position-relative"
      style="width: 500px; margin: auto auto 80px; color: #8b8a8a"
    >
      <span class="pi pi-search mb-4 fs-1 fw-bolder"></span>
      <span class="fs-2 fw-bolder">Tuyển dụng đơn hàng</span>
      <div v-if="isHomePageModify" style="position: absolute; top: 60px; right: -410px">
        <HP_NewsMultiSelectComponent
          style="width: 200px !important"
          v-model:choices="ordersHot"
          v-model:options="orders"
          :optionsLabel="'orderName'"
          :placeholder="'Đơn hàng lao động'"
          :selectionLimit="6"
        ></HP_NewsMultiSelectComponent>
      </div>
    </div>
    <div class="card container">
      <DataTable
        :value="ordersHot"
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
            <RouterLink
              class="hoverRed"
              :to="{ name: 'hp_order_view', params: { orderId: slotProps.data._id } }"
            >
              {{ slotProps.data.orderName }}
              <Tag class="ms-4" icon="pi pi-bolt" value="HOT" severity="danger" />
            </RouterLink>
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
          <RouterLink
            class="text-info hoverRed"
            :to="{
              name: 'hp_order_view'
            }"
            >Xem thêm đơn hàng lao động.
          </RouterLink>
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

<style scoped>
.hoverRed:hover,
.hoverRed:hover > span {
  color: rgb(251, 40, 40) !important;
}
</style>
