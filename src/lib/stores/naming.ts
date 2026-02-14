// src/lib/stores/naming.ts

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Get initial value from localStorage or default to false
const initialUseNewNaming = browser 
  ? localStorage.getItem('useNewNaming') === 'true'
  : false;

// Get initial note index from localStorage or default to 0
const initialNoteIndex = browser
  ? parseInt(localStorage.getItem('selectedNoteIndex') || '0', 10)
  : 0;

// Get initial mode index from localStorage or default to 0
const initialModeIndex = browser
  ? parseInt(localStorage.getItem('selectedModeIndex') || '0', 10)
  : 0;

// Create the stores
export const useNewNaming = writable<boolean>(initialUseNewNaming);
export const selectedNoteIndex = writable<number>(initialNoteIndex);
export const selectedModeIndex = writable<number>(initialModeIndex);

// Subscribe to changes and save to localStorage
if (browser) {
  useNewNaming.subscribe(value => {
    localStorage.setItem('useNewNaming', String(value));
  });

  selectedNoteIndex.subscribe(value => {
    localStorage.setItem('selectedNoteIndex', String(value));
  });

  selectedModeIndex.subscribe(value => {
    localStorage.setItem('selectedModeIndex', String(value));
  });
}