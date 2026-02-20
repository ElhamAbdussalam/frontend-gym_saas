import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="text-9xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>

        <div className="bg-white rounded-lg p-6 shadow-sm max-w-md mx-auto mb-6">
          <p className="text-sm text-gray-500 mb-3">
            Did you mean one of these?
          </p>
          <div className="space-y-2 text-left">
            <Link href="/" className="block text-blue-600 hover:underline">
              → / (Home)
            </Link>
            <Link
              href="/auth/login"
              className="block text-blue-600 hover:underline"
            >
              → /auth/login (Login)
            </Link>
            <Link
              href="/auth/register"
              className="block text-blue-600 hover:underline"
            >
              → /auth/register (Register)
            </Link>
            <Link
              href="/dashboard"
              className="block text-blue-600 hover:underline"
            >
              → /dashboard (Dashboard)
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
