import SigningHomeComponent from '@/components/control_components/signing_components/SigningHomeComponent.vue'
import SigningStatisticComponent from '@/components/control_components/signing_components/SigningStatisticComponent.vue'
import SigningBlackListComponent from '@/components/control_components/signing_components/SigningBlackListComponent.vue'

const signingComponents = [
  {
    name: 'list',
    com: SigningHomeComponent
  },
  {
    name: 'stc',
    com: SigningStatisticComponent
  },
  {
    name: 'bl',
    com: SigningBlackListComponent
  }
]

export default {
  path: '/control/signing/:place?',
  name: 'signing',
  component: () => import('@/views/control_views/SigningView.vue'),
  props: (route) => {
    // khởi tạo component cho mỗi lần chạy link khác nhau
    let innerComponent
    const signingPlace = signingComponents.find(
      (element) => element.name && element.name == route.params.place
    )
    innerComponent = signingPlace.com
    return { ...route.params, innerComponent }
  }
}
