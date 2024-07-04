<script setup>
import { onMounted, ref } from 'vue'
import Quill from 'quill'
import ImageUploader from 'quill-image-uploader'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { useStore } from 'vuex'

import ScrollTop from 'primevue/scrolltop'
import Editor from 'primevue/editor'

import HP_ModifyComponent from '@/components/home_page_components/modify/HP_ModifyComponent.vue'
import HP_HeaderComponent from '@/components/home_page_components/HP_HeaderComponent.vue'
import HP_FooterComponent from '@/components/home_page_components/HP_FooterComponent.vue'
import { get, post } from '@/utils/httpRequest'

const store = useStore()
const introduce = ref(null)
const result = ref(null)
const newses = ref(null)
const isHomePageModify = ref(store.state.isHomePageModify)

// Custom fonts
const fonts = ['Arial', 'Verdana', 'Times', 'Courier']

// Register custom fonts with Quill
const Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)
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

onMounted(async () => {
  await getIntroduce()
  await getNews()
})

const getIntroduce = async () => {
  introduce.value = await get('/introduce')
}

const setIntroduce = async () => {
  introduce.value.time = new Date()
  result.value = await post('/introduce', { introduce: introduce.value })
  setTimeout(() => {
    result.value = null
  }, 3000)
  await getIntroduce()
}

const getNews = async () => {
  newses.value = await get('/news')
  newses.value = newses.value.reverse().splice(0, 6)
}
</script>

<template>
  <HP_ModifyComponent
    v-model:state="isHomePageModify"
    v-model:result="result"
    @save-function="setIntroduce"
  ></HP_ModifyComponent>
  <HP_HeaderComponent :activeIndex="1"></HP_HeaderComponent>
  <div class="intro__content" style="margin: 40px 0">
    <div v-show="isHomePageModify" v-if="introduce" class="card">
      <Editor
        v-model="introduce.text"
        editorStyle="height: 320px, width: 50%"
        :modules="modules"
        :pt="{ toolbar: { style: 'display: none;' } }"
        theme="snow"
        @load="
          ({ instance }) => {
            instance.root.innerHTML = introduce.text
          }
        "
      />
    </div>
    <div v-if="introduce && !isHomePageModify" class="d-flex justify-content-center">
      <div class="container row justify-content-around">
        <div
          class="col-8 card border-0"
          style="background-color: white; min-height: 100vh; box-shadow: 0 0 10px #ccc"
        >
          <div class="intro__title fs-3 text-danger fw-bolder p-4 border-bottom border-danger">
            Công ty xuất khẩu lao động ...
          </div>
          <div class="ql-editor" v-html="introduce.text"></div>
        </div>
        <div
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
              {{ news.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
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

<style></style>
