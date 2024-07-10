<script setup>
import { ref, onMounted } from 'vue'

import HP_ContentCoverComponent from '@/components/home_page_components/content/HP_ContentCoverComponent.vue'
import HP_NewsMultiSelectComponent from '../news/HP_NewsMultiSelectComponent.vue'

import Carousel from 'primevue/carousel'

import { get, post } from '@/utils/httpRequest'

const focalNews = ref()
const focalNewsShow = ref()

const isHomePageModify = defineModel('isHomePageModify')

// giá trị function được truyền ra ngoài cho component home có thể thực thi
let updateFunction = defineModel('updateFunction')

onMounted(async () => {
  await getNews()
})

const getNews = async () => {
  focalNews.value = await get('/news')
  focalNews.value = focalNews.value.filter((news) => news.type == 'focal').reverse()
  focalNewsShow.value = focalNews.value.filter((news) => news.showOnHome == 0)
}

const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 1,
    numScroll: 1
  },
  {
    breakpoint: '1199px',
    numVisible: 1,
    numScroll: 1
  },
  {
    breakpoint: '767px',
    numVisible: 1,
    numScroll: 1
  },
  {
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1
  }
])

// thay đổi updateFunction để truyền ra ngoài cho component home thực thi mỗi khi chọn update
updateFunction.value = async () => {
  let result
  for (const news of focalNews.value) {
    if (news.showOnHome != null) {
      news.showOnHome = 4
      result = await post(`/news/${news._id}/update`, { news: news })
    }
  }
  for (const news of focalNewsShow.value) {
    result = await post(`/news/${news._id}/update`, { news: { ...news, showOnHome: 0 } })
  }
  return result
}
</script>

<template>
  <div style="background-color: #ff7575; padding: 50px 0">
    <HP_ContentCoverComponent
      title="Tiêu điểm"
      icon="pi pi-megaphone"
      class="card d-flex align-items-center container border-0"
      style="margin: auto"
    >
      <div v-if="isHomePageModify && focalNews" style="position: absolute; top: 5px; right: 10px">
        <HP_NewsMultiSelectComponent
          style="width: 200px !important"
          v-model:choices="focalNewsShow"
          v-model:options="focalNews"
          :optionsLabel="'focalTitle'"
          :placeholder="'Tiêu điểm'"
          :selectionLimit="6"
        ></HP_NewsMultiSelectComponent>
      </div>
      <Carousel
        :value="focalNewsShow"
        :numVisible="1"
        :numScroll="1"
        :responsiveOptions="responsiveOptions"
        circular
        :autoplayInterval="5000"
        style="width: 80%"
        :pt="{
          previousbutton: {
            class: 'carousel_button carousel_button--left'
          },
          nextbutton: {
            class: 'carousel_button carousel_button--right'
          },
          indicatorButton: ({ context }) => ({
            style: context.highlighted ? 'background-color: #fc6e48 !important' : ''
          })
        }"
      >
        <template #item="slotProps">
          <div class="d-flex justify-content-between rounded m-2 p-4">
            <div class="d-flex mb-4" style="width: 45%">
              <div class="mx-auto">
                <img
                  :src="slotProps.data.pictureBase64"
                  :alt="slotProps.data.title"
                  class="rounded"
                  style="width: 100%; height: 300px; box-shadow: 0 0 10px #ccc"
                />
              </div>
            </div>
            <div class="mb-4 position-relative" style="width: 49%; text-transform: capitalize">
              <div
                class="fs-2 text-danger fw-bolder"
                style="padding-bottom: 5px; border-bottom: solid 2px #fad8d8"
              >
                {{ slotProps.data.focalTitle }}
              </div>
              <div class="fs-5 fw-bolder my-2">
                {{ slotProps.data.title }}
              </div>
              <div class="fs-6 content my-2">{{ slotProps.data.content }}</div>

              <RouterLink
                :to="{
                  name: 'hp_news_view',
                  params: { isForeign: !!slotProps.data.isForeignNews, newsId: slotProps.data._id }
                }"
                class="d-inline-block position-absolute"
                style="bottom: 0; left: 0"
              >
                <Button class="rounded" label="Xem chi tiết" severity="danger" />
              </RouterLink>
            </div>
          </div>
        </template>
      </Carousel>
    </HP_ContentCoverComponent>
  </div>
</template>

<style>
.carousel_button {
  width: 30px;
  height: 60px;
  background-color: rgba(248, 140, 110, 0.73);
  color: white !important;
}

.carousel_button--left {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.carousel_button--right {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.carousel_button:hover {
  background-color: #fc6e48 !important;
}
</style>

<style scoped>
.content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6; /* Số dòng hiển thị */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
