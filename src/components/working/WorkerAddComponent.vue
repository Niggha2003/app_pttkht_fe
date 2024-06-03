<script setup>
import modifyDate from '@/helpers/modifyDate'
import { ref } from 'vue'
import getKeyByValue from '@/helpers/getKeyByValue'
import { post } from '@/utils/httpRequest'
import { onMounted } from 'vue'

const addResult = ref(null)
const worker = ref({
  isMarried: true,
  accountTraining: {
    role: 'student',
    person: {
      academicLevel: 'cd',
      anotherCertificates: []
    }
  }
})
const imageWorker = ref(null)
let handleImageChange

const academyLevel = {
  cs: 'Cơ sở',
  pt: 'Phổ thông',
  cd: 'Cao đẳng',
  dh: 'Đại học'
}

let associateContact = worker.value.accountTraining.person.associateContact
  ? `Tên: ${worker.value.accountTraining.person.associateContact.name}\nLoại quan hệ: ${worker.value.accountTraining.person.associateContact.relation}\nSố điện thoại: ${worker.value.accountTraining.person.associateContact.phoneNumber}`
  : 'Tên: ...\nLoại quan hệ: ...\nSố điện thoại: ...'

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

const handleAddWorker = async () => {
  try {
    addResult.value = await post(`/working/worker/create`, {
      worker: worker.value
    })
  } catch (e) {
    addResult.value = e
  }
  associateContact = worker.value.accountTraining.person.associateContact
    ? `Tên: ${worker.value.accountTraining.person.associateContact.name}\nLoại quan hệ: ${worker.value.accountTraining.person.associateContact.relation}\nSố điện thoại: ${worker.value.accountTraining.person.associateContact.phoneNumber}`
    : 'Tên: ...\nLoại quan hệ: ...\nSố điện thoại: ...'

  anotherCertificates = worker.value.accountTraining.person.anotherCertificates.reduce(
    (c, currentValue) => {
      return (
        `${c}` + `Tên chứng chỉ: ${currentValue.certificateName}, Cấp độ: ${currentValue.level}\n`
      )
    },
    ''
  )
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
    {{ console.log(addResult) }}

    <div
      v-if="addResult"
      :style="{
        color: addResult.status === 200 ? 'green' : 'red',
        'font-weight': 'bold',
        'margin-right': '20px',
        'text-align': 'center'
      }"
    >
      {{
        addResult.status === 200
          ? 'Thêm thành công'
          : addResult.response.status === 409
            ? 'Mã đăng nhập đã tồn tại'
            : 'Cần nhập đầy đủ trường thông tin'
      }}!!!
    </div>
    <div v-if="addResult === null" class="modify__choice d-flex flex-row-reverse">
      <div class="btn btn-success me-1" style="width: 100px" @click="handleAddWorker">Thêm</div>
    </div>
    <form v-if="addResult === null" class="pe-4">
      <fieldset class="row d-flex border-bottom justify-content-between mb-1">
        <legend class="p-0 fs-5">Thông tin tài khoản</legend>
        <div class="col-5 p-0 form-floating">
          <input
            type="text"
            class="form-control mb-3"
            id="floatingAccountCode"
            v-model="worker.accountTraining.accountCode"
          />
          <label for="floatingAccountCode">Tên đăng nhập</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingAccountPassword"
            v-model="worker.accountTraining.password"
          />
          <label for="floatingAccountPassword">Mật khẩu</label>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between mb-1">
        <legend class="p-0 fs-5">Thông tin cá nhân</legend>
        <div class="col-5 p-0 form-control border-0">
          <input type="file" id="fileInput" class="d-none" @change="handleImageChange" />
          <label class="mb-4 d-flex justify-content-center" for="fileInput">
            <img
              class="hoverOpacity"
              ref="imageWorker"
              :src="accountImg"
              alt="Click to upload"
              style="width: 300px"
            />
          </label>
        </div>
        <div class="col-5 p-0 form-floating">
          <input
            type="text"
            class="form-control mb-3"
            id="floatingAccountName"
            v-model="worker.accountTraining.person.name"
          />
          <label for="floatingAccountName">Tên người dùng</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <select
            class="form-select form-control mb-3"
            id="floatingAccountMarried"
            aria-label="Floating label select example"
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
            @input="
              (e) =>
                (worker.accountTraining.person.birthDate = new Date(e.target.value).toISOString())
            "
          />
          <label for="floatingAccountBirthDate">Ngày sinh</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <input
            type="text"
            class="form-control mb-3"
            id="floatingAccountPhoneNumber"
            v-model="worker.accountTraining.person.phoneNumber"
          />
          <label for="floatingAccountPhoneNumber">Số điện thoại</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <input
            type="text"
            class="form-control"
            id="floatingAccountAddress"
            v-model="worker.accountTraining.person.address"
          />
          <label for="floatingAccountAddress">Địa chỉ</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <select
            class="form-select form-control mb-3"
            id="floatingAccountAcademicLevel"
            aria-label="Floating label select example"
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
          ></textarea>
          <label for="floatingAccountAssociateContact">Người liên hệ</label>
        </div>
        <div class="col-5 p-0 form-floating">
          <textarea
            class="form-control"
            id="floatingAccountAnotherCertificates"
            style="height: 110px"
            :value="anotherCertificates"
            @input="
              (e) =>
                (worker.accountTraining.person.anotherCertificates = anotherCertificatesGetvalue(
                  e.target.value
                ))
            "
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
