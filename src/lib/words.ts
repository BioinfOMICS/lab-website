/**
 * Small helpers that turn counts into the words the pages use, so sentences such as
 * "Six databases and web tools" follow the data files instead of being typed by hand.
 */
const WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
  'nineteen', 'twenty',
];

/** 6 -> "six". Numbers above twenty stay as digits. */
export function numberWord(n: number): string {
  return Number.isInteger(n) && n >= 0 && n <= 20 ? WORDS[n] : String(n);
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** 6 -> "Six" */
export function NumberWord(n: number): string {
  return capitalize(numberWord(n));
}

/** 104 -> "100+", 87 -> "87" */
export function roundedDownPlus(n: number, step = 100): string {
  return n < step ? String(n) : `${Math.floor(n / step) * step}+`;
}

/** 104 -> "more than a hundred", 215 -> "more than two hundred", 87 -> "87" */
export function moreThanHundreds(n: number): string {
  const hundreds = Math.floor(n / 100);
  if (hundreds < 1) return String(n);
  return `more than ${hundreds === 1 ? 'a' : numberWord(hundreds)} hundred`;
}

/** ["a", "b", "c"] -> "a, b and c" */
export function joinWithAnd(parts: string[]): string {
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}
