<template>
  <div id="node-editor-wrapper" style="height: 100vh; width: 100%">
    <nav class="navbar navbar-default">
      <button @click="saveNetwork">Save</button>
    </nav>
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

// import RenderOption from "@/components/RenderOption.vue";
import RenderIFrameOption from "@/components/RenderIFrameOption";
import CodeOption from "@/components/CodeOption.vue";
import BackgroundHydra from "@/components/BackgroundHydra.vue";
import sendToBgRenderOption from "@/components/SendBGRenderOption.vue";

/*import HydraSynth from 'hydra-synth';*/

// import { HydraNodeFactory } from "@/baklavajs-nodes/generatorFactoryHydraNodes";

import { NodeBuilder } from "@baklavajs/core";

import glslFunctions from "hydra-synth/src/glsl/glsl-functions";

import MyNode from "@/components/baklavaOverwrites/MyNode";
import { doc, updateDoc } from "firebase/firestore";
import { fireStore } from "@/firebase";

export default {
  components: { BackgroundHydra },
  name: "Hydra",
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

    this.viewPlugin.components.node = MyNode;

    const HydraNodeFactory = function (settings) {
      let newNode = new NodeBuilder("HydraNode", {
        twoColumn: false,
        width: "50px",
      }).setName(settings.name);

      newNode.addInputInterface("In");

      const settingsWithNames = settings.inputs.map(function (input, index) {
        const uniqueInputName = input.name + (index + 1);
        const optionsMap = {
          float: "NumberOption",
          vec4: "InputOption",
          sampler2D: "InputOption",
        };
        let nodeOption = optionsMap[input.type];
        if (nodeOption) {
          newNode.addInputInterface(uniqueInputName, nodeOption, input.default);
        } else console.error(input.type);
        return {
          ...input,
          uid: uniqueInputName,
          nodeOption: nodeOption,
        };
      });
      // .addInputInterface("Number 1", "NumberOption", 1)
      // .addInputInterface("Number 2", "NumberOption", 10)
      if (settings.type === "combine" || settings.type === "combineCoord") {
        newNode.addInputInterface("texture", "textOption", "");
      }

      newNode.addOutputInterface("Out");
      newNode.addOption("renderCode", "RenderOption", "osc()", "", {
        height: 50,
      });
      newNode.onCalculate((n) => {
        let prevCode = n.getInterface("In").value ?? "";
        if (prevCode.length > 1) {
          prevCode = prevCode + ".";
        }
        console.log(settingsWithNames);
        const inputs = settingsWithNames.map(function (input) {
          console.log(input.uid, input);
          if (input.type === "float") {
            return parseFloat(n.getInterface(input.uid).value.toFixed(3));
          } else {
            return n.getInterface(input.uid).value;
          }
        });
        let textureVec4;
        if (settings.type === "combine" || settings.type === "combineCoord") {
          let texture = n.getInterface("texture").value ?? "";
          if (texture.length > 1) {
            textureVec4 = texture;
          }
        }
        const mergeTexture = [textureVec4, ...inputs].filter((n) => n);
        const inputString = mergeTexture.join(",");
        const hydraInstance = settings.type === "src" ? "hydraInstance." : "";
        const result = `${hydraInstance}${settings.name}(${inputString})`;
        // console.log(settings.name, result);
        const finalCodeString = prevCode + result;
        n.getInterface("Out").value = finalCodeString;
        n.setOptionValue("renderCode", finalCodeString);
      });
      //newNode.build();

      return {
        newNode: newNode,
        ...settings,
      };
    };

    const _that = this;

    let defaultNode;

    const localCopyGlsl = JSON.parse(JSON.stringify(glslFunctions));

    const hydraNodes = localCopyGlsl.map(function (settings) {
      const NodeConstructor = HydraNodeFactory(settings);
      const buildNode = NodeConstructor.newNode.build();
      _that.editor.registerNodeType(settings.name, buildNode, settings.type);
      // console.log(settings);
      if (settings.name === "osc") {
        defaultNode = _that.addNodeWithCoordinates(buildNode, 200, 140);
      }
      return {
        ...NodeConstructor.settings,
        newNode: buildNode,
      };
    });

    console.log("all Nodes", hydraNodes);

    // Show a minimap in the top right corner
    this.viewPlugin.enableMinimap = false;

    this.viewPlugin.registerOption("RenderOption", RenderIFrameOption);
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
    const node1 = this.addNodeWithCoordinates(RenderNode, 400, 240);
    this.addNodeWithCoordinates(RenderBackgroundNode, 600, 140);
    this.editor.addConnection(
      defaultNode.getInterface("Out"),
      node1.getInterface("Code")
    );
    // console.log(node2, defaultNode);
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
    saveNetwork: async function () {
      const firebaseSlug = this.$route.params.id;
      const savedJSON = this.editor.save();
      console.log(savedJSON);
      const serializeJSON = JSON.stringify(savedJSON);
      const documentRef = doc(fireStore, "HydraSketch", firebaseSlug);

      return await updateDoc(documentRef, {
        savedGraph: serializeJSON,
      });
    },
  },
};
</script>

