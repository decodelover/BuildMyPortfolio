# BuildMyPortfolio

AI-powered developer portfolio builder. Create stunning, production-ready portfolio websites in minutes using the power of Google Gemini.

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, Shadcn UI |
| **Auth** | Firebase Authentication |
| **Database** | Cloud Firestore |
| **Storage** | Firebase Storage |
| **State** | Zustand |
| **Forms** | React Hook Form + Zod |
| **Animations** | Framer Motion |
| **AI** | Google Gemini API |
| **Payments** | Paystack, Flutterwave |
| **Analytics** | PostHog |
| **Charts** | Recharts |
| **Tables** | TanStack Table |

## Getting Started

### Prerequisites

- Node.js 18.18+ 
- npm 9+
- A Firebase project with Auth, Firestore, and Storage enabled
- A Google Gemini API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd BuildMyPortfolio

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Then edit .env.local with your actual credentials
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
├── components/
│   ├── ui/                 # Shadcn UI primitives
│   ├── shared/             # Reusable cross-feature components
│   ├── layouts/            # Navbar, Footer, Sidebar
│   ├── forms/              # Form components (auth, profile, settings)
│   ├── dashboard/          # Dashboard-specific widgets
│   ├── admin/              # Admin panel components
│   └── portfolio/          # Portfolio editor & preview components
├── features/
│   ├── auth/               # Authentication flows
│   ├── portfolios/         # Portfolio CRUD & generation
│   ├── payments/           # Paystack & Flutterwave integration
│   ├── ai/                 # Gemini AI generation logic
│   ├── themes/             # Theme management & previews
│   ├── support/            # Help & support ticket system
│   └── admin/              # Admin analytics & user management
├── lib/
│   ├── firebase/           # Firebase client & admin SDK setup
│   ├── constants/          # App-wide constants & enums
│   ├── validations/        # Zod schemas for forms & API
│   ├── helpers/            # Utility functions
│   └── seo/                # SEO metadata constructors
├── hooks/                  # Custom React hooks
├── services/               # API service layer
├── store/                  # Zustand state stores
├── providers/              # React context providers
├── contexts/               # Additional context definitions
├── themes/                 # Theme configuration files
├── types/                  # TypeScript type definitions
└── styles/                 # Additional global styles
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all required values. See the template for documentation on each variable.

## License

Proprietary — All rights reserved.
