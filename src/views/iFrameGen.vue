<template>
  <div>
    <!--    <p>{{ currentHydraCodeString }}</p>-->
    <canvas
      :style="canvasStyle"
      ref="iframeHydraCanvas"
      :width="scaledWidth"
      :height="scaledHeight"
      class="iFrame-hydra-canvas"
    ></canvas>
  </div>
</template>

<script>
const Hydra = require("hydra-synth");

export default {
  name: "iFrameGen",
  data() {
    return {
      currentHydraCodeString: "none",
      scaleFactor: 4,
    };
  },
  methods: {
    encodeBase64: (text) => btoa(encodeURIComponent(text)),
    decodeBase64: (base64Code) => decodeURIComponent(atob(base64Code)),
  },
  computed: {
    scaledWidth() {
      return parseInt(this.$route.query.width, 10) / this.scaleFactor;
    },
    scaledHeight() {
      return parseInt(this.$route.query.height, 10) / this.scaleFactor;
    },
    canvasStyle: function () {
      let width;
      let height;
      if (this.scaledWidth) {
        width = this.scaledWidth;
      } else {
        width = window.innerWidth;
      }
      if (this.scaledHeight) {
        height = this.scaledHeight;
      } else {
        height = window.innerHeight;
      }
      return { width, height };
    },
  },
  watch: {
    currentHydraCodeString() {
      console.log("currentHydraCodeString", this.currentHydraCodeString);
      eval(this.currentHydraCodeString);
    },
  },
  mounted() {
    window.addEventListener("message", (event) => {
      // extract the data from the message event
      const { data } = event;

      if (!data.hydraString) {
        console.log("no hydra data", data);
        return;
      }
      console.log("hydra data:", data.hydraString);

      this.currentHydraCodeString = data.hydraString;
    });

    // Setup Hydra
    const canvas = this.$refs.iframeHydraCanvas;

    const hydra = new Hydra({
      detectAudio: false,
      canvas: canvas,
    });
    // document.body.appendChild(canvas);

    window.hydra = hydra;
    // eslint-disable-next-line no-undef

    console.log("Resolution iFrame: ", this.scaledWidth, this.scaledHeight);
    // eslint-disable-next-line no-undef
    setResolution(this.scaledWidth, this.scaledHeight);

    //const urlParams = new URLSearchParams(window.location.search);
    // const renderParams = {
    //   fps: urlParams.get("fps"),
    // };
    // const base64 = urlParams.get("code");
    const base64 = this.$route.params.code;
    console.log("code", base64);

    if (base64) {
      try {
        const code = this.decodeBase64(base64);
        console.log("Successfully decoded", code);
        if (code === "none" || code === undefined) {
          console.log("No code to eval");
        } else {
          this.currentHydraCodeString = code;
          eval(code);
        }
      } catch (e) {
        console.error("FailedToDecode", e);
      }
    }
  },
};

/* url queries: user, most recent transactions
Object.entries(hydra.generator.glslTransforms).filter(([key, value]) => value.type == "src").map(([key, value]) => key)
*/
</script>

<style scoped>
p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}
.iFrame-hydra-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translateX(-50%);
}
</style>
