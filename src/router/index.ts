import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuth } from '../composables/useAuth'

// Main Views
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import OtpVerificationView from '../views/OtpVerificationView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import NotFoundView from '../views/NotFoundView.vue'

// Dashboard Sub-Views
import UrlShortenerView from '../views/dashboard/UrlShortenerView.vue'
import UrlSaverView from '../views/dashboard/UrlSaverView.vue'
import QrGeneratorView from '../views/dashboard/QrGeneratorView.vue'
import ExpiringUrlView from '../views/dashboard/ExpiringUrlView.vue'
import ExpiringQrView from '../views/dashboard/ExpiringQrView.vue'
import AnalyticsView from '../views/dashboard/AnalyticsView.vue'
import ProfileView from '../views/dashboard/ProfileView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/otp-verification',
    name: 'OtpVerification',
    component: OtpVerificationView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard/shortener',
      },
      {
        path: 'shortener',
        name: 'DashboardUrlShortener',
        component: UrlShortenerView,
      },
      {
        path: 'saver',
        name: 'DashboardUrlSaver',
        component: UrlSaverView,
      },
      {
        path: 'qr-generator',
        name: 'DashboardQrGenerator',
        component: QrGeneratorView,
      },
      {
        path: 'expiring-url',
        name: 'DashboardExpiringUrl',
        component: ExpiringUrlView,
      },
      {
        path: 'expiring-qr',
        name: 'DashboardExpiringQr',
        component: ExpiringQrView,
      },
      {
        path: 'analytics',
        name: 'DashboardAnalytics',
        component: AnalyticsView,
      },
      {
        path: 'profile',
        name: 'DashboardProfile',
        component: ProfileView,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
