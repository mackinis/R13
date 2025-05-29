
"use client"; 

import { CarCard } from '@/components/car-card';
import { getAllCars, type Car, getStoreSettings, type StoreSettings } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/i18n-context';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const [cars, setCars] = useState<Car[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPageData() {
      setLoading(true);
      try {
        const [fetchedCars, fetchedSettings] = await Promise.all([
          getAllCars(), 
          getStoreSettings() 
        ]);
        setCars(fetchedCars);
        setStoreSettings(fetchedSettings);
      } catch (error) {
        console.error("Error fetching data for homepage:", error);
        setCars([]); 
        setStoreSettings(null);
      } finally {
        setLoading(false);
      }
    }
    loadPageData();
  }, []);
  
  const featuredCars = cars.slice(0, 4);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">{t('loadingPageContent')}</p>
      </div>
    );
  }

  return (
    <div>
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            {t('featuredVehiclesTitle')}
          </h2>
          <p className="text-center text-muted-foreground mb-10 md:mb-12 max-w-2xl mx-auto">
            {t('featuredVehiclesSubtitle')}
          </p>
          {featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">{t('noCarsAvailable')}</p>
          )}
          {cars.length > 0 && cars.length > featuredCars.length && ( 
             <div className="text-center mt-12">
              <Link href="/cars" passHref>
                <Button size="lg" variant="outline">{t('viewAllCarsButton')}</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="about" className="py-12 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t('aboutUsSectionTitle')}</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            {t('aboutUsSectionText', { storeName: storeSettings?.storeName || "AutoArtisan" })}
          </p>
          <Link href="/contact" passHref>
            <Button variant="default">{t('learnMoreButton')}</Button>
          </Link>
        </div>
      </section>

      <section id="contact" className="py-12 md:py-20 bg-background">
         <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t('getInTouchSectionTitle')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            {t('getInTouchSectionText')}
          </p>
          <Link href="/contact" passHref>
            <Button variant="primary">{t('contactUsButton')}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
