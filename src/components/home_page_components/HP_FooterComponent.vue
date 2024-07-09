<script setup>
import { get, post } from '@/utils/httpRequest'
import { onMounted, ref } from 'vue'

import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const licenseImage = ref()
const infoCompany = ref()
const licenseVisible = ref(false)
const isChangingInfo = ref(false)
const infos = ref(null)

const toast = useToast()

const isHomePageModify = defineModel('isHomePageModify')

onMounted(async () => {
  await getLicense()
  await getInfo()
})

const getInfo = async () => {
  infoCompany.value = await get('/info')
  infos.value = [
    {
      icon: 'pi pi-map-marker',
      text: infoCompany.value ? infoCompany.value.text : '',
      type: 'location',
      color: 'pink'
    },
    {
      icon: 'pi pi-phone',
      text: infoCompany.value ? infoCompany.value.phoneNumber : '',
      type: 'phone number',
      color: 'yellow'
    },
    {
      icon: 'pi pi-envelope',
      text: infoCompany.value ? infoCompany.value.email : '',
      type: 'email',
      color: 'blue'
    },
    {
      icon: 'pi pi-globe',
      text: infoCompany.value ? infoCompany.value.website : '',
      type: 'website',
      color: 'green'
    }
  ]
}

const getLicense = async () => {
  licenseImage.value = await get('/get_image', { dirName: 'license' })
}

const handleUpdateInfo = async () => {
  const result = await post('/info', { infoCompany: infoCompany.value })
  isChangingInfo.value = false
  toast.add({
    severity: result.status && result.status == 200 ? 'success' : 'error',
    summary: result.status && result.status == 200 ? 'Lưu thành công' : 'Lưu thất bại',
    detail:
      result.status && result.status == 200
        ? 'Bạn đã sửa thông tin liên hệ thành công'
        : 'Bạn đã sửa thông tin liên hệ thất bại',
    life: 3000
  })
  await getInfo()
}
</script>

<template>
  <div>
    <Toast />
    <div class="line border-top border-danger"></div>
    <div style="background-color: cadetblue; position: relative">
      <Button
        v-if="isHomePageModify"
        style="position: absolute; top: 0; left: 20px; transform: translateY(-150%)"
        type="button"
        label="Thay đổi thông tin"
        class="rounded ms-4"
        severity="contrast"
        @click="isChangingInfo = true"
      ></Button>
      <div class="container" style="margin-top: 40px; padding: 20px 0">
        <div class="company__info__and__license row justify-content-around">
          <div v-if="infos" class="company__info p-3 col-6">
            <div class="fs-2 fw-bolder my-2 text-white">Địa chỉ liên hệ</div>
            <div v-for="info in infos" :key="info" class="d-flex py-1 my-1 align-items-center">
              <span
                :class="info.icon + ' me-3'"
                :style="{
                  color: info.color,
                  'text-shadow': '2px 2px 1px rgba(0, 0, 0, .2)'
                }"
              ></span>
              <span style="color: white">{{ info.text }}</span>
            </div>
          </div>
          <div
            class="company__license p-3 d-flex justify-content-center rounded"
            style="background-color: #ffd1b1c7; max-height: 175px; width: 400px"
            @click="licenseVisible = true"
          >
            <div
              v-if="licenseImage"
              class="license d-flex flex-column align-items-center"
              style="width: 60%"
            >
              <p>
                <img
                  :src="licenseImage.find((license) => license.includes('icon'))"
                  alt=""
                  width="50"
                  height="50"
                />
              </p>
              <p><span style="color: #e47b00; font-weight: 500">1686/LĐTBXH-GP</span></p>
              <p class="m-0 fs-6 text-center">GIẤY PHÉP ĐƯA NLĐ ĐI LÀM VIỆC Ở NƯỚC NGOÀI</p>
            </div>
          </div>
          <Dialog
            v-model:visible="licenseVisible"
            modal
            header="Giấy phép"
            :style="{ width: '30rem' }"
          >
            <div class="d-flex justify-content-center">
              <img
                :src="licenseImage.find((license) => !license.includes('icon'))"
                alt=""
                width="300px"
                height="450px"
              />
            </div>
          </Dialog>
        </div>
      </div>
      <div style="background-color: #e8eeef; width: 100%; padding: 10px 0">
        <span
          class="text-center"
          style="display: block; font-size: 12px; width: 80%; margin: auto; line-height: 22px"
        >
          {{ infoCompany ? infoCompany.finalText : '' }}
        </span>
      </div>
    </div>
    <Dialog
      v-model:visible="isChangingInfo"
      modal
      header="Thay đổi thông tin công ty"
      :style="{ width: '50rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-6"
        >Thay đổi thông tin liên hệ công ty.</span
      >
      <div class="flex items-center gap-4 mb-4">
        <label for="text" class="font-semibold w-24">Trụ sở:</label>
        <InputText v-model="infoCompany.text" id="text" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="phoneNumber" class="font-semibold w-24">Điện thoại:</label>
        <InputText
          v-model="infoCompany.phoneNumber"
          id="phoneNumber"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="email" class="font-semibold w-24">Email:</label>
        <InputText v-model="infoCompany.email" id="email" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="website" class="font-semibold w-24">website:</label>
        <InputText
          v-model="infoCompany.website"
          id="website"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="finalText" class="font-semibold w-24">Dòng chữ cuối cùng:</label>
        <InputText
          v-model="infoCompany.finalText"
          id="finalText"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex justify-items-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="isChangingInfo = false"
          class="rounded"
        ></Button>
        <Button type="button" label="Lưu" @click="handleUpdateInfo" class="rounded ms-4"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.company__license:hover {
  background-color: #ffdfc8 !important;
  cursor: pointer;
  transition: 0.3s linear;
}

.w-24 {
  width: 90px;
}
</style>
