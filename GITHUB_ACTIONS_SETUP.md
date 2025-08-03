# 🤖 Setup GitHub Actions Auto-Deploy

## 🔐 **Configurar GitHub Secrets**

Para que GitHub Actions pueda deployar automáticamente a Vercel, necesitas configurar estos secrets en tu repositorio:

### **1. Obtener Vercel Token**

```bash
# Generar token de Vercel
vercel login
# Luego ve a: https://vercel.com/account/tokens
# Crear nuevo token y copiarlo
```

### **2. Configurar Secrets en GitHub**

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions → New repository secret

Agrega estos 4 secrets:

| Secret Name         | Value                               | Dónde obtenerlo                                                |
| ------------------- | ----------------------------------- | -------------------------------------------------------------- |
| `VERCEL_TOKEN`      | `vercel_xxxxxxxxxxxx`               | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID`     | `team_17eVKUox00mTO9ChotQcqOOY`     | Ya lo tienes ⬇️                                                |
| `VERCEL_PROJECT_ID` | `prj_LRPmHAqVDDIBiiVMwxRwFekLStYf`  | Ya lo tienes ⬇️                                                |
| `DATABASE_URL`      | `postgresql://neondb_owner:npg_...` | Tu conexión de Neon                                            |

### **3. Valores específicos para tu proyecto:**

```bash
# ✅ VERCEL_ORG_ID (ya extraído)
team_17eVKUox00mTO9ChotQcqOOY

# ✅ VERCEL_PROJECT_ID (ya extraído)
prj_LRPmHAqVDDIBiiVMwxRwFekLStYf

# ✅ DATABASE_URL (usa el valor de tu archivo .env local)
# postgresql://neondb_owner:npg_xxxxx@ep-xxxxx.eu-west-2.aws.neon.tech/neondb?sslmode=require
```

### **4. Solo necesitas obtener:**

1. **VERCEL_TOKEN**: Ve a https://vercel.com/account/tokens y crea uno nuevo

## 🚀 **¿Qué pasará después?**

Una vez configurados los secrets:

- ✅ **Push a `main`** → Deploy automático a producción
- ✅ **Pull Request** → Deploy de preview para testing
- ✅ **Database migration** → Se ejecuta automáticamente
- ✅ **Build + Deploy** → Todo automatizado

## 📋 **Pasos rápidos:**

1. Ve a https://vercel.com/account/tokens
2. Crea un nuevo token
3. Ve a tu repo GitHub → Settings → Secrets and variables → Actions
4. Agrega los 4 secrets mencionados arriba
5. ¡Haz un push y mira la magia! ✨

## 🔄 **Testing:**

```bash
# Hacer un cambio pequeño y push
git add .
git commit -m "Test auto-deploy"
git push origin main

# Ve a GitHub Actions tab para ver el deploy en acción
```
