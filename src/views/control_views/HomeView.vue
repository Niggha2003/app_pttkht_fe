<script setup>
import InterfaceComponent from '@/components/control_components/InterfaceComponent.vue'
import { useStore } from 'vuex'

const store = useStore()

const user = store.state.user
const roleOptions = {
  student: 'Người lao động',
  signing: 'Quản lí đơn đăng kí',
  ordering: 'Quản lí đơn hàng',
  working: 'Quản lí lao động',
  admin: 'Quản lí tài khoản nhân viên'
}
</script>

<template>
  <InterfaceComponent>
    <div class="fs-4 fw-bolder">
      Chào mừng <span class="text-danger">{{ user.name }}</span> với vai trò là
      <span class="text-danger">{{ roleOptions[user.role] }}</span>
    </div>
    <div class="mt-2 fs-4 fw-bolder text-danger">
      {{ user.role == 'student' ? 'Chúng tôi hiện chưa có chức năng cho người lao động' : '' }}
    </div>
  </InterfaceComponent>
</template>
