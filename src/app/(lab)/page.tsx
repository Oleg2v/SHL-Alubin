import Link from "next/link";

export default function LabIndex() {
  return (
    <main id="main" data-surface="press" className="grid min-h-dvh content-center gap-8 px-(--margin)">
      <p className="t-label text-fg-muted">SHL-Alubin concept / Stage 0</p>
      <h1 className="t-headline max-w-[14ch]">Cold metal. Hot process.</h1>
      <p>
        <Link className="t-lead" href="/style-tile/">
          Open the style tile
        </Link>
      </p>
    </main>
  );
}
