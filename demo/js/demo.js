/**
 * Script principal para la demo de I18NJS
 * Maneja la interactividad y demuestra las funcionalidades
 * Autor: @trystan4861
 */

// Instancia global de I18n
let i18n;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  initializeDemo();
  setupEventListeners();
  showWelcomeMessage();
});

/**
 * Inicializa la demo con la configuración básica
 */
function initializeDemo() {
  // Crear instancia de I18n
  i18n = new I18n();
  
  // Inicializar con idioma por defecto
  i18n.init({ lang: 'es' });
  
  // Cargar traducciones
  i18n.loadTranslations(translations);
  
  // Actualizar atributos de idioma faltantes
  i18n.updateMissingLangAttributes();
  
  // Traducir la página inicial
  i18n.translate();
  
  logToOutput('✅ I18NJS inicializado correctamente');
  logToOutput(`📊 Estadísticas: ${JSON.stringify(i18n.getStats(), null, 2)}`);
}

/**
 * Configura los event listeners para los controles
 */
function setupEventListeners() {
  // Selector de idioma
  const languageSelect = document.getElementById('languageSelect');
  languageSelect.addEventListener('change', function() {
    changeLanguage(this.value);
  });
  
  // Botones de control
  document.getElementById('translateAll').addEventListener('click', function() {
    const currentLang = document.getElementById('languageSelect').value;
    i18n.translate({ lang: currentLang });
    logToOutput(`🔄 Página traducida a: ${currentLang}`);
  });
  
  document.getElementById('addElement').addEventListener('click', function() {
    addDynamicElement();
  });
  
  document.getElementById('getTranslation').addEventListener('click', function() {
    demonstrateGetTranslation();
  });
  
  document.getElementById('getLanguages').addEventListener('click', function() {
    demonstrateGetLanguages();
  });
  
  document.getElementById('updateLang').addEventListener('click', function() {
    i18n.updateMissingLangAttributes();
    logToOutput('🔄 Atributos de idioma actualizados');
  });
  
  // Prevenir envío del formulario para la demo
  document.querySelector('.demo-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const currentLang = document.getElementById('languageSelect').value;
    const message = i18n.getTranslation({ 
      key: 'messages.elementAdded', 
      lang: currentLang 
    });
    logToOutput(`📝 Formulario enviado: ${message}`);
  });
}

/**
 * Cambia el idioma de la aplicación
 * @param {string} lang - Código del idioma
 */
function changeLanguage(lang) {
  // Actualizar el idioma del documento
  document.documentElement.lang = lang;
  
  // Traducir toda la página
  i18n.translate({ lang: lang });
  
  // Asegurar que los elementos dinámicos también se traduzcan
  updateDynamicElements(lang);
  
  // Actualizar el idioma por defecto de la instancia
  i18n.setDefaultLang(lang);
  
  logToOutput(`🌐 Idioma cambiado a: ${lang}`);
  logToOutput(`📊 Estadísticas actualizadas: ${JSON.stringify(i18n.getStats(), null, 2)}`);
}

/**
 * Actualiza las traducciones de elementos dinámicos
 * @param {string} lang - Código del idioma
 */
function updateDynamicElements(lang) {
  const dynamicElements = document.querySelectorAll('.dynamic-element');
  dynamicElements.forEach(element => {
    // Traducir cada elemento dinámico individualmente
    i18n.translate({ element: element, lang: lang });
  });
  
  if (dynamicElements.length > 0) {
    logToOutput(`🔄 ${dynamicElements.length} elemento(s) dinámico(s) actualizado(s)`);
  }
}

/**
 * Agrega un elemento dinámico para demostrar la traducción
 */
function addDynamicElement() {
  const container = document.querySelector('.controls-section');
  const currentLang = document.getElementById('languageSelect').value;
  
  // Crear nuevo elemento
  const newElement = document.createElement('div');
  newElement.className = 'dynamic-element';
  newElement.style.cssText = `
    margin: 15px 0;
    padding: 15px;
    background: #e3f2fd;
    border-radius: 8px;
    border-left: 4px solid #2196f3;
  `;
  
  // Obtener la traducción actual para el contenido
  const elementAddedText = i18n.getTranslation({ key: 'messages.elementAdded', lang: currentLang });
  const deleteText = i18n.getTranslation({ key: 'actions.delete', lang: currentLang });
  
  // Agregar contenido con data-i18n-key
  newElement.innerHTML = `
    <strong data-i18n-key="messages.elementAdded">${elementAddedText}</strong>
    <p>Timestamp: ${new Date().toLocaleTimeString()}</p>
    <button onclick="this.parentElement.remove()" 
            data-i18n-key="actions.delete"
            style="margin-top: 10px; padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
      ${deleteText}
    </button>
  `;
  
  // Insertar antes del área de salida
  const outputArea = document.querySelector('.output-area');
  container.insertBefore(newElement, outputArea);
  
  // Traducir el nuevo elemento
  i18n.translate({ element: newElement, lang: currentLang });
  
  logToOutput(`➕ Elemento dinámico agregado y traducido a: ${currentLang}`);
  logToOutput(`   📝 Texto: "${elementAddedText}"`);
  logToOutput(`   🗑️ Botón: "${deleteText}"`);
}

