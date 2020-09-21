export function replaceNewlineEscapes(s: string): string {
  return s.replace(/\\n/g, '\n');
}
