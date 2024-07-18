import workingRoute from './controlChildrenRoutes/workingRoute'
import accountRoute from './controlChildrenRoutes/accountRoute'
import orderRoute from './controlChildrenRoutes/orderRoute'

export default [
  {
    path: '/control',
    name: 'home',
    component: () => import('@/views/control_views/HomeView.vue')
  },
  workingRoute,
  accountRoute,
  orderRoute
]
