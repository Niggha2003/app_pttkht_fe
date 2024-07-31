import workingRoute from './controlChildrenRoutes/workingRoute'
import accountRoute from './controlChildrenRoutes/accountRoute'
import orderRoute from './controlChildrenRoutes/orderRoute'
import signingRoute from './controlChildrenRoutes/signingRoute'
import newsRoute from './controlChildrenRoutes/newsRoute'
import flightRoute from './controlChildrenRoutes/flightRoute'

export default [
  {
    path: '/control',
    name: 'home',
    component: () => import('@/views/control_views/HomeView.vue')
  },
  workingRoute,
  accountRoute,
  orderRoute,
  signingRoute,
  newsRoute,
  flightRoute
]
