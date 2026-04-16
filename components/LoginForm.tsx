import Link from "next/link";

export default function LoginForm() {
  return (
    <Link
      href="/app/social-bot"
      className="mt-6 block rounded-xl bg-indigo-600 px-4 py-3 text-center font-semibold text-white hover:bg-indigo-700"
    >
      Open Dashboard
    </Link>
  );
}
