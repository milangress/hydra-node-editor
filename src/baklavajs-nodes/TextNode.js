import { NodeBuilder } from "@baklavajs/core";

export const TextNode = new NodeBuilder("TextNode")
  .setName("Text")
  .addInputInterface("Text", "InputOption", 'osc(50,0.1,1.5).out()')
  .addOutputInterface("Output")
  .onCalculate((n) => {
    const code = n.getInterface("Text").value;
    n.getInterface("Output").value = code;
  })
  .build();
