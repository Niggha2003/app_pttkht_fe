<script setup>
import { get } from '@/utils/httpRequest'
import { onMounted, ref } from 'vue'
import Dialog from 'primevue/dialog'

const licenseImage = ref()
const licenseVisible = ref(false)
onMounted(async () => {
  await getLicense()
})

const getLicense = async () => {
  licenseImage.value = await get('/get_image', { dirName: 'license' })
}

const infos = [
  {
    icon: 'pi pi-map-marker',
    text: 'Trụ sở : Tầng 4, số nhà 3A, ngách 41, ngõ 195 Trần Cung, Tp Hà Nội, Việt Nam',
    type: 'location',
    color: 'pink'
  },
  {
    icon: 'pi pi-phone',
    text: '0976760298',
    type: 'phone number',
    color: 'yellow'
  },
  {
    icon: 'pi pi-envelope',
    text: 'nguyennghia241003@gmail.com',
    type: 'email',
    color: 'blue'
  },
  {
    icon: 'pi pi-globe',
    text: 'www.nghia.com.vn',
    type: 'website',
    color: 'green'
  }
]
</script>

<template>
  <div>
    <div class="line border-top border-danger"></div>
    <div style="background-color: cadetblue">
      <div class="container" style="margin-top: 40px; padding: 20px 0">
        <div class="company__info__and__license row justify-content-around">
          <div class="company__info p-3 col-6">
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
          >© CÔNG TY TNHH THƯƠNG MẠI VÀ PHÁT TRIỂN NHÂN LỰC MIỀN TÂY (MITACO) - Giấy chứng nhận
          doanh nghiệp số: 1501073201, Ngày cấp giấy phép: 18/10/2017, Nơi cấp: SKH&DT Vĩnh Long Địa
          chỉ: 112A Đinh Tiên Hoàng, Phường 8, TP. Vĩnh Long, Tỉnh Vĩnh Long , Điện thoại: 02703 895
          488
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.company__license:hover {
  background-color: #ffdfc8 !important;
  cursor: pointer;
  transition: 0.3s linear;
}
</style>
