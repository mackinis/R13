
"use client";

import React, { useEffect, useState, Suspense } from 'react'; // Added Suspense
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/i18n-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Mail, Send, User, MessageSquare, Phone as PhoneIconLucide, Loader2, MapPin } from "lucide-react";
import { sendContactEmail } from "./actions";
import { getFooterContent, type FooterConfig } from "@/lib/data";
import { useSearchParams } from 'next/navigation';

function ContactPageLoadingFallback() {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col justify-center items-center min-h-[50vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">{t('loadingContactInfo')}</p>
    </div>
  );
}

function ContactPageContent() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [contactInfo, setContactInfo] = useState<FooterConfig['contactInfo'] | null>(null);
  const [loadingContactInfo, setLoadingContactInfo] = useState(true);

  const carNameParam = searchParams.get('carName');

  useEffect(() => {
    async function loadContactInfo() {
      setLoadingContactInfo(true);
      try {
        const footerData = await getFooterContent();
        setContactInfo(footerData.contactInfo);
      } catch (error) {
        console.error("Failed to load contact info for contact page:", error);
        setContactInfo({
            email: t('siteContactEmail'),
            phone: t('siteContactPhone'),
            address: t('siteContactAddress'),
            mapQuery: t('siteContactAddress').replace(/\n/g, ', ')
        });
      } finally {
        setLoadingContactInfo(false);
      }
    }
    loadContactInfo();
  }, [t]);

  const ContactFormSchema = z.object({
    name: z.string().min(2, { message: t('contactFormErrorNameTooShort') }),
    email: z.string().email({ message: t('contactFormErrorEmailInvalid') }),
    message: z.string().min(10, { message: t('contactFormErrorMessageTooShort') }),
  });

  type ContactFormValues = z.infer<typeof ContactFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  useEffect(() => {
    if (carNameParam) {
      setValue('message', t('contactFormMessageCarInterest', { carName: carNameParam }));
    } else {
      // Ensure message is reset if carNameParam is removed or not present
      const currentMessage = getValues('message');
      if (currentMessage.startsWith(t('contactFormMessageCarInterest', { carName: '' }).substring(0, 20))) { // Check if it's a car interest message
        setValue('message', '');
      }
    }
  }, [carNameParam, setValue, t, getValues]);


  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    try {
      const result = await sendContactEmail(data);
      if (result.success) {
        toast({
          title: t('contactFormSuccessTitle'),
          description: t('contactFormSuccessDesc'),
        });
        reset();
        // Re-apply car interest message if carNameParam is still present
        if (carNameParam) {
            setValue('message', t('contactFormMessageCarInterest', { carName: carNameParam }));
        }
      } else {
        // Try to parse server error if it's a string that looks like JSON
        let serverErrorMessage = result.error || t('contactFormErrorServerDefault');
        if (result.error) {
            try {
                const errorObj = JSON.parse(result.error);
                if (errorObj && errorObj.message) {
                    serverErrorMessage = errorObj.message;
                }
            } catch (e) {
                // Not JSON, use as is
            }
        }
        throw new Error(serverErrorMessage);
      }
    } catch (error: any) {
        let detailedErrorMessage = error.message || t('contactFormErrorServerDefault');
        if (error.message && error.message.includes("Raw response was:")) {
            detailedErrorMessage = t('contactFormErrorServerUnreadable');
        }
      toast({
        title: t('contactFormErrorTitle'),
        description: detailedErrorMessage,
        variant: "destructive",
      });
    }
  };

  if (loadingContactInfo) {
    return <ContactPageLoadingFallback />;
  }

  const displayEmail = contactInfo?.email || t('siteContactEmail');
  const displayPhone = contactInfo?.phone || t('siteContactPhone');
  const displayAddress = contactInfo?.address || t('siteContactAddress');
  const mapQueryString = contactInfo?.mapQuery || t('siteContactAddress').replace(/\n/g, ', ');

  const encodedMapQuery = encodeURIComponent(mapQueryString);
  const mapLang = language === 'es' ? 'es' : 'en';

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
          {t('contactPageTitle')}
        </h1>
        <p className="text-center text-lg text-muted-foreground mb-10 md:mb-12">
          {t('contactPageSubtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start mb-10 md:mb-12">
          <div className="bg-card p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">{t('contactFormTitle')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name" className="flex items-center mb-1">
                  <User size={16} className="mr-2 text-primary" /> {t('contactFormNameLabel')}
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder={t('contactFormNamePlaceholder')}
                  disabled={isSubmitting}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center mb-1">
                  <Mail size={16} className="mr-2 text-primary" /> {t('contactFormEmailLabel')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder={t('contactFormEmailPlaceholder')}
                  disabled={isSubmitting}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="message" className="flex items-center mb-1">
                  <MessageSquare size={16} className="mr-2 text-primary" /> {t('contactFormMessageLabel')}
                </Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  rows={5}
                  placeholder={t('contactFormMessagePlaceholder')}
                  disabled={isSubmitting}
                  aria-invalid={errors.message ? "true" : "false"}
                />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send size={18} className="mr-2" />}
                {isSubmitting ? t('contactFormSendingButton') : t('contactFormSendButton')}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{t('contactInfoDirectTitle')}</h3>
              <p className="text-muted-foreground mb-1">
                <Mail size={16} className="inline mr-2 text-primary" />
                <a href={`mailto:${displayEmail}`} className="hover:text-primary">{displayEmail}</a>
              </p>
              <p className="text-muted-foreground">
                <PhoneIconLucide size={16} className="inline mr-2 text-primary" />
                <a href={`tel:${displayPhone.replace(/\D/g, '')}`} className="hover:text-primary">{displayPhone}</a>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{t('contactInfoAddressTitle')}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{displayAddress}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{t('contactInfoHoursTitle')}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{t('siteContactHours')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto mt-10 md:mt-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4 text-center md:text-left">{t('mapSectionTitle')}</h2>
        <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-md">
          {mapQueryString ? (
            <iframe
              src={`https://maps.google.com/maps?q=${encodedMapQuery}&hl=${mapLang}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('mapPlaceholderTitle')}
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">{t('mapQueryNotConfigured')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// New default export for the page
export default function ContactPage() {
  return (
    <Suspense fallback={<ContactPageLoadingFallback />}>
      <ContactPageContent />
    </Suspense>
  );
}

