import AccountHomeComponent from '@/components/control_components/account_components/AccountHomeComponent.vue'
import AccountAddComponent from '@/components/control_components/account_components/AccountAddComponent.vue'
import AccountStatisticComponent from '@/components/control_components/account_components/AccountStatisticComponent.vue'

const accountComponents = [
  {
    name: 'list',
    com: AccountHomeComponent
  },
  {
    name: 'stc',
    com: AccountStatisticComponent
  },
  {
    name: 'add',
    com: AccountAddComponent
  }
]

export default {
  path: '/control/account/:place?',
  name: 'employee',
  component: () => import('@/views/control_views/ControlView.vue'),
  props: (route) => {
    // khởi tạo component cho mỗi lần chạy link khác nhau
    let innerComponent
    const accountPlace = accountComponents.find(
      (element) => element.name && element.name == route.params.place
    )
    innerComponent = accountPlace.com
    return { ...route.params, innerComponent }
  }
}
