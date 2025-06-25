import { createStore } from "vuex";

export default createStore({
  state: {
    authData: "",
  },
  getters: {},
  mutations: {
    login(state, authData) {
      state.authData = authData;
      localStorage.setItem("user-info", JSON.stringify(authData));
    },
    logout(state) {
      state.authData = "";
      localStorage.removeItem("user-info");
    },
  },
  actions: {},
  modules: {},
});
