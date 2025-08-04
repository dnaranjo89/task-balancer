# 🚀 Deploy Your Task Balancer App for FREE

## ✅ Setup Complete!

Your app is now ready for deployment with:

- ✅ PostgreSQL database for persistence (Neon)
- ✅ Serverless functions (Vercel)
- ✅ GitHub Actions auto-deploy

## 🎯 Deploy to Vercel + Neon (Recommended - FREE)

### Step 1: Create Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new PostgreSQL project
3. Copy the connection string

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variable
vercel env add DATABASE_URL
# Paste your Neon connection string

# Run database migration
npm run db:migrate

# Redeploy
vercel --prod
```

Your app will be live at a Vercel URL with persistent database!

## 🤖 GitHub Actions Auto-Deploy (Optional)

For automatic deployments on every push to main:

1. See `GITHUB_ACTIONS_SETUP.md` for detailed instructions
2. Configure GitHub Secrets with your tokens
3. Every push to `main` = automatic deployment

## 🎯 Alternative: Deploy to Render

1. **Connect GitHub**: Go to render.com and connect your GitHub repo
2. **Web Service**: Create a new Web Service
3. **Configure**:
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Environment Variables: Add `DATABASE_URL`

Note: Render free tier sleeps after 15 minutes of inactivity.

## 🔧 Local Testing

Test locally before deploying:

```bash
# Setup environment
cp .env.example .env
# Edit .env with your Neon DATABASE_URL

# Run migration
npm run db:migrate

# Start development
npm run dev
```

## 📊 What This Setup Provides

1. **Database**: PostgreSQL with persistent data
2. **Performance**: Global CDN and edge functions
3. **Auto-deploy**: GitHub Actions integration
4. **Free hosting**: 100% free with generous limits

## 🎉 Next Steps

1. Create your Neon database (free)
2. Deploy to Vercel with the commands above
3. Optional: Setup GitHub Actions for auto-deploy
4. Your app will have a permanent URL with persistent data!

**Estimated deployment time: 10 minutes** ⏱️
