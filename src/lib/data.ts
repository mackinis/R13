
import type React from 'react';
import { db } from './firebaseConfig';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';

export interface Car {
  id: string; // Firestore document ID
  name: string;
  brand: string;
  year: number;
  price: number;
  description: string;
  images: string[];
  features: string[];
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Automatic' | 'Manual';
  engineSize: string;
  color: string;
}

export interface FooterConfig {
  copyrightText: string; // This will store the core text, e.g., "2024 AutoArtisan"
  socialLinks: { platform: string; url: string }[];
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    mapQuery: string;
  };
}

export type HeroMediaType = 'image' | 'video';

export interface StoreSettings {
  storeName: string;
  logoUrl?: string;
  logoUrlDark?: string;
  heroSubtitle?: string;
  heroMediaUrl?: string; // For hero image or video
  heroMediaType?: HeroMediaType;
}

export interface ChatWidgetSettings {
  isChatEnabled: boolean;
  customIconUrl?: string;
  iconSize: number;
  phoneNumber: string;
  defaultMessage: string;
}

// Firestore document paths
const STORE_PROFILE_PATH = "appSettings/storeProfile";
const FOOTER_CONFIG_PATH = "appSettings/footerConfig";
const CHAT_WIDGET_CONFIG_PATH = "appSettings/chatWidgetConfig";
const CARS_COLLECTION_PATH = "cars";

// --- Store Settings ---
export const getStoreSettings = async (): Promise<StoreSettings | null> => {
  try {
    const settingsDocRef = doc(db, STORE_PROFILE_PATH);
    const settingsSnap = await getDoc(settingsDocRef);
    if (settingsSnap.exists()) {
      console.log("[data.ts/getStoreSettings] Fetched store settings:", settingsSnap.data());
      const data = settingsSnap.data() as Partial<StoreSettings>;
      return {
        storeName: data.storeName || "AutoArtisan",
        logoUrl: data.logoUrl || "",
        logoUrlDark: data.logoUrlDark || "",
        heroSubtitle: data.heroSubtitle || 'Crafting Automotive Excellence. Discover your dream car with us.',
        heroMediaUrl: data.heroMediaUrl || '',
        heroMediaType: data.heroMediaType || 'image',
      };
    } else {
      console.log("[data.ts/getStoreSettings] No store settings document found. Returning defaults.");
      return {
        storeName: "AutoArtisan",
        logoUrl: "",
        logoUrlDark: "",
        heroSubtitle: "Crafting Automotive Excellence. Discover your dream car with us.",
        heroMediaUrl: "",
        heroMediaType: 'image',
      };
    }
  } catch (error) {
    console.error("[data.ts/getStoreSettings] Error fetching store settings:", error);
    return {
        storeName: "AutoArtisan (Error)",
        logoUrl: "",
        logoUrlDark: "",
        heroSubtitle: "Error loading subtitle.",
        heroMediaUrl: "",
        heroMediaType: 'image',
      };
  }
};

export const updateStoreSettings = async (settings: Partial<StoreSettings>): Promise<void> => {
  try {
    const settingsDocRef = doc(db, STORE_PROFILE_PATH);
    // Ensure all fields are present, even if empty, to avoid issues with Firestore merge
    const settingsToSave: StoreSettings = {
      storeName: settings.storeName || "AutoArtisan", // Default if empty
      logoUrl: settings.logoUrl || "",
      logoUrlDark: settings.logoUrlDark || "",
      heroSubtitle: settings.heroSubtitle || "",
      heroMediaUrl: settings.heroMediaUrl || "",
      heroMediaType: settings.heroMediaType || 'image',
    };
    await setDoc(settingsDocRef, settingsToSave, { merge: true });
    console.log("[data.ts/updateStoreSettings] Store settings updated successfully in Firestore.");
  } catch (error) {
    console.error("[data.ts/updateStoreSettings] Error updating store settings in Firestore:", error);
    throw error;
  }
};

