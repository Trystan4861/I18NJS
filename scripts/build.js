#!/usr/bin/env node

/**
 * Script de build personalizado para I18NJS
 * Compila TypeScript y prepara la distribución
 * Autor: @trystan4861
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build de I18NJS...\n');

try {
  // Limpiar directorio dist
  console.log('🧹 Limpiando directorio dist...');
  execSync('npm run clean', { stdio: 'inherit' });

  // Compilar TypeScript
  console.log('📦 Compilando TypeScript...');
  execSync('npm run compile', { stdio: 'inherit' });

  // Copiar archivos de demo
  console.log('📋 Copiando archivos de demo...');
  execSync('npm run copy-demo', { stdio: 'inherit' });

  // Crear archivo de versión
  console.log('📝 Creando archivo de versión...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const versionInfo = {
    version: packageJson.version,
    buildDate: new Date().toISOString(),
    name: packageJson.name,
    description: packageJson.description
  };
  
  fs.writeFileSync(
    path.join('dist', 'version.json'), 
    JSON.stringify(versionInfo, null, 2)
  );

  // Mostrar estadísticas
  console.log('\n✅ Build completado exitosamente!');
  console.log(`📊 Versión: ${packageJson.version}`);
  console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
  
  // Listar archivos generados
  const distFiles = fs.readdirSync('dist');
  console.log(`📁 Archivos generados: ${distFiles.length}`);
  distFiles.forEach(file => {
    const stats = fs.statSync(path.join('dist', file));
    const size = (stats.size / 1024).toFixed(2);
    console.log(`   - ${file} (${size} KB)`);
  });

} catch (error) {
  console.error('❌ Error durante el build:', error.message);
  process.exit(1);
}