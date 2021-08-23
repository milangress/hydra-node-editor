<template>
  <div class="hydra-canvas-container" ref="hydraCanvasContainer">
    <canvas class="hydra-canvas" ref="hydraCanvas"></canvas>
    <p>{{currentHydraCodeString}}</p>
  </div>
</template>

<script>
/*import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { Engine } from "@baklavajs/plugin-engine";*/

const Hydra = require("hydra-synth");

export default{
  components: {},
  name: "RenderOption",
  props: ["name", "value"],
  data() {
    return {
      currentHydraCodeString: 'default',
      hydra: false,
    };
  },
  mounted() {
    const hydraCanvas = this.$refs.hydraCanvas;
    this.hydra = new Hydra({
      canvas: hydraCanvas,
      autoLoop: true,
      makeGlobal: false,
      detectAudio: false,
      enableStreamCapture: false,
    });
    this.hydra.setResolution(this.canvasWidth, this.canvasHeight)
  },
  methods: {
    updateCanvas: function (code) {
      const codestring = `this.hydra.synth.${code.toString()}.out()`
      console.log("Hydra eval: ", codestring);
      eval(codestring)
    },
  },
  computed: {
    canvasWidth: function () {
      return this.$refs.hydraCanvasContainer.getBoundingClientRect().width
    },
    canvasHeight: function () {
      return this.canvasWidth / 1.5
    }
  },
  watch: {
    value: {
      // the callback will be called immediately after the start of the observation
      /*immediate: true,*/
      handler (val) {
        this.currentHydraCodeString = val
        this.updateCanvas(val)
      }
    },
  },
};
</script>

<style scoped></style>
