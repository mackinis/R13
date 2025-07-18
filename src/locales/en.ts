
export const en = {
  // Header
  navHome: 'Home',
  navAllCars: 'All Cars',
  navContact: 'Contact',
  languageSwitcherTooltip: 'Change language',
  toggleMenuSrOnly: 'Toggle Menu', 
  logoAltText: '{storeName} Logo',
  defaultStoreName: 'AutoArtisan',
  adminPanelLogin: 'Admin Panel',


  // Footer
  footerQuickLinks: 'Quick Links',
  footerAboutUsLink: 'About Us',
  footerContactLink: 'Contact',
  footerFollowUs: 'Follow Us',
  footerCopyright: '© {year} {storeName}.',
  footerAllRightsReserved: 'All Rights Reserved.',
  noSocialLinksConfigured: 'No social links configured.',


  // Homepage (src/app/(main)/page.tsx)
  heroTitle: '{storeName}',
  heroSubtitle: 'Crafting Automotive Excellence. Discover your dream car with us.',
  heroExploreButton: 'Explore Our Collection',
  heroAltText: 'Hero media for {storeName}',
  featuredVehiclesTitle: 'Featured Vehicles',
  featuredVehiclesSubtitle: 'Explore our handpicked selection of premium vehicles, combining luxury, performance, and cutting-edge technology.',
  noCarsAvailable: 'No cars available at the moment. Please check back later or add new cars in the admin panel.',
  viewAllCarsButton: 'View All Cars',
  aboutUsSectionTitle: 'About Us',
  aboutUsSectionText: 'At {storeName}, we are passionate about connecting discerning buyers with exceptional vehicles. Our curated collection represents the pinnacle of automotive engineering and design. We believe in transparency, quality, and a personalized experience for every client.',
  learnMoreButton: 'Contact Us',
  getInTouchSectionTitle: 'Get in Touch',
  getInTouchSectionText: 'Have questions or ready to find your next vehicle? Our expert team is here to assist you.',
  contactUsButton: 'Contact Us',
  loadingPageContent: 'Loading page content...',

  // Car Card (src/components/car-card.tsx)
  carCardViewDetails: 'View Details',

  // All Cars Page (src/app/cars/page.tsx)
  allCarsPageTitle: 'Our Collection',
  searchByNameBrandLabel: 'Search by Name/Brand',
  searchByNameBrandPlaceholder: 'e.g., Elegance Cruiser or Prestige Motors',
  filterByBrandLabel: 'Filter by Brand',
  filterByBrandPlaceholder: 'All Brands',
  allBrandsOption: 'All Brands',
  applyFiltersButton: 'Apply Filters',
  noCarsFoundTitle: 'No Cars Found',
  noCarsFoundText: "We couldn't find any cars matching your criteria. Try adjusting your filters or search terms.",
  noCarsAvailableAdminPrompt: "No Cars Available",
  noCarsAvailableAdminPromptText: "There are currently no cars in the inventory. Please add cars via the admin panel.",
  clearFiltersButton: 'Clear Filters',
  loadingCarCollection: 'Loading car collection...',

  // Car Detail Page (src/app/cars/[id]/page.tsx)
  backToAllCarsLink: 'Back to All Cars',
  carNotFoundTitle: 'Car not found',
  carNotFoundText: 'The car you are looking for does not exist or has been removed.',
  carDetailDescriptionTitle: 'Description',
  carDetailFeaturesTitle: 'Features',
  carDetailInterestedTitle: 'Interested in this car?',
  carDetailInterestedText: 'Contact us today for a test drive or more information.',
  carDetailEmailUsButton: 'Email Us',
  carDetailCallUsButton: 'Call Us',
  loadingCarDetails: 'Loading car details...',
  carImageAlt: '{carName} - Image {index}',
  noImagesAvailable: 'No images available',
  carDetailYearLabel: 'Year',
  carDetailMileageLabel: 'Mileage',
  carDetailFuelTypeLabel: 'Fuel',
  carDetailTransmissionLabel: 'Transmission',
  carDetailColorLabel: 'Color',
  carDetailEngineSizeLabel: 'Engine',


  // WhatsApp Button
  chatButtonLabel: 'Chat',
  whatsappContactNumber: '1234567890', 
  chatButtonDefaultMessage: 'Hello, I am interested in your cars.',

  // Contact Page
  contactPageTitle: 'Contact Us',
  contactPageSubtitle: "We'd love to hear from you! Whether you have a question about our vehicles, services, or anything else, our team is ready to answer all your questions.",
  contactFormTitle: 'Send us a Message',
  contactFormNameLabel: 'Full Name',
  contactFormNamePlaceholder: 'Enter your full name',
  contactFormEmailLabel: 'Email Address',
  contactFormEmailPlaceholder: 'you@example.com',
  contactFormMessageLabel: 'Your Message',
  contactFormMessagePlaceholder: 'Type your message here...',
  contactFormSendButton: 'Send Message',
  contactFormSendingButton: 'Sending...',
  contactFormSuccessTitle: 'Message Sent!',
  contactFormSuccessDesc: 'Thank you for contacting us. We will get back to you shortly.',
  contactFormErrorTitle: 'Error Sending Message',
  contactFormErrorServerDefault: 'An unexpected error occurred. Please try again.',
  contactFormErrorServerUnreadable: 'Could not read server error response. Please try again.',
  contactFormErrorNameTooShort: 'Name must be at least 2 characters.',
  contactFormErrorEmailInvalid: 'Please enter a valid email address.',
  contactFormErrorMessageTooShort: 'Message must be at least 10 characters.',
  contactInfoDirectTitle: 'Direct Contact',
  contactInfoAddressTitle: 'Our Showroom',
  contactInfoHoursTitle: 'Opening Hours',
  siteContactEmail: 'sales@autoartisan.com',
  siteContactPhone: '+1 (555) 123-4567',
  siteContactAddress: '123 Luxury Drive\nAuto City, AC 12345',
  siteContactHours: 'Monday - Friday: 9am - 6pm\nSaturday: 10am - 4pm\nSunday: Closed',
  mapPlaceholderTitle: 'Our Showroom Location',
  mapSectionTitle: 'Find Us Here',
  loadingContactInfo: 'Loading contact information...',
  mapQueryNotConfigured: 'Map query not configured.',
  contactFormMessageCarInterest: 'I am interested in the car: {carName}. Please provide more information.',


  // Login Page & Panel
  loginPageTitle: 'Admin Login',
  loginPageSubtitlePanel: 'Access the {storeName} Control Panel.',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  loginButton: 'Login',
  loginSuccessTitle: 'Login Successful!',
  loginSuccessDescPanelRedirect: 'Login successful! Redirecting to the control panel...',
  loginErrorTitle: 'Login Failed',
  loginErrorDescDefault: 'An unexpected error occurred. Please try again.',
  loginErrorDescInvalidCredentials: 'Invalid email or password. Please try again.',
  loginErrorDescNetwork: 'A network error occurred. Please try again.',
  loginErrorDescFirebase: 'Firebase authentication failed: {message} (Code: {code})',
  loginErrorDescTooManyRequests: 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
  loginErrorDescServerUnreadable: 'Could not read server error response. Please try again.',
  forgotPasswordPrompt: "Can't log in?",
  contactSupportLink: "Contact Support",
  backToSiteLink: "Back to Main Site",

  // Panel Layout & Page
  adminPanelTitle: 'Control Panel',
  viewSiteButton: 'View Site',
  logoutButton: 'Logout',
  logoutSuccessTitle: 'Logged Out',
  logoutSuccessDesc: 'You have been successfully logged out.',
  logoutErrorTitle: 'Logout Failed',
  logoutErrorDescDefault: 'Could not log out. Please try again.',
  logoutErrorDescNetwork: 'A network error occurred. Please try again.',
  logoutErrorDescFirebase: 'Firebase logout failed: {message} (Code: {code})',
  adminFooterText: '{storeName} Control Panel © {year}',
  adminPanelSubtitle: 'Manage your car listings and site settings.',
  verifyingAuth: 'Verifying authentication...',


  addCarTitle: 'Add Car',
  editCarTitle: 'Edit Car',
  editingCarDesc: 'Editing details for {carName}',
  theSelectedCar: 'the selected car',
  addCarDesc: 'Fill in the details to add a new car to your inventory.',
  carNameLabel: 'Name',
  carNamePlaceholder: 'e.g., Elegance Cruiser X1',
  carBrandLabel: 'Brand',
  carBrandPlaceholder: 'e.g., Prestige Motors',
  carYearLabel: 'Year',
  carYearPlaceholder: 'e.g., 2023',
  carPriceLabel: 'Price ($)',
  carPricePlaceholder: 'e.g., 75000',
  carMileageLabel: 'Mileage (km)',
  carMileagePlaceholder: 'e.g., 5000',
  carColorLabel: 'Color',
  carColorPlaceholder: 'e.g., Midnight Blue',
  carFuelTypeLabel: 'Fuel Type',
  carFuelTypePlaceholder: 'Select Fuel Type',
  fuelTypePetrol: 'Petrol',
  fuelTypeDiesel: 'Diesel',
  fuelTypeElectric: 'Electric',
  fuelTypeHybrid: 'Hybrid',
  carTransmissionLabel: 'Transmission',
  carTransmissionPlaceholder: 'Select Transmission',
  transmissionAutomatic: 'Automatic',
  transmissionManual: 'Manual',
  carEngineSizeLabel: 'Engine Size',
  carEngineSizePlaceholder: 'e.g., 3.0L V6 or 150kW',
  carDescriptionLabel: 'Description',
  carDescriptionPlaceholder: 'Detailed description of the car...',
  carImagesLabel: 'Images (comma-separated URLs)',
  carImagesPlaceholder: 'url1, url2, url3',
  carFeaturesLabel: 'Features (comma-separated)',
  carFeaturesPlaceholder: 'Feature 1, Feature 2',
  addCarButton: 'Add Car',
  saveChangesButton: 'Save Changes',
  cancelEditButton: 'Cancel Edit',
  deleteButton: 'Delete',

  carListingsTitle: 'Car Listings',
  carListingsDesc: 'View, edit, or delete existing car listings.',
  noCarsListedMessage: 'No cars listed yet. Add one using the form above.',

  manageFooterTitle: 'Manage Footer Content',
  manageFooterDesc: 'Update the information displayed in the site footer.',
  socialLinksTitle: 'Social Media Links',
  addSocialLinkButton: 'Add Social Link',
  removeSocialLinkButton: 'Remove',
  removeSocialLinkButtonAria: 'Remove social link',
  platformLabel: 'Platform',
  platformPlaceholder: 'e.g., Facebook',
  urlLabel: 'URL',
  urlPlaceholder: 'https://facebook.com/username',
  saveFooterButton: 'Save Footer Content',
  copyrightCoreTextLabel: "Copyright Core Text (e.g., '2024 YourCompany')",
  contactAddressLabel: 'Contact Address',
  contactPhoneLabel: 'Contact Phone',
  contactEmailLabel: 'Contact Email',
  mapQueryLabel: 'Map Search Query',
  mapQueryPlaceholder: 'e.g., 123 Main St, Anytown or Lat,Lng',

  storeSettingsCardTitle: 'Store Settings',
  storeSettingsCardDesc: 'Manage general store information like name, logo, and hero banner.',
  storeNameLabel: 'Store Name',
  storeNamePlaceholder: 'e.g., AutoArtisan Deluxe Cars',
  logoUrlLabel: 'Logo URL (Light Mode)',
  logoUrlPlaceholder: 'https://example.com/logo-light.png',
  logoUrlDarkLabel: 'Logo URL (Dark Mode)',
  logoUrlDarkPlaceholder: 'https://example.com/logo-dark.png (optional)',
  heroSubtitleLabel: 'Hero Banner Subtitle',
  heroSubtitlePlaceholder: 'Enter the subtitle for the main hero banner on the homepage...',
  heroMediaUrlLabel: 'Hero Media URL (Image or Video)',
  heroMediaUrlPlaceholder: 'https://example.com/hero-image.jpg or /hero-video.mp4',
  heroMediaTypeLabel: 'Hero Media Type',
  heroMediaTypePlaceholder: 'Select media type',
  mediaTypeImage: 'Image',
  mediaTypeVideo: 'Video',
  saveStoreSettingsButton: 'Save Store Settings',
  loadingStoreSettings: 'Loading store settings...',

  // Chat Management Translations
  manageChatCardTitle: 'Manage Chat Widget',
  manageChatCardDesc: 'Configure the WhatsApp chat widget settings.',
  enableChatLabel: 'Enable Chat Widget',
  customIconUrlLabel: 'Custom Icon URL (optional)',
  customIconUrlPlaceholder: 'https://example.com/icon.png (overrides default WhatsApp icon)',
  chatIconSizeLabel: 'Icon Size (pixels)',
  chatIconSizePlaceholder: 'e.g., 40 (default)',
  chatPhoneNumberLabel: 'WhatsApp Phone Number',
  chatPhoneNumberPlaceholder: 'e.g., 16505551234 (include country code)',
  chatDefaultMessageLabel: 'Default Chat Message',
  chatDefaultMessagePlaceholder: 'e.g., Hello, I have a question about a car...',
  saveChatSettingsButton: 'Save Chat Settings',
  chatSettingsSuccessSave: 'Chat settings updated successfully.',
  chatSettingsErrorSave: 'Failed to save chat settings.',

  // Panel Page general
  errorLoadingDataTitle: 'Error Loading Data',
  errorLoadingDataDesc: 'Failed to load initial panel data from Firestore.',
  successTitle: 'Success!',
  errorTitle: 'Error!',
  carSaveErrorRequiredFields: 'Name, Brand, Price, and Year are required for car.',
  carUpdateSuccess: '{carName} updated in Firestore.',
  carAddSuccess: '{carName} added to Firestore.',
  carSaveErrorDb: 'Failed to save car to database.',
  carDeleteSuccess: 'Car deleted from Firestore.',
  carDeleteErrorDb: 'Failed to delete car from database.',
  footerUpdateSuccess: 'Footer content updated in Firestore.',
  footerUpdateErrorDb: 'Failed to save footer content to database.',
  storeSettingsUpdateSuccess: 'Store settings updated in Firestore.',
  storeSettingsUpdateErrorDb: 'Failed to save store settings to database.',
  loadingPanelData: 'Loading panel data...',
  editButton: 'Edit', 
};
