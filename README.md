# F1 Viewer

A modern Formula 1 web app for schedule, race weekend status, drivers, and constructors. Built with Next.js, TypeScript, and Tailwind CSS, powered by the OpenF1 API.

## Features

- **Home Dashboard**: Next session countdown, session timing, weather, and quick links.
- **Drivers Page**: Team-grouped driver list with local image mapping and team colors.
- **Constructors Page**: Team cards with logos, car images, and driver lineups.
- **Schedule Page**: Weekend cards with round/testing labels, date ranges, and live status badges.
- **Race Detail Page**: `/schedule/[meetingKey]` timeline view with session states and track conditions.
- **Live Stream Page**: View active, integrated live streams via the dynamic player.
- **Global Timezone Toggle**: Switch between Local and Track time, persisted in `localStorage`.
- **Loading Skeletons**: Route-level loading UIs for smoother perceived performance.
- **Responsive UI/UX**: Optimized for desktop and mobile with dedicated mobile nav.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Date Utilities**: [date-fns](https://date-fns.org/)
- **Icons**: [lucide-react](https://lucide.dev/)
- **Data Sources**: [OpenF1 API](https://api.openf1.org/v1) & [ppv.to Streams API](https://ppv.to/api)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm

### Installation

1. Clone the repository (if applicable) or navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

## Notes About Data Reliability

- The app relies on live OpenF1 and ppv.to endpoints.
- In CI/deploy environments, some endpoints may occasionally return `401` or `429`.
- Pages include fallbacks and empty-state handling so builds and runtime stay resilient.

## Project Structure

- `src/app`: Routes, layout, loading states
- `src/components`: Reusable UI components
- `src/components/timezone`: Timezone context, toggle, and shared date rendering
- `src/components/schedule`: Live weekend/session state badges
- `src/lib`: API helpers, mappings, and shared types
- `public/drivers/2025`: Local driver images
- `public/teams/2025`: Local team logos
- `public/cars/2025`: Local constructor car images

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Formula 1 data provided by [OpenF1 API](https://api.openf1.org/v1).
- Live streams metadata provided by [ppv.to](https://ppv.to/api).
