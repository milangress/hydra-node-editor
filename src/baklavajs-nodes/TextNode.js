import { NodeBuilder } from "@baklavajs/core";

export const TextNode = new NodeBuilder("TextNode", {
  twoColumn: true,
  width: "300px",
})
  .setName("Text")
  .addOutputInterface("Out")
  .addInputInterface("In")
  .addOption("Text", "InputOption", "osc(50,0.1,1.5)")
  .onCalculate((n) => {
    let codeBefore = n.getInterface("In").value;
    if (codeBefore === null) {
      codeBefore = "";
    } else {
      codeBefore += ".";
    }
    const newCode = n.getOptionValue("Text");
    if (typeof newCode !== "string") {
      newCode.toString();
    }
    const codeString = codeBefore + newCode;
    n.getInterface("Out").value = codeString;
  })
  .build();
