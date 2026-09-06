import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const footer = ts.createSourceFile("Footer.tsx", readFileSync("components/Footer.tsx", "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const elements = [];
function visit(node) {
  if (ts.isJsxElement(node)) elements.push(node);
  ts.forEachChild(node, visit);
}
visit(footer);
const attribute = (node, name) => node.openingElement.attributes.properties.find((property) => ts.isJsxAttribute(property) && property.name.text === name)?.initializer?.text;
const text = (node) => node.children.map((child) => {
  if (ts.isJsxText(child)) return child.text.replace(/\s+/g, " ");
  if (ts.isJsxElement(child)) return text(child);
  if (ts.isJsxExpression(child) && child.expression && ts.isStringLiteral(child.expression)) return child.expression.text;
  return "";
}).join("").replace(/\s+/g, " ").trim();

const credits = elements.filter((node) => node.openingElement.tagName.getText(footer) === "a" && attribute(node, "href") === "https://kr8tiv.io");
assert.equal(credits.length, 1, "Footer must contain exactly one KR8TIV credit link");
const link = credits[0];
assert.equal(text(link), "KR8TIV", "Only uppercase KR8TIV must be linked");
const paragraph = link.parent;
assert.equal(paragraph.openingElement.tagName.getText(footer), "p");
assert.equal(text(paragraph), "Made with ♥ by KR8TIV", "Credit wording must match the requested text");
assert.equal(paragraph.children.filter((child) => ts.isJsxElement(child) && child.openingElement.tagName.getText(footer) === "a").length, 1);
assert.match(attribute(paragraph, "className"), /text-\[11px\]/, "Keep credit small and consistent with footer");
assert.match(attribute(link, "rel"), /noopener/);
assert.match(readFileSync("app/layout.tsx", "utf8"), /<Footer\s*\/>/, "Root layout must render the shared footer site-wide");
console.log("footer credit contract: PASS — exact wording, only KR8TIV linked, shared small footer");
