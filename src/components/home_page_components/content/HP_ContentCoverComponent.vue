<script setup>
const props = defineProps(['title', 'icon'])

const title = props.title
const icon = props.icon
</script>

<template>
  <div class="card menu_cover">
    <div class="menu_cover__title--main fw-bolder fs-5">
      <span :class="`${icon} me-2 fs-5`"></span>
      {{ title }}
    </div>
    <div class="menu_cover__title--transparent fs-5 fw-bolder">
      <span :class="`${icon} me-2 fs-5`"></span>
      {{ title }}
      <div class="menu_cover__line--left"></div>
      <div class="menu_cover__line--right"></div>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.menu_cover {
  margin: auto;
  position: relative;
  padding-top: 70px;
}

.menu_cover__title--main {
  padding: 5px 20px;
  position: absolute;
  background-color: rgb(252, 93, 93);
  left: 30px;
  min-width: 200px;
  z-index: 3;
  border-radius: 50px;
  top: 0;
  transform: translateY(50%);
  color: white;
  text-align: center;
  text-transform: uppercase;
}

.menu_cover__title--transparent {
  padding: 5px 20px;
  position: absolute;
  background-color: transparent;
  left: 30px;
  min-width: 200px;
  z-index: 2;
  color: transparent;
  top: 0;
  transform: translateY(50%);
  text-transform: uppercase;
}

.menu_cover__line--left::before {
  content: '';
  width: 30px;
  height: 35px;
  position: absolute;
  background-color: white;
  border-bottom-left-radius: 18px;
  top: -51%;
  left: 5px;
  z-index: 1;
  transform: translateX(-50%);
}

.menu_cover__line--left::after {
  content: '';
  width: 30px;
  height: 35px;
  position: absolute;
  background-color: rgb(252, 93, 93);
  border-bottom-left-radius: 18px;
  top: -50%;
  left: 5px;
  transform: translateX(-100%);
}

.menu_cover__line--right::after {
  content: '';
  width: 30px;
  height: 35px;
  position: absolute;
  background-color: white;
  border-bottom-right-radius: 18px;
  top: -51%;
  right: 5px;
  transform: translateX(50%);
  z-index: 1;
}

.menu_cover__line--right::before {
  content: '';
  width: 30px;
  height: 35px;
  position: absolute;
  background-color: rgb(252, 93, 93);
  border-bottom-right-radius: 18px;
  top: -50%;
  right: 5px;
  transform: translateX(100%);
}
</style>
