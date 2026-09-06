import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

for (const file of ["components/gl/GLImagesRuntime.tsx", "components/shop/ShopWorld.tsx"]) {
const source = readFileSync(file, "utf8");
const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const canvases = [];
function visit(node) {
  if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(tree) === "Canvas") {
    canvases.push(node);
  }
  ts.forEachChild(node, visit);
}
visit(tree);
assert.equal(canvases.length, 1, "Check the actual decorative Canvas");
const style = canvases[0].attributes.properties.find((attribute) => ts.isJsxAttribute(attribute) && attribute.name.text === "style");
assert.ok(style?.initializer && ts.isJsxExpression(style.initializer), `${file}: Canvas must override R3F's inline pointer-events:auto; its parent class is insufficient`);
const expression = style.initializer.expression;
assert.ok(expression && ts.isObjectLiteralExpression(expression));
const pointerEvents = expression.properties.find((property) => ts.isPropertyAssignment(property) && property.name.getText(tree) === "pointerEvents");
assert.ok(pointerEvents && ts.isStringLiteral(pointerEvents.initializer));
assert.equal(pointerEvents.initializer.text, "none", "Decorative effects must never intercept page links or buttons");
assert.match(source, /window\.addEventListener\("pointermove"/, "Retain global pointer input for the unchanged visual effects");
}
console.log("decorative canvas click contract: PASS — links remain interactive and effects retain pointer tracking");
