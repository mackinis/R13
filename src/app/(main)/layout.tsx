
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroBanner } from '@/components/hero-banner';
import { WhatsAppChatButton } from '@/components/whatsapp-chat-button';
import type { StoreSettings } from '@/lib/data';
import { getStoreSettings } from '@/lib/data';

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeSettings: StoreSettings | null = await getStoreSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Header storeSettings={storeSettings} />
      <HeroBanner
        storeName={storeSettings?.storeName}
        heroSubtitle={storeSettings?.heroSubtitle}
        heroMediaUrl={storeSettings?.heroMediaUrl}
        heroMediaType={storeSettings?.heroMediaType}
      />
      <main className="flex-grow">{children}</main>
      <Footer storeSettings={storeSettings} />
      <WhatsAppChatButton />
    </div>
  );
}
