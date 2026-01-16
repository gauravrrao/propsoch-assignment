"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropscoreRating } from "@/assets/PropsochRating";
import {
  cn,
  concatenateTypologies,
  formatDate,
  formatPrice,
  para,
} from "@/utils/helpers";
import { BudgetIcon } from "@/assets/budget-icon";
import { HouseIcon } from "@/assets/house-icon";
import { LocationIcon } from "@/assets/location-icon";
import { CalendarIcon } from "@/assets/utility";
import { Badge } from "./badge";
import { projectListing } from "@/types/types";
import { Share2, Heart, Phone, MapPin, Ruler, Building, Users, Car } from "lucide-react";

interface PropertyDetailProps {
  property: projectListing;
  similarProperties: projectListing[];
}

export default function PropertyDetail({ property, similarProperties }: PropertyDetailProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(property.image);

  const images = [
    property.image,
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
  ];

  const amenities = [
    { icon: "🏊", label: "Swimming Pool" },
    { icon: "🏋️", label: "Gym" },
    { icon: "🌳", label: "Garden" },
    { icon: "🚗", label: "Parking" },
    { icon: "👨‍👩‍👧‍👦", label: "Kids Play Area" },
    { icon: "🛒", label: "Shopping Mall" },
    { icon: "🏥", label: "Hospital" },
    { icon: "🎾", label: "Tennis Court" },
  ];

  const propertyHighlights = [
    { label: "Project Status", value: property.projectStatus === "available" ? "Under Construction" : "Ready" },
    { label: "Land Area", value: `${property.landArea} acres` },
    { label: "Total Units", value: "150" },
    { label: "Floors", value: "15" },
    { label: "Lifts", value: "4" },
    { label: "Parking", value: "2 per unit" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Back Navigation */}
      <div className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Listings</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-amber-500 text-amber-500" : "text-gray-400"}`} />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Property Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="white" className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
                  {property.type}
                </Badge>
                <Badge variant="success" className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/30">
                  {property.projectStatus === "available" ? "Available" : "Sold Out"}
                </Badge>
                <Badge variant="warning" className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
                  Popularity: {property.popularity}
                </Badge>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                {property.name}
              </h1>
              
              <div className="flex items-center gap-4 text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <LocationIcon className="w-5 h-5" />
                  <span>{property.micromarket}, {property.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Possession: {formatDate(property.possessionDate)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    {formatPrice(property.minPrice, false)}
                  </div>
                  <div className="text-sm text-gray-500">Starting Price</div>
                </div>
                <div className="h-12 w-px bg-gray-700"></div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {formatPrice(property.maxPrice, false)}
                  </div>
                  <div className="text-sm text-gray-500">Maximum Price</div>
                </div>
                <div className="h-12 w-px bg-gray-700"></div>
                <div>
                  <div className="text-2xl font-bold text-white flex items-center gap-2">
                    {property.propscore.toFixed(1)} <PropscoreRating rating={property.propscore} width={100} height={20} />
                  </div>
                  <div className="text-sm text-gray-500">Property Score</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-80">
              <div className="rounded-2xl border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Developer Info</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {property.developerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{property.developerName}</div>
                    <div className="text-sm text-gray-400">4.8★ Rating • 12 Projects</div>
                  </div>
                </div>
                <button className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all mb-3">
                  Contact Developer
                </button>
                <button className="w-full rounded-lg border border-gray-600 bg-gray-800 py-3 text-gray-300 font-medium hover:bg-gray-700 transition-all">
                  Schedule Site Visit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src={selectedImage}
                  alt={property.alt}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {images.slice(1).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className="relative h-44 rounded-xl overflow-hidden group"
                >
                  <Image
                    src={img}
                    alt={`Property image ${index + 2}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 transition-all ${
                    selectedImage === img ? "ring-2 ring-amber-500" : "group-hover:ring-2 group-hover:ring-amber-500/50"
                  }`}></div>
                </button>
              ))}
              <button className="relative h-44 rounded-xl overflow-hidden group bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-dashed border-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-2">+{images.length - 4}</div>
                  <div className="text-sm text-gray-400">More Photos</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-700">
            {["overview", "specifications", "amenities", "location", "similar"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-3 text-sm font-medium transition-all relative",
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-2xl font-bold text-white mb-6">Property Overview</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-4">
                      Welcome to {property.name}, an exquisite {property.type.toLowerCase()} project nestled in the heart of {property.micromarket}, {property.city}. 
                      This premium development offers a perfect blend of luxury, comfort, and modern living.
                    </p>
                    <p className="text-gray-300 mb-4">
                      Featuring {concatenateTypologies(property.typologies)} configurations ranging from {property.minSaleableArea} to {property.maxSaleableArea} square feet, 
                      each unit is meticulously designed to maximize space and natural light.
                    </p>
                    <p className="text-gray-300">
                      Developed by {property.developerName}, a renowned name in the real estate industry, 
                      this project promises world-class amenities, superior construction quality, and timely possession.
                    </p>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {propertyHighlights.map((highlight, index) => (
                      <div key={index} className="rounded-xl border border-gray-700 bg-gray-900/50 p-4">
                        <div className="text-sm text-gray-400 mb-1">{highlight.label}</div>
                        <div className="text-lg font-semibold text-white">{highlight.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="rounded-2xl border border-gray-700 bg-gray-900/50 p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Price Calculator</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Select Typology</label>
                        <select className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white">
                          {property.typologies.map((type) => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Area (sqft)</label>
                        <input
                          type="range"
                          min={property.minSaleableArea}
                          max={property.maxSaleableArea}
                          step="100"
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-400 mt-2">
                          <span>{property.minSaleableArea} sqft</span>
                          <span>{property.maxSaleableArea} sqft</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-700">
                        <div className="text-sm text-gray-400 mb-1">Estimated Price</div>
                        <div className="text-2xl font-bold text-amber-400">₹2.85 Cr</div>
                      </div>
                      <button className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all">
                        Calculate EMI
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "amenities" && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Amenities & Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-900/50 p-4 hover:border-amber-500/30 transition-colors">
                      <span className="text-2xl">{amenity.icon}</span>
                      <span className="text-gray-300">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "location" && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Location & Connectivity</h3>
                <div className="rounded-2xl overflow-hidden h-96 bg-gradient-to-br from-gray-900 to-gray-800 mb-6">
                  {/* Simplified map */}
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                      <div className="text-white font-semibold mb-2">{property.micromarket}, {property.city}</div>
                      <div className="text-gray-400">Lat: {property.latitude.toFixed(6)}, Lng: {property.longitude.toFixed(6)}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <Car className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="font-semibold text-white">Distance to Key Locations</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Airport</span>
                        <span className="text-white">35 km</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">City Center</span>
                        <span className="text-white">12 km</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Metro Station</span>
                        <span className="text-white">2.5 km</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Building className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="font-semibold text-white">Nearby Facilities</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Schools</span>
                        <span className="text-white">3 within 3 km</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Hospitals</span>
                        <span className="text-white">2 within 5 km</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Malls</span>
                        <span className="text-white">1.8 km</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <Users className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="font-semibold text-white">Neighborhood</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">
                        Located in one of {property.city} most prestigious neighborhoods, {property.micromarket} offers a perfect balance of urban convenience and peaceful living.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "similar" && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Similar Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {similarProperties.map((similar) => (
                    <Link
                      key={similar.id}
                      href={`/property/${similar.slug}/${similar.id}`}
                      className="group block"
                    >
                      <div className="rounded-xl border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800 p-4 hover:border-amber-500/50 transition-all">
                        <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                          <Image
                            src={similar.image}
                            alt={similar.alt}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-semibold text-white mb-2 line-clamp-1">{similar.name}</h4>
                        <div className="flex items-center text-gray-400 text-sm mb-2">
                          <LocationIcon className="w-3 h-3 mr-1" />
                          <span className="line-clamp-1">{similar.micromarket}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-amber-400">
                            {formatPrice(similar.minPrice, false)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {similar.propscore.toFixed(1)}★
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Make This Your New Home?</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Schedule a site visit today and experience the luxury of {property.name} firsthand.
            Our property experts are ready to assist you with all your queries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all">
              <Phone className="w-5 h-5" />
              Call Now: +91 98765 43210
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-8 py-3 text-gray-300 font-medium hover:bg-gray-700 transition-all">
              <CalendarIcon className="w-5 h-5" />
              Schedule Virtual Tour
            </button>
          </div>
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
              <p className="text-gray-500 text-sm">
                Your trusted partner in premium real estate.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Data updated: Today • RERA Registered: AP123456789
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}