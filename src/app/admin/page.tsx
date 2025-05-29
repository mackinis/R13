
"use client"; 

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import type { Car, FooterContent } from '@/lib/data'; 
import { 
  getAllCars as initialGetAllCars, 
  getFooterContent as initialGetFooterContent,
  addCar,
  updateCar,
  deleteCar,
  updateFooterContent as persistFooterContent // Renamed for clarity
} from '@/lib/data'; 
import { Trash2, PlusCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/i18n-context';

type EditableCar = Partial<Car> & { id?: string };
type SocialLink = { platform: string; url: string };

export default function AdminPage() {
  const { toast } = useToast();
  const { t } = useLanguage();

  const [cars, setCars] = useState<EditableCar[]>([]);
  const [currentCar, setCurrentCar] = useState<EditableCar>({});
  const [isEditingCar, setIsEditingCar] = useState(false);
  
  const [footerContent, setFooterContent] = useState<Partial<FooterContent>>({});
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // New state for store settings
  const [storeName, setStoreName] = useState('AutoArtisan'); 
  const [logoUrl, setLogoUrl] = useState('/autoartisan-logo.svg'); 
  const [mapQuery, setMapQuery] = useState(''); // State for map query

  useEffect(() => {
    async function loadInitialData() {
      const fetchedCars = await initialGetAllCars();
      setCars(fetchedCars);
      const content = await initialGetFooterContent();
      setFooterContent(content);
      setSocialLinks(content.socialLinks || []);
      setMapQuery(content.contactInfo?.mapQuery || '123 Luxury Drive, Auto City, AC 12345');
      // Typically load storeName and logoUrl from a persistent source (e.g., getStoreSettings())
      // For now, using defaults or local state
    }
    loadInitialData();
  }, []);

  const handleCarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'year' || name === 'mileage') {
      setCurrentCar({ ...currentCar, [name]: Number(value) || 0 });
    } else if (name === 'features' || name === 'images') {
      setCurrentCar({ ...currentCar, [name]: value.split(',').map(s => s.trim()) });
    } else {
      setCurrentCar({ ...currentCar, [name]: value });
    }
  };
  
  const handleSelectChange = (name: keyof EditableCar) => (value: string) => {
     setCurrentCar({ ...currentCar, [name]: value as any });
  };

  const handleSaveCar = async () => {
    if (!currentCar.name || !currentCar.brand || currentCar.price === undefined) {
        toast({ title: t('loginErrorTitle'), description: "Name, Brand, and Price are required.", variant: "destructive"});
        return;
    }

    try {
      if (isEditingCar && currentCar.id) {
        const updatedCarsList = await updateCar(currentCar as Car);
        setCars(updatedCarsList);
        toast({ title: t('loginSuccessTitle'), description: `${currentCar.name} updated.` });
      } else {
        const newCarWithId = { ...currentCar, id: String(Date.now()) } as Car;
        const updatedCarsList = await addCar(newCarWithId);
        setCars(updatedCarsList);
        toast({ title: t('loginSuccessTitle'), description: `${newCarWithId.name} added.` });
      }
      setCurrentCar({});
      setIsEditingCar(false);
    } catch (error) {
      toast({ title: t('loginErrorTitle'), description: "Failed to save car.", variant: "destructive"});
    }
  };

  const handleEditCar = (car: EditableCar) => {
    setCurrentCar(car);
    setIsEditingCar(true);
  };

  const handleDeleteCar = async (carId?: string) => {
    if (!carId) return;
    try {
      const updatedCarsList = await deleteCar(carId);
      setCars(updatedCarsList);
      toast({ title: t('loginSuccessTitle'), description: `Car deleted.` });
      if (currentCar.id === carId) {
          setCurrentCar({});
          setIsEditingCar(false);
      }
    } catch (error) {
      toast({ title: t('loginErrorTitle'), description: "Failed to delete car.", variant: "destructive"});
    }
  };
  
  const handleFooterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "mapQuery") {
      setMapQuery(value); // Update mapQuery state directly
    } else if (name.startsWith("contactInfo.")) {
        const field = name.split(".")[1] as keyof FooterContent["contactInfo"];
        setFooterContent(prev => ({
            ...prev,
            contactInfo: {
                ...(prev?.contactInfo || { address: '', phone: '', email: '', mapQuery: ''}), // Ensure contactInfo is initialized
                [field]: value,
            } as FooterContent["contactInfo"]
        }));
    } else {
        setFooterContent({ ...footerContent, [name]: value });
    }
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setSocialLinks(updatedLinks);
  };

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSaveFooter = async () => {
    const updatedFooterPayload: Partial<FooterContent> = {
      copyrightText: footerContent.copyrightText,
      socialLinks: socialLinks,
      contactInfo: {
        address: footerContent.contactInfo?.address || '',
        phone: footerContent.contactInfo?.phone || '',
        email: footerContent.contactInfo?.email || '',
        mapQuery: mapQuery, // Include mapQuery
      }
    };
    try {
      await persistFooterContent(updatedFooterPayload);
      toast({ title: t('loginSuccessTitle'), description: "Footer content updated (mock save)." });
    } catch (error) {
       toast({ title: t('loginErrorTitle'), description: "Failed to save footer content.", variant: "destructive"});
    }
  };

  const handleSaveStoreSettings = () => {
    // In a real app, you would persist storeName and logoUrl
    console.log("Saving store settings (mock):", { storeName, logoUrl });
    toast({ title: t('loginSuccessTitle'), description: "Store settings updated (mock save)." });
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">{t('adminPanelTitle')}</h1>
      <p className="text-center text-muted-foreground mb-8">
        {t('adminPanelSubtitle')}
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('storeSettingsCardTitle')}</CardTitle>
          <CardDescription>{t('storeSettingsCardDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="storeName">{t('storeNameLabel')}</Label>
            <Input 
              id="storeName" 
              name="storeName" 
              value={storeName} 
              onChange={(e) => setStoreName(e.target.value)} 
              placeholder={t('storeNamePlaceholder')} 
            />
          </div>
          <div>
            <Label htmlFor="logoUrl">{t('logoUrlLabel')}</Label>
            <Input 
              id="logoUrl" 
              name="logoUrl" 
              value={logoUrl} 
              onChange={(e) => setLogoUrl(e.target.value)} 
              placeholder={t('logoUrlPlaceholder')}
            />
            {logoUrl && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Logo Preview:</p>
                <img src={logoUrl} alt="Logo Preview" className="mt-1 h-10 border rounded" onError={(e) => e.currentTarget.style.display='none'} />
              </div>
            )}
          </div>
          <Button onClick={handleSaveStoreSettings}>{t('saveStoreSettingsButton')}</Button>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{isEditingCar ? t('addEditCarTitle').split('/')[1] : t('addEditCarTitle').split('/')[0]} Car</CardTitle>
          <CardDescription>
            {isEditingCar ? `Editing details for ${currentCar.name || 'the selected car'}` : 'Fill in the details to add a new car to your inventory.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label htmlFor="name">Name</Label><Input id="name" name="name" value={currentCar.name || ''} onChange={handleCarInputChange} placeholder="e.g., Elegance Cruiser X1" /></div>
            <div><Label htmlFor="brand">Brand</Label><Input id="brand" name="brand" value={currentCar.brand || ''} onChange={handleCarInputChange} placeholder="e.g., Prestige Motors" /></div>
            <div><Label htmlFor="year">Year</Label><Input id="year" name="year" type="number" value={currentCar.year || ''} onChange={handleCarInputChange} placeholder="e.g., 2023" /></div>
            <div><Label htmlFor="price">Price ($)</Label><Input id="price" name="price" type="number" value={currentCar.price || ''} onChange={handleCarInputChange} placeholder="e.g., 75000" /></div>
            <div><Label htmlFor="mileage">Mileage (km)</Label><Input id="mileage" name="mileage" type="number" value={currentCar.mileage || ''} onChange={handleCarInputChange} placeholder="e.g., 5000" /></div>
            <div><Label htmlFor="color">Color</Label><Input id="color" name="color" value={currentCar.color || ''} onChange={handleCarInputChange} placeholder="e.g., Midnight Blue" /></div>
             <div>
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select name="fuelType" value={currentCar.fuelType || ''} onValueChange={handleSelectChange('fuelType')}>
                    <SelectTrigger><SelectValue placeholder="Select Fuel Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select name="transmission" value={currentCar.transmission || ''} onValueChange={handleSelectChange('transmission')}>
                    <SelectTrigger><SelectValue placeholder="Select Transmission" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="md:col-span-2"><Label htmlFor="engineSize">Engine Size</Label><Input id="engineSize" name="engineSize" value={currentCar.engineSize || ''} onChange={handleCarInputChange} placeholder="e.g., 3.0L V6 or 150kW" /></div>
            <div className="md:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={currentCar.description || ''} onChange={handleCarInputChange} placeholder="Detailed description of the car..." /></div>
            <div className="md:col-span-2"><Label htmlFor="images">Images (comma-separated URLs)</Label><Input id="images" name="images" value={currentCar.images?.join(', ') || ''} onChange={handleCarInputChange} placeholder="url1, url2, url3" /></div>
            <div className="md:col-span-2"><Label htmlFor="features">Features (comma-separated)</Label><Input id="features" name="features" value={currentCar.features?.join(', ') || ''} onChange={handleCarInputChange} placeholder="Feature 1, Feature 2" /></div>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleSaveCar}>{isEditingCar ? t('addEditCarTitle').split('/')[1] : t('addEditCarTitle').split('/')[0]}</Button>
            {isEditingCar && <Button variant="outline" onClick={() => { setCurrentCar({}); setIsEditingCar(false); }}>Cancel Edit</Button>}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('carListingsTitle')}</CardTitle>
          <CardDescription>View, edit, or delete existing car listings.</CardDescription>
        </CardHeader>
        <CardContent>
          {cars.length === 0 ? <p>No cars listed yet.</p> : (
            <ul className="space-y-4">
              {cars.map(car => (
                <li key={car.id} className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <p className="font-semibold">{car.name} <span className="text-sm text-muted-foreground">({car.brand})</span></p>
                    <p className="text-sm text-primary">{(car.price || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditCar(car)}>{t('addEditCarTitle').split('/')[1]}</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCar(car.id)}>{t('removeSocialLinkButton')}</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('manageFooterTitle')}</CardTitle>
          <CardDescription>Update the information displayed in the site footer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="copyrightText">{t('copyrightTextLabel')}</Label>
            <Input id="copyrightText" name="copyrightText" value={footerContent.copyrightText || ''} onChange={handleFooterInputChange} />
          </div>
          <div>
            <Label htmlFor="contactAddress">{t('contactAddressLabel')}</Label>
            <Input id="contactAddress" name="contactInfo.address" value={footerContent.contactInfo?.address || ''} onChange={handleFooterInputChange} />
          </div>
           <div>
            <Label htmlFor="contactPhone">{t('contactPhoneLabel')}</Label>
            <Input id="contactPhone" name="contactInfo.phone" value={footerContent.contactInfo?.phone || ''} onChange={handleFooterInputChange} />
          </div>
           <div>
            <Label htmlFor="contactEmail">{t('contactEmailLabel')}</Label>
            <Input id="contactEmail" name="contactInfo.email" value={footerContent.contactInfo?.email || ''} onChange={handleFooterInputChange} />
          </div>
          <div>
            <Label htmlFor="mapQuery">{t('mapQueryLabel')}</Label>
            <Input id="mapQuery" name="mapQuery" value={mapQuery} onChange={handleFooterInputChange} placeholder={t('mapQueryPlaceholder')} />
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold">{t('socialLinksTitle')}</h4>
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-end gap-4 p-4 border rounded-md">
                <div className="flex-grow space-y-2">
                  <div>
                    <Label htmlFor={`socialPlatform-${index}`}>{t('platformLabel')}</Label>
                    <Input 
                      id={`socialPlatform-${index}`} 
                      value={link.platform} 
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                      placeholder="e.g., Facebook" 
                    />
                  </div>
                  <div>
                    <Label htmlFor={`socialUrl-${index}`}>{t('urlLabel')}</Label>
                    <Input 
                      id={`socialUrl-${index}`} 
                      value={link.url} 
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} 
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveSocialLink(index)} aria-label={t('removeSocialLinkButton')}>
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
