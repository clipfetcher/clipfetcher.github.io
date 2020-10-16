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

new Vue({
  created() {
    const html = document.documentElement // returns the html tag
    html.setAttribute('lang', 'zh-Hant')
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
