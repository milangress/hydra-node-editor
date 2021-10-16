<template>
  <div class="hydra-canvas-container" ref="hydraCanvasContainer">
    <canvas class="hydra-canvas" ref="hydraCanvas"></canvas>
    <div class="hydra-String">{{ hydraString }}</div>
  </div>
</template>

<script>
const Hydra = require("hydra-synth");

export default {
  name: "BackgroundHydra",
  data() {
    return {
      currentHydraCodeString: "default",
      hydra: false,
    };
  },
  computed: {
    hydraString() {
      const hydraString = this.$store.state.currentHydraBackgroundString;
      const cleanedUp = this.cleanup(hydraString.raw);
      console.log("BG EVAL: ", cleanedUp);
      if (this.hydra) {
        console.log(this.hydra);
        eval(cleanedUp);
      }
      return cleanedUp;
    },
  },
  methods: {
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
  },
  mounted() {
    this.hydra = new Hydra({
      canvas: this.$refs.hydraCanvas,
      autoLoop: true,
      makeGlobal: false,
      detectAudio: false,
      enableStreamCapture: false,
    });
    console.log(this.hydra);
    this.hydra.synth.osc(50, 0.1, 1.5).out();
    this.hydra.synth.osc(50, 0.1, 1.5).out();
  },
};
</script>

<style scoped>
.hydra-canvas-container {
  width: 100%;
  height: 100%;
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}

.hydra-canvas {
  width: 100%;
  height: 100%;
}

.hydra-String {
  position: absolute;
  bottom: 50px;
  left: 50px;
}
</style>
