<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { RouterLink } from 'vue-router'
import importImage from '@/helpers/importImage'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { MenuItemChange, MenuItemChildChange } from './menuList'

const store = useStore()
const user = store.state.user

const accountImg = importImage('user', user.photo)
const menu = ref(store.state.menu)

const handleOpenNavChild = (e) => {
  const childNav = e.target.nextElementSibling
  childNav.classList.toggle('show')
}

const handleMenuItemClick = (i) => {
  menu.value = MenuItemChange(menu.value, i)
  store.commit('changeMenu', menu.value)
}

const handleMenuItemChildClick = (index, childIndex) => {
  menu.value = MenuItemChildChange(menu.value, index, childIndex)
  store.commit('changeMenu', menu.value)
}

// const handleResizeMousedown = (e) => {
//   if (e.clientX < 3 + e.target.clientWidth && e.clientX > +e.target.clientWidth - 3) {
//     isResizing = true
//   } else {
//     return
//   }
// }

// onMounted(() => {
//   if (sidebar.value) {
//     window.addEventListener('mousemove', (e) => {
//       if (e.clientX < 3 + sidebar.value.clientWidth && e.clientX > +sidebar.value.clientWidth - 3) {
//         document.documentElement.style.cursor = 'ew-resize'
//       } else {
//         if (isResizing) {
//           document.documentElement.style.cursor = 'ew-resize'
//           sidebar.value.style.width = `${e.clientX}px`
//         } else {
//           document.documentElement.style.cursor = 'default'
//         }
//       }
//     })

//     window.addEventListener('mouseup', (e) => {
//       if (isResizing) {
//         isResizing = false
//         document.documentElement.style.cursor = 'default'
//         sidebar.value.style.width = `${e.clientX}px`
//       } else {
//         return
//       }
//     })
//   }
// })
</script>

<template>
  <!-- <div class="wrapper d-flex align-items-stretch"> -->
  <nav id="sidebar">
    <div class="">
      <a class="img logo rounded-circle mb-2" :style="`background-image: url(${accountImg})`"></a>
      <div class="text-center mb-6 fs-5 fw-bolder" style="color: #c0c6ca">{{ user.name }}</div>
      <ul class="list-unstyled components mb-5">
        <template v-for="(menuItem, index) in menu" :key="index">
          <li
            :class="menuItem.active === true ? 'active' : ''"
            v-if="menuItem.show === true"
            @click="
              () => {
                handleMenuItemClick(index)
              }
            "
          >
            <a
              v-if="menuItem.listChild.length > 0"
              data-toggle="collapse"
              aria-expanded="false"
              class="dropdown-toggle"
              @click.prevent="handleOpenNavChild"
            >
              <font-awesome-icon class="me-1" :icon="menuItem.icon" /> {{ menuItem.name }}
            </a>
            <a @click.prevent v-else
              ><font-awesome-icon class="me-1" :icon="menuItem.icon" /> {{ menuItem.name }}</a
            >
            <ul
              v-if="menuItem.listChild.length > 0"
              :class="`collapse list-unstyled ${menuItem.opened ? 'show' : ''}`"
            >
              <li
                v-for="(menuItemChild, childIndex) in menuItem.listChild"
                :key="childIndex"
                :class="menuItemChild.active === true ? 'active' : ''"
                @click.stop.prevent="
                  () => {
                    handleMenuItemChildClick(index, childIndex)
                  }
                "
              >
                <router-link
                  :to="menuItemChild.to"
                  style="display: flex; align-items: center; justify-content: space-between"
                >
                  <div>
                    <font-awesome-icon :icon="menuItemChild.icon" class="me-1" />
                    {{ menuItemChild.name }}
                  </div>

                  <font-awesome-icon
                    :class="menuItemChild.active === true ? '' : 'd-none'"
                    :icon="faCircle"
                    style="width: 8px; height: 8px"
                  />
                </router-link>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </div>
  </nav>
  <!-- </div> -->
</template>
