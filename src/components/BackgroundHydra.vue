<template>
  <div class="hydra-canvas-container" ref="hydraCanvasContainer">
    <canvas class="hydra-canvas" ref="hydraCanvas"></canvas>
    <p>{{currentHydraCodeString}}</p>
  </div>
</template>

<script>

const Hydra = require("hydra-synth");

export default {
  name: "BackgroundHydra",
  data() {
    return {
      currentHydraCodeString: 'default',
      hydra: false,
    };
  },
  mounted() {
    this.hydra = new Hydra({
      autoLoop: true,
      makeGlobal: true,
      detectAudio: false,
      enableStreamCapture: false,
    });
    console.log(this.hydra)
  }
}
</script>

<style scoped>
.hydra-canvas-container {
  width: 100%;
  height: 100%;
}

</style>
