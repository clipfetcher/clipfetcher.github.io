import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    alias: '/aboutme'
  },
  {
    path: '/news',
    name: 'News',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "news" */ '../views/News.vue')
  },
  {
    path: '/axios',
    name: 'Axios',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "axios" */ '../views/Axios.vue')
  },
  {
    path: '/player/:uid',
    name: 'Player',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "player" */ '../views/Player.vue'),
    children: [
      {
        path: 'profile',
        component: () => import(/* webpackChunkName: "player/profile" */ '../views/Player/Profile.vue'),
      }
    ]
  },
  {
    path: '/first',
    redirect: '/player/1'
    //redirect: { name: 'About' },
    //redirect: '/about'
  },
  {
    path: '/multiple',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Multiple" */ '../views/Multiple.vue'),
    children: [
      {
        path: '',
        components: {
          myHeader: () => import(/* webpackChunkName: "Header" */ '../views/multi/Header.vue'),
          mySidebar: () => import(/* webpackChunkName: "Sidebar" */ '../views/multi/Sidebar.vue')
        }
      }
    ]
  },
  {
    path: '/user/:uid',
    name: 'User',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user" */ '../views/User.vue'),
    props: true,
  },
  {
    path: '/',
    name: 'Demo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "news" */ '../views/Demo.vue')
  },
  {
    path: '/test',
    name: 'TestComponent',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "news" */ '../views/TestComponent.vue'),
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "news" */ '../views/TermsOfService.vue')
  },
  {
    path: '/privacy-notice',
    name: 'PrivacyNotice',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "news" */ '../views/PrivacyNotice.vue')
  },
  {
    path: '/highlight/:highlight_id',
    name: 'Highlight',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Highlight.vue'),
    props: true,
  },
  {
    path: '/results',
    name: 'HighlightSearch',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/HighlightSearch.vue')
  },
  {
    path: '/verify/:verify_token',
    name: 'AccountVerify',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AccountVerify.vue'),
    props: true,
  },
  {
    path: '/newPassword/:forgetPassword_token',
    name: 'NewPassword',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/NewPassword.vue'),
    props: true,
  },
  {
    path: '/admin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Admin.vue'),
    children: [
      {
        path: '',
        components: {
          account: () => import(/* webpackChunkName: "account" */ '../views/AdminComponents/Account.vue'),
          analysis: () => import(/* webpackChunkName: "analysis" */ '../views/AdminComponents/Analysis.vue'),
          appraise: () => import(/* webpackChunkName: "appraise" */ '../views/AdminComponents/Appraise.vue'),
        },
        // 判斷是否為管理員
        meta: { requiresAuth: true },
      }
    ],
  },
  { path: '/404', component: () => import(/* webpackChunkName: "user" */ '../views/NotFoundComponent.vue'), },
  { path: '*', redirect: '/404' }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
