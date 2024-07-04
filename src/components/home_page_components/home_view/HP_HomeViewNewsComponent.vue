<script setup>
import HP_NewsComponent from '@/components/home_page_components/news/HP_NewsComponent.vue'
import { onBeforeMount, ref } from 'vue'
import { get } from '@/utils/httpRequest'

const newses = ref(null)
const company_news0 = ref(null)
const company_news1 = ref(null)
const company_news2 = ref(null)
const foreign_news = ref(null)

const getNews = async () => {
  let newsArray = await get('/news')
  newses.value = newsArray.filter((news) => news.type == 'outstanding').reverse()
  // lọc các tin tức được xuất hiện ở bảng tin
  company_news0.value = newsArray.filter(
    (news) => !news.isForeignNews && news.showOnHome != null && news.showOnHome == 0
  )
  company_news1.value = newsArray.filter(
    (news) => !news.isForeignNews && news.showOnHome != null && news.showOnHome == 1
  )
  company_news2.value = newsArray.filter(
    (news) => !news.isForeignNews && news.showOnHome != null && news.showOnHome == 2
  )
  foreign_news.value = newsArray.filter(
    (news) => news.isForeignNews && news.showOnHome != null && news.showOnHome == 0
  )
}

onBeforeMount(async () => {
  await getNews()
})
</script>

<template>
  <div class="p-5" style="background-color: white">
    <div class="card d-flex align-items-center container border-0" style="padding: 40px 30px">
      <div class="row justify-content-between mb-3" style="width: 80%">
        <div
          class="col-sm-12 col-lg-8 p-0 row justify-content-between fw-bolder fs-2 text-danger border-bottom border-contrast"
        >
          <span
            class="company__news__title position-relative p-0 d-inline-block"
            style="width: auto"
            >Bản tin Mitaco
          </span>
        </div>
        <div
          class="col-4 p-0 d-none d-lg-block fw-bolder fs-2 text-danger"
          style="margin-right: -15px"
        >
          Tin tức nước ngoài
        </div>
      </div>
      <div class="row justify-content-between" style="width: 80%">
        <div
          v-if="newses"
          class="col-sm-12 col-lg-8 p-0 row justify-content-between position-relative"
        >
          <div class="col-5 p-0">
            <HP_NewsComponent
              :props="{
                type: 'col',
                hasImg: true,
                news: company_news0[0]
              }"
            ></HP_NewsComponent>
          </div>
          <div class="col-6 p-0">
            <!-- tin có ảnh -->
            <HP_NewsComponent
              :props="{
                type: 'row',
                hasImg: true,
                news: company_news1[0]
              }"
              class="pb-3"
            ></HP_NewsComponent>
            <HP_NewsComponent
              :props="{
                type: 'row',
                hasImg: true,
                news: company_news1[1]
              }"
              class="pb-3"
            ></HP_NewsComponent>

            <!-- tin không có ảnh -->
            <HP_NewsComponent
              :props="{ type: 'row', hasImg: false, news: company_news2[0] }"
              class="border-bottom border-contrast py-2"
            ></HP_NewsComponent>
            <HP_NewsComponent
              :props="{ type: 'row', hasImg: false, news: company_news2[1] }"
              class="border-bottom border-contrast py-2"
            ></HP_NewsComponent>
            <HP_NewsComponent
              :props="{ type: 'row', hasImg: false, news: company_news2[2] }"
              class="py-2"
            ></HP_NewsComponent>
          </div>
          <div class="position-absolute" style="bottom: -10px">Xem thêm tin tức</div>
        </div>
        <div
          class="col-4 d-none d-lg-block p-0"
          style="margin-right: -15px; background-color: #aed9ff; border-radius: 10px"
        >
          <HP_NewsComponent
            v-if="newses"
            :props="{
              type: 'col',
              hasImg: true,
              news: foreign_news[0]
            }"
            class="p-4"
          ></HP_NewsComponent>
          <div class="my-3 ms-3">Xem thêm tin tức</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.company__news__title::before {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 120%;
  height: 1.5px;
  background-color: rgba(var(--bs-danger-rgb), var(--bs-text-opacity)) !important;
}
</style>
