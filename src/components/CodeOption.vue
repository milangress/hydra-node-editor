<template>
  <prism-editor
    class="my-editor input-user-select"
    v-model="privatValue"
    :highlight="highlighter"
    v-on:input="listeners"
    line-numbers
    v-bind:readonly="false"
  ></prism-editor>
</template>

<script>
// import Prism Editor
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles

export default {
  components: {
    PrismEditor,
  },
  props: ["value"],
  data: () => ({
    privatValue: 'osc(50,0.1,1.5)',
  }),
  methods: {
    highlighter(code) {
      return highlight(code, languages.js, "markup"); // languages.<insert language> to return html with markup
    },
    mounted() {
      this.privatValue = this.value
    },
    watch: {
      value: function (val) {
        this.privatValue = val
      }
    },
    listeners(ev) {
      this.$emit("input", ev)
    },
  },
};
</script>

<style>
/* required class */
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: rgba(200, 200, 200, 0.2);
  color: #000;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.my-editor .prism-editor__textarea {
  user-select: auto;
  pointer-events: auto;
}

.my-editor .prism-editor__editor,
.my-editor .prism-editor__editor *{
  user-select: none;
  pointer-events: none;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}

/* Syntax highlighting */
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #90a4ae;
}
.token.punctuation {
  color: #9e9e9e;
}
.namespace {
  opacity: 0.7;
}
.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
  color: #e91e63;
}
.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: #4caf50;
}
.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: #795548;
}
.token.atrule,
.token.attr-value,
.token.keyword {
  color: #3f51b5;
}
.token.function {
  color: #f44336;
}
.token.regex,
.token.important,
.token.variable {
  color: #ff9800;
}
.token.important,
.token.bold {
  font-weight: bold;
}
.token.italic {
  font-style: italic;
}
.token.entity {
  cursor: help;
}
</style>
