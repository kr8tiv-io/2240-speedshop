/**
 * Char-roll hover label — the couture link language. Server-renderable: two
 * stacked copies of the label, every character in its own span with a --i
 * index; CSS does the 0.02s/char roll when any ancestor <a>/<button> (or a
 * `.roll-host`) is hovered. Screen readers get the plain label via aria.
 * Fine pointers only — on touch the duplicate never moves and the face reads
 * as plain text.
 */
export function RollText({ text }: { text: string }) {
  const chars = [...text];
  const render = (cls: string) => (
    <span aria-hidden="true" className={cls}>
      {chars.map((c, i) => (
        <span key={i} style={{ "--i": i } as React.CSSProperties}>
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
  return (
    <span className="roll" role="text" aria-label={text}>
      {render("roll-face")}
      {render("roll-dup")}
    </span>
  );
}

export default RollText;
