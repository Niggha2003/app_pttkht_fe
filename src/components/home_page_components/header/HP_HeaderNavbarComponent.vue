<script setup>
import { RouterLink } from 'vue-router'

const menu_items = defineModel()
const props = defineProps(['isRouter', 'pass'])

const isRouter = props.isRouter
const pass = props.pass

const handleActive = (i) => {
  const oldIndex = menu_items.value.findIndex((item) => item.active == true)
  menu_items.value[oldIndex].active = false
  menu_items.value[i].active = true
}
</script>

<template>
  <div
    class="container d-flex"
    style="
      height: 80px;
      border-radius: 20px;
      padding: 0 20px;
      background-color: white;
      border-radius: 10px;
      user-select: none;
      box-shadow: 0 0 10px #ccc;
      position: sticky;
      top: 40px;
    "
    section="root"
    v-bind="pass && pass['root'] ? pass['root'] : ''"
  >
    <slot name="start"></slot>

    <template v-for="(item, index) in menu_items" :key="item">
      <slot name="item" :label="item.label" :icon="item.icon" :items="item.items" :to="item.to">
        <div
          v-if="!isRouter"
          class="item d-flex justify-content-center align-items-center flex-grow-1 fs-5 fw-bolder"
          style="height: 100%; color: #fc6e48; cursor: pointer; padding: 20px; text-align: center"
          section="item"
          :active="item.active"
          v-bind="pass && pass['item'] ? pass['item'] : ''"
          @click="handleActive(index)"
        >
          <span
            v-if="item.icon"
            :class="`${item.icon} me-3 fs-4`"
            section="icon"
            v-bind="pass && pass['icon'] ? pass['icon'] : ''"
          ></span>
          {{ item.label }}
        </div>
        <RouterLink
          v-if="isRouter"
          class="item d-flex justify-content-center align-items-center flex-grow-1 fs-5 fw-bolder"
          style="height: 100%; color: #fc6e48; cursor: pointer; padding: 20px; text-align: center"
          section="item"
          :active="item.active"
          v-bind="pass && pass['item'] ? pass['item'] : ''"
          :to="item.to"
          @click="handleActive(index)"
        >
          <span
            v-if="item.icon"
            :class="`${item.icon} me-3 fs-4`"
            section="icon"
            v-bind="pass && pass['icon'] ? pass['icon'] : ''"
          ></span>
          {{ item.label }}
        </RouterLink>
      </slot>
    </template>
    <slot name="end"></slot>
  </div>
</template>

<style scoped>
.item[section='item']:hover,
.item[active='true'] {
  background-color: #fc6e48;
  color: white !important;
  transition: 0.3s linear;
}
</style>
