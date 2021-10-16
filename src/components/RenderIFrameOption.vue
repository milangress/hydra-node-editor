<template>
  <div class="hydra-canvas-container" ref="hydraCanvasContainer">
    <iframe :src="currentIframeUrl" class="hydraIframe" scrolling="no"></iframe>
    <p>{{ currentHydraCodeString }}</p>
  </div>
</template>

<script>
export default {
  components: {},
  name: "RenderIFrameOption",
  props: ["name", "value"],
  data() {
    return {
      currentHydraCodeString: "default",
      currentHydraBase64CodeString: String,
      hydra: false,
    };
  },
  mounted() {},
  methods: {
    updateCanvas: function (code) {
      const codestring = this.cleanup(code);
      console.log("Hydra eval: ", codestring);
      eval(codestring);
    },
    cleanup: function (code, hydraInstance = "this.hydra.synth") {
      //const codestring = `this.hydra.synth.${code.toString()}.out()`
      const codestring = code
        .toString()
        .replaceAll(/(?<!hydraInstance.)osc/gm, "hydraInstance.osc")
        .replaceAll(/\.hydraInstance/gm, hydraInstance)
        .replaceAll(/hydraInstance/gm, hydraInstance);
      const finalCodeString = codestring + ".out()";
      // console.log("Hydra eval: ", finalCodeString);
      return finalCodeString;
      // eval(finalCodeString)
    },
    cleanupReadable: function (code) {
      if (code) {
        return (
          code
            .toString()
            .replaceAll(/\.hydraInstance/gm, "")
            .replaceAll(/hydraInstance./gm, "")
            .replaceAll("hydraInstance", "")
            .replaceAll("..", ".") + ".out()"
        );
      } else console.error("no Data ", code);
    },
    encodeBase64: (text) => btoa(encodeURIComponent(text)),
  },
  computed: {
    canvasWidth: function () {
      return this.$refs.hydraCanvasContainer.getBoundingClientRect().width;
    },
    canvasHeight: function () {
      return this.canvasWidth / 1.5;
    },
    currentIframeUrl: function () {
      return `/iFrameGen/${this.currentHydraBase64CodeString}`;
    },
  },
  watch: {
    value: {
      // the callback will be called immediately after the start of the observation
      /*immediate: true,*/
      handler(val) {
        // this.currentHydraCodeString = this.cleanupReadable(val);
        this.currentHydraCodeString = this.cleanupReadable(val);
        this.currentHydraBase64CodeString = this.encodeBase64(this.currentHydraCodeString);
      },
    },
  },
};
</script>

<style scoped>
.hydraIframe {
  border: none;
  overflow: hidden;
}
</style>
