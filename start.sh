#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║       🧠 PsicoConecta - Iniciando         ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "📦 Verificando dependencias..."

if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias..."
  npm install
fi

echo ""
echo "🚀 Iniciando servidores..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Backend API:  http://localhost:3000"
echo "✅ Frontend App: http://localhost:5173"
echo ""
echo "⚠️  IMPORTANTE: Abre tu navegador en:"
echo ""
echo "   👉 http://localhost:5173"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev
