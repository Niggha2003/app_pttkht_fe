import WorkingHome from '@/components/control_components/working/WorkingHome.vue'
import WorkingStatistic from '@/components/control_components/working/WorkingStatistic.vue'
import WorkingBlacklist from '@/components/control_components/working/WorkingBlacklist.vue'

const workingComponent = [
  {
    name: 'list',
    com: WorkingHome
  },
  {
    name: 'stc',
    com: WorkingStatistic
  },
  {
    name: 'bl',
    com: WorkingBlacklist
  }
]

export default {
  path: '/control/working/:place?',
  name: 'working',
  component: () => import('@/views/control_views/WorkingView.vue'),
  props: (route) => {
    // khởi tạo component cho mỗi lần chạy link khác nhau
    let innerComponent
    const workingPlace = workingComponent.find(
      (element) => element.name && element.name == route.params.place
    )
    innerComponent = workingPlace.com
    return { ...route.params, innerComponent }
  }
}
