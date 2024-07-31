<!-- eslint-disable no-constant-condition -->
<script setup>
import { ref } from 'vue'
import { post } from '@/utils/httpRequest'
import { onMounted } from 'vue'

import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'

import quillEditorModules from '@/helpers/quillEditorModules'

const addResult = ref(null)
const addResultVisible = ref(false)
const isParagraphShow = ref(false)

// các options lựa chọn
const typeOptions = [
  { text: 'Tin tức nổi bật', code: 'outstanding', severity: 'warn' },
  { text: 'Tiêu điểm', code: 'focal', severity: 'danger' }
]
const isForeignOptions = [
  { text: 'Tin tức nước ngoài', code: true, severity: 'danger' },
  { text: 'Tin tức trong nước', code: false, severity: 'success' }
]

const news = ref({
  title: null,
  content: null,
  // những cái nào là tiêu điểm sẽ k có thời gian
  timeOutstandingRelease: null,
  pictureBase64: null,
  type: null,
  // những cái nào là outstanding sẽ k có focalTitle
  focalTitle: null,
  // show on Home bằng 4 hoặc null thì là k được show, 0 là show với foreign và focal, còn 0,1,2 là show với outstanding
  showOnHome: null,
  paragraph: null,
  isForeignNews: null
})

const imageNews = ref(null)
let handleImageChange

const handleAddNews = async () => {
  try {
    addResult.value = await post(`/news/create`, {
      news: {
        ...news.value,
        type: news.value.type.code,
        isForeignNews: news.value.isForeignNews.code,
        ...(news.value.type.code == 'outstanding' && {
          timeOutstandingRelease: new Date().toISOString()
        }),
        ...(news.value.focalTitle && { focalTitle: news.value.focalTitle })
      }
    })
    addResultVisible.value = true
  } catch (e) {
    addResult.value = { response: { status: 500 } }
    addResultVisible.value = true
  }
}

const resetAddNews = async () => {
  // reset kết quả thêm
  addResult.value = null

  // reset giá trị tài khoản
  news.value = {
    title: null,
    content: null,
    // những cái nào là tiêu điểm sẽ k có thời gian
    timeOutstandingRelease: null,
    pictureBase64: null,
    type: null,
    // những cái nào là outstanding sẽ k có focalTitle
    focalTitle: null,
    // show on Home bằng 4 hoặc null thì là k được show, 0 là show với foreign và focal, còn 0,1,2 là show với outstanding
    showOnHome: null,
    paragraph: null,
    isForeignNews: null
  }

  // reset ảnh
  imageNews.value = null
}

// thay đổi hình ảnh
onMounted(() => {
  resetAddNews()
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
</script>

<template>
  <div class="card p-4 mb-6">
    <div class="order__info ms-5">
      <Dialog
        v-if="addResult"
        v-model:visible="addResultVisible"
        modal
        header="Kết quả thêm mới tin tức"
        :style="{
          width: '25rem',
          'font-weight': 'bold',
          'text-align': 'center'
        }"
      >
        <div :style="{ color: addResult.status === 200 ? 'green' : 'red' }">
          {{
            addResult.status && addResult.status == 200
              ? 'Thêm thành công'
              : addResult.response.status === 409
                ? 'Thông tin không chính xác'
                : 'Cần nhập đầy đủ trường thông tin'
          }}!!!
        </div>
      </Dialog>
      <div
        v-if="!(addResult && addResult.status && addResult.status == 200)"
        class="modify__choice d-flex flex-row-reverse"
      >
        <div class="btn btn-success me-1" style="width: 100px" @click="handleAddNews">Thêm</div>
      </div>
      <form
        v-if="!(addResult && addResult.status && addResult.status == 200)"
        class="pe-4"
        v-show="!isParagraphShow"
      >
        <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
          <legend class="p-0 mb-3 mt-1 fs-5 fw-bolder">Tin tức</legend>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="newsType">Loại tin tức: </label>
              <Dropdown
                v-model="news.type"
                :options="typeOptions"
                optionLabel="text"
                input-id="newsType"
                checkmark
                :highlightOnSelect="false"
                class="w-full"
              />
            </div>
          </div>
        </fieldset>
        <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
          <legend class="p-0 fs-5 mb-3 fw-bolder">Nội dung tin tức</legend>
          <div class="col-5 p-0 border-0">
            <input type="file" id="fileInput" class="d-none" @change="handleImageChange" />
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
          <div v-if="news.type && news.type.code && news.type.code == 'focal'" class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="focalTitle">Tiêu đề lớn của tiêu điểm</label>
              <InputText id="focalTitle" v-model="news.focalTitle" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="title">Tiêu đề</label>
              <InputText id="title" v-model="news.title" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="newsDescription">Mô tả</label>
              <Textarea id="newsDescription" v-model="news.content" />
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
        />
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
      <div
        v-if="addResult && addResult.status && addResult.status == 200"
        class="d-flex justify-content-center py-2"
      >
        <Button
          label="Tiếp tục thêm mới tin tức"
          severity="secondary"
          icon="pi pi-user-plus"
          iconPos="right"
          @click="resetAddNews()"
        ></Button>
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
