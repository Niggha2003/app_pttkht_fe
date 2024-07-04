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
    path: '/order',
    name: 'hp_order_view',
    component: () => import('@/views/home_page_views/HP_OrderView.vue')
  },
  {
    path: '/form',
    name: 'hp_form_view',
    component: () => import('@/views/home_page_views/HP_FormView.vue')
  }
]
