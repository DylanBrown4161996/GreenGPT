const DEFAULT_ADMIN_EMAILS = [
  "dylanbrown416@gmail.com",
  "dylan.brown@bodiibrand.com",
  "dylan.brown@greengptadvisory.com",
];

function buildAdminEmailSet(): Set<string> {
  const fromEnv = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  const emails = fromEnv?.length ? fromEnv : DEFAULT_ADMIN_EMAILS;
  return new Set(emails);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return buildAdminEmailSet().has(email.trim().toLowerCase());
}
