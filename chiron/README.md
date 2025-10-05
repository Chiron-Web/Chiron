# CHIRON

**CHIRON** (Cognitive and Health Intelligent Real-time Optimization Network) is a health-focused web platform dedicated to providing users with reliable, accurate, and timely health news. It leverages modern technology and AI to fight misinformation and empower public health education.

## Features

- **Health News Verification:** Paste a URL or text to verify if the content is authentic or fake using AI-powered classification.
- **Live Health News Feed:** Browse the latest health news articles, with credibility and classification badges.
- **Content Scraping:** Automatically extract and analyze content from provided URLs.
- **User-Friendly Interface:** Clean, modern UI with responsive design.
- **Team & Mission:** Transparent about the team and the mission to combat health misinformation.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
	```bash
	git clone https://github.com/yourusername/chiron.git
	cd chiron
	```
2. Install dependencies:
	```bash
	npm install
	# or
	yarn install
	```

### Running the Development Server

```bash
npm run dev
# or

# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Usage

- **Home:** Enter a news article URL to verify its authenticity.
- **Verify News:** Paste a URL or text, fetch content, and classify it as authentic or fake.
- **Results:** View detailed classification results, including confidence and credibility scores.
- **About Us:** Learn about the CHIRON mission, vision, and team.

## Folder Structure

```
chiron/
├── app/
│   ├── components/
│   │   ├── about.js         # About section and team info
│   │   ├── context.js       # React context for classification state
│   │   ├── footer.js        # Footer component
│   │   ├── form.js          # News verification form
│   │   ├── header.js        # Header and navigation
│   │   ├── homepage.js      # Home page content and search
│   │   ├── newsGrid.js      # Health news feed grid
│   ├── about/
│   │   └── page.js          # About page
│   ├── results/
│   │   └── page.js          # Results page
│   ├── verify/
│   │   └── page.js          # Verification page
│   ├── layout.js            # App layout and context provider
│   ├── page.js              # Main entry (home)
│   ├── globals.css          # Global styles (Tailwind CSS)
├── public/                  # Static assets (images, icons)
├── package.json             # Project metadata and scripts
├── postcss.config.mjs       # PostCSS config (Tailwind)
├── next.config.mjs          # Next.js config
├── jsconfig.json            # JS config (path aliases)
├── eslint.config.mjs        # ESLint config
└── README.md                # Project documentation
```

## Technologies Used

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- Custom backend endpoints for classification and scraping

## Team

- Rojane Kyle Madera
- Michael Patrick Pelegrino
- Trixie Anne Depra

## License

This project is for educational and demonstration purposes.