// --- Footer Configuration ---
export const getFooterContent = async (): Promise<FooterConfig> => {
  try {
    const footerDocRef = doc(db, FOOTER_CONFIG_PATH);
    const footerSnap = await getDoc(footerDocRef);
    if (footerSnap.exists()) {
      console.log("[data.ts/getFooterContent] Fetched footer config:", footerSnap.data());
      const data = footerSnap.data() as Partial<FooterConfig>;
      return {
        copyrightText: data.copyrightText || `${new Date().getFullYear()} AutoArtisan`,
        socialLinks: data.socialLinks || [],
        contactInfo: data.contactInfo || {
          address: "123 Luxury Drive, Auto City, AC 12345",
          phone: "+1 (555) 123-4567",
          email: "contact@autoartisan.com",
          mapQuery: "123 Luxury Drive, Auto City, AC 12345"
        }
      };
    } else {
      console.log("[data.ts/getFooterContent] No footer config document found. Returning defaults.");
      return {
        copyrightText: `${new Date().getFullYear()} AutoArtisan`, // Core text only
        socialLinks: [],
        contactInfo: {
          address: "123 Luxury Drive, Auto City, AC 12345",
          phone: "+1 (555) 123-4567",
          email: "contact@autoartisan.com",
          mapQuery: "123 Luxury Drive, Auto City, AC 12345"
        }
      };
    }
  } catch (error) {
    console.error("[data.ts/getFooterContent] Error fetching footer config:", error);
    return {
        copyrightText: `${new Date().getFullYear()} AutoArtisan (Error)`, // Core text only
        socialLinks: [],
        contactInfo: {
          address: "Error loading address",
          phone: "Error loading phone",
          email: "Error loading email",
          mapQuery: "Error loading map query"
        }
      };
  }
};

export const updateFooterContent = async (newContent: Partial<FooterConfig>): Promise<void> => {
  try {
    const footerDocRef = doc(db, FOOTER_CONFIG_PATH);
    // Ensure all fields are present for merge
    const contentToSave: Partial<FooterConfig> = {
        copyrightText: newContent.copyrightText || `${new Date().getFullYear()} AutoArtisan`,
        socialLinks: newContent.socialLinks || [],
        contactInfo: newContent.contactInfo || {
            address: "123 Luxury Drive, Auto City, AC 12345",
            phone: "+1 (555) 123-4567",
            email: "contact@autoartisan.com",
            mapQuery: "123 Luxury Drive, Auto City, AC 12345"
        }
    };
    await setDoc(footerDocRef, contentToSave, { merge: true });
    console.log("[data.ts/updateFooterContent] Footer config updated successfully in Firestore.");
  } catch (error) {
    console.error("[data.ts/updateFooterContent] Error updating footer config in Firestore:", error);
    throw error;
  }
};

// --- Chat Widget Settings ---
export const DEFAULT_CHAT_WIDGET_SETTINGS: ChatWidgetSettings = {
  isChatEnabled: true,
  customIconUrl: '',
  iconSize: 40,
  phoneNumber: '',
  defaultMessage: 'Hello, I am interested in your cars.',
};

export const getChatWidgetSettings = async (): Promise<ChatWidgetSettings> => {
  try {
    const chatWidgetDocRef = doc(db, CHAT_WIDGET_CONFIG_PATH);
    const chatWidgetSnap = await getDoc(chatWidgetDocRef);
    if (chatWidgetSnap.exists()) {
      console.log("[data.ts/getChatWidgetSettings] Fetched chat widget settings:", chatWidgetSnap.data());
      // Merge with defaults to ensure all properties are present
      return { ...DEFAULT_CHAT_WIDGET_SETTINGS, ...(chatWidgetSnap.data() as Partial<ChatWidgetSettings>) };
    } else {
      console.log("[data.ts/getChatWidgetSettings] No chat widget settings document found. Returning defaults.");
      return DEFAULT_CHAT_WIDGET_SETTINGS;
    }
  } catch (error) {
    console.error("[data.ts/getChatWidgetSettings] Error fetching chat widget settings:", error);
    return { ...DEFAULT_CHAT_WIDGET_SETTINGS, phoneNumber: 'ErrorLoading', isChatEnabled: false };
  }
};

export const updateChatWidgetSettings = async (settings: Partial<ChatWidgetSettings>): Promise<void> => {
  try {
    const chatWidgetDocRef = doc(db, CHAT_WIDGET_CONFIG_PATH);
    const settingsToSave: ChatWidgetSettings = {
      isChatEnabled: typeof settings.isChatEnabled === 'boolean' ? settings.isChatEnabled : DEFAULT_CHAT_WIDGET_SETTINGS.isChatEnabled,
      customIconUrl: settings.customIconUrl || '',
      iconSize: Number(settings.iconSize) || DEFAULT_CHAT_WIDGET_SETTINGS.iconSize,
      phoneNumber: settings.phoneNumber || '',
      defaultMessage: settings.defaultMessage || DEFAULT_CHAT_WIDGET_SETTINGS.defaultMessage,
    };
    await setDoc(chatWidgetDocRef, settingsToSave, { merge: true });
    console.log("[data.ts/updateChatWidgetSettings] Chat widget settings updated successfully in Firestore.");
  } catch (error) {
    console.error("[data.ts/updateChatWidgetSettings] Error updating chat widget settings in Firestore:", error);
    throw error;
  }
};


