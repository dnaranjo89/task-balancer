# Deploy React Router v7 App for FREE with Persistent Database

## 🎯 **Recommended Option: Vercel + Neon PostgreSQL**

This setup gives you **persistent data** and **fast performance** completely free!

### **Step 1: Create a Neon Database (Free)**

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project (PostgreSQL database)
3. Copy the connection string from the dashboard
   - It looks like: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/database?sslmode=require`

### **Step 2: Deploy to Vercel**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add environment variable**:
   ```bash
   # During deployment, or later in Vercel dashboard
   vercel env add DATABASE_URL
   # Paste your Neon connection string
   ```

4. **Run database migration**:
   ```bash
   # This creates the tables in your Neon database
   vercel env pull .env.local
   npm run db:migrate
   ```

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

### **✅ What You Get:**

- ✅ **Persistent database** - data survives restarts
- ✅ **Fast performance** - Vercel edge functions
- ✅ **100% free** - Neon (3GB) + Vercel (hobby plan)
- ✅ **Global CDN** - super fast worldwide
- ✅ **Auto-deploy** - push to git = deploy

---

## Alternative Options

### Option 1: Render (Memory-only but simple)

Render offers a completely free tier with in-memory storage.

1. **Deploy**:
   - Push to GitHub
   - Connect to Render
   - Automatic deploys on push

**Limitations:**
- ⚠️ Data resets every ~15 minutes when service sleeps
- ⚠️ 1-minute wake time from sleep

### Option 2: Netlify (Serverless)

1. **Build and deploy**:
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod --dir=build
   ```

**Limitations:**
- ⚠️ Data resets on every request (serverless)
- ⚠️ Need external database for persistence

## Comparison of FREE Options

| Platform | Database | Persistence | Performance | Wake Time |
|----------|----------|-------------|-------------|-----------|
| **Vercel + Neon** | PostgreSQL | ✅ **Permanent** | ⚡ Fastest | ~200ms |
| Render | Memory | ❌ Resets every 15min | Slower | ~60s |
| Netlify | Memory/External | ❌/✅ | Fast | ~200ms |
| GitHub Pages | None | ❌ | Fastest | Instant |

---

## 🚀 **Quick Start (Vercel + Neon)**

The fastest way to get a persistent, fast app:

```bash
# 1. Create Neon database at neon.tech (free)
# 2. Copy connection string

# 3. Deploy to Vercel
npm install -g vercel
vercel

# 4. Add database URL
vercel env add DATABASE_URL
# Paste: postgresql://user:pass@host:5432/db?sslmode=require

# 5. Setup database
vercel env pull .env.local
npm run db:migrate

# 6. Redeploy
vercel --prod
```

**Done!** 🎉 Your app now has persistent data and is blazing fast.

---

## Environment Variables

For any deployment, you'll need:

```bash
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

## Next Steps

1. ✅ **Get your Neon database URL**
2. ✅ **Deploy to Vercel** 
3. ✅ **Add DATABASE_URL environment variable**
4. ✅ **Run migration**
5. ✅ **Enjoy persistent, fast app!**

Your app will have:
- ✅ **Persistent data** (survives restarts)
- ✅ **Fast global performance** 
- ✅ **100% free hosting**
- ✅ **Auto-deploy** on git push
- ✅ **HTTPS** automatically
