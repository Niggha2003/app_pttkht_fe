import NewsHomeComponent from '@/components/control_components/news_components/NewsHomeComponent.vue'
import NewsStatisticComponent from '@/components/control_components/news_components/NewsStatisticComponent.vue'
import NewsAddComponent from '@/components/control_components/news_components/NewsAddComponent.vue'

const newsComponents = [
  {
    name: 'list',
    com: NewsHomeComponent
  },
  {
    name: 'stc',
    com: NewsStatisticComponent
  },
  {
    name: 'add',
    com: NewsAddComponent
  }
]

export default {
  path: '/control/news/:place?',
  name: 'news',
  component: () => import('@/views/control_views/ControlView.vue'),
  props: (route) => {
    // khởi tạo component cho mỗi lần chạy link khác nhau
    let innerComponent
    const newsPlace = newsComponents.find(
      (element) => element.name && element.name == route.params.place
    )
    innerComponent = newsPlace.com
    return { ...route.params, innerComponent }
  }
}
