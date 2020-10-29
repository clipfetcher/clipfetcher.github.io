import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/my.css'
import store from './store/index'

Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (store.state.auth.isLogin) {
      const api = `${process.env.VUE_APP_ROOT_API}/api/admin/users`;
      axios.get(api, {
        params: {
          token: store.state.auth.token,
        },
      })
        .then(() => {
          next();
        })
        .catch(() => {
          store.dispatch("auth/setAuth", {
            token: "",
            isLogin: false,
          });
          next({
            path: '/',
          })
        });
    } else {
      next({
        path: '/',
      })
    }
  } else {
    if (store.state.auth.isLogin) {
      const api2 = `${process.env.VUE_APP_ROOT_API}/api/user`;
      axios.get(api2, {
        params: {
          token: store.state.auth.token,
        },
      })
        .catch(() => {
          store.dispatch("auth/setAuth", {
            token: "",
            isLogin: false,
          });
        });
    }
    next();
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
