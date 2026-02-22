import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// ── Storage keys ──────────────────────────────────────────────────────────
// Centralised so a key rename is a one-line change with no risk of mismatch
// between the read and write sides.

const KEYS = {
  useNewNaming:      'useNewNaming',
  selectedNoteIndex: 'selectedNoteIndex',
  selectedModeIndex: 'selectedModeIndex',
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────
// persistedWritable creates a writable store whose initial value is read from
// localStorage (SSR-safe via the browser guard) and whose changes are written
// back automatically via a subscribe callback.

function persistedWritable(key: string, defaultValue: boolean): ReturnType<typeof writable<boolean>>;
function persistedWritable(key: string, defaultValue: number):  ReturnType<typeof writable<number>>;
function persistedWritable(key: string, defaultValue: boolean | number) {
  const stored = browser ? localStorage.getItem(key) : null;

  const initial = stored === null
    ? defaultValue
    : typeof defaultValue === 'boolean'
      ? stored === 'true'
      : parseInt(stored, 10);

  const store = writable(initial);

  if (browser) {
    store.subscribe(value => localStorage.setItem(key, String(value)));
  }

  return store;
}

// ── Stores ────────────────────────────────────────────────────────────────

export const useNewNaming      = persistedWritable(KEYS.useNewNaming,      false);
export const selectedNoteIndex = persistedWritable(KEYS.selectedNoteIndex, 0);
export const selectedModeIndex = persistedWritable(KEYS.selectedModeIndex, 0);