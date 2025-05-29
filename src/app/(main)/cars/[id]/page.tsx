
"use client"; 

import Image from 'next/image';
import { getCarById, type Car } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar, Palette, Gauge, Settings, Zap, CheckCircle, Mail, Phone as PhoneIconLucide, Loader2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from '@/contexts/i18n-context';
import { useEffect, useState } from 'react';

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const { t, language } = useLanguage();
  const [car, setCar] = useState<Car | undefined | null>(undefined); // null for not found, undefined for loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCarAndSettings() {
      if (params.id) {
        setLoading(true);
        try {
          const fetchedCar: Car | undefined = await getCarById(params.id);
          setCar(fetchedCar || null);
        } catch (error) {
          console.error(`Error fetching car ${params.id}:`, error);
          setCar(null);
        } finally {
          setLoading(false);
        }
      } else {
        setCar(null);
        setLoading(false);
      }
    }
    loadCarAndSettings();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">{t('loadingCarDetails')}</p>
      </div>
    );
  }

  if (car === null) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">{t('carNotFoundTitle')}</h1>
        <p className="text-muted-foreground">{t('carNotFoundText')}</p>
        <Link href="/cars" className="mt-4 inline-block">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToAllCarsLink')}
          </Button>
        </Link>
      </div>
    );
  }

  const contactPhoneNumber = t('siteContactPhone');

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cars" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToAllCarsLink')}
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          {car.images && car.images.length > 0 && (
            <Carousel className="w-full rounded-lg overflow-hidden shadow-xl">
              <CarouselContent>
                {car.images.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video">
                      <Image
                        src={src}
                        alt={t('carImageAlt', { carName: car.name, index: index + 1 })}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="rounded-md object-cover"
                        data-ai-hint={`${car.brand} detail view`}
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {car.images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background text-foreground" />
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background text-foreground" />
                </>
              )}
            </Carousel>
          )}
           {(!car.images || car.images.length === 0) && (
            <div className="relative aspect-video bg-muted rounded-lg shadow-xl flex items-center justify-center">
              <p className="text-muted-foreground">{t('noImagesAvailable')}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-foreground">{car.name}</h1>
          <p className="text-lg text-muted-foreground">{car.brand}</p>
          
          <div className="text-4xl font-extrabold text-primary">
            {(car.price || 0).toLocaleString(language, { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm border-t border-b py-4">
            <div className="flex items-center"><Calendar size={18} className="mr-2 text-primary/80" /> {t('carDetailYearLabel')}: <span className="font-semibold ml-1">{car.year}</span></div>
            <div className="flex items-center"><Gauge size={18} className="mr-2 text-primary/80" /> {t('carDetailMileageLabel')}: <span className="font-semibold ml-1">{(car.mileage || 0).toLocaleString(language, {maximumFractionDigits: 0})} km</span></div>
            <div className="flex items-center">
              {car.fuelType === 'Electric' ? <Zap size={18} className="mr-2 text-primary/80" /> : <Gauge size={18} className="mr-2 text-primary/80" />}
              {t('carDetailFuelTypeLabel')}: <span className="font-semibold ml-1">{t(`fuelType${car.fuelType}` as any, car.fuelType)}</span>
            </div>
            <div className="flex items-center"><Settings size={18} className="mr-2 text-primary/80" /> {t('carDetailTransmissionLabel')}: <span className="font-semibold ml-1">{t(`transmission${car.transmission}` as any, car.transmission)}</span></div>
            <div className="flex items-center"><Palette size={18} className="mr-2 text-primary/80" /> {t('carDetailColorLabel')}: <span className="font-semibold ml-1">{car.color}</span></div>
            <div className="flex items-center"><Settings size={18} className="mr-2 text-primary/80" /> {t('carDetailEngineSizeLabel')}: <span className="font-semibold ml-1">{car.engineSize}</span></div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">{t('carDetailDescriptionTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">{car.description}</p>
          </div>

          {car.features && car.features.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">{t('carDetailFeaturesTitle')}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {car.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-muted-foreground">
                    <CheckCircle size={16} className="mr-2 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="pt-6 border-t">
             <h2 className="text-2xl font-semibold text-foreground mb-4">{t('carDetailInterestedTitle')}</h2>
             <p className="text-muted-foreground mb-4">{t('carDetailInterestedText')}</p>
             <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/contact?carName=${encodeURIComponent(car.name)}&carId=${car.id}`} passHref>
                    <Button size="lg" className="flex-1 w-full sm:w-auto">
                        <Mail className="mr-2 h-5 w-5" /> {t('carDetailEmailUsButton')}
                    </Button>
                </Link>
                <a href={`tel:${contactPhoneNumber.replace(/\D/g, '')}`}>
                    <Button size="lg" variant="outline" className="flex-1 w-full sm:w-auto">
                        <PhoneIconLucide className="mr-2 h-5 w-5" /> {t('carDetailCallUsButton')}
                    </Button>
                </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
