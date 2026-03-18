# Cambios para despliegue en Render

## server.js

### 1. Puerto dinámico
Render asigna el puerto via variable de entorno. Sin esto, el servidor nunca arrancaría.

```js
// Antes
const PORT = 3001

// Después
const PORT = process.env.PORT || 3001
```

### 2. Servir el frontend en producción
Sin esto, Express solo serviría la API y la web no se vería.

```js
// Añadido antes del app.listen
app.use(express.static(path.join(__dirname, 'dist')))
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
```

---

## package.json

### 3. Comando de build
En Linux (Render), el binario de Vite no tiene permisos de ejecución. Llamarlo directamente con Node evita ese problema.

```json
// Antes
"build": "vite build"

// Después
"build": "node node_modules/vite/bin/vite.js build"
```

---

## Configuración en Render

| Campo | Valor |
|---|---|
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free |