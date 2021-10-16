<template>
  <div :id="data.id" :class="classes" :style="styles">
    <div
      class="__title"
      @mousedown.self.stop="startDrag"
      @contextmenu.self.prevent="openContextMenu"
    >
      <span v-if="!renaming">{{ data.name }}</span>
      <input
        v-else
        type="text"
        class="dark-input"
        v-model="tempName"
        placeholder="Node Name"
        v-click-outside="doneRenaming"
        @keydown.enter="doneRenaming"
      />

      <component
        :is="plugin.components.contextMenu"
        v-model="contextMenu.show"
        :x="contextMenu.x"
        :y="contextMenu.y"
        :items="contextMenu.items"
        @click="onContextMenu"
      ></component>
    </div>

    <div class="__content">
      <!-- Outputs -->
      <div class="__outputs">
        <component
          :is="plugin.components.nodeInterface"
          v-for="(output, name) in data.outputInterfaces"
          :key="output.id"
          :name="name"
          :data="output"
        ></component>
      </div>

      <!-- Options -->
      <div class="__options">
        <template v-for="[name, option] in data.options">
          <component
            :is="plugin.components.nodeOption"
            :key="name"
            :name="name"
            :option="option"
            :componentName="option.optionComponent"
            :node="data"
            @openSidebar="openSidebar(name)"
          ></component>

          <portal
            :key="'sb_' + name"
            to="sidebar"
            v-if="
              plugin.sidebar.nodeId === data.id &&
              plugin.sidebar.optionName === name &&
              option.sidebarComponent
            "
          >
            <component
              :is="plugin.components.nodeOption"
              :key="data.id + name"
              :name="name"
              :option="option"
              :componentName="option.sidebarComponent"
              :node="data"
            ></component>
          </portal>
        </template>
      </div>

      <!-- Inputs -->
      <div class="__inputs">
        <component
          :is="plugin.components.nodeInterface"
          v-for="(input, name) in data.inputInterfaces"
          :key="input.id"
          :name="name"
          :data="input"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
// import {
//   // Component,
//   Vue,
//   // Prop,
//   // Inject
// } from "vue-property-decorator";
// // @ts-ignore
// import { ViewPlugin } from "@baklavajs/plugin-renderer-vue/dist/baklavajs-plugin-renderer-vue/src/viewPlugin";
// import { IViewNode } from "@baklavajs/plugin-renderer-vue/dist/baklavajs-plugin-renderer-vue/types/viewPlugin";
// import { sanitizeName } from "@baklavajs/plugin-renderer-vue/dist/baklavajs-plugin-renderer-vue/src/utility/cssNames";
// import Vue from "vue";
const sanitizeName = function (name) {
  return name.replace(" ", "-");
};
export default {
  name: "NodeView",
  data() {
    return {
      draggingStartPosition: null,
      draggingStartPoint: null,
      renaming: false,
      tempName: "",
      contextMenu: {
        show: false,
        x: 0,
        y: 0,
        items: [
          { value: "rename", label: "Rename" },
          { value: "delete", label: "Delete" },
        ],
      },
    };
  },
  inject: ["plugin", "selectedNodeViews"],
  props: {
    data: {
      type: Object,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return {
        node: true,
        "--selected": this.selected,
        "--dragging": !!this.draggingStartPoint,
        "--two-column": !!this.data.twoColumn,
        [`--type-${sanitizeName(this.data.type)}`]: true,
        [this.data.customClasses]: true,
      };
    },
    styles() {
      return {
        top: `${this.data.position.y}px`,
        left: `${this.data.position.x}px`,
        width: `${this.data.width}px`,
      };
    },
  },
  mounted() {
    this.data.events.addInterface.addListener(this, () => this.update());
    this.data.events.removeInterface.addListener(this, () => this.update());
    this.data.events.addOption.addListener(this, () => this.update());
    this.data.events.removeOption.addListener(this, () => this.update());
    this.plugin.hooks.renderNode.execute(this);
  },
  updated() {
    this.plugin.hooks.renderNode.execute(this);
  },
  beforeDestroy() {
    this.data.events.addInterface.removeListener(this);
    this.data.events.removeInterface.removeListener(this);
    this.data.events.addOption.removeListener(this);
    this.data.events.removeOption.removeListener(this);
  },
  methods: {
    update() {
      this.$forceUpdate();
    },
    startDrag(ev) {
      this.select();
      if (
        this.selectedNodeViews.length === 0 ||
        this.selectedNodeViews[0] === undefined
      ) {
        this.selectedNodeViews.splice(0, this.selectedNodeViews.length);
        this.selectedNodeViews.push(this);
      }
      this.selectedNodeViews.forEach((elem) => {
        elem.draggingStartPoint = {
          x: ev.screenX,
          y: ev.screenY,
        };
        elem.draggingStartPosition = {
          x: elem.data.position.x,
          y: elem.data.position.y,
        };
        document.addEventListener("mousemove", elem.handleMove);
        document.addEventListener("mouseup", elem.stopDrag);
      });
    },
    select() {
      this.$emit("select", this);
    },
    stopDrag() {
      this.selectedNodeViews.forEach((elem) => {
        elem.draggingStartPoint = null;
        elem.draggingStartPosition = null;
        document.removeEventListener("mousemove", elem.handleMove);
        document.removeEventListener("mouseup", elem.stopDrag);
      });
    },
    handleMove(ev) {
      this.selectedNodeViews.forEach((elem) => {
        if (elem.draggingStartPoint) {
          const dx = ev.screenX - elem.draggingStartPoint.x;
          const dy = ev.screenY - elem.draggingStartPoint.y;
          elem.data.position.x =
            elem.draggingStartPosition.x + dx / elem.plugin.scaling;
          elem.data.position.y =
            elem.draggingStartPosition.y + dy / elem.plugin.scaling;
        }
      });
    },
    openContextMenu(ev) {
      this.contextMenu.show = true;
      this.contextMenu.x = ev.offsetX;
      this.contextMenu.y = ev.offsetY;
    },
    onContextMenu(action) {
      switch (action) {
        case "delete":
          this.plugin.editor.removeNode(this.data);
          break;
        case "rename":
          this.tempName = this.data.name;
          this.renaming = true;
      }
    },
    doneRenaming() {
      this.data.name = this.tempName;
      this.renaming = false;
    },
    openSidebar(optionName) {
      this.plugin.sidebar.nodeId = this.data.id;
      this.plugin.sidebar.optionName = optionName;
      this.plugin.sidebar.visible = true;
    },
  },
};
</script>
