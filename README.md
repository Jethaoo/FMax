# F1 Viewer

A modern web application to view Formula 1 2025 schedule, drivers, and constructors data. Built with Next.js, TypeScript, and Tailwind CSS, powered by the [OpenF1 API](https://f1api.dev/).

## Features

- **Home Dashboard**: View the latest or upcoming race session details.
- **Drivers**: Comprehensive list of 2025 season drivers with teams and car numbers.
- **Constructors**: Team details and lineups.
- **Responsive Design**: Clean and modern UI that works on all devices.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Source**: [OpenF1 API](https://f1api.dev/)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

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

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Application pages and layout (Next.js App Router).
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and API client configuration.
- `src/lib/types.ts`: TypeScript interfaces for API data.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Data provided by [OpenF1 API](https://f1api.dev/) - Free and Open Source Formula 1 Data.
