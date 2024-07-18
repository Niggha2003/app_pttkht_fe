import OrderAddComponent from '@/components/control_components/order_components/OrderAddComponent.vue'
import OrderHomeComponent from '@/components/control_components/order_components/OrderHomeComponent.vue'
import OrderStatisticComponent from '@/components/control_components/order_components/OrderStatisticComponent.vue'

const orderComponents = [
  {
    name: 'list',
    com: OrderHomeComponent
  },
  {
    name: 'stc',
    com: OrderStatisticComponent
  },
  {
    name: 'add',
    com: OrderAddComponent
  }
]

export default {
  path: '/control/order/:place?',
  name: 'ordering',
  component: () => import('@/views/control_views/OrderView.vue'),
  props: (route) => {
    // khởi tạo component cho mỗi lần chạy link khác nhau
    let innerComponent
    const orderPlace = orderComponents.find(
      (element) => element.name && element.name == route.params.place
    )
    innerComponent = orderPlace.com
    return { ...route.params, innerComponent }
  }
}
