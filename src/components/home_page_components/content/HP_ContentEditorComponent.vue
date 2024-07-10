<script setup>
import Quill from 'quill'
import ImageUploader from 'quill-image-uploader'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import modifyDate from '@/helpers/modifyDate'
import { ref } from 'vue'
import Editor from 'primevue/editor'

const isHomePageModify = defineModel('isHomePageModify')
const content = defineModel('content')
const props = defineProps(['time', 'orders', 'newses'])
const time = props.time
const newses = ref(props.newses)
const orders = ref(props.orders)

if (newses.value) {
  newses.value = newses.value.splice(0, 6)
}
if (orders.value) {
  orders.value = orders.value.splice(0, 6)
}

// Custom fonts cho quill
const fonts = ['Arial', 'Verdana', 'Times', 'Courier']

// Register custom fonts cho Quill
const Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)

// dùng cái này để khi upload ảnh chuyển src của ảnh về dạng url
Quill.register('modules/imageUploader', ImageUploader)

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: fonts }],
    [{ align: [] }],

    ['link', 'image'], // link and image
    ['clean'] // remove formatting button
  ],
  imageUploader: {
    upload: async (file) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)

        fetch('http://localhost:5000/api/upload_image/paragraph', {
          method: 'POST',
          body: formData
        })
          .then((response) => response.json())
          .then((result) => {
            resolve(result.imageUrl)
          })
          .catch((error) => {
            reject('Upload failed')
            console.error('Error:', error)
          })
      })
    }
  }
}
</script>

<template>
  <div class="intro__content" style="margin: 40px 0">
    <div v-show="isHomePageModify" v-if="content" class="card">
      <Editor
        v-model="content"
        editorStyle="height: 320px, width: 50%"
        :modules="modules"
        :pt="{ toolbar: { style: 'display: none;' } }"
        theme="snow"
        @load="
          ({ instance }) => {
            instance.root.innerHTML = content
          }
        "
      />
    </div>
    <div v-if="content && !isHomePageModify" class="d-flex justify-content-center">
      <div class="container row justify-content-around">
        <div
          class="col-8 card border-0"
          style="background-color: white; min-height: 100vh; box-shadow: 0 0 10px #ccc"
        >
          <div class="intro__title fs-3 text-danger fw-bolder p-4 border-bottom border-danger mb-2">
            Công ty xuất khẩu lao động ...
          </div>
          <div class="d-flex align-items-center justify-content-end pe-3 my-3" v-if="time">
            <span class="pi pi-clock me-2" style="font-size: 13px; color: #888"></span>
            <span style="margin-top: -3px; color: #888; font-size: 13px">{{
              modifyDate(time)
            }}</span>
          </div>
          <div class="ql-editor" v-html="content"></div>
        </div>
        <div
          v-if="newses"
          class="col-3 card border-0"
          style="
            background-color: white;
            min-height: 300px;
            max-height: 500px;
            box-shadow: 0 0 10px #ccc;
          "
        >
          <div
            class="fs-4 text-danger fw-bolder p-3 border-bottom border-danger d-flex align-items-center"
          >
            <span class="pi pi-bell fs-4 me-3 fw-bolder"></span>
            <span style="margin-top: -3px">Tin tức khác</span>
          </div>
          <ul>
            <li class="fs-6 fw-bolder text-contrast m-3" v-for="news in newses" :key="news">
              <RouterLink
                class="hoverRed"
                :to="{
                  name: 'hp_news_view',
                  params: { isForeign: !!news.isForeignNews, newsId: news._id }
                }"
              >
                {{ news.title }}
              </RouterLink>
            </li>
          </ul>
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
            class="fs-4 text-danger fw-bolder p-3 border-bottom border-danger d-flex align-items-center"
          >
            <span class="pi pi-bell fs-4 me-3 fw-bolder"></span>
            <span style="margin-top: -3px">Đơn hàng lựa chọn</span>
          </div>
          <ul>
            <li
              class="fs-6 fw-bolder hoverRed text-contrast m-3"
              v-for="order in orders"
              :key="order"
            >
              <RouterLink
                class="hoverRed"
                :to="{ name: 'hp_order_view', params: { orderId: order._id } }"
              >
                {{ order.orderName }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hoverRed:hover {
  color: rgb(253, 66, 66) !important;
}
</style>
