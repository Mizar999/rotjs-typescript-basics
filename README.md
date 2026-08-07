# rot.js TypeScript Basics

A basic roguelike example built with **rot.js**, **TypeScript**, and **Vite**.

**Playable Demo:** [https://mizar999.github.io/rotjs-typescript-basics/](https://mizar999.github.io/rotjs-typescript-basics/)

---

## Resources

- [rot.js - Roguelike Toolkit](https://github.com/ondras/rot.js)
- [RogueBasin - rot.js Tutorial](http://www.roguebasin.roguelikedevelopment.org/index.php?title=Rot.js_tutorial)
- [Frostlike - 7 Day Roguelike Challenge 2017 entry](https://github.com/maqqr/7drl2017)

---

## Development

To clone and develop this project locally:

```powershell
git clone https://github.com/Mizar999/rotjs-typescript-basics.git
cd rotjs-typescript-basics
npm install
npm run dev
```

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite dev server with instant Hot Module Replacement (HMR). |
| `npm run build` | Runs TypeScript type-checking and builds the production bundle into `dist/`. |
| `npm run preview` | Previews the production build locally. |

---

## New Project Setup from Scratch

If you want to set up a new rot.js project with TypeScript and Vite from scratch:

1. **Initialize NPM project & install dependencies:**

   ```powershell
   npm init -y
   npm install --save-dev typescript vite rot-js
   ```

2. **Create Vite configuration (`vite.config.ts`):**

   ```typescript
   import { defineConfig } from 'vite';

   export default defineConfig({
     base: './',
     build: {
       outDir: 'dist',
     },
   });
   ```

3. **Create TypeScript configuration (`tsconfig.json`):**

   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "useDefineForClassFields": true,
       "module": "ESNext",
       "lib": ["ES2020", "DOM", "DOM.Iterable"],
       "skipLibCheck": true,
       "moduleResolution": "node",
       "allowSyntheticDefaultImports": true,
       "strict": false,
       "noEmit": true
     },
     "include": ["src"]
   }
   ```

4. **Create HTML Entry Point (`index.html`):**

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>rot.js TypeScript Basics</title>
     </head>
     <body>
       <script type="module" src="/src/app.ts"></script>
     </body>
   </html>
   ```

5. **Configure `package.json` scripts:**

   ```json
   "scripts": {
     "dev": "vite",
     "build": "tsc && vite build",
     "preview": "vite preview"
   }
   ```

---

## Automatic Deployment (GitHub Pages)

This repository uses an automated GitHub Actions workflow defined in `.github/workflows/deploy.yml`.

Every push to the `main` or `master` branch automatically triggers a build and deploys the generated site directly to GitHub Pages.
