<!-- eslint-disable no-constant-condition -->
<script setup>
import { ref } from 'vue'
import { post } from '@/utils/httpRequest'
import { onMounted } from 'vue'

import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'

import quillEditorModules from '@/helpers/quillEditorModules'

const props = defineProps(['news'])
const news = ref(props.news)

const isDisabled = ref(true)
const isParagraphShow = ref(false)
const updateResult = ref(null)

const imageNews = ref(null)
let handleImageChange

// các options lựa chọn

// do newsList bên ngoài đã sửa thuộc tính isForeignNews này để phù hợp render ra nên sẽ không cần sửa tại đây
const isForeignOptions = [
  { text: 'Tin tức nước ngoài', code: true, severity: 'danger' },
  { text: 'Tin tức trong nước', code: false, severity: 'success' }
]

// khởi tạo các giá trị hiển thị
const newsImg = news.value.pictureBase64

// gửi dữ liệu update
const handleUpdateInfo = async () => {
  try {
    updateResult.value = await post(`/news/${news.value._id}/update`, {
      news: {
        ...news.value,
        ...(news.value.timeOutstandingRelease && {
          timeOutstandingRelease: news.value.timeOutstandingRelease
        }),
        ...(news.value.focalTitle && { focalTitle: news.value.focalTitle })
      }
    })
  } catch (e) {
    updateResult.value = e
  }
  setTimeout(() => {
    updateResult.value = null
  }, 1000)
}

onMounted(async () => {
  // thay đổi hình ảnh
  handleImageChange = (e) => {
    const fileInput = e.target

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader()

      reader.onload = function (e) {
        imageNews.value.src = e.target.result
        news.value.pictureBase64 = e.target.result
      }

      reader.readAsDataURL(fileInput.files[0])
    }
  }
})

// các hàm xử lí bật tắt chế độ sửa
const handleChangeModifyMode = (state) => {
  isDisabled.value = state
}
</script>

<template>
  <div class="news__info ms-2">
    <div class="modify__choice d-flex flex-row-reverse">
      <div
        v-if="!isDisabled"
        class="btn btn-secondary me-1"
        style="width: 100px; height: 35px"
        @click="handleChangeModifyMode(true)"
      >
        Tắt sửa
      </div>
      <div
        v-if="isDisabled"
        class="btn btn-danger me-1"
        style="width: 100px; height: 35px"
        @click="handleChangeModifyMode(false)"
      >
        Sửa
      </div>
      <div
        v-if="!isDisabled"
        class="btn btn-success me-1"
        style="width: 100px"
        @click="handleUpdateInfo"
      >
        Lưu
      </div>
      <div
        v-if="updateResult && updateResult.status && !isDisabled"
        style="color: green; font-weight: bold; margin-right: 20px"
      >
        {{ updateResult.status == 200 ? 'Lưu thành công' : 'Lưu không thành công' }}!!!
      </div>
    </div>
    <form class="pe-4" v-show="!isParagraphShow">
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 mb-3 mt-1 fs-5 fw-bolder">Tin tức</legend>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="newsType">Loại tin tức: </label>
            <Tag :severity="news.type.severity" :value="news.type.text"></Tag>
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="newsShow">Có xuất hiện ở bảng tin hay không? </label>
            <Tag :severity="news.showOnHome.severity" :value="news.showOnHome.text"></Tag>
          </div>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 mb-3 fw-bolder">Nội dung tin tức</legend>
        <div class="col-5 p-0 border-0">
          <input
            type="file"
            id="fileInput"
            class="d-none"
            :disabled="isDisabled"
            @change="handleImageChange"
          />
          <label class="mb-4 d-flex justify-content-center" for="fileInput">
            <img
              :class="!isDisabled ? 'hoverOpacity' : ''"
              ref="imageNews"
              :src="newsImg"
              alt="Click to upload"
              style="width: 300px"
            />
          </label>
        </div>
        <div v-if="news.type.code && news.type.code == 'focal'" class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="focalTitle">Tiêu đề lớn của tiêu điểm</label>
            <InputText id="focalTitle" v-model="news.focalTitle" :disabled="isDisabled" />
          </div>
        </div>
        <div v-if="news.type.code && news.type.code != 'focal'" class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="timeOutstandingRelease">Thời gian đăng bài</label>
            <Calendar
              v-model="news.timeOutstandingRelease"
              :disabled="true"
              :showOnFocus="false"
              inputId="timeOutstandingRelease"
              dateFormat="dd/mm/yy"
              showTime
              hourFormat="24"
              :pt="{
                root: {
                  style: 'width: 100%'
                }
              }"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="title">Tiêu đề</label>
            <InputText id="title" v-model="news.title" :disabled="isDisabled" />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="newsDescription">Mô tả</label>
            <Textarea id="newsDescription" v-model="news.content" :disabled="isDisabled" />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="isForeignNews">Có phải tin tức nước ngoài? </label>
            <Dropdown
              v-model="news.isForeignNews"
              :options="isForeignOptions"
              optionLabel="text"
              input-id="isForeignNews"
              checkmark
              :highlightOnSelect="false"
              class="w-full"
              :disabled="isDisabled"
            />
          </div>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin khác</legend>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="">Sửa đoạn văn cho tin tức: </label>
            <Button
              icon="pi pi-info-circle"
              label="Xem đoạn văn"
              severity="secondary"
              style="width: 150px; margin-top: 10px"
              @click="isParagraphShow = true"
            />
          </div>
        </div>
      </fieldset>
    </form>
    <div class="my-6" v-show="isParagraphShow">
      <Editor
        v-model="news.paragraph"
        editorStyle="height: 320px, width: 50%"
        :modules="quillEditorModules"
        :pt="{ toolbar: { style: 'display: none;' } }"
        theme="snow"
        @load="
          ({ instance }) => {
            instance.root.innerHTML = news.paragraph
          }
        "
        v-show="!isDisabled"
      />
      <div class="ql-editor card p-3" v-show="isDisabled" v-html="news.paragraph"></div>
      <div class="d-flex justify-content-end">
        <Button
          icon="pi pi-info-circle"
          label="Tắt xem đoạn văn"
          severity="secondary"
          style="width: 180px; margin-top: 20px"
          @click="isParagraphShow = false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hoverOpacity:hover {
  opacity: 0.6;
  cursor: pointer;
}
</style>
