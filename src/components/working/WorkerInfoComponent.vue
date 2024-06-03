<script setup>
import { ref } from 'vue'
import { post } from '@/utils/httpRequest'
import { onMounted } from 'vue'

import modifyDate from '@/helpers/modifyDate'
import importImage from '@/helpers/importImage'
import getKeyByValue from '@/helpers/getKeyByValue'
import md5Hash from '@/helpers/md5Hash'

const props = defineProps(['worker'])
const updateResult = ref(null)
const initialWorkerPassword = props.worker.accountTraining.password
const worker = ref(props.worker)
const isDisabled = ref(true)
const isModifying = ref(false)
const imageWorker = ref(null)
let handleImageChange

const accountImg = importImage('user', props.worker.accountTraining.person.photo)

const academyLevel = {
  cs: 'Cơ sở',
  pt: 'Phổ thông',
  cd: 'Cao đẳng',
  dh: 'Đại học'
}

let associateContact = `Tên: ${worker.value.accountTraining.person.associateContact.name}\nLoại quan hệ: ${worker.value.accountTraining.person.associateContact.relation}\nSố điện thoại: ${worker.value.accountTraining.person.associateContact.phoneNumber}\n`
let anotherCertificates = worker.value.accountTraining.person.anotherCertificates.reduce(
  (c, currentValue) => {
    return (
      `${c}` + `Tên chứng chỉ: ${currentValue.certificateName}, Cấp độ: ${currentValue.level}\n`
    )
  },
  ''
)
const associateContactGetvalue = (value) => {
  const valueArray = value.trim().replaceAll('\n', ':').split(':')
  const associateContactObject = {
    name: valueArray[1],
    relation: valueArray[3],
    phoneNumber: valueArray[5]
  }
  return associateContactObject
}

const anotherCertificatesGetvalue = (value) => {
  const valueArray = value.trim().replaceAll(', ', ': ').replaceAll('\n', ': ').split(': ')
  const anotherCertificates = []
  for (let i = 1, j = 3; i < valueArray.length, j < valueArray.length; i += 4, j += 4) {
    anotherCertificates.push({
      certificateName: valueArray[i],
      level: valueArray[j]
    })
  }
  return anotherCertificates
}

const handleTurnOnModifyMode = () => {
  isModifying.value = true
  isDisabled.value = false
  console.log(isDisabled)
}

const handleTurnOffModifyMode = () => {
  isModifying.value = false
  isDisabled.value = !isDisabled.value
}

const handleUpdateInfo = async () => {
  if (worker.value.accountTraining.password == md5Hash('')) {
    worker.value.accountTraining.password = initialWorkerPassword
  }
  try {
    updateResult.value = await post(`/working/worker/${worker.value._id}/update`, {
      worker: worker.value
    })
  } catch (e) {
    updateResult.value = e
  }
  associateContact = `Tên: ${worker.value.accountTraining.person.associateContact.name}\nLoại quan hệ: ${worker.value.accountTraining.person.associateContact.relation}\nSố điện thoại: ${worker.value.accountTraining.person.associateContact.phoneNumber}\n`
  anotherCertificates = worker.value.accountTraining.person.anotherCertificates.reduce(
    (c, currentValue) => {
      return (
        `${c}` + `Tên chứng chỉ: ${currentValue.certificateName}, Cấp độ: ${currentValue.level}\n`
      )
    },
    ''
  )
  setTimeout(() => {
    updateResult.value = null
  }, 3000)
}

onMounted(() => {
  handleImageChange = (e) => {
    const fileInput = e.target

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader()
      worker.value.accountTraining.person.photoType = fileInput.files[0].name.split('.')[1]

      reader.onload = function (e) {
        imageWorker.value.src = e.target.result
        worker.value.accountTraining.person.photo = e.target.result
      }

      reader.readAsDataURL(fileInput.files[0])
    }
  }
})
</script>

