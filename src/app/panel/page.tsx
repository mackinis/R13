
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebaseConfig';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/hooks/use-toast";
import type { Car, FooterConfig, StoreSettings, HeroMediaType, ChatWidgetSettings } from '@/lib/data';
import {
  getAllCars as fetchAllCarsFromDb,
  getFooterContent as fetchFooterContentFromDb,
  getStoreSettings as fetchStoreSettingsFromDb,
  getChatWidgetSettings as fetchChatWidgetSettingsFromDb,
  addCar as addCarToDb,
  updateCar as updateCarInDb,
  deleteCar as deleteCarFromDb,
  updateFooterContent as persistFooterContentToDb,
  updateStoreSettings as persistStoreSettingsToDb,
  updateChatWidgetSettings as persistChatWidgetSettingsToDb,
  DEFAULT_CHAT_WIDGET_SETTINGS
} from '@/lib/data';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/i18n-context';

type EditableCar = Partial<Car> & { id?: string };
type SocialLink = { platform: string; url: string };

export default function PanelPage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true); // For Firestore data loading

  const [cars, setCars] = useState<EditableCar[]>([]);
  const [currentCar, setCurrentCar] = useState<EditableCar>({});
  const [isEditingCar, setIsEditingCar] = useState(false);

  const [footerConfig, setFooterConfig] = useState<Partial<FooterConfig>>({});
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const [storeSettings, setStoreSettings] = useState<Partial<StoreSettings>>({
    storeName: '',
    logoUrl: '',
    logoUrlDark: '',
    heroSubtitle: '',
    heroMediaUrl: '',
    heroMediaType: 'image',
  });
  const [mapQuery, setMapQuery] = useState('');

  const [chatSettings, setChatSettings] = useState<Partial<ChatWidgetSettings>>({
    isChatEnabled: true,
    customIconUrl: '',
    iconSize: 40,
    phoneNumber: '',
    defaultMessage: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('[PanelPage] onAuthStateChanged, user:', user?.email);
      if (user) {
        if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          setAuthUser(user);
          setIsCheckingAuth(false);
        } else {
          console.warn('[PanelPage] Authenticated user email does not match ADMIN_EMAIL. Redirecting to login.');
          setAuthUser(null);
          router.push('/auth/login'); // Unauthorized admin
        }
      } else {
        console.log('[PanelPage] No user authenticated. Redirecting to login.');
        setAuthUser(null);
        router.push('/auth/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadInitialData = useCallback(async () => {
    if (!authUser) return; // Don't load data if not authenticated admin

    console.log('[PanelPage] Authenticated admin. Loading Firestore data...');
    setIsLoadingData(true);
    try {
      const [fetchedCars, fetchedFooter, fetchedStore, fetchedChat] = await Promise.all([
        fetchAllCarsFromDb(),
        fetchFooterContentFromDb(),
        fetchStoreSettingsFromDb(),
        fetchChatWidgetSettingsFromDb()
      ]);

      setCars(fetchedCars);

      setFooterConfig(fetchedFooter || { copyrightText: '', socialLinks: [], contactInfo: { address: '', phone: '', email: '', mapQuery: '' } });
      setSocialLinks(fetchedFooter?.socialLinks || []);
      setMapQuery(fetchedFooter?.contactInfo?.mapQuery || '');

      setStoreSettings(fetchedStore || {
        storeName: '',
        logoUrl: '',
        logoUrlDark: '',
        heroSubtitle: '',
        heroMediaUrl: '',
        heroMediaType: 'image',
      });

      setChatSettings(fetchedChat || DEFAULT_CHAT_WIDGET_SETTINGS);
      console.log('[PanelPage] Firestore data loaded successfully.');
    } catch (error) {
      console.error("[PanelPage] Failed to load initial panel data from Firestore:", error);
      toast({ title: t('errorLoadingDataTitle'), description: t('errorLoadingDataDesc'), variant: "destructive" });
      // Set to defaults on error
      setCars([]);
      setFooterConfig({ copyrightText: '', socialLinks: [], contactInfo: { address: '', phone: '', email: '', mapQuery: '' } });
      setStoreSettings({ storeName: '', logoUrl: '', logoUrlDark: '', heroSubtitle: '', heroMediaUrl: '', heroMediaType: 'image'});
      setSocialLinks([]);
      setMapQuery('');
      setChatSettings(DEFAULT_CHAT_WIDGET_SETTINGS);
    } finally {
      setIsLoadingData(false);
    }
  }, [authUser, toast, t]);

  useEffect(() => {
    if (authUser && !isCheckingAuth) {
      loadInitialData();
    }
  }, [authUser, isCheckingAuth, loadInitialData]);


  // Car Input Change Handler
  const handleCarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'year' || name === 'mileage') {
      setCurrentCar({ ...currentCar, [name]: Number(value) || undefined });
    } else if (name === 'features' || name === 'images') {
      setCurrentCar({ ...currentCar, [name]: value.split(',').map(s => s.trim()).filter(s => s) });
    } else {
      setCurrentCar({ ...currentCar, [name]: value });
    }
  };

  // Car Select Change Handler
  const handleSelectChange = (name: keyof EditableCar) => (value: string) => {
     setCurrentCar({ ...currentCar, [name]: value as any });
  };

  // Save Car Handler
  const handleSaveCar = async () => {
    if (!currentCar.name || !currentCar.brand || !currentCar.price || !currentCar.year) {
        toast({ title: t('errorTitle'), description: t('carSaveErrorRequiredFields'), variant: "destructive"});
        return;
    }
    const carDataForSave: Omit<Car, 'id'> = {
        name: currentCar.name,
        brand: currentCar.brand,
        year: Number(currentCar.year),
        price: Number(currentCar.price),
        description: currentCar.description || '',
        images: currentCar.images || [],
        features: currentCar.features || [],
        mileage: Number(currentCar.mileage) || 0,
        fuelType: currentCar.fuelType || 'Petrol',
        transmission: currentCar.transmission || 'Automatic',
        engineSize: currentCar.engineSize || '',
        color: currentCar.color || '',
    };
    try {
      if (isEditingCar && currentCar.id) {
        await updateCarInDb(currentCar.id, carDataForSave);
        toast({ title: t('successTitle'), description: t('carUpdateSuccess', { carName: currentCar.name }) });
      } else {
        await addCarToDb(carDataForSave);
        toast({ title: t('successTitle'), description: t('carAddSuccess', { carName: currentCar.name }) });
      }
      setCurrentCar({});
      setIsEditingCar(false);
      await loadInitialData();
    } catch (error) {
      console.error("Error saving car to Firestore:", error);
      toast({ title: t('errorTitle'), description: t('carSaveErrorDb'), variant: "destructive"});
    }
  };

  // Edit Car Handler
  const handleEditCar = (car: EditableCar) => {
    setCurrentCar(car);
    setIsEditingCar(true);
  };

  // Delete Car Handler
  const handleDeleteCar = async (carId?: string) => {
    if (!carId) return;
    try {
      await deleteCarFromDb(carId);
      toast({ title: t('successTitle'), description: t('carDeleteSuccess') });
      if (currentCar.id === carId) {
          setCurrentCar({});
          setIsEditingCar(false);
      }
      await loadInitialData();
    } catch (error) {
      console.error("Error deleting car from Firestore:", error);
      toast({ title: t('errorTitle'), description: t('carDeleteErrorDb'), variant: "destructive"});
    }
  };

  // Footer Input Change Handler
  const handleFooterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "mapQuery") {
        setMapQuery(value);
        setFooterConfig(prev => ({
            ...prev,
            contactInfo: { ...(prev?.contactInfo || { address: '', phone: '', email: '', mapQuery: '' }), mapQuery: value }
        }));
    } else if (name.startsWith("contactInfo.")) {
        const field = name.split(".")[1] as keyof FooterConfig["contactInfo"];
        setFooterConfig(prev => ({
            ...prev,
            contactInfo: {
                ...(prev?.contactInfo || { address: '', phone: '', email: '', mapQuery: mapQuery }),
                [field]: value,
            }
        }));
    } else {
        setFooterConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  // Social Link Handlers
  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setSocialLinks(updatedLinks);
  };
  const handleAddSocialLink = () => setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  const handleRemoveSocialLink = (index: number) => setSocialLinks(socialLinks.filter((_, i) => i !== index));

  // Save Footer Handler
  const handleSaveFooter = async () => {
    const updatedFooterPayload: Partial<FooterConfig> = {
      copyrightText: footerConfig.copyrightText,
      socialLinks: socialLinks,
      contactInfo: {
        address: footerConfig.contactInfo?.address || '',
        phone: footerConfig.contactInfo?.phone || '',
        email: footerConfig.contactInfo?.email || '',
        mapQuery: mapQuery,
      }
    };
    try {
      await persistFooterContentToDb(updatedFooterPayload);
      toast({ title: t('successTitle'), description: t('footerUpdateSuccess') });
      await loadInitialData();
    } catch (error) {
       console.error("Error saving footer content to Firestore:", error);
       toast({ title: t('errorTitle'), description: t('footerUpdateErrorDb'), variant: "destructive"});
    }
  };

  // Store Settings Handlers
  const handleStoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({ ...prev, [name]: value }));
  };
  const handleStoreHeroMediaTypeChange = (value: string) => {
    setStoreSettings(prev => ({ ...prev, heroMediaType: value as HeroMediaType }));
  };
  const handleSaveStoreSettings = async () => {
    try {
      await persistStoreSettingsToDb(storeSettings);
      toast({ title: t('successTitle'), description: t('storeSettingsUpdateSuccess') });
      await loadInitialData();
    } catch (error) {
      console.error("Error saving store settings to Firestore:", error);
      toast({ title: t('errorTitle'), description: t('storeSettingsUpdateErrorDb'), variant: "destructive"});
    }
  };

  // Chat Widget Settings Handlers
  const handleChatSettingsInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setChatSettings(prev => ({ ...prev, [name]: name === 'iconSize' ? Number(value) : value }));
  };

  const handleChatEnabledChange = (checked: boolean) => {
    setChatSettings(prev => ({ ...prev, isChatEnabled: checked }));
  };

  const handleSaveChatSettings = async () => {
    try {
      await persistChatWidgetSettingsToDb(chatSettings);
      toast({ title: t('successTitle'), description: t('chatSettingsSuccessSave') });
      await loadInitialData();
    } catch (error) {
      console.error("Error saving chat settings to Firestore:", error);
      toast({ title: t('errorTitle'), description: t('chatSettingsErrorSave'), variant: "destructive"});
    }
  };


  if (isCheckingAuth || !authUser) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">{t('verifyingAuth')}</p>
      </div>
    );
  }

  if (isLoadingData) {
     return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">{t('loadingPanelData')}</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-2 text-center">{t('adminPanelTitle')}</h1>
      <p className="text-center text-muted-foreground mb-8">
        {t('adminPanelSubtitle')}
      </p>

      {/* Store Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('storeSettingsCardTitle')}</CardTitle>
          <CardDescription>{t('storeSettingsCardDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="storeName">{t('storeNameLabel')}</Label>
            <Input id="storeName" name="storeName" value={storeSettings.storeName || ''} onChange={handleStoreSettingsChange} placeholder={t('storeNamePlaceholder')} />
          </div>
          <div>
            <Label htmlFor="logoUrl">{t('logoUrlLabel')}</Label>
            <Input id="logoUrl" name="logoUrl" value={storeSettings.logoUrl || ''} onChange={handleStoreSettingsChange} placeholder={t('logoUrlPlaceholder')} />
          </div>
          <div>
            <Label htmlFor="logoUrlDark">{t('logoUrlDarkLabel')}</Label>
            <Input id="logoUrlDark" name="logoUrlDark" value={storeSettings.logoUrlDark || ''} onChange={handleStoreSettingsChange} placeholder={t('logoUrlDarkPlaceholder')} />
          </div>
          <div>
            <Label htmlFor="heroSubtitle">{t('heroSubtitleLabel')}</Label>
            <Textarea id="heroSubtitle" name="heroSubtitle" value={storeSettings.heroSubtitle || ''} onChange={handleStoreSettingsChange} placeholder={t('heroSubtitlePlaceholder')} rows={3}/>
          </div>
          <div>
            <Label htmlFor="heroMediaUrl">{t('heroMediaUrlLabel')}</Label>
            <Input id="heroMediaUrl" name="heroMediaUrl" value={storeSettings.heroMediaUrl || ''} onChange={handleStoreSettingsChange} placeholder={t('heroMediaUrlPlaceholder')} />
          </div>
          <div>
            <Label htmlFor="heroMediaType">{t('heroMediaTypeLabel')}</Label>
            <Select name="heroMediaType" value={storeSettings.heroMediaType || 'image'} onValueChange={handleStoreHeroMediaTypeChange}>
              <SelectTrigger id="heroMediaType"><SelectValue placeholder={t('heroMediaTypePlaceholder')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="image">{t('mediaTypeImage')}</SelectItem>
                <SelectItem value="video">{t('mediaTypeVideo')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSaveStoreSettings}>{t('saveStoreSettingsButton')}</Button>
        </CardContent>
      </Card>

      {/* Manage Chat Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('manageChatCardTitle')}</CardTitle>
          <CardDescription>{t('manageChatCardDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch id="isChatEnabled" checked={!!chatSettings.isChatEnabled} onCheckedChange={handleChatEnabledChange} />
            <Label htmlFor="isChatEnabled">{t('enableChatLabel')}</Label>
          </div>
          <div>
            <Label htmlFor="chatCustomIconUrl">{t('chatCustomIconUrlLabel')}</Label>
            <Input id="chatCustomIconUrl" name="customIconUrl" value={chatSettings.customIconUrl || ''} onChange={handleChatSettingsInputChange} placeholder={t('chatCustomIconUrlPlaceholder')} />
          </div>
          <div>
            <Label htmlFor="chatIconSize">{t('chatIconSizeLabel')}</Label>
            <Input id="chatIconSize" name="iconSize" type="number" value={chatSettings.iconSize || 40} onChange={handleChatSettingsInputChange} placeholder={t('chatIconSizePlaceholder')} min="20" max="80" />
          </div>
           <div>
            <Label htmlFor="chatPhoneNumber">{t('chatPhoneNumberLabel')}</Label>
            <Input id="chatPhoneNumber" name="phoneNumber" value={chatSettings.phoneNumber || ''} onChange={handleChatSettingsInputChange} placeholder={t('chatPhoneNumberPlaceholder')} />
          </div>
           <div>
            <Label htmlFor="chatDefaultMessage">{t('chatDefaultMessageLabel')}</Label>
            <Textarea id="chatDefaultMessage" name="defaultMessage" value={chatSettings.defaultMessage || ''} onChange={handleChatSettingsInputChange} placeholder={t('chatDefaultMessagePlaceholder')} rows={3} />
          </div>
          <Button onClick={handleSaveChatSettings}>{t('saveChatSettingsButton')}</Button>
        </CardContent>
      </Card>

      {/* Add/Edit Car Card */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditingCar ? t('editCarTitle') : t('addCarTitle')}</CardTitle>
          <CardDescription>
            {isEditingCar ? t('editingCarDesc', { carName: currentCar.name || t('theSelectedCar') }) : t('addCarDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label htmlFor="nameCarInput">{t('carNameLabel')}</Label><Input id="nameCarInput" name="name" value={currentCar.name || ''} onChange={handleCarInputChange} placeholder={t('carNamePlaceholder')} /></div>
            <div><Label htmlFor="brandCarInput">{t('carBrandLabel')}</Label><Input id="brandCarInput" name="brand" value={currentCar.brand || ''} onChange={handleCarInputChange} placeholder={t('carBrandPlaceholder')} /></div>
            <div><Label htmlFor="yearCarInput">{t('carYearLabel')}</Label><Input id="yearCarInput" name="year" type="number" value={currentCar.year || ''} onChange={handleCarInputChange} placeholder={t('carYearPlaceholder')} /></div>
            <div><Label htmlFor="priceCarInput">{t('carPriceLabel')}</Label><Input id="priceCarInput" name="price" type="number" value={currentCar.price || ''} onChange={handleCarInputChange} placeholder={t('carPricePlaceholder')} /></div>
            <div><Label htmlFor="mileageCarInput">{t('carMileageLabel')}</Label><Input id="mileageCarInput" name="mileage" type="number" value={currentCar.mileage || ''} onChange={handleCarInputChange} placeholder={t('carMileagePlaceholder')} /></div>
            <div><Label htmlFor="colorCarInput">{t('carColorLabel')}</Label><Input id="colorCarInput" name="color" value={currentCar.color || ''} onChange={handleCarInputChange} placeholder={t('carColorPlaceholder')} /></div>
            <div>
                <Label htmlFor="fuelTypeCarInput">{t('carFuelTypeLabel')}</Label>
                <Select name="fuelType" value={currentCar.fuelType || ''} onValueChange={handleSelectChange('fuelType')}>
                    <SelectTrigger id="fuelTypeCarInput"><SelectValue placeholder={t('carFuelTypePlaceholder')} /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Petrol">{t('fuelTypePetrol')}</SelectItem>
                        <SelectItem value="Diesel">{t('fuelTypeDiesel')}</SelectItem>
                        <SelectItem value="Electric">{t('fuelTypeElectric')}</SelectItem>
                        <SelectItem value="Hybrid">{t('fuelTypeHybrid')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="transmissionCarInput">{t('carTransmissionLabel')}</Label>
                <Select name="transmission" value={currentCar.transmission || ''} onValueChange={handleSelectChange('transmission')}>
                    <SelectTrigger id="transmissionCarInput"><SelectValue placeholder={t('carTransmissionPlaceholder')} /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Automatic">{t('transmissionAutomatic')}</SelectItem>
                        <SelectItem value="Manual">{t('transmissionManual')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="md:col-span-2"><Label htmlFor="engineSizeCarInput">{t('carEngineSizeLabel')}</Label><Input id="engineSizeCarInput" name="engineSize" value={currentCar.engineSize || ''} onChange={handleCarInputChange} placeholder={t('carEngineSizePlaceholder')} /></div>
            <div className="md:col-span-2"><Label htmlFor="descriptionCarInput">{t('carDescriptionLabel')}</Label><Textarea id="descriptionCarInput" name="description" value={currentCar.description || ''} onChange={handleCarInputChange} placeholder={t('carDescriptionPlaceholder')} /></div>
            <div className="md:col-span-2"><Label htmlFor="imagesCarInput">{t('carImagesLabel')}</Label><Input id="imagesCarInput" name="images" value={currentCar.images?.join(', ') || ''} onChange={handleCarInputChange} placeholder={t('carImagesPlaceholder')} /></div>
            <div className="md:col-span-2"><Label htmlFor="featuresCarInput">{t('carFeaturesLabel')}</Label><Input id="featuresCarInput" name="features" value={currentCar.features?.join(', ') || ''} onChange={handleCarInputChange} placeholder={t('carFeaturesPlaceholder')} /></div>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleSaveCar}>{isEditingCar ? t('saveChangesButton') : t('addCarButton')}</Button>
            {isEditingCar && <Button variant="outline" onClick={() => { setCurrentCar({}); setIsEditingCar(false); }}>{t('cancelEditButton')}</Button>}
          </div>
        </CardContent>
      </Card>

      {/* Car Listings Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('carListingsTitle')}</CardTitle>
          <CardDescription>{t('carListingsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {cars.length === 0 ? <p>{t('noCarsListedMessage')}</p> : (
            <ul className="space-y-4">
              {cars.map(car => (
                <li key={car.id} className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <p className="font-semibold">{car.name} <span className="text-sm text-muted-foreground">({car.brand})</span></p>
                    <p className="text-sm text-primary">{(car.price || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditCar(car)}>{t('editButton')}</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCar(car.id)}>{t('deleteButton')}</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Manage Footer Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('manageFooterTitle')}</CardTitle>
          <CardDescription>{t('manageFooterDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="copyrightText">{t('copyrightCoreTextLabel')}</Label>
            <Input id="copyrightText" name="copyrightText" value={footerConfig.copyrightText || ''} onChange={handleFooterInputChange} />
          </div>
          <div>
            <Label htmlFor="contactAddress">{t('contactAddressLabel')}</Label>
            <Input id="contactAddress" name="contactInfo.address" value={footerConfig.contactInfo?.address || ''} onChange={handleFooterInputChange} />
          </div>
           <div>
            <Label htmlFor="contactPhone">{t('contactPhoneLabel')}</Label>
            <Input id="contactPhone" name="contactInfo.phone" value={footerConfig.contactInfo?.phone || ''} onChange={handleFooterInputChange} />
          </div>
           <div>
            <Label htmlFor="contactEmail">{t('contactEmailLabel')}</Label>
            <Input id="contactEmail" name="contactInfo.email" value={footerConfig.contactInfo?.email || ''} onChange={handleFooterInputChange} />
          </div>
          <div>
            <Label htmlFor="mapQueryInputPanel">{t('mapQueryLabel')}</Label>
            <Input id="mapQueryInputPanel" name="mapQuery" value={mapQuery} onChange={handleFooterInputChange} placeholder={t('mapQueryPlaceholder')} />
          </div>
          <div className="space-y-4">
            <h4 className="text-md font-semibold">{t('socialLinksTitle')}</h4>
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-end gap-4 p-4 border rounded-md">
                <div className="flex-grow space-y-2">
                  <div>
                    <Label htmlFor={`socialPlatform-${index}`}>{t('platformLabel')}</Label>
                    <Input id={`socialPlatform-${index}`} value={link.platform} onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)} placeholder={t('platformPlaceholder')} />
                  </div>
                  <div>
                    <Label htmlFor={`socialUrl-${index}`}>{t('urlLabel')}</Label>
                    <Input id={`socialUrl-${index}`} value={link.url} onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} placeholder={t('urlPlaceholder')} />
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveSocialLink(index)} aria-label={t('removeSocialLinkButtonAria')}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddSocialLink}>
              <PlusCircle className="mr-2 h-4 w-4" /> {t('addSocialLinkButton')}
            </Button>
          </div>
          <Button onClick={handleSaveFooter}>{t('saveFooterButton')}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
