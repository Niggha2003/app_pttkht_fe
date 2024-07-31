import FlightHomeComponent from '@/components/control_components/flight_components/FlightHomeComponent.vue'
import FlightStatisticComponent from '@/components/control_components/flight_components/FlightStatisticComponent.vue'
import FlightAddComponent from '@/components/control_components/flight_components/FlightAddComponent.vue'

const flightComponents = [
  {
    name: 'list',
    com: FlightHomeComponent
  },
  {
    name: 'stc',
    com: FlightStatisticComponent
  },
  {
    name: 'add',
    com: FlightAddComponent
  }
]

export default {
  path: '/control/flight/:place?',
  name: 'flight',
  component: () => import('@/views/control_views/ControlView.vue'),
  props: (route) => {
    // khởi tạo component cho mỗi lần chạy link khác nhau
    let innerComponent
    const flightPlace = flightComponents.find(
      (element) => element.name && element.name == route.params.place
    )
    innerComponent = flightPlace.com
    return { ...route.params, innerComponent }
  }
}
