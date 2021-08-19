<template>
  <div id="node-editor" style="height: 80vh; width: 80vw">
    <baklava-editor :plugin="viewPlugin" />
  </div>
</template>

<script>
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { Engine } from "@baklavajs/plugin-engine";
import { MathNode } from "@/baklavajs-nodes/MathNode";
import { DisplayNode } from "@/baklavajs-nodes/DisplayNode";

export default {
  components: {},
  data() {
    return {
      editor: new Editor(),
      viewPlugin: new ViewPlugin(),
      engine: new Engine(true),
    };
  },
  created() {
    // Register the plugins
    // The view plugin is used for rendering the nodes
    this.editor.use(this.viewPlugin);
    // The option plugin provides some default option UI elements
    this.editor.use(new OptionPlugin());
    // The engine plugin calculates the nodes in the graph in the
    // correct order using the "calculate" methods of the nodes
    this.editor.use(this.engine);

    // Show a minimap in the top right corner
    this.viewPlugin.enableMinimap = true;

    // register the nodes we have defined, so they can be
    // added by the user as well as saved & loaded.
    this.editor.registerNodeType("MathNode", MathNode);
    this.editor.registerNodeType("DisplayNode", DisplayNode);

    // add some nodes so the screen is not empty on startup
    const node1 = this.addNodeWithCoordinates(MathNode, 100, 140);
    const node2 = this.addNodeWithCoordinates(DisplayNode, 400, 140);
    this.editor.addConnection(
      node1.getInterface("Result"),
      node2.getInterface("Value")
    );
    this.engine.calculate();
  },
  methods: {
    addNodeWithCoordinates(nodeType, x, y) {
      const n = new nodeType();
      this.editor.addNode(n);
      n.position.x = x;
      n.position.y = y;
      return n;
    },
  },
};
</script>

<style lang="scss">
#node-editor {
  .node-editor .background {
    display: none;
  }

  .node-editor .node {
    max-width: 20rem;
    background: rgba(255, 255, 255, 1);
    color: #000;
    border-radius: 0px;
    border: 1px solid #000;
    position: absolute;
    filter: none;
    //filter: drop-shadow(0 0 3px rgba(0,0,0,0.8));
    transition: box-shadow 0.1s linear, filter 0.1s linear;
  }

  .node > .__title {
    border-radius: 0px;
    background: rgba(255, 255, 255, 1);
    color: #000;
    border-bottom: 1px solid #000;
  }

  .node-editor .connection {
    stroke: #000;
  }

  .node-interface .__port {
    background: #000 !important;
  }
  .dark-input,
  .dark-select > .__selected,
  .dark-select > .__dropdown,
  .dark-num-input, {
    background: #fff;
    color: #000;
    border: 1px solid #000;
  }
}
</style>
