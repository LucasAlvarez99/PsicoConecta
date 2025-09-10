# Plataforma de Gestión Psicológica - PsicoConecta

## Descripción del Proyecto
Plataforma completa de gestión psicológica inspirada en SoyMenta para un solo psicólogo con múltiples pacientes.

## Arquitectura del Sistema
- **Frontend**: React + TypeScript + Vite + TailwindCSS + shadcn/ui
- **Backend**: Node.js + Express + Drizzle ORM
- **Base de datos**: PostgreSQL (Neon)
- **Autenticación**: Replit Auth integrado
- **WebSocket**: Chat en tiempo real con autenticación JWT
- **Roles**: Psicólogo (admin) y Pacientes

## Funcionalidades MVP Implementadas
- ✅ Autenticación segura con Replit Auth
- ✅ Agendamiento de citas con validación
- ✅ Chat en vivo específico por paciente con WebSocket seguro
- ✅ Perfiles editables de pacientes
- ✅ Sistema de testimonios con moderación
- ✅ Panel administrativo completo
- ✅ Diseño responsive profesional

## Configuración de Producción

### Variables de Entorno Requeridas
```bash
# CRÍTICO: Configurar JWT secret para WebSockets en producción
WS_JWT_SECRET=your-secure-random-jwt-secret-for-websockets

# Configuración de base de datos (automática en Replit)
DATABASE_URL=postgresql://...
PGDATABASE=...
PGHOST=...
PGPASSWORD=...
PGPORT=...
PGUSER=...
```

### Seguridad JWT
- **Desarrollo**: Usa fallback con advertencia de seguridad
- **Producción**: REQUIERE configuración de `WS_JWT_SECRET` (falla si no está configurada)
- **WebSocket tokens**: Expiración 15 minutos, validación estricta

## Características de Próxima Fase
- [ ] Sistema de notificaciones por email
- [ ] Reportes automáticos de progreso
- [ ] Integración de pagos (Stripe)
- [ ] Videollamadas integradas
- [ ] Backup automático de datos

## Arquitectura de Seguridad
- Validaciones anti-IDOR en todos los endpoints
- Pacientes solo pueden interactuar con su psicólogo asignado
- Psicólogos pueden gestionar solo sus pacientes
- JWT tokens para autenticación WebSocket
- Validación de roles estricta

## Comandos de Desarrollo
```bash
npm run dev          # Iniciar aplicación completa
npm run db:push      # Sincronizar schema de base de datos
npm run db:push --force  # Sincronizar forzado si hay conflictos
```

## Estado Actual
- MVP completamente funcional y seguro
- Chat específico por paciente implementado con validaciones IDOR
- Configuración de producción segura implementada
- Listo para características avanzadas de próxima fase