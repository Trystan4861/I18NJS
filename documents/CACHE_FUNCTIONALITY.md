# Funcionalidad de Caché Remoto - I18NJS

## Descripción

La clase I18n ahora incluye funcionalidad de caché remoto que permite descargar traducciones desde URLs remotas y almacenarlas localmente en el navegador usando localStorage. Esta funcionalidad incluye gestión automática de expiración de caché y soporte para múltiples URLs simultáneamente.

## Características Principales

### 1. Descarga Remota con Caché
- Descarga traducciones desde URLs remotas
- Almacenamiento automático en localStorage
- Verificación de caché antes de realizar peticiones HTTP
- Soporte para múltiples URLs simultáneamente

### 2. Gestión de Tiempo de Vida
- Tiempo de vida configurable por URL (en horas)
- Valor por defecto: 24 horas
- Limpieza automática de caché expirado
- Verificación de validez en cada acceso

### 3. Fusión Inteligente de Traducciones
- Las traducciones remotas se fusionan con las locales existentes
- Soporte para estructuras anidadas
- Preservación de traducciones previas

## API

### Nuevas Opciones en I18nOptions

```typescript
interface I18nOptions {
  lang?: string;
  remoteUrl?: string;           // Nueva: URL remota de traducciones
  cacheLifetimeHours?: number;  // Nueva: Tiempo de vida del caché en horas
}
```

### Nuevos Métodos

#### `loadFromRemoteUrl(url: string, cacheLifetimeHours?: number): Promise<void>`

Carga traducciones desde una URL remota con caché local.

**Parámetros:**
- `url`: URL del archivo JSON de traducciones
- `cacheLifetimeHours`: Tiempo de vida del caché en horas (por defecto: 24)

**Ejemplo:**
```javascript
const i18n = new I18n();

// Cargar con caché de 6 horas
await i18n.loadFromRemoteUrl('https://api.example.com/translations.json', 6);

// Cargar con caché por defecto (24 horas)
await i18n.loadFromRemoteUrl('https://api.example.com/more-translations.json');
```

#### `clearCache(): void`

Limpia todo el caché almacenado localmente.

**Ejemplo:**
```javascript
i18n.clearCache();
```

#### `getCacheInfo(): object`

Obtiene información detallada sobre el estado del caché.

**Retorna:**
```typescript
{
  [url: string]: {
    timestamp: number;      // Timestamp de cuando se guardó
    lifetimeHours: number;  // Tiempo de vida configurado
    isExpired: boolean;     // Si el caché ha expirado
  }
}
```

**Ejemplo:**
```javascript
const cacheInfo = i18n.getCacheInfo();
console.log(cacheInfo);
// {
//   "https://api.example.com/translations.json": {
//     timestamp: 1640995200000,
//     lifetimeHours: 6,
//     isExpired: false
//   }
// }
```

### Método `init()` Actualizado

El método `init()` ahora es asíncrono y soporta carga remota:

```javascript
// Inicialización con URL remota
await i18n.init({
  lang: 'es',
  remoteUrl: 'https://api.example.com/translations.json',
  cacheLifetimeHours: 12
});
```

## Formato de Datos Remotos

Las traducciones remotas deben seguir el mismo formato que las locales:

```json
{
  "es": {
    "welcome": "Bienvenido",
    "buttons": {
      "save": "Guardar",
      "cancel": "Cancelar"
    }
  },
  "en": {
    "welcome": "Welcome",
    "buttons": {
      "save": "Save",
      "cancel": "Cancel"
    }
  }
}
```

## Ejemplos de Uso

### Ejemplo Básico

```javascript
const i18n = new I18n('es');

// Cargar traducciones desde URL remota
await i18n.loadFromRemoteUrl('https://api.example.com/translations.json', 8);

// Traducir elementos del DOM
i18n.translate();
```

### Ejemplo con Múltiples URLs

```javascript
const i18n = new I18n('es');

// Cargar traducciones base (caché de 24 horas)
await i18n.loadFromRemoteUrl('https://api.example.com/base-translations.json');

// Cargar traducciones específicas del módulo (caché de 6 horas)
await i18n.loadFromRemoteUrl('https://api.example.com/module-translations.json', 6);

// Cargar traducciones temporales (caché de 1 hora)
await i18n.loadFromRemoteUrl('https://api.example.com/temp-translations.json', 1);

// Todas las traducciones se fusionan automáticamente
i18n.translate();
```

### Ejemplo con Gestión de Errores

```javascript
const i18n = new I18n('es');

try {
  await i18n.loadFromRemoteUrl('https://api.example.com/translations.json', 12);
  console.log('Traducciones cargadas correctamente');
} catch (error) {
  console.error('Error cargando traducciones:', error.message);
  // Continuar con traducciones locales si las hay
}

i18n.translate();
```

### Ejemplo de Monitoreo de Caché

```javascript
const i18n = new I18n('es');

// Cargar traducciones
await i18n.loadFromRemoteUrl('https://api.example.com/translations.json', 6);

// Verificar estado del caché
const cacheInfo = i18n.getCacheInfo();
for (const [url, info] of Object.entries(cacheInfo)) {
  console.log(`URL: ${url}`);
  console.log(`Guardado: ${new Date(info.timestamp).toLocaleString()}`);
  console.log(`Expira en: ${info.lifetimeHours} horas`);
  console.log(`Expirado: ${info.isExpired ? 'Sí' : 'No'}`);
}

// Limpiar caché si es necesario
if (Object.values(cacheInfo).some(info => info.isExpired)) {
  i18n.clearCache();
}
```

## Consideraciones Técnicas

### Almacenamiento
- Utiliza `localStorage` del navegador
- Clave de almacenamiento: `i18n_cache_storage`
- Almacena datos en formato JSON

### Rendimiento
- Verificación de caché antes de peticiones HTTP
- Limpieza automática de entradas expiradas
- Fusión eficiente de traducciones

### Compatibilidad
- Requiere soporte de `localStorage`
- Requiere soporte de `fetch` API
- Funciona en todos los navegadores modernos

### Limitaciones
- No controla el espacio disponible en localStorage
- Depende de la conectividad de red para la primera carga
- El caché se limpia si el usuario borra los datos del navegador

## Demo

Puedes ver la funcionalidad en acción en el archivo `demo/cache-example.html` incluido en el proyecto.

## Migración

### Desde Versiones Anteriores

El método `init()` ahora es asíncrono cuando se usa con URLs remotas:

```javascript
// Antes (síncrono)
i18n.init({ lang: 'es' });

// Ahora (asíncrono cuando hay URL remota)
await i18n.init({ 
  lang: 'es',
  remoteUrl: 'https://api.example.com/translations.json'
});

// Sigue siendo síncrono sin URL remota
i18n.init({ lang: 'es' });
```

### Compatibilidad hacia Atrás

Todas las funcionalidades existentes siguen funcionando sin cambios. La nueva funcionalidad es completamente opcional.