<style lang="scss">
#node-editor-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;

  .node-editor {
    font-family: "Arial Narrow", Arial, sans-serif;
  }

  .node-editor,
  .hydraCanvasContainer {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
  }

  .node-editor .background {
    display: none;
  }

  .node {
    max-width: 20rem;
    background: rgba(255, 255, 255, 1);
    color: #000;
    border-radius: 0px;
    border: 1px solid #000;
    position: absolute;
    // filter: none;
    //filter: drop-shadow(0 0 3px rgba(0,0,0,0.8));
    transition: box-shadow 0.1s linear, filter 0.1s linear;
    resize: both;
    box-shadow: 4px 4px 0 0 rgb(0 0 0 / 10%);
  }
  .node:hover {
    outline: 1px solid #000;
    outline-offset: 2px;
  }
  // .node-editor .node,
  // .connection {
  //   filter: contrast(100%);
  // }
  //.__title {
  //  filter: blur(0.1px) brightness(99%) grayscale(100%) contrast(5000%);
  //}

  .node > .__content {
    padding: 0 0.5em;
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
    top: calc(50% - 0.5rem);
    transition: all 0.1s ease-in-out;
  }
  .node-interface .__port:hover {
    background: rgba(0, 0, 0, 1);
    transform: scale(2);
  }
  .node-interface.--connected > .__port {
    background: blue;
    transform: scale(1.2);
  }

  .node > .__title {
    border-radius: 0;
    // background: rgba(255, 255, 255, 1);
    // color: #000;
    border-bottom: 1px solid #000;
    font-weight: bold;
    font-size: 1.5em;
    max-height: 1em;
    overflow: hidden;
    padding: 0;
    background: #000;
    color: white;

    span {
      //text-shadow: 3px 3px 0 3px black,6px 6px 0 6px white;
      // text-transform: uppercase;
      filter: blur(0.1px) brightness(99%) grayscale(100%) contrast(5000%);
      color: black;
      -webkit-text-stroke: 1px white;
      display: inline-block;
      transform: scale(1.1);
    }

    .dark-context-menu {
      font-size: initial;
      filter: none;
      z-index: 1000;
    }
    .dark-context-menu > .item {
      background: white;
      border: 1px solid #000;
      color: black;
    }
    .dark-context-menu .item:hover {
      background: black;
      color: white;
    }

    input.dark-input {
      max-width: 33%;
      font-size: 1rem;
      padding: 0 0;
      text-align: center;
      z-index: 1000;
      color: #000;
      position: fixed;
      transform: scale(2);
      left: 33%;
      right: 0;
    }
  }

  .node-editor .connection {
    stroke: #000;
    stroke-width: 5px;
    fill: none;
    stroke-linecap: round;
    filter: drop-shadow(3px 5px 2px rgb(265 265 265 / 0.4));
  }

  .node > .__content > div > div {
    margin: 0.25em;
  }

  .dark-input,
  .dark-select > .__selected,
  .dark-select > .__dropdown,
  .dark-num-input {
    background: #fff;
    color: #000;
    border: 1px solid #000;

    > .__content:hover {
      background-color: unset;
    }
    > .__button path {
      stroke: #000;
      fill: #000;
    }
  }
  .dark-input {
    padding: 0;
    margin: 0;
    max-width: 8rem;
  }
  .--type-CodeNode {
    //width: 230px;
    max-width: 40rem;
    .__outputs,
    .__inputs {
      height: 1px;
      color: transparent;
    }
    .__content > div > .my-editor {
      margin: 0;
      padding: 0;
    }
  }

  .node.--two-column > .__content {
    grid-template-columns: auto;
  }
  .--type-HydraNode {
    .__outputs {
      max-height: 1px;
      .__output {
        margin: 0;
        transform: translateY(0.25em);
      }
    }
    .__inputs .--input:nth-of-type(1) {
      //padding-top: 0;
      margin-top: 0;
    }
  }

  .--type-RenderNode {
    .hydra-canvas-container {
      margin: 0 !important;
    }
    .node-option {
      margin: 0;
    }
    .__content {
      padding: 0;
    }
    .__content > .__options {
      grid-column: 1 / -1;
      grid-row: 1 / -1;
      z-index: 2;
    }
  }
  .dark-context-menu {
    background: white;
    color: black;
    border: 1px solid black;

    .item {
      justify-content: space-between;
      align-items: flex-start !important;
    }

    .item > .flex-fill {
      text-align: left;
    }

    .item + .item {
      border-top: 1px solid black;
    }

    > .divider {
      height: 3px;
      background-color: black;
    }

    .item:not(.--header):not(.--active):not(.--disabled):hover {
      background: blue;
      color: white;
    }
    .item:not(.--header):not(.--active):is(.--disabled):hover {
      background: lightgray;
    }
  }
}
.node-interface {
  padding: 0 0.1em 0;
}
.navbar {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
