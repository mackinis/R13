export const es = {
  // Header
  navHome: 'Inicio',
  navAllCars: 'Autos',
  navContact: 'Contacto',
  languageSwitcherTooltip: 'Cambiar idioma',
  toggleMenuSrOnly: 'Alternar Menú', 
  logoAltText: 'Logo de {storeName}',
  defaultStoreName: 'AutoArtisan',
  // Removed loginButtonLabel

  // Footer
  footerQuickLinks: 'Enlaces Rápidos',
  footerAboutUsLink: 'Sobre Nosotros',
  footerContactLink: 'Contacto',
  footerFollowUs: 'Síguenos',
  footerCopyright: '© {year} {storeName}.',
  footerAllRightsReserved: 'Todos los Derechos Reservados.',
  noSocialLinksConfigured: 'No hay enlaces sociales configurados.',

  // Homepage (src/app/(main)/page.tsx)
  heroTitle: '{storeName}',
  heroSubtitle: 'Creando Excelencia Automotriz. Descubre el auto de tus sueños con nosotros.',
  heroExploreButton: 'Explora Nuestra Colección',
  heroAltText: 'Media principal de {storeName}',
  featuredVehiclesTitle: 'Vehículos Destacados',
  featuredVehiclesSubtitle: 'Explora nuestra cuidada selección de vehículos premium, combinando lujo, rendimiento y tecnología de vanguardia.',
  noCarsAvailable: 'No hay autos disponibles en este momento.',
  viewAllCarsButton: 'Ver Todos los Autos',
  aboutUsSectionTitle: 'Sobre Nosotros',
  aboutUsSectionText: 'En {storeName}, nos apasiona conectar a compradores exigentes con vehículos excepcionales. Nuestra colección curada representa la cima de la ingeniería y el diseño automotriz. Creemos en la transparencia, la calidad y una experiencia personalizada para cada cliente.',
  learnMoreButton: 'Contáctanos',
  getInTouchSectionTitle: 'Ponte en Contacto',
  getInTouchSectionText: '¿Tienes preguntas o estás listo para encontrar tu próximo vehículo? Nuestro equipo de expertos está aquí para ayudarte.',
  contactUsButton: 'Contáctanos',
  loadingPageContent: 'Cargando contenido de la página...',

  // Car Card (src/components/car-card.tsx)
  carCardViewDetails: 'Ver Detalles',

  // All Cars Page (src/app/cars/page.tsx)
  allCarsPageTitle: 'Nuestra Colección',
  searchByNameBrandLabel: 'Buscar por Nombre/Marca',
  searchByNameBrandPlaceholder: 'ej., Elegance Cruiser o Prestige Motors',
  filterByBrandLabel: 'Filtrar por Marca',
  filterByBrandPlaceholder: 'Todas las Marcas',
  allBrandsOption: 'Todas las Marcas',
  applyFiltersButton: 'Aplicar Filtros',
  noCarsFoundTitle: 'No se Encontraron Autos',
  noCarsFoundText: 'No pudimos encontrar ningún auto que coincida con tus criterios. Intenta ajustar tus filtros o términos de búsqueda.',
  noCarsAvailableAdminPrompt: "No Hay Autos Disponibles",
  noCarsAvailableAdminPromptText: "Actualmente no hay autos en el inventario. Por favor, añade autos a través del panel de administración.",
  clearFiltersButton: 'Limpiar Filtros',
  loadingCarCollection: 'Cargando colección de autos...',

  // Car Detail Page (src/app/cars/[id]/page.tsx)
  backToAllCarsLink: 'Volver a Todos los Autos',
  carNotFoundTitle: 'Auto no encontrado',
  carNotFoundText: 'El auto que buscas no existe o ha sido eliminado.',
  carDetailDescriptionTitle: 'Descripción',
  carDetailFeaturesTitle: 'Características',
  carDetailInterestedTitle: '¿Interesado en este auto?',
  carDetailInterestedText: 'Contáctanos hoy para una prueba de manejo o más información.',
  carDetailEmailUsButton: 'Envíanos un Email',
  carDetailCallUsButton: 'Llámanos',
  loadingCarDetails: 'Cargando detalles del auto...',
  carImageAlt: '{carName} - Imagen {index}',
  noImagesAvailable: 'No hay imágenes disponibles',
  carDetailYearLabel: 'Año',
  carDetailMileageLabel: 'Kilometraje',
  carDetailFuelTypeLabel: 'Combustible',
  carDetailTransmissionLabel: 'Transmisión',
  carDetailColorLabel: 'Color',
  carDetailEngineSizeLabel: 'Motor',

  // WhatsApp Button
  chatButtonLabel: 'Chat',
  whatsappContactNumber: '5491123456789', 
  chatButtonDefaultMessage: 'Hola, estoy interesado en sus autos.',

  // Contact Page
  contactPageTitle: 'Contáctanos',
  contactPageSubtitle: '¡Nos encantaría saber de ti! Si tienes alguna pregunta sobre nuestros vehículos, servicios o cualquier otra cosa, nuestro equipo está listo para responder todas tus dudas.',
  contactFormTitle: 'Envíanos un Mensaje',
  contactFormNameLabel: 'Nombre Completo',
  contactFormNamePlaceholder: 'Ingresa tu nombre completo',
  contactFormEmailLabel: 'Correo Electrónico',
  contactFormEmailPlaceholder: 'tu@ejemplo.com',
  contactFormMessageLabel: 'Tu Mensaje',
  contactFormMessagePlaceholder: 'Escribe tu mensaje aquí...',
  contactFormSendButton: 'Enviar Mensaje',
  contactFormSendingButton: 'Enviando...',
  contactFormSuccessTitle: '¡Mensaje Enviado!',
  contactFormSuccessDesc: 'Gracias por contactarnos. Te responderemos en breve.',
  contactFormErrorTitle: 'Error al Enviar Mensaje',
  contactFormErrorServerDefault: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
  contactFormErrorServerUnreadable: 'No se pudo entender la respuesta de error del servidor. Por favor, inténtalo de nuevo.',
  contactFormErrorNameTooShort: 'El nombre debe tener al menos 2 caracteres.',
  contactFormErrorEmailInvalid: 'Por favor, ingresa un correo electrónico válido.',
  contactFormErrorMessageTooShort: 'El mensaje debe tener al menos 10 caracteres.',
  contactInfoDirectTitle: 'Contacto Directo',
  contactInfoAddressTitle: 'Nuestra Sala de Exposición',
  contactInfoHoursTitle: 'Horario de Atención',
  siteContactEmail: 'ventas@autoartisan.com',
  siteContactPhone: '+54 (11) 5555-1234',
  siteContactAddress: 'Av. Lujo 123\nCiudad Auto, CA 12345',
  siteContactHours: 'Lunes - Viernes: 9hs - 18hs\nSábado: 10hs - 16hs\nDomingo: Cerrado',
  mapPlaceholderTitle: 'Ubicación de Nuestra Sala de Exposición',
  mapSectionTitle: 'Encuéntranos Aquí',
  loadingContactInfo: 'Cargando información de contacto...',
  mapQueryNotConfigured: 'Consulta de mapa no configurada.',
  contactFormMessageCarInterest: 'Estoy interesado en el auto: {carName}. Por favor, brinden más información.',

  // Login Page & Panel
  loginPageTitle: 'Acceso de Administrador',
  loginPageSubtitlePanel: 'Accede al Panel de Control de {storeName}.',
  emailLabel: 'Correo Electrónico',
  passwordLabel: 'Contraseña',
  loginButton: 'Ingresar',
  loginSuccessTitle: '¡Inicio de Sesión Exitoso!',
  loginSuccessDescPanelRedirect: '¡Inicio de sesión exitoso! Redirigiendo al panel de control...',
  loginErrorTitle: 'Fallo de Inicio de Sesión',
  loginErrorDescDefault: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
  loginErrorDescInvalidCredentials: 'Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.',
  loginErrorDescNetwork: 'Ocurrió un error de red. Por favor, inténtalo de nuevo.',
  loginErrorDescFirebase: 'Falló la autenticación con Firebase: {message} (Código: {code})',
  loginErrorDescTooManyRequests: 'El acceso a esta cuenta ha sido deshabilitado temporalmente debido a muchos intentos fallidos de inicio de sesión. Puedes restaurarlo inmediatamente restableciendo tu contraseña o puedes intentarlo de nuevo más tarde.',
  loginErrorDescServerUnreadable: 'No se pudo entender la respuesta de error del servidor. Por favor, inténtalo de nuevo.',
  forgotPasswordPrompt: "¿No puedes iniciar sesión?",
  contactSupportLink: "Contacta a Soporte",
  backToSiteLink: "Volver al Sitio Principal",

  // Panel Layout & Page
  adminPanelTitle: 'Panel de Control',
  viewSiteButton: 'Ver Sitio',
  logoutButton: 'Cerrar Sesión',
  logoutSuccessTitle: 'Sesión Cerrada',
  logoutSuccessDesc: 'Has cerrado sesión exitosamente.',
  logoutErrorTitle: 'Fallo al Cerrar Sesión',
  logoutErrorDescDefault: 'No se pudo cerrar sesión. Por favor, inténtalo de nuevo.',
  logoutErrorDescNetwork: 'Ocurrió un error de red. Por favor, inténtalo de nuevo.',
  logoutErrorDescFirebase: 'Fallo al cerrar sesión con Firebase: {message} (Código: {code})',
  adminFooterText: 'Panel de Control de {storeName} © {year}',
  adminPanelSubtitle: 'Gestiona tus listados de autos y la configuración del sitio.',
  verifyingAuth: 'Verificando autenticación...',


  addCarTitle: 'Añadir Auto',
  editCarTitle: 'Editar Auto',
  editingCarDesc: 'Editando detalles para {carName}',
  theSelectedCar: 'el auto seleccionado',
  addCarDesc: 'Completa los detalles para añadir un nuevo auto a tu inventario.',
  carNameLabel: 'Nombre',
  carNamePlaceholder: 'ej., Elegance Cruiser X1',
  carBrandLabel: 'Marca',
  carBrandPlaceholder: 'ej., Prestige Motors',
  carYearLabel: 'Año',
  carYearPlaceholder: 'ej., 2023',
  carPriceLabel: 'Precio ($)',
  carPricePlaceholder: 'ej., 75000',
  carMileageLabel: 'Kilometraje (km)',
  carMileagePlaceholder: 'ej., 5000',
  carColorLabel: 'Color',
  carColorPlaceholder: 'ej., Azul Medianoche',
  carFuelTypeLabel: 'Tipo de Combustible',
  carFuelTypePlaceholder: 'Seleccionar Tipo de Combustible',
  fuelTypePetrol: 'Gasolina',
  fuelTypeDiesel: 'Diésel',
  fuelTypeElectric: 'Eléctrico',
  fuelTypeHybrid: 'Híbrido',
  carTransmissionLabel: 'Transmisión',
  carTransmissionPlaceholder: 'Seleccionar Transmisión',
  transmissionAutomatic: 'Automática',
  transmissionManual: 'Manual',
  carEngineSizeLabel: 'Tamaño del Motor',
  carEngineSizePlaceholder: 'ej., 3.0L V6 o 150kW',
  carDescriptionLabel: 'Descripción',
  carDescriptionPlaceholder: 'Descripción detallada del auto...',
  carImagesLabel: 'Imágenes (URLs separadas por coma)',
  carImagesPlaceholder: 'url1, url2, url3',
  carFeaturesLabel: 'Características (separadas por coma)',
  carFeaturesPlaceholder: 'Característica 1, Característica 2',
  addCarButton: 'Añadir Auto',
  saveChangesButton: 'Guardar Cambios',
  cancelEditButton: 'Cancelar Edición',
  deleteButton: 'Eliminar',

  carListingsTitle: 'Listados de Autos',
  carListingsDesc: 'Ver, editar o eliminar listados de autos existentes.',
  noCarsListedMessage: 'Aún no hay autos listados. Añade uno usando el formulario de arriba.',

  manageFooterTitle: 'Gestionar Contenido del Pie de Página',
  manageFooterDesc: 'Actualizar la información que se muestra en el pie de página del sitio.',
  socialLinksTitle: 'Enlaces de Redes Sociales',
  addSocialLinkButton: 'Añadir Enlace Social',
  removeSocialLinkButton: 'Eliminar',
  removeSocialLinkButtonAria: 'Eliminar enlace social',
  platformLabel: 'Plataforma',
  platformPlaceholder: 'ej., Facebook',
  urlLabel: 'URL',
  urlPlaceholder: 'https://facebook.com/usuario',
  saveFooterButton: 'Guardar Contenido del Pie de Página',
  copyrightCoreTextLabel: "Texto Principal del Copyright (ej., '2024 TuEmpresa')",
  contactAddressLabel: 'Dirección de Contacto',
  contactPhoneLabel: 'Teléfono de Contacto',
  contactEmailLabel: 'Email de Contacto',
  mapQueryLabel: 'Texto de Búsqueda del Mapa',
  mapQueryPlaceholder: 'ej., Av. Corrientes 123, CABA o Lat,Lng',

  storeSettingsCardTitle: 'Configuración de la Tienda',
  storeSettingsCardDesc: 'Gestionar información general de la tienda como nombre, logo y banner principal.',
  storeNameLabel: 'Nombre de la Tienda',
  storeNamePlaceholder: 'ej., AutoArtisan Autos de Lujo',
  logoUrlLabel: 'URL del Logo (Modo Claro)',
  logoUrlPlaceholder: 'https://ejemplo.com/logo-claro.png',
  logoUrlDarkLabel: 'URL del Logo (Modo Oscuro)',
  logoUrlDarkPlaceholder: 'https://ejemplo.com/logo-oscuro.png (opcional)',
  heroSubtitleLabel: 'Subtítulo del Banner Principal',
  heroSubtitlePlaceholder: 'Ingresa el subtítulo para el banner principal en la página de inicio...',
  heroMediaUrlLabel: 'URL del Media Principal (Imagen o Video)',
  heroMediaUrlPlaceholder: 'https://ejemplo.com/hero-imagen.jpg o /hero-video.mp4',
  heroMediaTypeLabel: 'Tipo de Media Principal',
  heroMediaTypePlaceholder: 'Selecciona el tipo de media',
  mediaTypeImage: 'Imagen',
  mediaTypeVideo: 'Video',
  saveStoreSettingsButton: 'Guardar Configuración de Tienda',
  loadingStoreSettings: 'Cargando configuración de la tienda...',

  // Chat Management Translations
  manageChatCardTitle: 'Gestionar Widget de Chat',
  manageChatCardDesc: 'Configurar los ajustes del widget de chat de WhatsApp.',
  enableChatLabel: 'Habilitar Widget de Chat',
  customIconUrlLabel: 'URL del Ícono Personalizado (opcional)',
  customIconUrlPlaceholder: 'https://ejemplo.com/icono.png (reemplaza el ícono de WhatsApp)',
  chatIconSizeLabel: 'Tamaño del Ícono (píxeles)',
  chatIconSizePlaceholder: 'ej., 40 (predeterminado)',
  chatPhoneNumberLabel: 'Número de Teléfono de WhatsApp',
  chatPhoneNumberPlaceholder: 'ej., 5491123456789 (incluir código de país)',
  chatDefaultMessageLabel: 'Mensaje de Chat Predeterminado',
  chatDefaultMessagePlaceholder: 'ej., Hola, tengo una pregunta sobre un auto...',
  saveChatSettingsButton: 'Guardar Ajustes del Chat',
  chatSettingsSuccessSave: 'Ajustes del chat actualizados correctamente.',
  chatSettingsErrorSave: 'Error al guardar los ajustes del chat.',

  // Panel Page general
  errorLoadingDataTitle: 'Error al Cargar Datos',
  errorLoadingDataDesc: 'Falló la carga inicial de datos del panel desde Firestore.',
  successTitle: '¡Éxito!',
  errorTitle: '¡Error!',
  carSaveErrorRequiredFields: 'Nombre, Marca, Precio y Año son obligatorios para el auto.',
  carUpdateSuccess: '{carName} actualizado en Firestore.',
  carAddSuccess: '{carName} añadido en Firestore.',
  carSaveErrorDb: 'Falló al guardar el auto en la base de datos.',
  carDeleteSuccess: 'Auto eliminado de Firestore.',
  carDeleteErrorDb: 'Falló al eliminar el auto de la base de datos.',
  footerUpdateSuccess: 'Contenido del pie de página actualizado en Firestore.',
  footerUpdateErrorDb: 'Falló al guardar el contenido del pie de página en la base de datos.',
  storeSettingsUpdateSuccess: 'Configuración de tienda actualizada en Firestore.',
  storeSettingsUpdateErrorDb: 'Falló al guardar la configuración de tienda en la base de datos.',
  loadingPanelData: 'Cargando datos del panel...',
  editButton: 'Editar',
};