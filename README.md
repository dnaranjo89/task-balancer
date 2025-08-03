# Task Balancer 🏠

Una aplicación web simple para gestionar tareas domésticas entre compañeros de piso, con sistema de puntos y historial.

## ✨ Características

- 📱 **Interfaz tablet-friendly** - Optimizada para tablets
- 👥 **Dos usuarios** - Fácil cambio entre personas
- 🎯 **Tareas con puntos** - Sistema de puntuación por tarea
- 📊 **Scoreboard** - Puntuaciones totales e historial
- 💾 **Base de datos persistente** - Con PostgreSQL (Neon)
- 🚀 **Deploy gratuito** - Vercel + Neon (100% gratis)

## 🛠️ Tech Stack

- **Frontend**: React Router v7, TypeScript, Tailwind CSS
- **Backend**: React Router actions (serverless functions)
- **Database**: PostgreSQL (Neon) con Drizzle ORM
- **Deployment**: Vercel (gratis)

## 🏃‍♂️ Quick Start

### 1. Crear base de datos (gratis)

1. Ve a [neon.tech](https://neon.tech) y regístrate
2. Crea un nuevo proyecto PostgreSQL
3. Copia la connection string

### 2. Setup local

```bash
# Clonar el repo
git clone <your-repo>
cd task-balancer

# Instalar dependencias
npm install

# Configurar environment variables
cp .env.example .env
# Edita .env y pega tu DATABASE_URL de Neon

# Ejecutar migración de base de datos
npm run db:migrate

# Iniciar desarrollo
npm run dev
```

### 3. Deploy a Vercel (gratis)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Agregar variable de entorno
vercel env add DATABASE_URL
# Pegar tu connection string de Neon

# Ejecutar migración en producción
vercel env pull .env.local
npm run db:migrate

# Redeploy
vercel --prod
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run build        # Build para producción
npm run start        # Iniciar servidor de producción
npm run db:generate  # Generar nuevas migraciones
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Abrir Drizzle Studio (UI de BD)
```

## 🎮 Cómo usar

### Flujo principal:
1. **Página principal** (`/`) - Seleccionar persona
2. **Selección de tarea** (`/{person}/does`) - Elegir tarea realizada
3. **Scoreboard** (`/scoreboard`) - Ver puntuaciones e historial

### Tareas incluidas:
- 🧽 Limpiar cocina (3 puntos)
- 🚽 Limpiar baño (4 puntos)
- 🧹 Aspirar (2 puntos)
- 🗑️ Sacar basura (1 punto)
- 🍽️ Lavar platos (2 puntos)
- 🛏️ Hacer camas (1 punto)

## 🔧 Personalización

### Agregar nuevas tareas:
Edita `app/data/tasks.ts`:

```typescript
export const TASKS = [
  // ... tareas existentes
  { id: 'nueva', name: 'Nueva tarea', points: 3, icon: '🆕' }
]
```

### Cambiar personas:
Edita `app/data/tasks.ts`:

```typescript
export const PEOPLE = ['David', 'Maria', 'Carlos'] // Agregar más personas
```

## 🗄️ Base de datos

La aplicación usa PostgreSQL con Drizzle ORM. El esquema incluye:

```sql
CREATE TABLE completed_tasks (
  id SERIAL PRIMARY KEY,
  task_id TEXT NOT NULL,
  person_id TEXT NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  points INTEGER NOT NULL
);
```

## 🚀 Deployment

Ver [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) para instrucciones detalladas de deployment en diferentes plataformas.

**Recomendado**: Vercel + Neon (100% gratis, persistente)

## 📄 Licencia

MIT
