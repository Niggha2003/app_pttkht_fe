<script setup>
import modifyDate from '@/helpers/modifyDate'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import importImage from '@/helpers/importImage'

const propDefine = defineProps(['props'])
const props = propDefine.props
const worker = props.worker
</script>

<template>
  <div class="worker p-1 mb-3 ms-2 me-3 d-flex justify-content-between align-items-center">
    <div class="d-flex">
      <img
        :src="importImage('user', worker.accountTraining.person.photo)"
        :alt="worker.accountTraining.person.name"
        style="width: 100px; height: 100px"
      />
      <div class="ms-2">
        <h4 class="fs-5 mb-1">{{ worker.accountTraining.person.name }}</h4>
        <p class="m-0" style="opacity: 0.8">
          {{ modifyDate(worker.accountTraining.person.birthDate) }}
        </p>
      </div>
    </div>
    <div class="icon">
      <font-awesome-icon :icon="faArrowRight" />
    </div>
  </div>
</template>

<style scope>
.worker {
  transition: all 0.3s ease-out;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 0 5px #ff5e5e;
  border-radius: 5px;
}
.worker .icon {
  margin-right: 1rem;
}
.worker:hover {
  background-color: #f06969;
  color: white;
}
.worker:hover .icon {
  margin-right: 0.5rem;
}
</style>
