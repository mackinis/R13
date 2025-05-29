
"use client"; // For useLanguage hook

import Image from 'next/image';
import Link from 'next/link';
import type { Car } from '@/lib/data';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Calendar, Gauge, Palette, Settings, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/i18n-context';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const { t, language } = useLanguage();
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full rounded-lg">
      <CardHeader className="p-0">
        <Link href={`/cars/${car.id}`} className="block relative aspect-video w-full">
          <Image
            src={car.images[0]}
            alt={`Image of ${car.name}`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="hover:scale-105 transition-transform duration-300 object-cover"
            data-ai-hint={`${car.brand} ${car.color}`}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/cars/${car.id}`} className="block">
          <CardTitle className="text-xl font-semibold mb-1 hover:text-primary transition-colors">
            {car.name}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">{car.brand}</p>
        <div className="flex items-center justify-between mb-3">
          <p className="text-2xl font-bold text-primary">
            {car.price.toLocaleString(language, { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <Badge variant="secondary">{car.year}</Badge>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center">
            <Gauge size={14} className="mr-1.5 text-primary/70" /> {car.mileage.toLocaleString(language, {maximumFractionDigits: 0})} km
          </div>
          <div className="flex items-center">
            {car.fuelType === 'Electric' ? <Zap size={14} className="mr-1.5 text-primary/70" /> : <Tag size={14} className="mr-1.5 text-primary/70" />} {car.fuelType}
          </div>
          <div className="flex items-center">
            <Settings size={14} className="mr-1.5 text-primary/70" /> {car.transmission}
          </div>
          <div className="flex items-center">
             <Palette size={14} className="mr-1.5 text-primary/70" /> {car.color}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Link href={`/cars/${car.id}`} className="w-full">
          <Button variant="default" className="w-full">
            {t('carCardViewDetails')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
