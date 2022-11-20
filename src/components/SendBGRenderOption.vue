<template>
  <div @click="toggleHeight = !toggleHeight">
    <!--    <CodeOption :value="currentHydraCodeString" :readonly="true"></CodeOption>-->
    <!--    <p>{{ currentHydraCodeString }}</p>-->
    <prism-editor
      class="my-editor, input-user-select"
      v-model="readableHydraString"
      :highlight="highlighter"
      line-numbers
      v-bind:readonly="true"
      :style="toggleHeightStyle"
    ></prism-editor>
  </div>
</template>

<script>
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles

export default {
  components: { PrismEditor },
  name: "SendBGRenderOption",
  props: ["name", "value"],
  data() {
    return {
      currentHydraCodeString: "default",
      toggleHeight: true,
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
          .replaceAll(/hydraInstance/gm, "")
          .replaceAll(").", ")\n.");
      } catch (err) {
        console.log("No Content Available: ", err);
      }
    },
    highlighter(code) {
      return highlight(code, languages.js, "markup"); // languages.<insert language> to return html with markup
    },
  },
  computed: {
    readableHydraString: function () {
      return this.toggleHeight ? "Expand" : this.cleanupReadable(this.value);
    },
    toggleHeightStyle: function () {
      return {
        maxHeight: this.toggleHeight ? "0.8rem" : "50rem",
      };
    },
  },
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

<style scoped>
.my-editor {
  transition: max-height 0.3s ease-in-out;
}
</style>
