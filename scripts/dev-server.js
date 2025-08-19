#!/usr/bin/env node

/**
 * Servidor de desarrollo para I18NJS
 * Inicia servidor HTTP con recarga automática
 * Autor: @trystan4861
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 8080;
const DEMO_DIR = path.join(__dirname, '..', 'demo');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'text/plain';
}

function serveFile(res, filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const mimeType = getMimeType(filePath);
    
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Archivo no encontrado');
  }
}

const server = http.createServer((req, res) => {
  let filePath = path.join(DEMO_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Agregar CORS headers para desarrollo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveFile(res, filePath);
  } else {
    // Servir index.html para rutas SPA
    serveFile(res, path.join(DEMO_DIR, 'index.html'));
  }
});

server.listen(PORT, () => {
  console.log(`🌐 Servidor de desarrollo iniciado`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📁 Sirviendo: ${DEMO_DIR}`);
  console.log(`⏰ Iniciado: ${new Date().toLocaleString()}`);
  console.log('\n💡 Presiona Ctrl+C para detener el servidor');
  
  // Intentar abrir el navegador
  try {
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    execSync(`${start} http://localhost:${PORT}`, { stdio: 'ignore' });
  } catch (error) {
    console.log('ℹ️  No se pudo abrir el navegador automáticamente');
  }
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando servidor de desarrollo...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});