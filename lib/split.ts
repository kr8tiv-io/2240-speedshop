/**
 * Manual char splitter — SplitText is Club GSAP, so this does the one job the
 * kinetic type needs: wrap every character in a `.k-char` span, grouped inside
 * per-word `nowrap` wrappers (so lines never break mid-word) inside `.k-line`
 * blocks, and hand the char spans back for staggered tweens.
 *
 * Reads `innerText`, so call it on elements whose newlines are real — give the
 * element `white-space: pre-line` if it uses `\n` for authored line breaks.
 */
export function splitChars(el: HTMLElement): HTMLElement[] {
  /* The couture signature: `data-accent-word="and"` on the element renders
     that ONE word in italic Fraunces tungsten (.accent-serif) after the split. */
  const accent = (el.dataset.accentWord ?? "").toLowerCase();
  const lines = el.innerText.split("\n").filter((l) => l.trim().length > 0);
  el.textContent = "";
  const chars: HTMLElement[] = [];

  for (const line of lines) {
    const lineEl = document.createElement("span");
    lineEl.className = "k-line";
    const words = line.split(/\s+/).filter(Boolean);

    words.forEach((word, w) => {
      const wordEl = document.createElement("span");
      wordEl.style.display = "inline-block";
      wordEl.style.whiteSpace = "nowrap";
      if (accent && word.replace(/[^\w'’]/g, "").toLowerCase() === accent) {
        wordEl.className = "accent-serif";
      }
      for (const ch of word) {
        const span = document.createElement("span");
        span.className = "k-char";
        span.textContent = ch;
        wordEl.appendChild(span);
        chars.push(span);
      }
      lineEl.appendChild(wordEl);
      if (w < words.length - 1) lineEl.appendChild(document.createTextNode(" "));
    });

    el.appendChild(lineEl);
  }
  return chars;
}
