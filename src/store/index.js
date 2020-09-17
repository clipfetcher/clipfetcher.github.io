import Vue from 'vue'
import Vuex from 'vuex'
import PersistedState from 'vuex-persistedstate'

import auth from './module/auth'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth
    },
    plugins: [PersistedState({
        storage: window.localStorage,
        reducer(val) {
            return {
                // 只儲存特定 module
                auth: val.auth
            }
        }
    })]
});
