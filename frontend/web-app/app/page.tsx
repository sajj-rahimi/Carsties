import Link from "next/link";
import {
  AiOutlineCar,
  AiOutlineArrowRight,
  AiOutlineTrophy,
  AiOutlineCalendar,
  AiOutlineDollar
} from "react-icons/ai";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-red-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-red-600 rounded-full">
                <AiOutlineCar className="text-white text-6xl" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-red-600">Carsties</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover amazing cars through our premium auction platform. Bid on
              your dream vehicle today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auction"
                className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-lg"
              >
                Browse Auctions
                <AiOutlineArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors text-lg"
              >
                Search Cars
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Carsties?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of car auctions with our cutting-edge
              platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-100 rounded-full">
                  <AiOutlineTrophy className="text-blue-600 text-3xl" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Premium Auctions
              </h3>
              <p className="text-gray-600">
                Access exclusive car auctions featuring high-quality vehicles
                from trusted sellers worldwide.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-green-100 rounded-full">
                  <AiOutlineCalendar className="text-green-600 text-3xl" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Real-time Bidding
              </h3>
              <p className="text-gray-600">
                Participate in live auctions with real-time bidding updates and
                instant notifications.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-yellow-100 rounded-full">
                  <AiOutlineDollar className="text-yellow-600 text-3xl" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Find incredible deals on cars with competitive bidding and
                transparent pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Bidding?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of car enthusiasts and find your perfect vehicle
              today.
            </p>
            <Link
              href="/auction"
              className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-lg"
            >
              View All Auctions
              <AiOutlineArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
