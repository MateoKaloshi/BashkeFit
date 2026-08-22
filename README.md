# BashkeFit

A React + Vite single-page fitness website for BashkeFit.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Main files

- `src/App.jsx` — page sections, navigation, BMI calculator, testimonials
- `src/styles.css` — full responsive styling and animations
- `public/logo.svg` — transparent BashkeFit placeholder logo

## Customize

The main theme color is defined in `src/styles.css`:

```css
--lime: #82e675;
```

Replace `public/logo.svg` with your real logo if you want. Keep the same filename to avoid changing the React code.

## Images

This recreation does **not** redistribute the original template's preview assets. The project uses external Unsplash image URLs so the layout can be previewed immediately. Replace them with your own local images before production if desired.
