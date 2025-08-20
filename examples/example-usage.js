/**
 * Ejemplo de uso de la funcionalidad de caché remoto de I18NJS
 * Autor: @trystan4861
 */

// Importar la clase I18n (en un proyecto real usarías import)
// import { I18n } from './src/I18n';

// Para este ejemplo, asumimos que la clase está disponible globalmente
// const { I18n } = require('./dist/I18n');

async function ejemploBasico() {
  console.log('=== Ejemplo Básico de Caché Remoto ===');
  
  // Crear instancia
  const i18n = new I18n('es');
  
  try {
    // Cargar traducciones desde URL remota con caché de 6 horas
    console.log('Cargando traducciones desde URL remota...');
    await i18n.loadFromRemoteUrl('https://api.example.com/translations.json', 6);
    
    console.log('✓ Traducciones cargadas correctamente');
    console.log('Idiomas disponibles:', i18n.getLanguages());
    
    // Obtener información del caché
    const cacheInfo = i18n.getCacheInfo();
    console.log('Información del caché:', cacheInfo);
    
  } catch (error) {
    console.error('✗ Error cargando traducciones:', error.message);
  }
}

async function ejemploMultiplesUrls() {
  console.log('\n=== Ejemplo con Múltiples URLs ===');
  
  const i18n = new I18n('es');
  
  try {
    // Cargar traducciones base (24 horas de caché por defecto)
    console.log('Cargando traducciones base...');
    await i18n.loadFromRemoteUrl('https://api.example.com/base-translations.json');
    
    // Cargar traducciones específicas del módulo (6 horas de caché)
    console.log('Cargando traducciones del módulo...');
    await i18n.loadFromRemoteUrl('https://api.example.com/module-translations.json', 6);
    
    // Cargar traducciones temporales (1 hora de caché)
    console.log('Cargando traducciones temporales...');
    await i18n.loadFromRemoteUrl('https://api.example.com/temp-translations.json', 1);
    
    console.log('✓ Todas las traducciones cargadas');
    
    // Mostrar información del caché
    const cacheInfo = i18n.getCacheInfo();
    console.log('URLs en caché:', Object.keys(cacheInfo));
    
    // Mostrar estadísticas
    const stats = i18n.getStats();
    console.log('Estadísticas:', {
      idiomas: stats.availableLanguages,
      claves: stats.totalTranslationKeys
    });
    
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

async function ejemploConInit() {
  console.log('\n=== Ejemplo usando init() con URL remota ===');
  
  const i18n = new I18n();
  
  try {
    // Inicializar con URL remota
    await i18n.init({
      lang: 'en',
      remoteUrl: 'https://api.example.com/translations.json',
      cacheLifetimeHours: 12
    });
    
    console.log('✓ I18n inicializado con traducciones remotas');
    console.log('Idioma actual:', i18n.getCurrentLang());
    
    // Ejemplo de traducción
    const translation = i18n.getTranslation({ key: 'welcome' });
    console.log('Traducción de "welcome":', translation);
    
  } catch (error) {
    console.error('✗ Error en inicialización:', error.message);
  }
}

async function ejemploGestionCache() {
  console.log('\n=== Ejemplo de Gestión de Caché ===');
  
  const i18n = new I18n('es');
  
  try {
    // Cargar algunas traducciones
    await i18n.loadFromRemoteUrl('https://api.example.com/translations.json', 2);
    
    // Mostrar información del caché
    let cacheInfo = i18n.getCacheInfo();
    console.log('Caché antes de limpiar:', Object.keys(cacheInfo));
    
    // Limpiar caché
    i18n.clearCache();
    console.log('✓ Caché limpiado');
    
    // Verificar que se limpió
    cacheInfo = i18n.getCacheInfo();
    console.log('Caché después de limpiar:', Object.keys(cacheInfo));
    
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

// Ejecutar ejemplos
async function ejecutarEjemplos() {
  console.log('Iniciando ejemplos de uso de I18NJS con caché remoto...\n');
  
  // Nota: Estos ejemplos fallarán porque las URLs no existen
  // En un uso real, reemplaza con URLs válidas de tu servidor
  
  await ejemploBasico();
  await ejemploMultiplesUrls();
  await ejemploConInit();
  await ejemploGestionCache();
  
  console.log('\n=== Ejemplos completados ===');
  console.log('Nota: Los errores son esperados porque las URLs de ejemplo no existen.');
  console.log('En un proyecto real, reemplaza con URLs válidas de tu servidor.');
}

// Ejecutar si se llama directamente
if (typeof module !== 'undefined' && require.main === module) {
  ejecutarEjemplos();
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined') {
  module.exports = {
    ejemploBasico,
    ejemploMultiplesUrls,
    ejemploConInit,
    ejemploGestionCache,
    ejecutarEjemplos
  };
}