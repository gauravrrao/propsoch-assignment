import DiscoveryMap from "@/components/discovery-map";
import MapCaller from "@/components/MapCaller";
import PropertyList from "@/components/property-list";
import { PropertyListing } from "@/data/property-listing";
import { Metadata } from "next";

//TODO : Add meta data for this page
// Page should serve via SSR
// Do not add "use client" declarative

// TODO: Create a List view for these properties.
// Use your own imagination while designing, please don't copy Propsoch's current UI.
// We don't like it either.
// Add pagination
// You can modify the Property Listing however you want. If you feel like creating an API and implementing pagination via that, totally your call.
export const metadata: Metadata = {
  title: "Prime Properties | Discover Luxury Real Estate",
  description: "Explore premium apartments, villas, and plots with our interactive property discovery platform. Find your dream home in Bangalore.",
  keywords: "luxury real estate, premium properties, Bangalore homes, apartments, villas, plots",
  openGraph: {
    title: "Prime Properties | Discover Luxury Real Estate",
    description: "Interactive property discovery with premium listings and detailed insights.",
    type: "website",
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Prime Properties | Discover Luxury Real Estate",
    description: "Interactive property discovery with premium listings and detailed insights.",
  },
};

// Server-side pagination helper
async function getPaginatedProjects(page: number = 1, pageSize: number = 12) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const projects = PropertyListing.projects.slice(startIndex, endIndex);
  
  return {
    projects,
    total: PropertyListing.projects.length,
    page,
    totalPages: Math.ceil(PropertyListing.projects.length / pageSize),
    pageSize,
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 12;
  
  const paginatedData = await getPaginatedProjects(currentPage, pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500"></div>
                <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  PrimeProperties
                </span>
              </div>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">Discover</a>
                <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">Listings</a>
                <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">Developers</a>
                <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">Insights</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:from-gray-700 hover:to-gray-600 transition-all">
                Sign In
              </button>
              <button className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-amber-500/25">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Discover <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Premium Properties</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Explore handpicked luxury apartments, villas, and plots in Bangalore most sought-after locations.
            Filter, compare, and find your perfect property match.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">{paginatedData.total}</div>
            <div className="text-sm text-gray-400">Total Properties</div>
          </div>
          <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">₹2.1Cr+</div>
            <div className="text-sm text-gray-400">Avg. Price</div>
          </div>
          <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">4.2★</div>
            <div className="text-sm text-gray-400">Avg. Rating</div>
          </div>
          <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-sm text-gray-400">Premium Developers</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
              <MapCaller  projects={PropertyListing.projects} />
          </div>

          {/* Quick Filters Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['Apartment', 'Villa', 'Row House', 'Plot'].map((type) => (
                      <button key={type} className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white text-sm transition-colors">
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                  <div className="flex flex-wrap gap-2">
                    {['< ₹1Cr', '₹1-2Cr', '₹2-3Cr', '> ₹3Cr'].map((range) => (
                      <button key={range} className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white text-sm transition-colors">
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Possession</label>
                  <div className="flex flex-wrap gap-2">
                    {['Ready', '2025', '2026', '2027+'].map((year) => (
                      <button key={year} className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white text-sm transition-colors">
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Developer */}
            <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Featured Developer</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold">OP</span>
                </div>
                <div>
                  <div className="font-semibold text-white">Oakridge Properties</div>
                  <div className="text-sm text-gray-400">4.8★ • 12 Projects</div>
                </div>
              </div>
              <button className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-medium text-white hover:from-amber-600 hover:to-orange-600 transition-all">
                View All Projects
              </button>
            </div>
          </div>
        </div>

        {/* Properties List Section */}
        <div className="mt-8">
          <PropertyList 
            initialData={paginatedData}
            currentPage={currentPage}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500"></div>
                <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  PrimeProperties
                </span>
              </div>
              <p className="text-gray-500 text-sm max-w-md">
                Your trusted partner in discovering premium real estate properties with transparent insights and expert guidance.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Contact</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Careers</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-600 text-sm">
            © 2024 PrimeProperties. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}