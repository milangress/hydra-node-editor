<template>
  <div>
    <p>{{ currentHydraCodeString }}</p>
  </div>
</template>

<script>
/*import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { Engine } from "@baklavajs/plugin-engine";*/

export default {
  components: {},
  name: "SendBGRenderOption",
  props: ["name", "value"],
  data() {
    return {
      currentHydraCodeString: "default",
    };
  },
  mounted() {},
  methods: {
    cleanup: function (code, hydraInstance = "this.hydra.synth") {
      //const codestring = `this.hydra.synth.${code.toString()}.out()`
      const codestring = code
        .toString()
        .replaceAll(/(?<!hydraInstance)\.osc/gm, "hydraInstance.osc")
        .replaceAll(/hydraInstance/gm, hydraInstance);
      const finalCodeString = codestring + ".out()";
      console.log("Hydra eval: ", finalCodeString);
      return finalCodeString;
      // eval(finalCodeString)
    },
    cleanupReadable: function (code) {
      try {
        return code
          .replaceAll(/\.hydraInstance/gm, "")
          .replaceAll(/hydraInstance/gm, "");
      } catch (err) {
        console.log('No Content Available: ',err);
      }
    },
  },
  computed: {},
  watch: {
    value: {
      // the callback will be called immediately after the start of the observation
      /*immediate: true,*/
      handler(val) {
        this.$store.commit({
          type: "newHydraString",
          string: val,
        });
        this.currentHydraCodeString = this.cleanupReadable(val);
      },
    },
  },
};
</script>

<style scoped></style>
