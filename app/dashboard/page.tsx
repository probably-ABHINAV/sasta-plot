
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { User } from "@stackframe/stack";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const user: User | null = await stackServerApp.getUser();

  if (!user) {
    redirect("/handler/sign-in");
  }

  return (
    <div className="container mx-auto p-12 space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.displayName || user.primaryEmail}!</h1>
      <div className="p-6 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">User Details</h2>
        <pre className="bg-gray-900 text-white p-4 rounded overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div>
        <a href="/handler/sign-out" className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Sign Out
        </a>
      </div>
    </div>
  );
}
