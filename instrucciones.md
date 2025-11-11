# INSTRUCCIONES - PsicoConecta

## PARA DESARROLLO

Ejecuta en una sola terminal:

```bash
npm run dev
```

Esto va a iniciar:
- ✅ Backend (puerto 5173)
- ✅ Frontend (puerto 5173 con Vite)

Abre tu navegador en:
```
http://localhost:5173
```

## PARA PRODUCCIÓN

```bash
npm run build
npm start
```

Luego abre:
```
http://localhost:5173
```

## SOLUCIÓN DE PROBLEMAS

### Si ves "Cannot GET /"

1. Verifica que AMBOS servidores estén corriendo (backend + Vite)
2. Abre `http://localhost:5173` (no 3000)
3. Espera 5-10 segundos mientras Vite compila
4. Refresca el navegador (F5)

### Si el puerto 5173 está ocupado

```bash
# Mata el proceso
lsof -ti:5173 | xargs kill -9
```

### Ver logs del servidor

Verifica la terminal - deberías ver:
```
🚀 Server running on http://localhost:5173
```
