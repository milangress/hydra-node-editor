import { NodeBuilder } from "@baklavajs/core";

export const RenderNode = new NodeBuilder("RenderNode", {
  twoColumn: true,
  width: "300px",
})
  .setName("Render")
  .addInputInterface("Code")
  .addOption("renderCode", "RenderOption", "osc()")
  .onCalculate((n) => {
    let value = n.getInterface("Code").value;
    console.log("RenderNode", value);
    n.setOptionValue("renderCode", value);
    console.log(n.getOptionValue("renderCode"));
  })
  .build();
