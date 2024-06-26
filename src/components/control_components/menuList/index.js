import {
  faPeopleGroup,
  faFolder,
  faFileContract,
  faAddressBook
} from '@fortawesome/free-solid-svg-icons'

import { faList, faChartSimple, faBan } from '@fortawesome/free-solid-svg-icons'

const menu = [
  {
    name: 'Quản lí lao động',
    active: false,
    opened: false,
    type: 'working',
    icon: faPeopleGroup,
    show: true,
    listChild: [
      {
        name: 'Danh sách lao động',
        active: false,
        icon: faList,
        to: {
          name: 'working',
          params: {
            place: 'list'
          }
        }
      },
      {
        name: 'Thống kê lao động',
        active: false,
        icon: faChartSimple,
        to: {
          name: 'working',
          params: {
            place: 'stc'
          }
        }
      },
      {
        name: 'Danh sách đen lao động',
        active: false,
        icon: faBan,
        to: {
          name: 'working',
          params: {
            place: 'bl'
          }
        }
      }
    ]
  },
  {
    name: 'Quản lí đơn hàng',
    active: false,
    show: true,
    opened: false,
    type: 'ordering',
    icon: faFolder,
    listChild: []
  },
  {
    name: 'Quản lí đơn đăng kí',
    active: false,
    show: true,
    opened: false,
    type: 'signing',
    icon: faFileContract,
    listChild: []
  },
  {
    name: 'Danh sách người dùng',
    active: false,
    show: true,
    opened: false,
    type: 'employee',
    icon: faAddressBook,
    listChild: []
  }
]

export const MenuItemChange = (menu, i) => {
  menu.forEach((menuItem) => {
    menuItem.active = false
    if (menuItem != menu[i]) {
      menuItem.listChild.forEach((child) => {
        child.active = false
      })
    }
  })
  menu[i].active = true
  menu[i].opened = !menu[i].opened
  return menu
}

export const MenuItemChildChange = (menu, index, childIndex) => {
  menu.forEach((menuItem) => {
    menuItem.active = false
    if (menuItem != menu[index]) {
      menuItem.listChild.forEach((child) => {
        child.active = false
      })
    }
  })
  menu[index].opened = true
  menu[index].active = true
  menu[index].listChild.forEach((child) => {
    child.active = false
  })

  menu[index].listChild[childIndex].active = true
  return menu
}

export default menu
