import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const initialError = params.error ? decodeURIComponent(params.error) : undefined;
  return <AdminLoginForm initialError={initialError} />;
}
