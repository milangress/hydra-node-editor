<template>
  <div id="node-editor" style="height: 100vh; width: 100%;">
    <baklava-editor :plugin="viewPlugin" />
    <BackgroundHydra></BackgroundHydra>
  </div>
</template>

<script>
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { Engine } from "@baklavajs/plugin-engine";
// import { MathNode } from "@/baklavajs-nodes/MathNode";
// import { DisplayNode } from "@/baklavajs-nodes/DisplayNode";
import { RenderNode } from "@/baklavajs-nodes/RenderNode";
import { TextNode } from "@/baklavajs-nodes/TextNode";
import { CodeNode } from "@/baklavajs-nodes/CodeNode";

import RenderOption from "@/components/RenderOption.vue";
import CodeOption from "@/components/CodeOption.vue";
import BackgroundHydra from "@/components/BackgroundHydra.vue";

/*import HydraSynth from 'hydra-synth';*/

export default {
  components: { BackgroundHydra },
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

    this.viewPlugin.registerOption("RenderOption", RenderOption);
    this.viewPlugin.registerOption("CodeOption", CodeOption);

    // register the nodes we have defined, so they can be
    // added by the user as well as saved & loaded.
    //this.editor.registerNodeType("MathNode", MathNode);
    //this.editor.registerNodeType("DisplayNode", DisplayNode);
    this.editor.registerNodeType("CodeNode", CodeNode);
    this.editor.registerNodeType("RenderNode", RenderNode);
    this.editor.registerNodeType("TextNode", TextNode);

    // add some nodes so the screen is not empty on startup
    // const node1 = this.addNodeWithCoordinates(MathNode, 100, 140);
    this.addNodeWithCoordinates(TextNode, 200, 340);
    const node1 = this.addNodeWithCoordinates(CodeNode, 100, 140);
    const node2 = this.addNodeWithCoordinates(RenderNode, 500, 140);
    this.editor.addConnection(
      node1.getInterface("Out"),
      node2.getInterface("Code")
    );
    this.engine.calculate();

    //Hydra
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
    border-radius: 0;
    border: 1px solid #000;
    position: absolute;
    filter: none;
    //filter: drop-shadow(0 0 3px rgba(0,0,0,0.8));
    transition: box-shadow 0.1s linear, filter 0.1s linear;
    resize: both;
  }

  .node:hover {
    box-shadow: none;
    outline: 1px solid #000;
    outline-offset: 2px;
  }

  .node.--selected {
    box-shadow: none;
    outline: 1px solid #000;
    outline-offset: 5px;

    .node-interface .__port {
      width: 1rem;
      height: 1rem;
      background: white;
      border: 1px solid #000;
    }

    .node > .__title {
      border-radius: 0;
      background: rgba(255, 255, 255, 1);
      color: #000;
      border-bottom: 1px solid #000;
    }

    .node-editor .connection {
      stroke: #000;
    }

    .dark-input,
    .dark-select > .__selected,
    .dark-select > .__dropdown,
    .dark-num-input {
      background: #fff;
      color: #000;
      border: 1px solid #000;
    }

    .--type-CodeNode {
      width: 230px;

      .__outputs,
      .__inputs {
        height: 1px;
        color: transparent;
      }

      .__content > div > div {
        margin: 0;
      }
    }
  }
}
</style>
