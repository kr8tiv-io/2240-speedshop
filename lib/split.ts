/**
 * Manual char splitter — SplitText is Club GSAP, so this does the one job the
 * kinetic type needs: wrap every character in a `.k-char` span, grouped inside
 * per-word `nowrap` wrappers (so lines never break mid-word) inside `.k-line`
 * blocks, and hand the char spans back for staggered tweens.
 *
 * COUTURE PASS: the splitter now walks the child tree instead of flattening
 * to innerText, so an accent element (`<em data-accent>`) survives the split —
 * its characters carry `.k-accent` (the Fraunces italic signature) while still
 * being ordinary `.k-char` spans in the stagger.
 *
 * Newlines inside text nodes are treated as authored line breaks — give the
 * element `white-space: pre-line` if it uses `\n` for them.
 */
export function splitChars(el: HTMLElement): HTMLElement[] {
  type Run = { text: string; accent: boolean };
  const runs: Run[] = [];

  const walk = (node: Node, accent: boolean) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (text.length > 0) runs.push({ text, accent });
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elNode = node as HTMLElement;
      if (elNode.tagName === "BR") {
        runs.push({ text: "\n", accent: false });
        return;
      }
      const isAccent = accent || elNode.hasAttribute("data-accent");
      elNode.childNodes.forEach((child) => walk(child, isAccent));
    }
  };
  el.childNodes.forEach((child) => walk(child, false));

  // Flatten runs into lines of [char, accent] pairs.
  type Ch = { ch: string; accent: boolean };
  const lines: Ch[][] = [[]];
  for (const run of runs) {
    for (const ch of run.text) {
      if (ch === "\n") {
        lines.push([]);
      } else {
        lines[lines.length - 1].push({ ch, accent: run.accent });
      }
    }
  }

  el.textContent = "";
  const chars: HTMLElement[] = [];

  for (const line of lines) {
    if (line.length === 0 || line.every((c) => c.ch.trim().length === 0)) continue;
    const lineEl = document.createElement("span");
    lineEl.className = "k-line";

    // Group into words on whitespace so lines never break mid-word.
    let wordEl: HTMLElement | null = null;
    const flushSpace = () => {
      lineEl.appendChild(document.createTextNode(" "));
      wordEl = null;
    };
    for (const { ch, accent } of line) {
      if (/\s/.test(ch)) {
        if (wordEl) flushSpace();
        continue;
      }
      if (!wordEl) {
        wordEl = document.createElement("span");
        wordEl.style.display = "inline-block";
        wordEl.style.whiteSpace = "nowrap";
        lineEl.appendChild(wordEl);
      }
      const span = document.createElement("span");
      span.className = accent ? "k-char k-accent" : "k-char";
      span.textContent = ch;
      wordEl.appendChild(span);
      chars.push(span);
    }

    el.appendChild(lineEl);
  }
  return chars;
}
