<template>
  <div class="hydra-canvas-container" ref="hydraCanvasContainer">
    <canvas
      class="hydra-canvas"
      ref="hydraCanvas"
      v-show="canvasVisible"
    ></canvas>
    <div
      class="hydra-String"
      @click="toggleSize"
      :class="{ small: isToggleHydraString }"
    >
      {{ hydraString }}
    </div>
    <div
      class="hideBG"
      @click="canvasVisible = !canvasVisible"
      :class="{ canvasHidden: canvasVisible }"
    ></div>
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
      canvasVisible: true,
      isToggleHydraString: true,
    };
  },
  computed: {
    hydraString() {
      const hydraString = this.$store.state.currentHydraBackgroundString;
      const cleanedUp = this.cleanup(hydraString.raw);
      console.log("BG EVAL: ", cleanedUp);
      if (this.hydra) {
        console.log(this.hydra);
        try {
          eval(cleanedUp);
        } catch (err) {
          console.error("Hydra Eval Failed", err);
        }
      }
      return this.cleanupReadable(hydraString.raw);
    },
  },
  methods: {
    toggleSize() {
      console.log("toggle Hydra String");
      this.isToggleHydraString = !this.isToggleHydraString;
    },
    cleanup: function (code) {
      // hydraInstance = "this.hydra.synth"
      if (code != null) {
        //const codestring = `this.hydra.synth.${code.toString()}.out()`
        const codestring = code.toString().replaceAll("hydraInstance.", "");
        // .replaceAll(/(?<!hydraInstance.)osc/gm, "hydraInstance.osc")
        // .replaceAll(/\.hydraInstance/gm, hydraInstance)
        // .replaceAll(/hydraInstance/gm, hydraInstance);
        const finalCodeString = codestring + ".out()";
        // console.log("Hydra eval: ", finalCodeString);
        return finalCodeString;
        // eval(finalCodeString)
      } else return "";
    },
    cleanupReadable: function (code) {
      if (code != null) {
        return code
          .toString()
          .replaceAll(/\.hydraInstance/gm, "")
          .replaceAll(/hydraInstance/gm, "")
          .replaceAll(",", ", ");
      } else return "";
    },
  },
  mounted() {
    this.hydra = new Hydra({
      canvas: this.$refs.hydraCanvas,
      autoLoop: true,
      makeGlobal: true,
      detectAudio: false,
      enableStreamCapture: false,
    });
    console.log(this.hydra);
    // this.hydra.synth.osc(60, 0.1).diff(this.hydra.synth.osc(60, 0.1)).out();
    //this.hydra.synth.osc(50, 0.1, 1.5).out();
    // this.hydra.synth.osc(50, 0.1, 1.5).out();
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
  z-index: 100;
  text-align: left;
  bottom: 50px;
  left: 50px;
  max-width: 50vw;
  max-height: 60vh;
  font-size: 1.5em;
  background-color: white;
  -webkit-text-stroke: 1.1px #000;
  filter: blur(0.1px) brightness(99%) grayscale(100%) contrast(5000%);
  mix-blend-mode: multiply;
}
.small {
  font-size: 0.5em;
  max-width: 20vw;
  max-height: 20vh;
}

.hideBG {
  position: absolute;
  z-index: 100;
  bottom: 50px;
  right: 50px;
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: repeating-radial-gradient(#0023ff, #f1f4f5 15px);
  transform: rotate(45deg);
  border: 3px solid #0023ff;
  transition: all 0.5s cubic-bezier(0.28, 0.84, 0.42, 1);
  background-size: 100% 100%;
  background-position: 50% 50%;
}

.hideBG:hover {
  background-size: 20% 20%;
}

.hideBG.canvasHidden {
  border-radius: 100% 0;
  filter: blur(2px);
}

.hideBG.canvasHidden:hover {
  background-size: 200% 200%;
  filter: blur(0);
}
</style>
