# Design System — Linternita

## Colors
- `--gold: #C9A84C` — acento principal, botones, precios
- `--gold-light: #E8C97A` — gradientes, highlights
- `--gold-dark: #8B6914` — texto sobre fondos claros
- `--rose: #F2C4CE` — badges, acentos suaves
- `--cream: #FAF7F2` — fondo principal
- `--brown: #2C1810` — texto principal
- Fondo oscuro del footer/CTA: `#2C1810`

## Typography
- Font: Geist Sans (Next.js default)
- Headings: font-bold, tracking normal
- Labels de categoría: text-[10px] uppercase tracking-widest
- Precios: font-bold text-[#C9A84C]

## Elevation
- Cards: `shadow-sm border border-[#E8C97A]/20`
- Hover: `shadow` con translateY(-2px)
- Sticky nav: `bg-[#FAF7F2]/95 backdrop-blur-sm`

## Components
- Botones principales: `.btn-gold` — gradiente dorado, rounded-full
- Botones secundarios: border-2 border-[#C9A84C], rounded-full
- Cards de producto: rounded-2xl, imagen cuadrada, info abajo
- Badges: rounded-full, texto xs

## Layout
- Max width: max-w-6xl mx-auto
- Padding: px-4
- Grid productos: grid-cols-2 md:grid-cols-4
- Navbar height: h-16

## Motion
- Easing custom: cubic-bezier(0.23, 1, 0.32, 1)
- Botones: scale(0.97) en :active
- Cards: translateY(-2px) en hover
- Stagger productos: 50ms entre items
- Hero: fade-up escalonado
