<template>
  <div id="app">
    <pre v-if="isAuthenticated">{{ user }}</pre>
    <div v-else>
      <button @click="signIn">
        Sign In with Google
      </button>
    </div>
    <!--    <div id="nav">-->
    <!--      <router-link to="/">Home</router-link> |-->
    <!--      <router-link to="/about">About</router-link>-->
    <!--    </div>-->
    <router-view />
  </div>
</template>

<script>
import firebase from "firebase";
import useAuth from "@vueuse/firebase/useAuth";
const { useAuth: useAuthLocal } = useAuth
export default {
  components: {},
  name: "App",
  data() {
    return {};
  },
  setup() {
    const { GoogleAuthProvider } = firebase.auth;

    const { isAuthenticated, user } = useAuthLocal(firebase.auth);

    const signIn = () =>
      firebase.auth().signInWithPopup(new GoogleAuthProvider());

    return { isAuthenticated, user, signIn };
  },
};
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
}

#app {
  font-kerning: normal;
  font-family: "Arial Narrow", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
  font-variant-ligatures: common-ligatures;
}

#nav {
  position: fixed;
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
