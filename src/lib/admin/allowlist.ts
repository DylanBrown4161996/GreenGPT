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

/** Comma-separated ADMIN_EMAILS env, or built-in defaults. */
export function getAdminNotifyEmails(): string[] {
  const fromEnv = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()).filter(Boolean);
  return fromEnv?.length ? fromEnv : [...DEFAULT_ADMIN_EMAILS];
}

/** Recipients for new facility intake alerts (INTAKE_NOTIFY_EMAIL overrides ADMIN_EMAILS). */
export function getIntakeNotifyEmails(): string[] {
  const override = process.env.INTAKE_NOTIFY_EMAIL?.split(",").map((e) => e.trim()).filter(Boolean);
  if (override?.length) return override;
  return getAdminNotifyEmails();
}