/**
 * Demuestra el uso del método getLanguages
 */
function demonstrateGetLanguages() {
  const availableLanguages = i18n.getLanguages();
  const currentLang = document.getElementById('languageSelect').value;
  
  logToOutput(`🌐 Demostrando getLanguages():`);
  logToOutput(`📋 Idiomas disponibles: [${availableLanguages.join(', ')}]`);
  logToOutput(`📊 Total de idiomas: ${availableLanguages.length}`);
  logToOutput(`🎯 Idioma actual: ${currentLang}`);
  
  // Mostrar información adicional de cada idioma
  availableLanguages.forEach((lang, index) => {
    const isActive = lang === currentLang ? ' (activo)' : '';
    const sampleTranslation = i18n.getTranslation({ key: 'page.title', lang });
    logToOutput(`  ${index + 1}. ${lang.toUpperCase()}${isActive}: "${sampleTranslation}"`);
  });
}

/**
 * Demuestra el uso del método getTranslation
 */
function demonstrateGetTranslation() {
  const currentLang = document.getElementById('languageSelect').value;
  
  // Demostrar getLanguages()
  const availableLanguages = i18n.getLanguages();
  logToOutput(`🌐 Idiomas disponibles: ${availableLanguages.join(', ')}`);
  
  // Ejemplos de obtención de traducciones
  const examples = [
    'page.title',
    'sections.welcome.title',
    'form.labels.name',
    'status.completed',
    'messages.translationResult'
  ];
  
  logToOutput(`🔍 Demostrando getTranslation() en idioma: ${currentLang}`);
  
  examples.forEach(key => {
    const translation = i18n.getTranslation({ key, lang: currentLang });
    logToOutput(`  "${key}" → "${translation}"`);
  });
  
  // Ejemplo con clave inexistente
  const nonExistent = i18n.getTranslation({ 
    key: 'nonexistent.key', 
    lang: currentLang 
  });
  logToOutput(`  "nonexistent.key" → "${nonExistent}" (fallback a la clave)`);
}

/**
 * Muestra mensaje de bienvenida en la consola
 */
function showWelcomeMessage() {
  console.log(`
🌐 I18NJS Demo Iniciada
======================
✅ Sistema de internacionalización cargado
📚 Idiomas disponibles: ${Object.keys(translations).join(', ')}
🎯 Funcionalidades disponibles:
   - Cambio dinámico de idioma
   - Traducción de elementos específicos
   - Obtención de traducciones por clave
   - Gestión automática de atributos
   - Elementos dinámicos

💡 Usa los controles en la página para probar las funcionalidades
  `);
}

/**
 * Registra mensajes en el área de salida
 * @param {string} message - Mensaje a registrar
 */
function logToOutput(message) {
  const outputContent = document.getElementById('outputContent');
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  outputContent.textContent += logEntry;
  outputContent.scrollTop = outputContent.scrollHeight;
  
  // También registrar en la consola del navegador
  console.log(message);
}

/**
 * Función auxiliar para limpiar el área de salida
 */
function clearOutput() {
  document.getElementById('outputContent').textContent = '';
}

/**
 * Función para exportar estadísticas (útil para debugging)
 */
function exportStats() {
  const stats = i18n.getStats();
  const dataStr = JSON.stringify(stats, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'i18n-stats.json';
  link.click();
  
  logToOutput('📊 Estadísticas exportadas como JSON');
}

// Hacer funciones disponibles globalmente para debugging
window.demoFunctions = {
  clearOutput,
  exportStats,
  changeLanguage,
  updateDynamicElements,
  addDynamicElement,
  demonstrateGetTranslation,
  demonstrateGetLanguages
};

// Agregar estilos para elementos dinámicos
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  .dynamic-element {
    animation: slideIn 0.3s ease-out;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(dynamicStyles);