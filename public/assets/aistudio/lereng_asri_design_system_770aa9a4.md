---
name: "Lereng Asri"
description: "A warm, nature-inspired design system for Desa Wisata Lereng Asri, combining lush highlands tones with clear mobile-first booking actions."
---

## Overview

Desa Wisata Lereng Asri is an eco-tourism and mountain village destination offering outbound activities, family camping, tea plantation walks, cultural experiences, and local culinary delights. The design system embodies natural tranquility, authenticity, and warm Indonesian hospitality. The visual style is modern, approachable, and tactile, relying on earthy green tones, warm sunlight amber accents, and clean readability on mobile screens where tourists discover destinations and book directly via WhatsApp.

## Colors

The color palette draws from the lush terraced slopes and mist-kissed forests of mountain slopes, accented by golden sunrise warmth and crisp white clouds.

- **Primary:** Deep emerald forest green (`#1E4D38`) representing highland pine forests and tea plantations.
- **Secondary:** Fresh fern green (`#2E7D52`) for badges, highlights, and secondary elements.
- **Accent:** Warm solar amber (`#D97706`) for high-priority CTA accents and rating stars.
- **WhatsApp Brand:** Vibrant emerald communication green (`#25D366`) and deep forest contrast (`#128C7E`) specifically for booking actions.
- **Surfaces:** Clean, crisp organic tones (`#F8FAF8` for light surface, `#FFFFFF` for cards).

```yaml
colors:
  accent: "#D97706"
  accent-hover: "#B45309"
  whatsapp: "#25D366"
  whatsapp-dark: "#128C7E"
  light:
    primary: "#1E4D38"
    on-primary: "#FFFFFF"
    primary-container: "#E8F5E9"
    on-primary-container: "#0E3823"
    surface: "#F8FAF8"
    on-surface: "#19221C"
    surface-variant: "#EEF3EF"
    on-surface-variant: "#435248"
    surface-card: "#FFFFFF"
    outline: "#D1DDD5"
    outline-variant: "#E4EDE6"
  dark:
    primary: "#85D8A5"
    on-primary: "#063821"
    primary-container: "#154F35"
    on-primary-container: "#A5ECC0"
    surface: "#111814"
    on-surface: "#E1E8E3"
    surface-variant: "#1C2720"
    on-surface-variant: "#A2B3A8"
    surface-card: "#18231D"
    outline: "#37473D"
    outline-variant: "#28372D"
```

## Typography

The typography pairs **Poppins** for friendly, modern headlines with **Lato** for high-legibility humanist body copy.

```yaml
typography:
  display-lg:
    fontFamily: "Poppins"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 48px
    letterSpacing: -0.5px
  display-lg-mobile:
    fontFamily: "Poppins"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 38px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "Poppins"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: "Poppins"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
  headline-md:
    fontFamily: "Poppins"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
  headline-sm:
    fontFamily: "Poppins"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
  title-lg:
    fontFamily: "Poppins"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 26px
  title-md:
    fontFamily: "Poppins"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body-lg:
    fontFamily: "Lato"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md:
    fontFamily: "Lato"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
  body-sm:
    fontFamily: "Lato"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
  label-lg:
    fontFamily: "Poppins"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  label-md:
    fontFamily: "Poppins"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 18px
  label-sm:
    fontFamily: "Lato"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 16px
```

## Layout & Spacing

A mobile-first layout prioritizing rapid vertical scanning, touch targets >= 48px for thumb navigation, clear visual cards, and persistent floating WhatsApp CTA for high booking conversion.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 40px
  page-margin: 16px
```

## Elevation & Depth

Subtle, organic elevations with soft warm-green tinted shadows. Cards use a delicate 1px border (`outline-variant`) paired with 2px-6px blurred shadows to feel layered yet clean.

## Shapes

Organic, friendly rounded shapes reflect natural curves of highland valleys.

```yaml
rounded:
  sm: 6px
  DEFAULT: 12px
  md: 16px
  lg: 20px
  xl: 28px
  full: 9999px
```

## Motion & Micro-interaction

Quick and tactile transitions on interactive buttons, cards, and floating triggers.

```yaml
motion:
  state-change:
    duration: 150ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 250ms
    delay: 0ms
    timingFunction: cubic-bezier(0.16, 1, 0.3, 1)
```

## Voice & Content Strategy

- **Tone:** Welcoming, authentic, hospitable, informative, and inviting (*"Mari Singgah di Lereng Asri"*).
- **Language:** Bahasa Indonesia tailored for local tourists, families, and travel groups.
- **Currency Format:** Indonesian Rupiah formatted as `Rp 150.000 / orang` with tabular figures.
- **WhatsApp CTA:** Clear verb-driven triggers indicating direct contact with village coordinators (*"Pesan via WhatsApp"*, *"Konsultasi Paket Gratis"*).

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Badge** → `@components/badge.html`: `badge-numeric`, `badge-dot`
- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
