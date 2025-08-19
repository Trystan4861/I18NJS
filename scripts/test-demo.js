#!/usr/bin/env node

/**
 * Script de testing básico para la demo de I18NJS
 * Verifica que todos los archivos necesarios existan
 * Autor: @trystan4861
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Ejecutando tests de la demo I18NJS...\n');

const requiredFiles = [
  'demo/index.html',
  'demo/css/demo.css',
  'demo/js/i18n.js',
  'demo/js/translations.js',
  'demo/js/demo.js',
  'demo/README.md'
];

const requiredElements = [
  'data-i18n-key',
  'languageSelect',
  'translateAll',
  'addElement',
  'getTranslation',
  'updateLang'
];

let passed = 0;
let failed = 0;

function test(description, condition) {
  if (condition) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    failed++;
  }
}

// Test 1: Verificar archivos requeridos
console.log('📁 Verificando archivos requeridos...');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  test(`Archivo existe: ${file}`, exists);
});

// Test 2: Verificar contenido HTML
console.log('\n🏷️  Verificando elementos HTML...');
try {
  const htmlContent = fs.readFileSync(
    path.join(__dirname, '..', 'demo', 'index.html'), 
    'utf8'
  );
  
  requiredElements.forEach(element => {
    const exists = htmlContent.includes(element);
    test(`Elemento encontrado: ${element}`, exists);
  });
} catch (error) {
  test('Lectura de index.html', false);
}

// Test 3: Verificar estructura de traducciones
console.log('\n🌐 Verificando estructura de traducciones...');
try {
  const translationsContent = fs.readFileSync(
    path.join(__dirname, '..', 'demo', 'js', 'translations.js'), 
    'utf8'
  );
  
  const hasSpanish = translationsContent.includes('es:');
  const hasEnglish = translationsContent.includes('en:');
  const hasFrench = translationsContent.includes('fr:');
  const hasNestedKeys = translationsContent.includes('sections:') && translationsContent.includes('welcome:');
  
  test('Traducciones en español', hasSpanish);
  test('Traducciones en inglés', hasEnglish);
  test('Traducciones en francés', hasFrench);
  test('Claves anidadas', hasNestedKeys);
} catch (error) {
  test('Lectura de translations.js', false);
}

// Test 4: Verificar clase I18n
console.log('\n🔧 Verificando clase I18n...');
try {
  const i18nContent = fs.readFileSync(
    path.join(__dirname, '..', 'demo', 'js', 'i18n.js'), 
    'utf8'
  );
  
  const hasClass = i18nContent.includes('class I18n');
  const hasInit = i18nContent.includes('init(');
  const hasTranslate = i18nContent.includes('translate(');
  const hasGetTranslation = i18nContent.includes('getTranslation(');
  
  test('Clase I18n definida', hasClass);
  test('Método init', hasInit);
  test('Método translate', hasTranslate);
  test('Método getTranslation', hasGetTranslation);
} catch (error) {
  test('Lectura de i18n.js', false);
}

// Test 5: Verificar CSS
console.log('\n🎨 Verificando estilos CSS...');
try {
  const cssContent = fs.readFileSync(
    path.join(__dirname, '..', 'demo', 'css', 'demo.css'), 
    'utf8'
  );
  
  const hasResponsive = cssContent.includes('@media');
  const hasAnimations = cssContent.includes('@keyframes');
  const hasGrid = cssContent.includes('grid');
  const hasFlexbox = cssContent.includes('flex');
  
  test('Diseño responsive', hasResponsive);
  test('Animaciones CSS', hasAnimations);
  test('CSS Grid', hasGrid);
  test('Flexbox', hasFlexbox);
} catch (error) {
  test('Lectura de demo.css', false);
}

// Resumen
console.log('\n📊 Resumen de tests:');
console.log(`✅ Pasaron: ${passed}`);
console.log(`❌ Fallaron: ${failed}`);
console.log(`📈 Total: ${passed + failed}`);

if (failed === 0) {
  console.log('\n🎉 ¡Todos los tests pasaron! La demo está lista.');
  process.exit(0);
} else {
  console.log('\n⚠️  Algunos tests fallaron. Revisa los archivos indicados.');
  process.exit(1);
}