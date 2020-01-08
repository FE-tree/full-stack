import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '../src/assets/style/normalize.css'

import { Toast, Loading, Dialog } from 'vant';
Vue.use(Toast)
Vue.use(Loading)
Vue.use(Dialog)

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')