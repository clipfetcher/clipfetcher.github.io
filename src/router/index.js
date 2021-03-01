import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/axios',
    name: 'Axios',
    component: () => import('../views/Axios.vue')
  },
  {
    path: '/',
    name: 'Demo',
    component: () => import('../views/Demo.vue')
  },
  {
    path: '/test',
    name: 'TestComponent',
    component: () => import('../views/TestComponent.vue'),
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    component: () => import('../views/TermsOfService.vue')
  },
  {
    path: '/privacy-notice',
    name: 'PrivacyNotice',
    component: () => import('../views/PrivacyNotice.vue')
  },
  {
    path: '/update-log',
    name: 'UpdateLog',
    component: () => import('../views/UpdateLog.vue')
  },
  {
    path: '/highlight/:highlight_id',
    name: 'Highlight',
    component: () => import('../views/Highlight.vue'),
    props: true,
  },
  {
    path: '/results',
    name: 'HighlightSearch',
    component: () => import('../views/HighlightSearch.vue')
  },
  {
    path: '/clip',
    name: 'Quick30',
    component: () => import('../views/Quick30ClipGenerater.vue'),
    // 判斷是否為管理員
    meta: { requiresAuth: true },
  },
  {
    path: '/verify/:verify_token',
    name: 'AccountVerify',
    component: () => import('../views/AccountVerify.vue'),
    props: true,
  },
  {
    path: '/newPassword/:forgetPassword_token',
    name: 'NewPassword',
    component: () => import('../views/NewPassword.vue'),
    props: true,
  },
  {
    path: '/admin',
    component: () => import('../views/Admin.vue'),
    children: [
      {
        path: '',
        components: {
          account: () => import('../views/AdminComponents/Account.vue'),
          analysis: () => import('../views/AdminComponents/Analysis.vue'),
          appraise: () => import('../views/AdminComponents/Appraise.vue'),
        },
        // 判斷是否為管理員
        meta: { requiresAuth: true },
      }
    ],
  },
  { path: '/404', component: () => import('../views/NotFoundComponent.vue'), },
  { path: '*', redirect: '/404' }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
