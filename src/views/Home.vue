<template>
  <div id="node-editor-wrapper" style="height: 100vh; width: 100%">
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
import { RenderBackgroundNode } from "@/baklavajs-nodes/RenderBackgroundNode";

import RenderOption from "@/components/RenderOption.vue";
import CodeOption from "@/components/CodeOption.vue";
import BackgroundHydra from "@/components/BackgroundHydra.vue";
import sendToBgRenderOption from "@/components/SendBGRenderOption.vue";

/*import HydraSynth from 'hydra-synth';*/

// import { HydraNodeFactory } from "@/baklavajs-nodes/generatorFactoryHydraNodes";

import { NodeBuilder } from "@baklavajs/core";

import glslFunctions from "hydra-synth/src/glsl/glsl-functions";

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

    const HydraNodeFactory = function (settings) {
      console.log(settings);

      let newNode = new NodeBuilder("HydraNode", {
        twoColumn: true,
        width: "50px",
      }).setName(settings.name);

      newNode.addInputInterface("Code");

      settings.inputs.forEach(function (input) {
        const optionsMap = {
          float: "NumberOption",
        };
        let nodeOptions = optionsMap[input.type];
        if (nodeOptions) {
          newNode.addInputInterface(input.name, nodeOptions, input.default);
        } else console.error(input);
      });
      // .addInputInterface("Number 1", "NumberOption", 1)
      // .addInputInterface("Number 2", "NumberOption", 10)
      // .addOption("Operation", "SelectOption", "Add", undefined, {
      //   items: ["Add", "Subtract"],
      // })

      newNode.addOutputInterface("Output");
      newNode.onCalculate((n) => {
        let prevCode = n.getInterface("Code").value ?? '';
        if (prevCode.length > 1) {
          prevCode = prevCode + '.'
        }
        // console.log('prevCode', prevCode)
        const inputs = settings.inputs.map(function (input) {
          return n.getInterface(input.name).value;
        });
        const inputString = inputs.join(",");
        const hydraInstance = settings.type === "src" ? "hydraInstance." : "";
        const result = `${hydraInstance}${settings.name}(${inputString})`;
        // console.log(settings.name, result);
        n.getInterface("Output").value = prevCode + result;
      });
      //newNode.build();

      return newNode;
    };

    const _that = this;

    let defaultNode

    const hydraNodes = glslFunctions.map(function (settings) {
      const NodeConstructor = HydraNodeFactory(settings);
      const buildNode = NodeConstructor.build();
      console.log(_that.editor);
      _that.editor.registerNodeType(settings.name, buildNode, settings.type);
      // console.log(settings);
      if (settings.name === "osc") {
        defaultNode = _that.addNodeWithCoordinates(buildNode, 200, 140);
      }
      return buildNode
    });

    console.log('all Nodes', hydraNodes)

    // Show a minimap in the top right corner
    this.viewPlugin.enableMinimap = false;

    this.viewPlugin.registerOption("RenderOption", RenderOption);
    this.viewPlugin.registerOption("CodeOption", CodeOption);
    this.viewPlugin.registerOption(
      "sendToBgRenderOption",
      sendToBgRenderOption
    );

    // register the nodes we have defined, so they can be
    // added by the user as well as saved & loaded.
    //this.editor.registerNodeType("MathNode", MathNode);
    //this.editor.registerNodeType("DisplayNode", DisplayNode);
    this.editor.registerNodeType("CodeNode", CodeNode);
    this.editor.registerNodeType("RenderNode", RenderNode);
    this.editor.registerNodeType("TextNode", TextNode);
    this.editor.registerNodeType("RenderBackgroundNode", RenderBackgroundNode);

    // add some nodes so the screen is not empty on startup
    // const node1 = this.addNodeWithCoordinates(MathNode, 100, 140);
    // this.addNodeWithCoordinates(TextNode, 200, 340);
    // const node1 = this.addNodeWithCoordinates(CodeNode, 100, 140);
    const node2 = this.addNodeWithCoordinates(RenderBackgroundNode, 600, 140);
    this.editor.addConnection(
        defaultNode.getInterface("Output"),
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
#node-editor-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;

  .node-editor,
  .hydraCanvasContainer {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
  }

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
  }
  .node-interface .__port {
    width: 1rem;
    height: 1rem;
    background: white;
    border: 1px solid #000;
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

  .dark-input,
  .dark-select > .__selected,
  .dark-select > .__dropdown,
  .dark-num-input {
    background: #fff;
    color: #000;
    border: 1px solid #000;

    >.__content:hover {
      background-color: unset;
    }
    >.__button path {
      stroke: #000;
      fill: #000;
    }
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

  .node.--two-column>.__content {
    grid-template-columns: auto;
  }
}
</style>
