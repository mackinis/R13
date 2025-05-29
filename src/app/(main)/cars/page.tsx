
"use client";

import { CarCard } from '@/components/car-card';
import { getAllCars, type Car } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, ListFilter, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/i18n-context';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function CarsPageLoadingFallback() {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col justify-center items-center min-h-[50vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">{t('loadingCarCollection')}</p>
    </div>
  );
}

function CarsPageClientContent() {
  const { t } = useLanguage();
  const searchParamsHook = useSearchParams();
  const router = useRouter();

  const [allCars, setAllCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [uniqueBrands, setUniqueBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('all');

  useEffect(() => {
    // Initialize state from URL search params on mount or when searchParamsHook changes
    setQuery(searchParamsHook.get('q') || '');
    setBrand(searchParamsHook.get('brand') || 'all');
  }, [searchParamsHook]);


  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const fetchedCars: Car[] = await getAllCars();
        setAllCars(fetchedCars);
        setUniqueBrands(Array.from(new Set(fetchedCars.map(car => car.brand))));
      } catch (error) {
        console.error("Error fetching cars for all cars page:", error);
        setAllCars([]);
        setUniqueBrands([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    // This effect handles the actual filtering whenever allCars or the filter criteria (query, brand) change.
    // It now directly uses the state variables `query` and `brand` which are kept in sync with URL params.
    let carsToFilter = allCars;
    const currentQueryLower = query.toLowerCase();

    if (currentQueryLower) {
      carsToFilter = carsToFilter.filter(car =>
        car.name.toLowerCase().includes(currentQueryLower) ||
        car.brand.toLowerCase().includes(currentQueryLower)
      );
    }

    if (brand && brand !== 'all') {
      carsToFilter = carsToFilter.filter(car => car.brand === brand);
    }
    setFilteredCars(carsToFilter);
  }, [allCars, query, brand]); // query and brand are now direct dependencies from component state

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (brand && brand !== 'all') params.set('brand', brand);
    router.push(`/cars?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setQuery('');
    setBrand('all');
    router.push('/cars');
  };

  if (loading) {
    return <CarsPageLoadingFallback />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-foreground">{t('allCarsPageTitle')}</h1>

      <div className="mb-8 p-6 bg-card rounded-lg shadow">
        <form onSubmit={handleFilterSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium text-muted-foreground">{t('searchByNameBrandLabel')}</label>
              <div className="relative">
                <Input
                  type="text"
                  id="search"
                  name="q"
                  placeholder={t('searchByNameBrandPlaceholder')}
                  className="pr-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="brand" className="text-sm font-medium text-muted-foreground">{t('filterByBrandLabel')}</label>
              <Select name="brand" value={brand} onValueChange={setBrand}>
                <SelectTrigger id="brand">
                  <SelectValue placeholder={t('filterByBrandPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allBrandsOption')}</SelectItem>
                  {uniqueBrands.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <ListFilter className="mr-2 h-4 w-4" /> {t('applyFiltersButton')}
            </Button>
          </div>
        </form>
      </div>

      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
         <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {query || brand !== 'all' ? t('noCarsFoundTitle') : t('noCarsAvailableAdminPrompt')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {query || brand !== 'all' ? t('noCarsFoundText') : t('noCarsAvailableAdminPromptText')}
            </p>
            {(query || brand !== 'all') && (
                <Button variant="outline" onClick={handleClearFilters}>{t('clearFiltersButton')}</Button>
            )}
        </div>
      )}
    </div>
  );
}

export default function AllCarsPage() {
  return (
    <Suspense fallback={<CarsPageLoadingFallback />}>
      <CarsPageClientContent />
    </Suspense>
  );
}
