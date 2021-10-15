import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentHydraBackgroundString: "hydraInstance.osc()",
  },
  mutations: {
    newHydraString (state, payload) {
      state.currentHydraBackgroundString = payload.string;
    }
  },
  actions: {},
  modules: {},
});