<template>
  <div class="worker__info ms-5">
    <div class="modify__choice d-flex flex-row-reverse">
      <div
        v-if="isModifying"
        class="btn btn-success me-1"
        style="width: 100px"
        @click="handleUpdateInfo"
      >
        Lưu
      </div>
      <div
        v-if="isModifying"
        class="btn btn-secondary me-1"
        style="width: 100px"
        @click="handleTurnOffModifyMode"
      >
        Tắt sửa
      </div>
      <div
        v-if="!isModifying"
        class="btn btn-danger me-1"
        style="width: 100px"
        @click="handleTurnOnModifyMode"
      >
        Sửa
      </div>
      <div
        v-if="updateResult && updateResult.status && isModifying"
        style="color: green; font-weight: bold; margin-right: 20px"
      >
        {{ updateResult.status }}!!!
      </div>
    </div>
    <form class="pe-4">
      <fieldset class="row d-flex border-bottom justify-content-between mb-1 pb-2">
        <legend class="p-0 fs-5 bolder">Thông tin tài khoản</legend>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1">
            <label for="floatingAccountCode">Tên lao động</label>
            <InputText
              id="floatingAccountCode"
              v-model="worker.accountTraining.accountCode"
              :pt="{
                root: {
                  disabled: isDisabled
                }
              }"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1">
            <label for="floatingAccountPassword">Mật khẩu</label>
            <InputText
              id="floatingAccountPassword"
              type="password"
              value=""
              @input="(e) => (worker.accountTraining.password = md5Hash(e.target.value))"
              :pt="{
                root: {
                  disabled: isDisabled
                }
              }"
            />
          </div>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between mb-1">
        <legend class="p-0 fs-5">Thông tin cá nhân</legend>
        <div class="col-5 p-0 border-0">
          <input
            type="file"
            id="fileInput"
            class="d-none"
            :disabled="isDisabled ? true : false"
            @change="handleImageChange"
          />
          <label class="mb-4 d-flex justify-content-center" for="fileInput">
            <img
              :class="!isDisabled ? 'hoverOpacity' : ''"
              ref="imageWorker"
              :src="accountImg"
              alt="Click to upload"
              style="width: 300px"
            />
          </label>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1">
            <label for="floatingAccountName">Tên người dùng</label>
            <InputText
              id="floatingAccountName"
              class="mb-3"
              v-model="worker.accountTraining.person.name"
              :pt="{
                root: {
                  disabled: isDisabled
                }
              }"
            />
          </div>
        </div>
        <div class="col-5 p-0 form-floating">
          <select
            class="form-select form-control mb-3"
            id="floatingAccountMarried"
            aria-label="Floating label select example"
            :disabled="isDisabled ? true : false"
            @input="
              (e) => {
                worker.isMarried = e.target.value
              }
            "
          >
            <option :value="true" :selected="worker.isMarried == true ? true : false">
              Đã kết hôn
            </option>
            <option :value="false" :selected="worker.isMarried == false ? true : false">
              Chưa kết hôn
            </option>
          </select>
          <label for="floatingAccountMarried">Tình trạng hôn nhân</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <input
            type="text"
            class="form-control mb-3"
            id="floatingAccountIdentifyCard"
            v-model="worker.accountTraining.person.identifyCard"
            :disabled="isDisabled ? true : false"
          />
          <label for="floatingAccountIdentifyCard">Căn cước công dân/Chứng minh thư</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <input
            type="date"
            class="form-control"
            id="floatingAccountBirthDate"
            :value="
              modifyDate(worker.accountTraining.person.birthDate).split('-').reverse().join('-')
            "
            @input="(e) => (worker.accountTraining.person.birthDate = e.target.value.toISOString())"
            :disabled="isDisabled ? true : false"
          />
          <label for="floatingAccountBirthDate">Ngày sinh</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <input
            type="text"
            class="form-control mb-3"
            id="floatingAccountPhoneNumber"
            v-model="worker.accountTraining.person.phoneNumber"
            :disabled="isDisabled ? true : false"
          />
          <label for="floatingAccountPhoneNumber">Số điện thoại</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <input
            type="text"
            class="form-control"
            id="floatingAccountAddress"
            v-model="worker.accountTraining.person.address"
            :disabled="isDisabled ? true : false"
          />
          <label for="floatingAccountAddress">Địa chỉ</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <select
            class="form-select form-control mb-3"
            id="floatingAccountAcademicLevel"
            aria-label="Floating label select example"
            :disabled="isDisabled ? true : false"
            @input="
              (e) =>
                (worker.accountTraining.person.academicLevel = getKeyByValue(
                  academyLevel,
                  e.target.value
                ))
            "
          >
            <template v-for="(academicLevel, key) in academyLevel" :key="key">
              <option
                :value="academicLevel"
                :selected="
                  worker.accountTraining.person.academicLevel == academicLevel ? true : false
                "
              >
                {{ academicLevel }}
              </option>
            </template>
          </select>
          <label for="floatingAccountAcademicLevel">Trình độ bằng cấp</label>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between mb-1">
        <legend class="p-0 fs-5">Thông tin khác</legend>
        <div class="col-5 p-0 form-floating">
          <textarea
            class="form-control mb-3"
            id="floatingAccountAssociateContact"
            style="height: 110px; overflow-y: hidden"
            :value="associateContact"
            @input="
              (e) =>
                (worker.accountTraining.person.associateContact = associateContactGetvalue(
                  e.target.value
                ))
            "
            :disabled="isDisabled ? true : false"
          ></textarea>
          <label for="floatingAccountAssociateContact">Người liên hệ</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <textarea
            class="form-control"
            id="floatingAccountAnotherCertificates"
            :value="anotherCertificates"
            style="height: 110px"
            @input="
              (e) =>
                (worker.accountTraining.person.anotherCertificates = anotherCertificatesGetvalue(
                  e.target.value
                ))
            "
            :disabled="isDisabled ? true : false"
          ></textarea>
          <label for="floatingAccountAnotherCertificates"
            >Bằng cấp/ Chứng chỉ khác (Tên chứng chỉ: ... , Cấp độ: ...)</label
          >
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
.hoverOpacity:hover {
  opacity: 0.6;
  cursor: pointer;
}
</style>
