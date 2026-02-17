import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold">🏋️ GymFlow</h1>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">
            Manage Your Gym Like a Pro
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            All-in-one gym management platform with member tracking, class
            scheduling, attendance, and analytics.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required • 14-day free trial
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">👥 Member Management</h3>
            <p className="text-gray-300">
              Track members, memberships, and QR code check-ins easily.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">📅 Class Scheduling</h3>
            <p className="text-gray-300">
              Schedule classes, manage bookings, and track attendance.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">📊 Analytics</h3>
            <p className="text-gray-300">
              Real-time insights on revenue, attendance, and growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
