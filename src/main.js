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

import vClickOutside from "v-click-outside";
Vue.use(vClickOutside);
//
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
//
// const firebaseConfig = {
//   apiKey: "AIzaSyCrEl1SCEhfLe0lUtOOkGnu_Bl0rCx6Rew",
//   authDomain: "hydra-node-editor.firebaseapp.com",
//   projectId: "hydra-node-editor",
//   storageBucket: "hydra-node-editor.appspot.com",
//   messagingSenderId: "178368560077",
//   appId: "1:178368560077:web:7f95bc4d78a97b67e06284",
// };
//
// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);

// firebase.initializeApp(firebaseConfig);

import VueCompositionAPI from "@vue/composition-api";
Vue.use(VueCompositionAPI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
