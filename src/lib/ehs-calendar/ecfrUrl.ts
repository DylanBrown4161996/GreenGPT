/**
 * Build eCFR.gov URLs from standard federal CFR citation strings.
 * Returns undefined for state codes, standards (NFPA/ANSI), and compound citations.
 */
export function citationToEcfrUrl(citation: string | undefined): string | undefined {
  if (!citation) return undefined;

  const c = citation.trim();
  if (c.includes("/") || !/^\d+\s+CFR\s+/.test(c)) return undefined;

  const match = c.match(/^(\d+)\s+CFR\s+([\d.]+)/);
  if (!match) return undefined;

  const title = match[1];
  const ref = match[2];
  const base = `https://www.ecfr.gov/current/title-${title}`;

  if (!ref.includes(".")) {
    return `${base}/part-${ref}`;
  }

  const part = ref.slice(0, ref.indexOf("."));

  if (title === "29" || title === "10") {
    return `${base}/section-${ref}`;
  }

  return `${base}/part-${part}/section-${ref}`;
}
