<script setup>
import { get } from '@/utils/httpRequest'
import { onMounted, ref } from 'vue'

const partnerImages = ref()

onMounted(async () => {
  await getPartnerImage()
})

const getPartnerImage = async () => {
  partnerImages.value = await get('/get_image', { dirName: 'partnerOrganization' })
}
</script>

<template>
  <div style="background-color: white">
    <div
      class="d-flex fs-3 text-white fw-bolder justify-content-center align-items-center"
      style="
        height: 50px;
        background-color: rgba(var(--bs-danger-rgb), var(--bs-text-opacity)) !important;
        text-transform: uppercase;
      "
    >
      <div>
        <span class="pi pi-globe fs-3 me-3"></span>
        Các đối tác của chúng tôi
      </div>
    </div>
    <div class="d-flex justify-content-around" style="padding: 20px 0">
      <img
        v-for="partner in partnerImages"
        :key="partner"
        :src="partner"
        alt=""
        style="height: 120px"
        class="p-3"
      />
    </div>
    <div
      class="line"
      style="
        width: 100%;
        height: 5px;
        background-color: rgba(var(--bs-danger-rgb)) !important;
        box-shadow: 5px 0 5px #ccc;
      "
    ></div>
  </div>
</template>
