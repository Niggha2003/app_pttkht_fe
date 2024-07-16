import WorkingHome from '@/components/control_components/working_components/WorkingHome.vue'
import WorkingStatistic from '@/components/control_components/working_components/WorkingStatistic.vue'
import WorkingBlacklist from '@/components/control_components/working_components/WorkingBlacklist.vue'

const workingComponents = [
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
    const workingPlace = workingComponents.find(
      (element) => element.name && element.name == route.params.place
    )
    innerComponent = workingPlace.com
    return { ...route.params, innerComponent }
  }
}
