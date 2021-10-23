<template>
  <div id="app">
    <nav class="auth-header">
      <pre v-if="isAuthenticated">{{ user.displayName }}</pre>
      <div v-else>
        <button @click="signIn">
          Sign In with Google
        </button>
      </div>
    </nav>
    <!--    <div id="nav">-->
    <!--      <router-link to="/">Home</router-link> |-->
    <!--      <router-link to="/about">About</router-link>-->
    <!--    </div>-->
    <slot></slot>
  </div>
</template>

<script>
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase"

import { useAuth } from "@vueuse/firebase/useAuth";
export default {
  components: {},
  name: "Default",
  data() {
    return {};
  },
  setup() {
    const provider = new GoogleAuthProvider();

    const { isAuthenticated, user } = useAuth(auth);

    const signIn = () => signInWithPopup(auth, provider);

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
.auth-header {
  position: fixed;
  top: 20px;
  left: 20px;
}
</style>
