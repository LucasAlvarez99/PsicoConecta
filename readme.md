# 🧠 PsicoConecta

Plataforma de terapia psicológica online con chat en tiempo real y gestión de citas.

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Iniciar el Proyecto

```bash
npm run dev
```

Esto iniciará:
- Backend API
- Frontend Vite (ambos en puerto 5173)

### 3. Abrir en Navegador

```
http://localhost:5173
```

Todo funciona en un solo puerto.

---

## 📦 Tecnologías

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Express + Node.js
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Chat:** WebSockets

---

## 🔑 Funcionalidades

- ✅ Autenticación de usuarios (pacientes y psicólogos)
- ✅ Gestión de citas
- ✅ Chat en tiempo real entre psicólogo y paciente
- ✅ Perfiles de usuario
- ✅ Panel administrativo para psicólogos
- ✅ Sistema de testimonios

---

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia backend + frontend |
| `npm run dev:server` | Solo backend (puerto 3000) |
| `npm run dev:client` | Solo frontend (puerto 5173) |
| `npm run build` | Compila para producción |
| `npm run start` | Ejecuta versión de producción |

---

## 🗄️ Base de Datos

La base de datos Supabase ya está configurada con:

- Tabla `users` - Usuarios (pacientes y psicólogos)
- Tabla `appointments` - Citas programadas
- Tabla `chat_messages` - Mensajes del chat
- Tabla `testimonials` - Testimonios de pacientes

---

## 🔐 Variables de Entorno

El archivo `.env` ya contiene las credenciales de Supabase configuradas:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
WS_JWT_SECRET=...
```

---

## 🐛 Troubleshooting

### Pantalla en blanco

- **Verifica que estés en:** `http://localhost:5173`
- **NO uses:** `http://localhost:3000` (es solo para la API)
- **Espera:** 5-10 segundos mientras Vite compila

### Error "Cannot GET /"

- Estás en el puerto incorrecto
- Usa `http://localhost:5173` en lugar de `http://localhost:3000`

### Los servidores no inician

```bash
# Detén todos los procesos
Ctrl+C

# Limpia node_modules si es necesario
rm -rf node_modules
npm install

# Reinicia
npm run dev
```

### Puerto 3000 o 5173 ya está en uso

```bash
# Linux/Mac - Mata el proceso en el puerto
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📄 Licencia

MIT
