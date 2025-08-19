# Scripts de I18NJS

Guía rápida de todos los scripts disponibles en el proyecto.

## 🚀 Scripts Principales

### Desarrollo
```bash
# Iniciar servidor de desarrollo (demo)
npm start
npm run dev:demo

# Desarrollo con TypeScript y nodemon
npm run dev

# Watch mode para desarrollo
npm run dev:watch
```

### Build y Distribución
```bash
# Build completo (recomendado)
npm run build

# Build rápido (solo compilación)
npm run build:fast

# Build con watch mode
npm run build:watch

# Solo compilar TypeScript
npm run compile

# Limpiar directorio dist
npm run clean
```

### Testing
```bash
# Tests de la demo
npm run test:demo

# Tests unitarios (placeholder)
npm test
```

### Servidores
```bash
# Servidor de desarrollo personalizado (puerto 8080)
npm run dev:demo

# Servidor HTTP simple para demo (puerto 8080)
npm run serve:demo

# Servidor para archivos de distribución (puerto 3000)
npm run serve

# Servidor genérico (puerto 8000)
npm run serve:dev
```

### Calidad de Código
```bash
# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format
npm run format:check
```

### Versionado
```bash
# Incrementar versión patch y build
npm run version:patch

# Incrementar versión minor y build
npm run version:minor

# Incrementar versión major y build
npm run version:major
```

## 📁 Scripts Personalizados

### `scripts/build.js`
- Build completo con estadísticas
- Crea archivo de versión
- Copia archivos de demo
- Muestra información detallada

### `scripts/dev-server.js`
- Servidor HTTP personalizado
- CORS habilitado para desarrollo
- Auto-apertura del navegador
- Logging detallado

### `scripts/test-demo.js`
- Tests automáticos de la demo
- Verificación de archivos
- Validación de estructura
- Reporte detallado

## 🔧 Configuración

### TypeScript (`tsconfig.json`)
- Target: ES2020
- Strict mode habilitado
- Source maps y declaraciones
- Output: `dist/`

### ESLint (`.eslintrc.json`)
- Configuración TypeScript
- Integración con Prettier
- Reglas personalizadas

### Prettier (`.prettierrc`)
- Single quotes
- Semicolons
- 2 espacios de indentación
- Line width: 80

### Nodemon (`nodemon.json`)
- Watch: `src/`
- Extensions: `ts,js,json`
- Delay: 1000ms

## 🌐 URLs de Desarrollo

- **Demo**: http://localhost:8080
- **Distribución**: http://localhost:3000
- **Genérico**: http://localhost:8000

## 📊 Comandos Útiles

```bash
# Ver dependencias instaladas
npm list --depth=0

# Verificar versión de Node/npm
node --version && npm --version

# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json && npm install

# Ver información del paquete
npm info i18njs

# Verificar vulnerabilidades
npm audit
```

## 🐛 Troubleshooting

### Error de módulos
```bash
npm install
npm run build
```

### Error de permisos
```bash
# Windows
npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"

# O usar PowerShell como administrador
```

### Puerto ocupado
```bash
# Cambiar puerto en scripts/dev-server.js
const PORT = process.env.PORT || 8081;
```

---

*Documentación de scripts para I18NJS - trystan4861*