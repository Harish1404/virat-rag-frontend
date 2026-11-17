import { SignUp } from "@clerk/nextjs";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";

// Optional catch-all route so Clerk's sign-up steps (e.g. /sign-up/verify) all land here.
export default function SignUpPage() {
  return (
    <AuthPageShell>
      <SignUp />
    </AuthPageShell>
  );
}
