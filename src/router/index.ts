import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import CreateNewUserView from '@/views/admin/CreateNewUserView.vue'
import UserServicesListView from '@/views/admin/UserServicesListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/HomeView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/dashboard/admin/create-user',
      name: 'create-user-page',
      component: CreateNewUserView,
    },
    {
      path: '/dashboard/:id/services',
      name: 'user-service-list',
      component: UserServicesListView,
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
