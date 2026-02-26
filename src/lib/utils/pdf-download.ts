// ── printPdf.ts ───────────────────────────────────────────────────────────────
// Triggers the browser's native print-to-PDF dialog.
// No dependencies — the browser renders the live page exactly as styled.
// Call downloadPdf() from a button's on:click handler.

/**
 * Sets the document title to the desired PDF filename, triggers the browser
 * print dialog, then restores the original title. Most browsers use the
 * document title as the default filename when saving as PDF.
 */
export function downloadPdf(): void {
  const original  = document.title;
  document.title  = 'design-monolith';
  window.print();
  document.title  = original;
}