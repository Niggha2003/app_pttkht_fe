import {
  faPeopleGroup,
  faFolder,
  faFileContract,
  faAddressBook,
  faPager,
  faList,
  faChartSimple,
  faBan,
  faUserPlus,
  faFolderPlus,
  faNewspaper,
  faPlane
} from '@fortawesome/free-solid-svg-icons'

const menu = [
  {
    name: 'Quản lí lao động',
    active: false,
    opened: false,
    type: 'working',
    icon: faPeopleGroup,
    show: false,
    role: 'working',
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
    show: false,
    opened: false,
    type: 'ordering',
    icon: faFolder,
    role: 'ordering',
    listChild: [
      {
        name: 'Danh sách đơn hàng',
        active: false,
        icon: faList,
        to: {
          name: 'ordering',
          params: {
            place: 'list'
          }
        }
      },
      {
        name: 'Thống kê đơn hàng',
        active: false,
        icon: faChartSimple,
        to: {
          name: 'ordering',
          params: {
            place: 'stc'
          }
        }
      },
      {
        name: 'Tạo đơn hàng mới',
        active: false,
        icon: faFolderPlus,
        to: {
          name: 'ordering',
          params: {
            place: 'add'
          }
        }
      }
    ]
  },
  {
    name: 'Quản lí tin tức',
    active: false,
    show: false,
    opened: false,
    type: 'news',
    role: 'ordering',
    icon: faNewspaper,
    listChild: [
      {
        name: 'Danh sách tin tức',
        active: false,
        icon: faList,
        to: {
          name: 'news',
          params: {
            place: 'list'
          }
        }
      },
      {
        name: 'Thống kê tin tức',
        active: false,
        icon: faChartSimple,
        to: {
          name: 'news',
          params: {
            place: 'stc'
          }
        }
      },
      {
        name: 'Tạo tin tức mới',
        active: false,
        icon: faFolderPlus,
        to: {
          name: 'news',
          params: {
            place: 'add'
          }
        }
      }
    ]
  },
  {
    name: 'Quản lí vé máy bay',
    active: false,
    show: false,
    opened: false,
    type: 'flight',
    icon: faPlane,
    role: 'ordering',
    listChild: [
      {
        name: 'Danh sách vé máy bay',
        active: false,
        icon: faList,
        to: {
          name: 'flight',
          params: {
            place: 'list'
          }
        }
      },
      {
        name: 'Thống kê vé máy bay',
        active: false,
        icon: faChartSimple,
        to: {
          name: 'flight',
          params: {
            place: 'stc'
          }
        }
      },
      {
        name: 'Tạo vé máy bay mới',
        active: false,
        icon: faFolderPlus,
        to: {
          name: 'flight',
          params: {
            place: 'add'
          }
        }
      }
    ]
  },
  {
    name: 'Quản lí đơn đăng kí',
    active: false,
    show: false,
    opened: false,
    type: 'signing',
    role: 'signing',
    icon: faFileContract,
    listChild: [
      {
        name: 'Danh sách đơn đăng kí',
        active: false,
        icon: faList,
        to: {
          name: 'signing',
          params: {
            place: 'list'
          }
        }
      },
      {
        name: 'Thống kê đơn đăng kí',
        active: false,
        icon: faChartSimple,
        to: {
          name: 'signing',
          params: {
            place: 'stc'
          }
        }
      },
      {
        name: 'Đơn đăng kí bị loại',
        active: false,
        icon: faBan,
        to: {
          name: 'signing',
          params: {
            place: 'bl'
          }
        }
      }
    ]
  },
  {
    name: 'Danh sách người dùng',
    active: false,
    show: false,
    opened: false,
    type: 'employee',
    icon: faAddressBook,
    role: 'admin',
    listChild: [
      {
        name: 'Danh sách tài khoản',
        active: false,
        icon: faList,
        to: {
          name: 'employee',
          params: {
            place: 'list'
          }
        }
      },
      {
        name: 'Thống kê tài khoản',
        active: false,
        icon: faChartSimple,
        to: {
          name: 'employee',
          params: {
            place: 'stc'
          }
        }
      },
      {
        name: 'Tạo tài khoản mới',
        active: false,
        icon: faUserPlus,
        to: {
          name: 'employee',
          params: {
            place: 'add'
          }
        }
      }
    ]
  },
  {
    name: 'Xem trang web',
    active: false,
    show: false,
    opened: false,
    type: 'web',
    role: 'ordering',
    icon: faPager,
    to: { name: 'home_page' },
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

export const MenuItemReset = (menu) => {
  menu.forEach((menuItem) => {
    menuItem.active = false
    menuItem.opened = false
    menuItem.listChild.forEach((child) => {
      child.active = false
    })
  })
  return menu
}

export const MenuShowItem = (menu, items = []) => {
  menu.forEach((menuItem) => {
    menuItem.show = false
  })
  items.forEach((item) => {
    menu.forEach((menuItem, index) => {
      if (menuItem.role == item) {
        menu[index].show = true
      }
    })
  })
  return menu
}

export default menu
