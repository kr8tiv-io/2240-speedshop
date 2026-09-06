import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const file = new URL("../app/blog/page.tsx", import.meta.url);
const source = ts.createSourceFile(
  file.pathname,
  readFileSync(file, "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const cardTemplates = [];

function visit(node) {
  if (ts.isJsxAttribute(node) && node.name.getText(source) === "href"
      && node.initializer && ts.isJsxExpression(node.initializer)) {
    const expression = node.initializer.expression;
    if (expression && ts.isTemplateExpression(expression)
        && expression.head.text === "/blog/") {
      cardTemplates.push(expression);
    }
  }
  ts.forEachChild(node, visit);
}
visit(source);

assert.equal(cardTemplates.length, 2, "Cover the featured article and every mapped journal row");
for (const template of cardTemplates) {
  assert.equal(template.templateSpans.length, 1, "An article destination contains one registry slug");
  const span = template.templateSpans[0];
  assert.match(span.expression.getText(source), /^(featured|a)\.meta\.slug$/);
  assert.equal(span.literal.text, "/", "Journal cards must link directly to trailing-slash canonical pages without a redirect");
}

console.log("blog card canonical contract: PASS — featured article and all registry rows use direct canonical paths");
