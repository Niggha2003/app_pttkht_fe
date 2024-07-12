export default [
  {
    path: '/',
    name: 'home_page',
    component: () => import('@/views/home_page_views/HP_HomeView.vue')
  },
  {
    path: '/intro',
    name: 'hp_intro_view',
    component: () => import('@/views/home_page_views/HP_IntroView.vue')
  },
  {
    path: '/order/:orderId?',
    name: 'hp_order_view',
    component: () => import('@/views/home_page_views/HP_OrderView.vue'),
    props: (route) => {
      return { ...route.params }
    }
  },
  {
    path: '/form/:orderCode?',
    name: 'hp_form_view',
    component: () => import('@/views/home_page_views/HP_FormView.vue'),
    props: (route) => {
      return { ...route.params }
    }
  },
  {
    path: '/news/:isForeign?/:newsId?',
    name: 'hp_news_view',
    component: () => import('@/views/home_page_views/HP_NewsView.vue'),
    props: (route) => {
      return { ...route.params }
    }
  }
]
