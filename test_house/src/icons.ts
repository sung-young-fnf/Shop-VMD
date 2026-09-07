const paths = {
  house:'M3 10 12 3l9 7M5 9v12h14V9M9 21v-8h6v8',
  roof:'M2 12 12 3l10 9M5 12v8h14v-8M9 16h6',
  plan:'M3 3h18v18H3zM10 3v8h11M3 15h7v6',
  layers:'m12 3 10 5-10 5L2 8ZM2 12l10 5 10-5M2 16l10 5 10-5',
  moon:'M20.9 13a9 9 0 0 1-9.9-9.9A9 9 0 1 0 20.9 13Z',
  sun:'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  plus:'M12 5v14M5 12h14',minus:'M5 12h14',
  reset:'M3 11a9 9 0 1 1 2 7M3 4v7h7',
  rotate:'M3 8h14l-3-3M21 16H7l3 3M17 8a5 5 0 0 1 4 5M7 16a5 5 0 0 1-4-5',
  bed:'M3 17v4m18-4v4M3 17h18V9H3v8ZM3 9V5h18v4M7 9V7h4v2m2 0V7h4v2',
  kitchen:'M4 3v7h5V3M6.5 10v11M17 3c-3 4-3 8 1 8v10M18 3v8',
  living:'M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M3 10v8h18v-8M3 14h18M5 18v3m14-3v3',
  tree:'m12 3 6 7h-3l5 7H4l5-7H6l6-7ZM12 17v5',
  garage:'M3 21V8l9-5 9 5v13M6 21V10h12v11M6 14h12M6 18h12',
} as const;
export type Icon = keyof typeof paths;
export function icon(name: Icon): string { return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]}"/></svg>`; }
