const menu = [
  {
    name: 'Quản lí lao động',
    active: false,
    opened: false,
    type: 'working',
    show: true,
    listChild: [
      {
        name: 'Danh sách lao động',
        active: false,
        to: {
          name: 'working',
          params: {
            place: 'list'
          }
        }
      },
      {
        name: 'Năng suất lao động',
        active: false,
        to: {
          name: 'working',
          params: {
            place: 'ef'
          }
        }
      },
      {
        name: 'Thống kê lao động',
        active: false,
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
    listChild: []
  },
  {
    name: 'Quản lí đơn đăng kí',
    active: false,
    show: true,
    opened: false,
    type: 'signing',
    listChild: []
  },
  {
    name: 'Quản lí đào tạo',
    active: false,
    show: true,
    opened: false,
    type: 'training',
    listChild: []
  },
  {
    name: 'Danh sách người dùng',
    active: false,
    show: true,
    opened: false,
    type: 'employee',
    listChild: []
  }
]

export default menu
