<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
const defaultLayout = "default";

export default {
  components: {},
  name: "App",
  data() {
    return {};
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || defaultLayout) + "-layout";
    },
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
