<script setup>
import { onBeforeMount, ref } from 'vue'
import { get } from '@/utils/httpRequest'

import ScrollTop from 'primevue/scrolltop'
import DataView from 'primevue/dataview'

import HP_HeaderComponent from '@/components/home_page_components/HP_HeaderComponent.vue'
import HP_FooterComponent from '@/components/home_page_components/HP_FooterComponent.vue'
import HP_ContentEditorComponent from '@/components/home_page_components/introduce/HP_ContentEditorComponent.vue'

import modifyDate from '@/helpers/modifyDate'

const props = defineProps(['newsId', 'isForeign'])
const newsId = props.newsId
const orders = ref(null)
const newses = ref([])
const isForeign = props.isForeign
const news = ref()

// không cho người dùng chỉnh sửa trang news
const isModify = false

onBeforeMount(async () => {
  await getNews(newsId)
  await getNewses()
  await getOrders()
})

const getNewses = async () => {
  const quantity = newses.value.length + 10
  newses.value = await get('/news')
  newses.value = newses.value
    .filter((news) => !!news.isForeignNews == JSON.parse(isForeign))
    .reverse()
    .splice(0, quantity)
}

const getNews = async (id) => {
  news.value = await get(`/news/${id}`)
}

const getOrders = async () => {
  orders.value = await get('/order/order')
  orders.value = orders.value.reverse().splice(0, 6)
}
</script>

<template>
  <HP_HeaderComponent :activeIndex="0"></HP_HeaderComponent>
  <template v-if="newsId">
    <HP_ContentEditorComponent
      v-if="news"
      v-model:orders="orders"
      v-model:isHomePageModify="isModify"
      v-model:content="news.paragraph"
      :time="news.timeOutstandingRelease ? news.timeOutstandingRelease : null"
    ></HP_ContentEditorComponent>
  </template>
  <template v-if="!newsId">
    <div v-if="newses" style="margin: 40px 0">
      <div class="d-flex justify-content-center">
        <div class="container row justify-content-around">
          <div
            class="col-8 card border-0"
            style="background-color: white; min-height: 100vh; box-shadow: 0 0 10px #ccc"
          >
            <div class="fs-3 text-danger fw-bolder p-4 border-bottom border-danger mb-2">
              Công ty xuất khẩu lao động ...
            </div>
            <div class="news">
              <DataView :value="newses">
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
                              name: 'hp_news_view',
                              params: { isForeign: !!item.isForeignNews, newsId: item._id }
                            }"
                          >
                            <img
                              class="block xl:block mx-auto rounded"
                              :src="item.pictureBase64"
                              :alt="item.title"
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
                                :class="
                                  'font-medium text-surface-500 dark:text-surface-400 text-sm ' +
                                  (item.type == 'focal' ? 'text-warning' : 'text-danger')
                                "
                                >{{ item.type == 'focal' ? 'Tiêu điểm' : 'Tin tức nổi bật' }}
                              </span>
                              <RouterLink
                                :to="{
                                  name: 'hp_news_view',
                                  params: { isForeign: !!item.isForeignNews, newsId: item._id }
                                }"
                                class="d-block text-lg fw-bolder mt-2 hoverRed"
                                >{{ item.title }}
                              </RouterLink>
                              <div
                                v-if="item.timeOutstandingRelease"
                                class="d-flex align-items-center mt-2"
                              >
                                <span
                                  class="pi pi-clock me-2"
                                  style="font-size: 11px; color: #888"
                                ></span>
                                <span style="margin-top: -3px; font-size: 11px; color: #888">{{
                                  modifyDate(item.timeOutstandingRelease)
                                }}</span>
                              </div>
                            </div>
                            <div class="bg-surface-100" style="border-radius: 30px">
                              <div
                                class="bg-surface-0 flex align-items-center gap-2 justify-content-center py-1"
                                style="color: #787878"
                              >
                                <span class="content text-surface-900 font-medium text-sm">{{
                                  item.content
                                }}</span>
                              </div>
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
                  label="Xem thêm tin tức"
                  severity="help"
                  text
                  @click="
                    async () => {
                      await getNewses()
                    }
                  "
                />
              </div>
            </div>
          </div>
          <div
            v-if="orders"
            class="col-3 card border-0"
            style="
              background-color: white;
              min-height: 300px;
              max-height: 500px;
              box-shadow: 0 0 10px #ccc;
            "
          >
            <div
              class="fs-4 text-danger fw-bolder p-3 border-bottom border-danger d-flex align-align-items-center"
            >
              <span class="pi pi-bell fs-4 me-3 fw-bolder"></span>
              <span style="margin-top: -3px">Đơn hàng lựa chọn</span>
            </div>
            <ul>
              <li class="fs-6 fw-bolder text-contrast m-3" v-for="order in orders" :key="order">
                {{ order.orderName }}
              </li>
            </ul>
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
