import { NodeBuilder } from "@baklavajs/core";

export const CodeNode = new NodeBuilder("CodeNode", {
  twoColumn: true,
  width: "300px",
})
  .setName("Code")
  .addOutputInterface("Out")
  .addInputInterface("In")
  .addOption("Code", "CodeOption", "osc(50,0.1,1.5)")
  .onCalculate((n) => {
    let codeBefore = n.getInterface("In").value;
    if (codeBefore === null) {
      codeBefore = "";
    } else {
      codeBefore += ".";
    }
    const newCode = n.getOptionValue("Code");
    if (typeof newCode !== "string") {
      newCode.toString();
    }
    const codeString = codeBefore + newCode;
    n.getInterface("Out").value = codeString;
  })
  .build();
