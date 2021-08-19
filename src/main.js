import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import { BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";
import "@baklavajs/plugin-renderer-vue/dist/styles.css";
// import "@/css/baklavaOverwrites.css";

Vue.use(BaklavaVuePlugin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
