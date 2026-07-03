export const cls = (...xs: (string | boolean | undefined | null)[]) => xs.filter(Boolean).join(" ");
