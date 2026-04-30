# Deployment

## Platform
Vercel (Automatic deployment via GitHub)

## Build Configuration
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## Environment
- Node.js 18+
- npm 9+

## Local Test
```bash
npm install
npm run build
npm run preview
```

## Deploy Flow
1. Push to `main` branch
2. Vercel automatically builds
3. Deploys to: https://card-roguelike-six.vercel.app/

## GitHub Integration
- Repository: https://github.com/gunqiuwang/card-roguelike
- Branch: main
- Auto-deploy: Enabled

## Preview Deployments
- Every PR gets a preview URL
- Main branch: Production deployment
