'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string | null;
  reviews: Review[];
}

interface RestaurantListProps {
  initialRestaurants: Restaurant[];
  isDemo: boolean;
}

export default function RestaurantList({ initialRestaurants, isDemo }: RestaurantListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi');

  // Ekstrak kota unik untuk opsi filter dropdown lokasi secara dinamis
  const locations = useMemo(() => {
    const list = initialRestaurants.map((r) => r.location.trim());
    return ['Semua Lokasi', ...Array.from(new Set(list))];
  }, [initialRestaurants]);

  // Logika filter berdasarkan pencarian teks dan lokasi
  const filteredRestaurants = useMemo(() => {
    return initialRestaurants.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        selectedLocation === 'Semua Lokasi' ||
        r.location.trim().toLowerCase() === selectedLocation.trim().toLowerCase();

      return matchesSearch && matchesLocation;
    });
  }, [initialRestaurants, searchQuery, selectedLocation]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < Math.round(rating);
          return (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${isFilled ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 dark:text-zinc-800 fill-zinc-100 dark:fill-zinc-900/50'}`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
    );
  };

  const getAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between w-full p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm">
        {/* Search Input */}
        <div className="relative flex-grow max-w-lg">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari nama restoran, menu, atau kota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-950 dark:focus:border-zinc-100 focus:outline-none transition-colors"
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative min-w-[160px]">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200 focus:border-zinc-950 dark:focus:border-zinc-100 focus:outline-none transition-colors appearance-none cursor-pointer pr-8"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Featured Restaurants Section */}
      <main id="restoran-pilihan" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-zinc-150 dark:border-zinc-850 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Restoran Pilihan</h2>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
              Daftar restoran pilihan yang dikurasi oleh para penikmat kuliner.
            </p>
          </div>
          {isDemo && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/50 self-start md:self-auto font-medium">
              Mode Demo (Database Kosong)
            </span>
          )}
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((r) => {
              const avgRating = getAverageRating(r.reviews);
              return (
                <div
                  key={r.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300"
                >
                  {/* Image Container with Hover Effect */}
                  <div className="card-img-container bg-zinc-100 dark:bg-zinc-850">
                    {r.imageUrl ? (
                      <img
                        src={r.imageUrl}
                        alt={r.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-50 dark:bg-zinc-850 text-zinc-400 dark:text-zinc-500">
                        <svg className="w-8 h-8 stroke-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/95 dark:bg-zinc-900/95 px-2.5 py-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm backdrop-blur-sm border border-zinc-150 dark:border-zinc-800">
                        📍 {r.location}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-5 space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                        {r.name}
                      </h3>
                    </div>

                    <p className="text-sm text-zinc-600 dark:text-zinc-350 line-clamp-2 leading-relaxed flex-grow">
                      {r.description}
                    </p>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4 mt-auto">
                      {/* Stars and Review Count */}
                      <div className="flex items-center gap-2">
                        {renderStars(avgRating)}
                        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                          {avgRating > 0 ? avgRating.toFixed(1) : '-'} ({r.reviews.length})
                        </span>
                      </div>

                      <Link
                        href={`/restaurants/${r.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800 group-hover:bg-zinc-950 dark:group-hover:bg-zinc-50 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-white dark:group-hover:text-zinc-950 transition-all duration-200"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State Fallback */
          <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-xl bg-white dark:bg-zinc-900/10 space-y-3">
            <svg className="w-10 h-10 text-zinc-350 dark:text-zinc-650 mx-auto stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">Tidak ada restoran ditemukan</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-450 max-w-sm mx-auto">
              Tidak ada kuliner yang cocok dengan kata kunci "{searchQuery}" atau lokasi "{selectedLocation}". Coba cari menu atau kota lain.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLocation('Semua Lokasi');
              }}
              className="mt-2 text-xs font-semibold text-zinc-950 dark:text-zinc-50 underline hover:text-zinc-700"
            >
              Reset Filter
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
