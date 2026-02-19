import Link from "next/link";
import {
  ArrowRight,
  Check,
  BarChart3,
  Users,
  Calendar,
  CreditCard,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
              <span className="text-2xl font-bold text-white">GymFlow</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-300 hover:text-white transition"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-gray-300 hover:text-white transition"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Manage Your Gym
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Like a Pro
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
            All-in-one gym management platform with member tracking, class
            scheduling, attendance monitoring, and subscription billing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg text-white text-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              Start 14-Day Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#demo"
              className="border-2 border-white/20 px-8 py-4 rounded-lg text-white text-lg font-semibold hover:bg-white/10 transition"
            >
              Watch Demo
            </Link>
          </div>
          <p className="text-gray-400 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-300">
            Powerful features to run your gym efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Member Management"
            description="Track memberships, renewals, and member information in one place"
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8" />}
            title="Class Scheduling"
            description="Schedule classes, manage bookings, and track attendance seamlessly"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Analytics Dashboard"
            description="Real-time insights on revenue, attendance, and member growth"
          />
          <FeatureCard
            icon={<CreditCard className="w-8 h-8" />}
            title="Payment Processing"
            description="Automated billing, payment tracking, and financial reporting"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300">
            Choose the plan that fits your gym
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            name="Starter"
            price="49"
            description="Perfect for small gyms"
            features={[
              "Up to 50 members",
              "Up to 3 trainers",
              "Up to 10 classes",
              "Basic analytics",
              "Email support",
            ]}
          />
          <PricingCard
            name="Pro"
            price="199"
            description="For growing fitness centers"
            features={[
              "Unlimited members",
              "Unlimited trainers",
              "Unlimited classes",
              "Advanced analytics",
              "Priority support",
              "Custom branding",
            ]}
            featured
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Transform Your Gym?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of gyms already using GymFlow
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 GymFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-lg flex items-center justify-center mb-4 text-white">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  description,
  features,
  featured,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-8 ${
        featured
          ? "bg-gradient-to-br from-purple-600 to-pink-600 transform scale-105"
          : "bg-white/5 backdrop-blur-lg border border-white/10"
      }`}
    >
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <p className="text-gray-300 mb-6">{description}</p>
      <div className="mb-6">
        <span className="text-5xl font-bold text-white">${price}</span>
        <span className="text-gray-300">/month</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-white">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/register"
        className={`block text-center px-6 py-3 rounded-lg font-semibold transition ${
          featured
            ? "bg-white text-purple-600 hover:bg-gray-100"
            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
        }`}
      >
        Get Started
      </Link>
    </div>
  );
}
