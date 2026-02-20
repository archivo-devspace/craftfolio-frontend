# Craftfolio Frontend

Craftfolio Frontend is a Next.js (App Router) portfolio builder where users can:

- Build a portfolio section-by-section in a drag-and-drop editor
- Customize theme colors, typography, and radius
- Save/publish portfolios to a backend API
- Preview public portfolio pages at dynamic routes
- Use EN/MM UI localization in builder/auth screens

This README documents the current implementation in detail.

## Tech Stack

- Next.js `16.1.2` (App Router)
- React `19.2.3`
- TypeScript `5`
- Tailwind CSS `4` (via `@tailwindcss/postcss`)
- Zustand `5` for state management + persistence
- dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`) for drag-and-drop
- `lucide-react` icons

## Project Structure

```text
src/
  app/
    layout.tsx                 # Root HTML shell, global font links, metadata
    page.tsx                   # Main builder page (Sidebar + Canvas)
    [name]/[slug]/page.tsx     # Public live portfolio page
    globals.css                # Tailwind v4 theme, utilities, custom MM font faces

  components/
    auth/
      AuthModal.tsx            # Sign in/sign up modal

    builder/
      Sidebar.tsx              # Left panel tabs + section manager + settings/actions
      SectionEditor.tsx        # Dispatches to section-specific editors
      ThemeEditor.tsx          # Theme controls (preset/custom colors/font/radius)
      canvas/
        Canvas.tsx             # Main editable canvas + save/publish/preview logic
        CanvasToolbar.tsx      # Save/publish/live preview + locale switch UI
        SortableSection.tsx    # Wraps section rendering with sortable behavior
        ViewModeSelector.tsx   # Device mode buttons (component exists)
      editors/
        HeroEditor.tsx
        AboutEditor.tsx
        ProjectsEditor.tsx
        SkillsEditor.tsx
        ExperienceEditor.tsx
        ContactEditor.tsx
      sidebar-components/
        SidebarTabs.tsx
        SectionList.tsx
        SortableSidebarItem.tsx
        AddSectionPanel.tsx
        SettingsPanel.tsx

    sections/
      SectionRenderer.tsx      # Switch by section type
      HeroSection.tsx
      AboutSection.tsx
      ProjectsSection.tsx
      SkillsSection.tsx
      ExperienceSection.tsx
      ContactSection.tsx

    ui/
      LoadingScreen.tsx
      FormInputs.tsx
      Button.tsx
      EmptyStates.tsx

  hooks/
    usePortfolioData.ts        # Fetch user/public portfolio flows
    useTheme.ts                # Theme style mapping + helpers

  lib/
    api.ts                     # API client and endpoint wrappers
    i18n.ts                    # Translation utility

  store/
    portfolioStore.ts          # Portfolio editor state
    authStore.ts               # Auth/token state
    localeStore.ts             # EN/MM locale state

  types/
    portfolio.ts               # Portfolio/section/theme TypeScript models

  locales/
    en.json
    mm.json

public/
  fonts/
    Z06-Walone-{Thin,Regular,Bold}.ttf
```

## Routes and Runtime Flow

### 1) Builder route: `/`

Entry file: `src/app/page.tsx`

Flow:

1. `checkAuth()` runs on mount (`authStore`)
2. `usePortfolioData()` fetches the latest user portfolio (`GET /portfolios`)
3. Page renders `Sidebar` + `Canvas`
4. Theme CSS variables are injected from current store state

### 2) Public route: `/:name/:slug`

Entry file: `src/app/[name]/[slug]/page.tsx`

Flow:

1. Route params (`name`, `slug`) are read with `useParams`
2. `usePublicPortfolio({ slug, name })` fetches `GET /portfolios/public?slug=...&name=...`
3. Sections are sorted by `order`, filtered by `visible`, rendered with `SectionRenderer`

## State Management (Zustand)

### `portfolioStore` (`portfolio-builder-storage`)

Main editor state:

- `portfolio` (name, slug, published, theme, sections)
- `selectedSectionId`
- `previewMode`

Key actions:

- `addSection`, `removeSection`, `reorderSections`
- `updateSection` (includes serializable-value sanitization)
- `toggleSectionVisibility`, `selectSection`
- `updateTheme`
- `resetPortfolio`, `loadPortfolio`
- `getPortfolioJson` (export payload)

Default portfolio includes sections:

- Hero
- About
- Projects
- Skills
- Contact

(`Experience` is available to add manually.)

### `authStore` (`auth-storage`)

- Handles `login`, `register`, `logout`, `checkAuth`
- Persists `user` + `isAuthenticated`
- Stores/removes access token through `api.setToken(...)`
- On logout/check-auth failure, resets portfolio to default

### `localeStore` (`locale-storage`)

- Locale: `en | mm`
- `setLocale`, `toggleLocale`
- `t(key)` translation lookup with English fallback

## API Integration

Base URL:

- `NEXT_PUBLIC_API_URL` (default: `http://localhost:3002`)

