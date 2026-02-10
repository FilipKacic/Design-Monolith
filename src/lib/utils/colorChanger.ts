import { COLORS, getColor } from '../constants/colors';
import type { WheelName, ColorName } from '../constants/colors';

export function setBackgroundColor(
  element: HTMLElement | null,
  color: ColorName | { wheel: WheelName; index: number }
) {
  if (!element) return; // Safety check

  let value: string;
  let index: number | undefined;

  if (typeof color === 'string') {
    value = COLORS[color];
    index = undefined; // unknown
  } else {
    const result = getColor(color.wheel, color.index);
    value = result.value;
    index = color.index;
  }

  element.style.backgroundColor = value;

  // Set text color based on index
  if (index !== undefined) {
    const whiteIndices = [0, 1, 8, 9, 10, 11]; // Indices for Mulberry, Red, Indigo, Blue, Lavender, Cylamen
    element.style.color = whiteIndices.includes(index) ? 'white' : 'black';
  }
}
