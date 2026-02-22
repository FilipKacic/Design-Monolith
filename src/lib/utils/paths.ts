import { resolve } from '$app/paths';

// ── Asset base path ───────────────────────────────────────────────────────────
// resolve('/') returns the app's base URL with a trailing slash (e.g. "/app/").
// Stripping it gives a clean prefix for constructing asset paths like
// `{assetBase}/icons/home.svg` without double-slash issues.

export const assetBase = resolve('/').replace(/\/$/, '');