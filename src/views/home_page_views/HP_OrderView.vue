<script setup>
import { onBeforeMount, ref } from 'vue'
import { get } from '@/utils/httpRequest'

import ScrollTop from 'primevue/scrolltop'
import DataView from 'primevue/dataview'

import HP_HeaderComponent from '@/components/home_page_components/HP_HeaderComponent.vue'
import HP_FooterComponent from '@/components/home_page_components/HP_FooterComponent.vue'
import HP_ContentEditorComponent from '@/components/home_page_components/content/HP_ContentEditorComponent.vue'

import importImage from '@/helpers/importImage'
import modifyDate from '@/helpers/modifyDate'

const formatCurrency = (value) => {
  value = value * 1000
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

const props = defineProps(['orderId'])
const orderId = props.orderId
const orders = ref([])
const order = ref(null)

// không cho người dùng chỉnh sửa trang orders
const isModify = false

const orderTypes = {
  ck: 'Cơ khí',
  dm: 'Dệt may',
  os: 'Giúp việc',
  bv: 'Bốc vác'
}

onBeforeMount(async () => {
  await getOrders()
  if (orderId) {
    await getOrder(orderId)
  }
})

const getOrders = async () => {
  const quantity = orders.value.length + 10
  orders.value = await get('/order/order')
  orders.value = orders.value.reverse().splice(0, quantity)
}

const getOrder = async (id) => {
  order.value = await get(`/order/order/${id}`)
}
</script>

<template>
  <HP_HeaderComponent :activeIndex="2"></HP_HeaderComponent>
  <template v-if="orderId">
    <HP_ContentEditorComponent
      v-if="order"
      :orders="orders"
      v-model:isHomePageModify="isModify"
      v-model:content="order.paragraph"
      :time="order.timePosted ? order.timePosted : null"
    ></HP_ContentEditorComponent>
  </template>
  <template v-if="!orderId">
    <div v-if="orders" style="margin: 40px 0">
      <div class="d-flex justify-content-center">
        <div class="container row justify-content-around">
          <div
            class="col-12 card border-0"
            style="background-color: white; min-height: 100vh; box-shadow: 0 0 10px #ccc"
          >
            <div class="fs-3 text-danger fw-bolder p-4 border-bottom border-danger mb-2">
              Công ty xuất khẩu lao động ...
            </div>
            <div class="orders">
              <DataView :value="orders">
                <template #list="slotProps">
                  <div class="flex flex-column">
                    <div v-for="(item, index) in slotProps.items" :key="index">
                      <div
                        class="d-flex flex-column sm:flex-row sm:align-items-start p-4 gap-4"
                        :class="{
                          'border-top border-surface-200 dark:border-surface-700': index !== 0
                        }"
                      >
                        <div class="md:w-40 relative" style="max-width: 250px">
                          <RouterLink
                            :to="{
                              name: 'hp_order_view',
                              params: { orderId: item._id }
                            }"
                          >
                            <img
                              class="block xl:block mx-auto rounded"
                              :src="importImage('/order', `${item.photo}`)"
                              :alt="item.orderName"
                              style="width: 100%; padding: 10px; box-shadow: 0 0 5px #ccc"
                            />
                          </RouterLink>
                        </div>
                        <div
                          class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-6"
                        >
                          <div
                            class="flex flex-row md:flex-column justify-content-between align-items-start gap-2"
                          >
                            <div>
                              <span
                                :class="'font-medium text-surface-500 dark:text-surface-400 text-sm text-success'"
                                >{{ orderTypes[item.type] }}
                              </span>
                              <RouterLink
                                :to="{
                                  name: 'hp_order_view',
                                  params: { orderId: item._id }
                                }"
                                class="d-block text-lg fw-bolder mt-2 hoverRed"
                                >{{ item.orderName }}
                              </RouterLink>
                            </div>
                            <div
                              class="bg-surface-0 flex align-items-center gap-2 justify-content-center py-1"
                              style="color: #787878"
                            >
                              <span class="content text-surface-900 font-medium text-sm">
                                Thời gian đăng bài: {{ modifyDate(item.timePosted) }}
                              </span>
                            </div>
                            <div
                              class="bg-surface-0 flex align-items-center gap-2 justify-content-center py-1"
                              style="color: #787878"
                            >
                              <span class="content text-surface-900 font-medium text-sm">
                                Thời gian cần xuất khẩu: {{ modifyDate(item.timeNeeded) }}
                              </span>
                            </div>
                            <div
                              class="bg-surface-0 flex align-items-center gap-2 justify-content-center py-1"
                              style="color: #787878"
                            >
                              <span class="content text-surface-900 font-medium text-sm">
                                Địa chỉ: {{ item.companyAddress }}
                              </span>
                            </div>
                            <div
                              class="bg-surface-0 flex align-items-center gap-2 justify-content-center py-1 text-danger"
                            >
                              <span class="content text-surface-900 font-medium text-sm">
                                Lương: {{ formatCurrency(item.salary) }}
                              </span>
                            </div>
                            <div
                              class="bg-surface-0 flex align-items-center gap-2 justify-content-center py-1"
                              style="color: #787878"
                            >
                              <span class="content text-surface-900 font-medium text-sm">
                                Công việc: {{ item.jobDescription }}</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </DataView>
              <div class="d-flex justify-content-end">
                <Button
                  class="m-4"
                  label="Xem thêm công việc"
                  severity="help"
                  text
                  @click="
                    async () => {
                      await getOrders()
                    }
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <HP_FooterComponent></HP_FooterComponent>

  <ScrollTop
    :pt="{
      root: {
        style: 'background-color: #5bb7dc',
        class: 'rounded'
      }
    }"
  />
</template>

<style scoped>
.content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Số dòng hiển thị */
  overflow: hidden;
  text-overflow: ellipsis;
}

.hoverRed:hover {
  color: rgb(254, 60, 60) !important;
}
</style>