// --- Car Data ---
export const getAllCars = async (): Promise<Car[]> => {
  try {
    const carsCollectionRef = collection(db, CARS_COLLECTION_PATH);
    const carsSnapshot = await getDocs(carsCollectionRef);
    const carsList = carsSnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Car, 'id'>),
    }));
    console.log("[data.ts/getAllCars] Fetched all cars from Firestore:", carsList.length);
    return carsList;
  } catch (error) {
    console.error("[data.ts/getAllCars] Error fetching all cars from Firestore:", error);
    return [];
  }
};

export const getCarById = async (id: string): Promise<Car | undefined> => {
  try {
    const carDocRef = doc(db, CARS_COLLECTION_PATH, id);
    const carSnap = await getDoc(carDocRef);
    if (carSnap.exists()) {
      console.log("[data.ts/getCarById] Fetched car by ID from Firestore:", id);
      return { id: carSnap.id, ...(carSnap.data() as Omit<Car, 'id'>) };
    } else {
      console.log(`[data.ts/getCarById] No car found with ID: ${id}`);
      return undefined;
    }
  } catch (error) {
    console.error(`[data.ts/getCarById] Error fetching car by ID ${id} from Firestore:`, error);
    return undefined;
  }
};

export const addCar = async (carData: Omit<Car, 'id'>): Promise<Car> => {
  try {
    const carsCollectionRef = collection(db, CARS_COLLECTION_PATH);
    const carDataForDb: Omit<Car, 'id'> = {
        ...carData,
        year: Number(carData.year) || 0,
        price: Number(carData.price) || 0,
        mileage: Number(carData.mileage) || 0,
        images: Array.isArray(carData.images) ? carData.images : [],
        features: Array.isArray(carData.features) ? carData.features : [],
    };
    const docRef = await addDoc(carsCollectionRef, carDataForDb);
    console.log("[data.ts/addCar] Car added to Firestore with ID:", docRef.id);
    return { id: docRef.id, ...carDataForDb };
  } catch (error) {
    console.error("[data.ts/addCar] Error adding car to Firestore:", error);
    throw error;
  }
};

export const updateCar = async (carId: string, carData: Partial<Omit<Car, 'id'>>): Promise<Car> => {
  try {
    const carDocRef = doc(db, CARS_COLLECTION_PATH, carId);
    const carDataForDb = { ...carData };
    if (carData.year !== undefined) carDataForDb.year = Number(carData.year);
    if (carData.price !== undefined) carDataForDb.price = Number(carData.price);
    if (carData.mileage !== undefined) carDataForDb.mileage = Number(carData.mileage);
    if (carData.images !== undefined && !Array.isArray(carData.images)) carDataForDb.images = [];
    if (carData.features !== undefined && !Array.isArray(carData.features)) carDataForDb.features = [];

    await updateDoc(carDocRef, carDataForDb);
    console.log("[data.ts/updateCar] Car updated in Firestore with ID:", carId);
    const updatedCarDoc = await getDoc(carDocRef);
    if (!updatedCarDoc.exists()) {
      throw new Error("Updated car document not found after update.");
    }
    return { id: updatedCarDoc.id, ...(updatedCarDoc.data() as Omit<Car, 'id'>) };
  } catch (error) {
    console.error(`[data.ts/updateCar] Error updating car ${carId} in Firestore:`, error);
    throw error;
  }
};

export const deleteCar = async (carId: string): Promise<void> => {
  try {
    const carDocRef = doc(db, CARS_COLLECTION_PATH, carId);
    await deleteDoc(carDocRef);
    console.log("[data.ts/deleteCar] Car deleted from Firestore with ID:", carId);
  } catch (error) {
    console.error(`[data.ts/deleteCar] Error deleting car ${carId} from Firestore:`, error);
    throw error;
  }
};
