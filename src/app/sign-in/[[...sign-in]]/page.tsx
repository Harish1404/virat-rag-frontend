import { SignIn } from "@clerk/nextjs";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";

// "[[...sign-in]]" is an optional catch-all route: Clerk uses extra URL parts
// for its own steps (e.g. /sign-in/factor-one), and they all land on this page.
export default function SignInPage() {
  return (
    <AuthPageShell>
      <SignIn />
    </AuthPageShell>
  );
}