Implemented endpoints in `src/lib/api.ts`:

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Portfolios:

- `POST /portfolios`
- `GET /portfolios`
- `GET /portfolios/:id`
- `PATCH /portfolios/:id`
- `DELETE /portfolios/:id`
- `PATCH /portfolios/:id/publish`
- `GET /portfolios/public?slug=...&name=...`
- `GET /portfolios/check-slug?slug=...`

Behavior notes:

- Supports plain JSON responses and envelope responses (`{ statusCode, message, data, timestamp }`)
- Error extraction supports both string and string-array message payloads
- `Authorization: Bearer <token>` header is auto-attached when token exists

## Builder UX Details

### Sidebar

- Tabs: Sections / Theme / Settings
- Section list supports:
  - Drag reorder
  - Visibility toggle
  - Remove section
  - Select section for editing
- Add-section panel prevents duplicate section types
- Settings panel supports:
  - Name/slug editing
  - Save to backend
  - JSON export/import
  - Reset with confirmation dialog
- Custom dialogs are used (not browser `alert/confirm`) for import/reset/logout

### Canvas

- Drag-and-drop section order editing via dnd-kit
- Save flow:
  - Requires auth
  - `createPortfolio` if no `id`, else `updatePortfolio`
- Publish flow:
  - Requires auth
  - Requires saved portfolio (`id`)
  - Toggles published state through publish endpoint
- Live preview flow:
  - Requires published portfolio
  - Opens `/:name/:slug`

### Device preview sizing

Canvas frame sizing in non-desktop modes:

- Mobile: `390 x 844` frame
- Tablet: `820 x 1024` frame

## Theme System

Theme model (`PortfolioTheme`):

- `primaryColor`
- `secondaryColor`
- `accentColor`
- `backgroundColor`
- `textColor`
- `fontFamily`
- `borderRadius` (`none | small | medium | large`)

Theme is applied as CSS variables and directly in section inline styles.

`ThemeEditor` includes:

- Preset themes (Midnight, Ocean, Forest, Sunset, Rose, Monochrome)
- Custom color pickers
- Font family selector
- Border radius presets

Extra behavior:

- Applying a preset updates hero section `gradientColors` to match theme colors

## Localization and Myanmar Font

Localization files:

- `src/locales/en.json`
- `src/locales/mm.json`

Current translation scope:

- Builder/editor UI
- Auth modal
- Toolbar/sidebar/settings/dialogs

Myanmar font setup:

- Font files in `public/fonts/Z06-Walone-*.ttf`
- Font-face declarations in `src/app/globals.css`
- `.mm-ui-font` class applies Myanmar font stack

Important scope rule currently implemented:

- MM font is applied to editor/chrome UI (toolbar/sidebar/dialog/auth)
- Portfolio sections continue using theme-selected font (`theme.fontFamily`)

## Portfolio Data Model (High Level)

Section types:

- `hero`
- `about`
- `projects`
- `skills`
- `experience`
- `contact`

Each section has:

- `id`, `type`, `order`, `visible`, `data`

Data schemas are strongly typed in `src/types/portfolio.ts`.

## Setup

### Prerequisites

- Node.js 20+
- pnpm
- Backend API running (default `http://localhost:3002`)

### Install

```bash
pnpm install
```

### Environment

Create `.env` from sample:

```bash
cp .env.sample .env
```

`.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` - run development server
- `pnpm build` - production build
- `pnpm start` - run production server
- `pnpm lint` - ESLint checks

## Known Gaps / Notes

- `CanvasToolbar` currently imports `ViewModeSelector`, but the selector block is commented out in the UI.
- Lint currently reports warnings (no errors), including:
  - Unused imports/vars in a few files
  - `HeroSection` using `<img>` instead of `next/image`
  - `usePortfolioData` effect dependency warning
- `src/i18n/` folder exists but is empty (translation logic is in `src/lib/i18n.ts`).

## Troubleshooting

### Backend not reachable

Symptoms:

- Login/save/publish/public preview errors

Checks:

1. Ensure backend is running on expected host/port
2. Verify `NEXT_PUBLIC_API_URL`
3. Confirm CORS and auth token behavior on backend

### You still see old UI behavior after edits

Do:

1. Restart dev server
2. Hard refresh browser cache

## License

See `LICENSE`.
