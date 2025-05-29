
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/i18n-context';
import type { HeroMediaType } from '@/lib/data';

interface HeroBannerProps {
  storeName?: string | null;
  heroSubtitle?: string | null;
  heroMediaUrl?: string | null;
  heroMediaType?: HeroMediaType | null;
}

export function HeroBanner({ storeName, heroSubtitle, heroMediaUrl, heroMediaType }: HeroBannerProps) {
  const { t } = useLanguage();

  const displayStoreName = storeName || "AutoArtisan"; 
  const displaySubtitle = heroSubtitle || t('heroSubtitle'); 
  const currentHeroMediaUrl = heroMediaUrl || "https://placehold.co/1920x1080.png";
  const currentHeroMediaType = heroMediaType || 'image'; // Default to image if not specified

  return (
    <div className="relative h-[70vh] min-h-[400px] max-h-[700px] w-full overflow-hidden">
      {currentHeroMediaType === 'image' ? (
        <Image
          src={currentHeroMediaUrl}
          alt={t('heroAltText', { storeName: displayStoreName })}
          fill
          sizes="100vw"
          className="object-cover animate-ken-burns"
          quality={85}
          priority
          data-ai-hint={heroMediaUrl ? "dealership hero image" : "luxury car dealership"}
        />
      ) : currentHeroMediaType === 'video' && currentHeroMediaUrl ? (
        <video
          src={currentHeroMediaUrl}
          autoPlay
          loop
          muted
          playsInline // Important for iOS
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
          data-ai-hint={heroMediaUrl ? "dealership hero video" : "automotive lifestyle video"}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        // Fallback for misconfiguration or missing URL - could be a static placeholder
        <Image
          src="https://placehold.co/1920x1080.png"
          alt={t('heroAltText', { storeName: displayStoreName })}
          fill
          sizes="100vw"
          className="object-cover animate-ken-burns"
          quality={85}
          priority
          data-ai-hint="placeholder"
        />
      )}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-fade-in-down drop-shadow-lg">
          {t('heroTitle', { storeName: displayStoreName })}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in-up animation-delay-300 drop-shadow-md">
          {displaySubtitle}
        </p>
        <Link href="/cars" passHref>
          <Button size="lg" className="animate-fade-in-up animation-delay-600 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {t('heroExploreButton')}
          </Button>
        </Link>
      </div>
      <style jsx global>{`
        @keyframes kenburns {
          0% {
            transform: scale(1.1) translate(0, 0);
          }
          100% {
            transform: scale(1) translate(0, 0);
          }
        }
        .animate-ken-burns {
          animation: kenburns 30s ease-out infinite alternate;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
}
