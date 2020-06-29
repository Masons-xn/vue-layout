import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store/store"
import i18n from "./i18n/i18n"

Vue.config.productionTip = false
import "./config/init"
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app")
