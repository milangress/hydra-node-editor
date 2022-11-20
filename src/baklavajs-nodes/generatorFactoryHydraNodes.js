import { NodeBuilder } from "@baklavajs/core";

import glslFunctions from "hydra-synth/src/glsl/glsl-functions";

export const HydraNodeFactory = function () {
  console.log(glslFunctions);

  const testval = new NodeBuilder("HydraNode")
    .setName("MathTest")
    .addInputInterface("Number 1", "NumberOption", 1)
    .addInputInterface("Number 2", "NumberOption", 10)
    .addOption("Operation", "SelectOption", "Add", undefined, {
      items: ["Add", "Subtract"],
    })
    .addOutputInterface("Output")
    .onCalculate((n) => {
      const n1 = n.getInterface("Number 1").value;
      const n2 = n.getInterface("Number 2").value;
      const operation = n.getOptionValue("Operation");
      let result;
      if (operation === "Add") {
        result = n1 + n2;
      } else if (operation === "Subtract") {
        result = n1 - n2;
      }
      n.getInterface("Output").value = result;
    });

  return [testval];
};
