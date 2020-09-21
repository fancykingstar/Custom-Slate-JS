export function removeLastSentence(s: string): string {
  return s.replace(/\.[^.]+$/, '.');
}
