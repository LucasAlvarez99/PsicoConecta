# 🚀 Guía Rápida - PsicoConecta

## Cómo Ejecutar el Proyecto

### 1. Iniciar el Proyecto Completo

```bash
npm run dev
```

Esto inicia **DOS servidores simultáneamente**:
- ✅ Backend API en: `http://localhost:3000`
- ✅ Frontend (Vite) en: `http://localhost:5173`

### 2. Acceder a la Aplicación

**⚠️ IMPORTANTE:** Debes abrir tu navegador en:
```
http://localhost:5173
```

❌ **NO** accedas a `http://localhost:3000` (es solo para la API)

---

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia backend + frontend simultáneamente |
| `npm run dev:server` | Solo el servidor backend (puerto 3000) |
| `npm run dev:client` | Solo el frontend Vite (puerto 5173) |
| `npm run build` | Compila el proyecto para producción |
| `npm run start` | Ejecuta la versión de producción |

---

## Arquitectura

```
┌─────────────────────────┐
│   Frontend (Vite)       │
│   http://localhost:5173 │
│   - React + TypeScript  │
│   - Tailwind CSS        │
│   - Wouter (routing)    │
└───────────┬─────────────┘
            │
            │ Proxy: /api/* →
            │
┌───────────▼─────────────┐
│   Backend (Express)     │
│   http://localhost:3000 │
│   - API REST            │
│   - WebSocket           │
│   - Supabase DB         │
└─────────────────────────┘
```

---

## Usuarios de Prueba

### Psicólogo
- Email: `psicologo@psicoconecta.com`
- Rol: psychologist

### Paciente
- Email: `paciente@ejemplo.com`
- Rol: patient

*Nota: Necesitas crear una cuenta con Supabase Auth (usa el botón "Registrarse" en la página)*

---

## Páginas Disponibles

- `/` - Landing page (no autenticado) / Dashboard (autenticado)
- `/profile` - Perfil de usuario
- `/chat/:patientId` - Chat psicólogo-paciente
- `/admin` - Panel administrativo (solo psicólogos)

---

## Troubleshooting

### Pantalla en blanco / "Cannot GET /"
✅ **Solución:** Asegúrate de estar en `http://localhost:5173` y no en el puerto 3000

### Error de conexión a la base de datos
✅ **Solución:** Verifica que el archivo `.env` tenga las credenciales correctas de Supabase

### El servidor no inicia
✅ **Solución:** Ejecuta `npm install` primero para instalar todas las dependencias
