import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentHydraBackgroundString: {
      raw: "hydraInstance.osc()",
    },
  },
  mutations: {
    newHydraString(state, payload) {
      Vue.set(state.currentHydraBackgroundString, "raw", payload.string);
      // state.currentHydraBackgroundString = payload.string;
    },
  },
  actions: {},
  modules: {},
});
