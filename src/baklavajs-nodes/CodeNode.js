import { NodeBuilder } from "@baklavajs/core";

export const CodeNode = new NodeBuilder("CodeNode", { twoColumn: true, width: '300px' })
  .setName("Code")
    .addOutputInterface("Out")
  .addInputInterface("Code", "InputOption", 'osc(50,0.1,1.5)')
  .onCalculate((n) => {
    const code = n.getInterface("Code").value;
    n.getInterface("Out").value = code;
  })
  .build();
