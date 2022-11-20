<template>
  <canvas
    :style="canvasStyle"
    ref="iframeHydraCanvas"
    :width="this.$route.query.width"
    :height="this.$route.query.height"
  ></canvas>
</template>

<script>
const Hydra = require("hydra-synth");

export default {
  name: "iFrameGen",
  methods: {
    encodeBase64: (text) => btoa(encodeURIComponent(text)),
    decodeBase64: (base64Code) => decodeURIComponent(atob(base64Code)),
  },
  computed: {
    canvasStyle: function () {
      let width;
      let height;
      if (this.$route.query.width) {
        width = this.$route.query.width;
      } else {
        width = window.innerWidth;
      }
      if (this.$route.query.height) {
        height = this.$route.query.height;
      } else {
        height = window.innerHeight;
      }
      return { width, height };
    },
  },
  mounted() {
    const canvas = this.$refs.iframeHydraCanvas;

    const hydra = new Hydra({
      detectAudio: false,
      canvas: canvas,
    });
    // document.body.appendChild(canvas);

    window.hydra = hydra;
    // eslint-disable-next-line no-undef
    console.log(this.$route.query.width, this.$route.query.height);
    const widthInt = parseInt(this.$route.query.width, 10);
    const heightInt = parseInt(this.$route.query.width, 10);
    // eslint-disable-next-line no-undef
    setResolution(widthInt, heightInt);

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
        eval(code);
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

<style scoped></style>
