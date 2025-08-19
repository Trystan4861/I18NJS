# Demo I18NJS - Demostración Interactiva

Esta carpeta contiene una demostración completa e interactiva del sistema de internacionalización I18NJS.

## 🚀 Cómo Ejecutar la Demo

### Opción 1: Servidor Local Simple
```bash
# Desde la carpeta demo
python -m http.server 8000
# O con Node.js
npx serve .
```

### Opción 2: Abrir Directamente
Simplemente abre `index.html` en tu navegador web moderno.

## 📁 Estructura de la Demo

```
demo/
├── index.html          # Página principal de la demo
├── css/
│   └── demo.css        # Estilos para la demostración
├── js/
│   ├── i18n.js         # Clase I18n compilada a JavaScript
│   ├── translations.js # Datos de traducción (ES, EN, FR)
│   └── demo.js         # Lógica interactiva de la demo
└── README.md           # Este archivo
```

## 🌐 Funcionalidades Demostradas

### 1. **Cambio Dinámico de Idioma**
- Selector de idioma en la parte superior
- Traduce toda la página instantáneamente
- Soporte para Español, Inglés y Francés

### 2. **Elementos con Data Attributes**
```html
<span data-i18n-key="status.completed">Completado</span>
<input data-i18n-key="form.placeholders.name" placeholder="Ingresa tu nombre">
```

### 3. **Claves Multinivel**
- `page.title` → Título de la página
- `sections.welcome.title` → Título de sección
- `form.labels.name` → Etiqueta de formulario
- `status.completed` → Estado del sistema

### 4. **Controles Interactivos**

#### **Traducir Todo**
Traduce todos los elementos de la página al idioma seleccionado.

#### **Agregar Elemento**
Crea dinámicamente un nuevo elemento con `data-i18n-key` y lo traduce automáticamente.

#### **Obtener Traducción**
Demuestra el método `getTranslation()` con varios ejemplos de claves.

#### **Actualizar Idiomas**
Actualiza los atributos `data-i18n-lang` de elementos que no los tengan.

## 🎯 Casos de Uso Demostrados

### **Formularios**
- Labels traducibles
- Placeholders dinámicos
- Botones de acción

### **Estados del Sistema**
- Indicadores de estado
- Iconos con texto
- Cards informativas

### **Contenido Dinámico**
- Elementos creados por JavaScript
- Traducción automática de nuevo contenido
- Gestión de atributos

### **Navegación y UI**
- Títulos de sección
- Mensajes de usuario
- Footer informativo

## 🔧 Características Técnicas

### **Detección Automática**
- Idioma desde `document.documentElement.lang`
- Fallback al idioma por defecto ('es')
- Actualización automática de atributos

### **Gestión de Elementos**
- Traducción masiva o individual
- Soporte para inputs, textareas y elementos de texto
- Preservación de estructura HTML

### **Sistema de Fallback**
- Retorna la clave original si no encuentra traducción
- Manejo graceful de claves inexistentes
- Logging detallado en consola

## 📊 Área de Salida

La demo incluye un área de salida que muestra:
- Mensajes de inicialización
- Cambios de idioma
- Estadísticas del sistema
- Resultados de operaciones
- Timestamps de acciones

## 🎨 Diseño Responsive

- **Desktop**: Layout en grid con múltiples columnas
- **Tablet**: Adaptación automática de columnas
- **Mobile**: Layout de una sola columna
- **Animaciones**: Transiciones suaves y efectos visuales

## 🧪 Testing Manual

### **Pruebas Básicas**
1. Cambiar idioma usando el selector
2. Verificar que todos los textos se traduzcan
3. Agregar elementos dinámicos
4. Probar formularios con placeholders

### **Pruebas Avanzadas**
1. Inspeccionar atributos `data-i18n-lang`
2. Verificar fallbacks con claves inexistentes
3. Probar traducción de elementos específicos
4. Validar estadísticas del sistema

### **Pruebas de Rendimiento**
1. Medir tiempo de traducción masiva
2. Verificar memoria con elementos dinámicos
3. Probar con muchos elementos simultáneos

## 🐛 Debugging

### **Consola del Navegador**
La demo registra información detallada en la consola:
```javascript
// Acceder a funciones de debugging
window.demoFunctions.clearOutput();
window.demoFunctions.exportStats();
```

### **Área de Salida**
Monitorea en tiempo real:
- Operaciones realizadas
- Cambios de estado
- Errores o advertencias
- Estadísticas actualizadas

## 🔍 Inspección de Elementos

Usa las herramientas de desarrollador para inspeccionar:
- Atributos `data-i18n-key`
- Atributos `data-i18n-lang`
- Cambios en el DOM
- Estructura de traducciones

## 📈 Métricas Disponibles

La demo proporciona estadísticas en tiempo real:
```javascript
{
  "totalElements": 25,
  "availableLanguages": ["es", "en", "fr"],
  "totalTranslationKeys": 45,
  "currentLang": "es",
  "defaultLang": "es"
}
```

## 🎓 Casos de Aprendizaje

### **Para Desarrolladores**
- Implementación práctica de i18n
- Gestión de data-attributes
- Traducción dinámica de contenido
- Integración con formularios

### **Para Diseñadores**
- UX multiidioma
- Adaptación de layouts
- Indicadores visuales de idioma
- Responsive design

### **Para QA**
- Casos de prueba de internacionalización
- Validación de traducciones
- Testing de elementos dinámicos
- Verificación de fallbacks

---

**¡Explora todas las funcionalidades y experimenta con el sistema I18NJS!**

*Desarrollado por trystan4861*