import { NodeBuilder } from "@baklavajs/core";

export const RenderBackgroundNode = new NodeBuilder("RenderBackgroundNode", { twoColumn: true, width: '300px' })
  .setName("Background Render")
  .addInputInterface("Code")
  .addOption("renderCode", "sendToBgRenderOption", 'hydraInstance.osc()')
  .onCalculate((n) => {
    let value = n.getInterface("Code").value;
    console.log("RenderNode", value);
    n.setOptionValue("renderCode", value);
    console.log(n.getOptionValue('renderCode'))
  })
  .build();
