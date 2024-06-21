import WorkingHome from '@/components/working/WorkingHome.vue'
import WorkingBlacklist from '@/components/working/WorkingBlacklist.vue'
import WorkingStatistic from '@/components/working/WorkingStatistic.vue'

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
  path: '/working/:place?',
  name: 'working',
  component: () => import('@/views/WorkingView.vue'),
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
