# I18NJS - Sistema de Internacionalización para JavaScript/TypeScript

Una clase TypeScript ligera y eficiente para manejar traducciones i18n en aplicaciones web usando data-attributes.

## Características

- **Traducción automática**: Traduce elementos del DOM usando `data-i18n-key`
- **Soporte multinivel**: Claves anidadas con notación de puntos (ej: `labels.completed`)
- **Gestión de idiomas**: Detección automática del idioma desde `document.documentElement.lang`
- **Flexibilidad**: Traduce elementos específicos o toda la página
- **TypeScript**: Completamente tipado para mejor experiencia de desarrollo

## Instalación

```bash
# Clona el repositorio
git clone https://github.com/Trystan4861/I18NJS.git

# Cambia a la carpeta clonada
cd I18NJS

# Instala dependencias (si las hay)
npm install
```

## 🚀 Demo Interactiva

¡Prueba I18NJS en acción! Incluimos una demo completa e interactiva:

```bash
# Navega a la carpeta demo
cd demo

# Abre index.html en tu navegador
# O usa un servidor local:
python -m http.server 8000
# Luego visita: http://localhost:8000
```

### Características de la Demo:
- **3 idiomas**: Español, Inglés y Francés
- **Cambio dinámico**: Selector de idioma en tiempo real
- **Casos de uso completos**: Formularios, estados, contenido dinámico
- **Controles interactivos**: Botones para probar todas las funcionalidades
- **Logging en tiempo real**: Área de salida con información detallada
- **Diseño responsive**: Funciona en desktop, tablet y móvil

Ver [demo/README.md](demo/README.md) para más detalles.

## Uso Básico

### 1. Inicialización

```typescript
import { I18n } from './src';
// O importar tipos específicos si es necesario
import type { I18nOptions, TranslationDataset } from './src';

const i18n = new I18n();

// Inicializar con idioma por defecto (opcional)
i18n.init({ lang: 'es' });
```

### 2. Cargar Traducciones

```typescript
const translations = {
  es: {
    labels: {
      completed: 'Completado',
      pending: 'Pendiente',
      welcome: 'Bienvenido'
    },
    messages: {
      success: 'Operación exitosa'
    }
  },
  en: {
    labels: {
      completed: 'Completed',
      pending: 'Pending',
      welcome: 'Welcome'
    },
    messages: {
      success: 'Successful operation'
    }
  }
};

i18n.loadTranslations(translations);
```

### 3. Marcar Elementos HTML

```html
<!-- Elementos a traducir -->
<h1 data-i18n-key="labels.welcome">Bienvenido</h1>
<span data-i18n-key="labels.completed">Completado</span>
<input type="text" data-i18n-key="labels.pending" placeholder="Pendiente">

<!-- El atributo data-i18n-lang se agregará automáticamente -->
```

### 4. Traducir

```typescript
// Traducir todos los elementos con data-i18n-key
i18n.translate();

// Traducir a un idioma específico
i18n.translate({ lang: 'en' });

// Traducir un elemento específico
const element = document.getElementById('mi-elemento');
i18n.translate({ element, lang: 'en' });
```

## API de la Clase

### Métodos Principales

#### `init(options?: I18nOptions): void`

Inicializa la clase con opciones opcionales.

```typescript
i18n.init({ lang: 'es' });
```

#### `loadTranslations(translationData: TranslationDataset): void`

Carga las traducciones desde un objeto de datos.

#### `translate(options?: TranslateOptions): void`

Traduce elementos del DOM.

- `options.element`: Elemento específico a traducir (opcional)
- `options.lang`: Idioma de destino (opcional, usa el por defecto si se omite)

#### `getTranslation(options: GetTranslationOptions): string`

Obtiene una traducción específica por clave.

```typescript
const translation = i18n.getTranslation({ 
  key: 'labels.completed', 
  lang: 'en' 
});
```

#### `getLanguages(): string[]`

Obtiene la lista de idiomas disponibles.

```typescript
const languages = i18n.getLanguages();
console.log(languages); // ['es', 'en', 'fr']

// Verificar si un idioma está disponible
const hasEnglish = i18n.getLanguages().includes('en');
```

### Métodos Auxiliares

#### `updateMissingLangAttributes(): void`

Actualiza elementos que tienen `data-i18n-key` pero no `data-i18n-lang`.

#### `getCurrentLang(): string`

Obtiene el idioma actual de la aplicación.

#### `setDefaultLang(lang: string): void`

Establece el idioma por defecto de la clase.

## Data Attributes

### `data-i18n-key`

**Requerido**. Especifica la clave de traducción usando notación de puntos.

```html
<span data-i18n-key="labels.completed">Texto por defecto</span>
<span data-i18n-key="messages.success">Mensaje por defecto</span>
```

### `data-i18n-lang`

**Opcional**. Se agrega automáticamente para marcar el idioma actual del elemento. Si no existe, se toma de `document.documentElement.lang` o del idioma por defecto de la clase.

## Estructura de Traducciones

Las traducciones se organizan en un objeto anidado:

```typescript
{
  [idioma: string]: {
    [categoria: string]: {
      [subcategoria: string]: string | objeto_anidado
    }
  }
}
```

### Ejemplo

```typescript
{
  es: {
    navigation: {
      home: 'Inicio',
      about: 'Acerca de',
      contact: 'Contacto'
    },
    forms: {
      validation: {
        required: 'Este campo es obligatorio',
        email: 'Ingrese un email válido'
      }
    }
  }
}
```

## Casos de Uso

### Cambio Dinámico de Idioma

```typescript
// Cambiar idioma y traducir toda la página
document.documentElement.lang = 'en';
i18n.translate({ lang: 'en' });
```

### Traducción de Formularios

```html
<form>
  <input type="email" data-i18n-key="forms.email.placeholder" placeholder="Email">
  <button data-i18n-key="forms.submit">Enviar</button>
</form>
```

### Contenido Dinámico

```typescript
// Crear elemento dinámicamente
const newElement = document.createElement('span');
newElement.setAttribute('data-i18n-key', 'messages.loading');
newElement.textContent = 'Cargando...';

// Traducir el nuevo elemento
i18n.translate({ element: newElement });
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Autor

**trystan4861**

---

*Desarrollado con ❤️ para facilitar la internacionalización en aplicaciones web*