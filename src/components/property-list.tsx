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

interface PropertyListProps {
  initialData: {
    projects: projectListing[];
    total: number;
    page: number;
    totalPages: number;
    pageSize: number;
  };
  currentPage: number;
}

export default function PropertyList({ initialData, currentPage }: PropertyListProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const toggleFilter = (filter: string) => {
    if (filter === "all") {
      setSelectedFilters(["all"]);
    } else {
      setSelectedFilters(prev => {
        const newFilters = prev.filter(f => f !== "all");
        if (newFilters.includes(filter)) {
          return newFilters.filter(f => f !== filter);
        } else {
          return [...newFilters, filter];
        }
      });
    }
  };

  const sortProjects = (projects: projectListing[]) => {
    const sorted = [...projects];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.minPrice - b.minPrice);
      case "price-high":
        return sorted.sort((a, b) => b.minPrice - a.minPrice);
      case "popularity":
        return sorted.sort((a, b) => {
          const order: Record<string, number> = { A: 4, B: 3, C: 2, Z: 1 };
          return order[b.popularity] - order[a.popularity];
        });
      case "score":
        return sorted.sort((a, b) => b.propscore - a.propscore);
      case "area":
        return sorted.sort((a, b) => b.maxSaleableArea - a.maxSaleableArea);
      default:
        return sorted;
    }
  };

  const filterProjects = (projects: projectListing[]) => {
    if (selectedFilters.includes("all") || selectedFilters.length === 0) {
      return projects;
    }
    
    return projects.filter(project => {
      if (selectedFilters.includes("premium") && project.minPrice > 20000000) return true;
      if (selectedFilters.includes("popular") && project.popularity === "A") return true;
      if (selectedFilters.includes("ready") && new Date(project.possessionDate) <= new Date()) return true;
      if (selectedFilters.includes("high-rating") && project.propscore >= 4) return true;
      return false;
    });
  };

  const filteredAndSortedProjects = sortProjects(filterProjects(initialData?.projects || []));

  const propertyTypes = ["Apartment", "Villa", "Row House", "Plot"];
  const selectedPropertyType = "all";

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="rounded-2xl border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Premium Listings</h2>
            <p className="text-gray-400">
              {filteredAndSortedProjects.length} of {initialData.total} properties matching your criteria
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              {["all", "premium", "popular", "ready", "high-rating"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                    selectedFilters.includes(filter)
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  {filter === "all" ? "All" : 
                   filter === "premium" ? "Premium" :
                   filter === "popular" ? "Popular" :
                   filter === "ready" ? "Ready" : "High Rated"}
                </button>
              ))}
            </div>

            {/* View and Sort Controls */}
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg bg-gray-800 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === "list"
                      ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              >
                <option value="relevance" className="bg-gray-800">Sort by: Relevance</option>
                <option value="price-low" className="bg-gray-800">Price: Low to High</option>
                <option value="price-high" className="bg-gray-800">Price: High to Low</option>
                <option value="popularity" className="bg-gray-800">Popularity</option>
                <option value="score" className="bg-gray-800">Highest Rating</option>
                <option value="area" className="bg-gray-800">Largest Area</option>
              </select>
            </div>
          </div>
        </div>

        {/* Property Type Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <button
              key={type}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                selectedPropertyType === type.toLowerCase()
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Grid/List */}
      <div>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProjects.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedProjects.map((property) => (
              <PropertyRow key={property.id} property={property} />
            ))}
          </div>
        )}

        {filteredAndSortedProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-gray-700 bg-gray-900/50">
            <div className="text-amber-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No properties found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={() => setSelectedFilters(["all"])}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {initialData.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm">
          <div className="text-gray-400">
            Page <span className="font-semibold text-white">{currentPage}</span> of{" "}
            <span className="font-semibold text-white">{initialData.totalPages}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              ← Previous
            </button>
            
            {Array.from({ length: Math.min(5, initialData.totalPages) }, (_, i) => {
              let pageNum;
              if (initialData.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= initialData.totalPages - 2) {
                pageNum = initialData.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    currentPage === pageNum
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === initialData.totalPages}
              className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PropertyCard({ property }: { property: projectListing }) {
  return (
    <Link
      href={`/property/${property.slug}/${property.id}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.image}
            alt={property.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
          
          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <Badge variant="white" className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-gray-600">
              {property.type}
            </Badge>
            {property.popularity === "A" && (
              <Badge variant="success" className="bg-gradient-to-r from-emerald-500/90 to-emerald-600/90 backdrop-blur-sm border-emerald-600">
                🔥 Trending
              </Badge>
            )}
            {property.propscore >= 4.5 && (
              <Badge variant="warning" className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm border-amber-600">
                ⭐ Premium
              </Badge>
            )}
          </div>
          
          {/* Wishlist Button */}
          <button 
            className="absolute right-4 top-4 rounded-full bg-gray-900/80 backdrop-blur-sm p-2.5 hover:bg-amber-500/20 transition-colors group/wishlist"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle wishlist logic
            }}
          >
            <svg className="w-5 h-5 text-gray-400 group-hover/wishlist:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title and Location */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white line-clamp-1 mb-2 group-hover:text-amber-300 transition-colors">
              {property.name}
            </h3>
            <div className="flex items-center text-gray-400 text-sm">
              <LocationIcon className="mr-1.5" width={14} height={14} />
              <span className="line-clamp-1">{property.micromarket}, {property.city}</span>
            </div>
          </div>

          {/* Price and Score */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                {formatPrice(property.minPrice, false)}
              </div>
              <div className="text-sm text-gray-500">
                {property.minSaleableArea} - {property.maxSaleableArea} sqft
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PropscoreRating
                rating={property.propscore}
                width={100}
                height={20}
              />
              <span className="text-sm font-medium text-amber-400">
                {property.propscore.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <HouseIcon className="text-gray-500" width={16} height={16} />
                <span className="text-gray-300">
                  {concatenateTypologies(property.typologies)}
                </span>
              </div>
              <div className="text-gray-500 flex items-center gap-1.5">
                <CalendarIcon width={14} height={14} />
                {formatDate(property.possessionDate)}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <BudgetIcon className="text-gray-500" width={16} height={16} />
                <span className="font-medium text-gray-300">
                  Upto {formatPrice(property.maxPrice, false)}
                </span>
              </div>
              <div className="text-gray-500">
                By {property.developerName}
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 py-2.5 text-sm font-medium text-gray-300 hover:from-gray-700 hover:to-gray-600 hover:text-white transition-all group-hover:from-amber-500/10 group-hover:to-orange-500/10 group-hover:text-amber-300">
            View Details →
          </button>
        </div>
      </div>
    </Link>
  );
}

function PropertyRow({ property }: { property: projectListing }) {
  return (
    <Link
      href={`/property/${property.slug}/${property.id}`}
      className="group block"
    >
      <div className="flex flex-col lg:flex-row gap-6 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6 transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10">
        {/* Image */}
        <div className="relative h-48 lg:h-40 lg:w-64 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={property.image}
            alt={property.alt}
            fill
            sizes="256px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent"></div>
          <div className="absolute left-3 top-3">
            <Badge variant="white" className="bg-gray-900/90 backdrop-blur-sm border-gray-600">
              {property.type}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="mb-4">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {property.name}
                </h3>
                <div className="flex items-center text-gray-400 mb-3">
                  <LocationIcon className="mr-1.5" width={14} height={14} />
                  <span>{property.micromarket}, {property.city}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm">
                    {concatenateTypologies(property.typologies)}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm">
                    {property.minSaleableArea} - {property.maxSaleableArea} sqft
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm">
                    {formatDate(property.possessionDate)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    {formatPrice(property.minPrice, false)}
                  </div>
                  <div className="text-sm text-gray-500">Starting Price</div>
                </div>
                <div className="flex items-center gap-2">
                  <PropscoreRating
                    rating={property.propscore}
                    width={100}
                    height={24}
                  />
                  <span className="text-sm font-medium text-amber-400">
                    {property.propscore.toFixed(1)}
                  </span>
                </div>
                <button 
                  className="rounded-full p-2.5 hover:bg-amber-500/20 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle wishlist logic
                  }}
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Developer and Features */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                <span className="text-sm font-bold text-amber-400">
                  {property.developerName.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-white">{property.developerName}</div>
                <div className="text-sm text-gray-500">{property.landArea} acres land</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                Popularity: <span className={cn(
                  "font-semibold",
                  property.popularity === "A" ? "text-emerald-400" :
                  property.popularity === "B" ? "text-amber-400" :
                  property.popularity === "C" ? "text-orange-400" : "text-red-400"
                )}>{property.popularity}</span>
              </span>
              <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-sm font-medium text-gray-300 hover:from-gray-700 hover:to-gray-600 hover:text-white transition-all group-hover:from-amber-500/10 group-hover:to-orange-500/10 group-hover:text-amber-300">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}