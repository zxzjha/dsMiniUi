import App from './App'
import uView from '@/uni_modules/uview-ui'
import store from '@/store/index.js'  //引入vuex
import share from '@/lib/share.js'

// #ifndef VUE3
import Vue from 'vue'
App.mpType = 'app'

Vue.use(uView)
Vue.mixin(share)

Vue.prototype.$store = store
Vue.prototype.$EventBus = new Vue()
Vue.config.productionTip = false

const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif