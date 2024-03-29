<template>
  <div
    class="hydra-canvas-container"
    ref="hydraCanvasContainer"
    @click="startStopCanvas"
  >
    <iframe
      @load="onLoadIFrame"
      :src="currentIframeUrl"
      class="hydraIframe"
      scrolling="no"
      :style="{ height: canvasHeight + 'px', width: canvasWidth + 'px' }"
    ></iframe>
    <div class="hydra-text">{{ currentHydraCodeInfo }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  name: "RenderIFrameOption",
  props: ["name", "value"],
  data() {
    return {
      currentHydraCodeString: "none",
      currentHydraBase64CodeString: String,
      canvasVisible: true,
      contentWindow: null,
      backupStringWhilePaused: undefined,
    };
  },
  mounted() {
    console.log("mounted", this.name, this.value);
    this.currentHydraCodeString = this.cleanupReadable(this.value);
    this.currentHydraBase64CodeString = this.encodeBase64(
      this.currentHydraCodeString
    );
  },
  methods: {
    startStopCanvas() {
      if (this.canvasVisible) {
        this.backupStringWhilePaused = this.currentHydraCodeString;
      } else {
        this.currentHydraCodeString = this.backupStringWhilePaused;
      }
      this.currentHydraBase64CodeString = this.encodeBase64(
        this.currentHydraCodeString
      );
      this.canvasVisible = !this.canvasVisible;
    },
    onLoadIFrame() {
      console.log("onLoadIFrame");
      const iframe = this.$refs.hydraCanvasContainer.querySelector("iframe");
      console.log("iframe", iframe);
      const iWindow = iframe.contentWindow;
      iWindow.postMessage("Hello from parent", "*");
      this.contentWindow = iWindow;
      this.contentWindow.postMessage(
        {
          hydraString: this.currentHydraCodeString,
        },
        "*"
      );
    },
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
      // return this.$refs.hydraCanvasContainer.getBoundingClientRect().width;
      return 300;
    },
    currentIframeUrl: function () {
      return this.canvasVisible
        ? `/iFrameGen/${this.currentHydraBase64CodeString}/?width=${this.canvasWidth}&height=${this.canvasHeight}`
        : "";
    },
    currentHydraCodeInfo: function () {
      return this.canvasVisible ? this.currentHydraCodeString : "Paused";
    },
    canvasHeight: function () {
      if (this.$attrs.option.height) {
        return this.$attrs.option.height;
      } else {
        return this.canvasWidth / (16 / 10);
      }
    },
  },
  watch: {
    value: {
      // the callback will be called immediately after the start of the observation
      /*immediate: true,*/
      handler(val) {
        // this.currentHydraCodeString = this.cleanupReadable(val);
        this.currentHydraCodeString = this.cleanupReadable(val);
        if (this.contentWindow) {
          this.contentWindow.postMessage(
            {
              hydraString: this.currentHydraCodeString,
            },
            "*"
          );
        } else {
          console.log(
            "could not send message to iframe",
            this.currentHydraCodeString
          );
        }

        // this.currentHydraBase64CodeString = this.encodeBase64(
        //   this.currentHydraCodeString
        // );
      },
    },
  },
};
</script>

<style scoped>
.hydra-canvas-container:hover::before {
  background-color: blue;
  content: "Start/Stop";
  left: 0;
  top: 30%;
  position: fixed;
  font-size: 2em;
  z-index: 1;
  color: white;
  width: 100%;
  display: inline-block;
  mix-blend-mode: difference;
}

.hydraIframe {
  border: none;
  overflow: hidden;
  background: black;
  pointer-events: none;
}

.hydra-text {
  max-width: 300px;
  text-align: left;
  overflow-wrap: break-word;
}
</style>
