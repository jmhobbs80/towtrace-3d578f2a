
# TowTrace

## Project Overview

A comprehensive vehicle management system built with modern web technologies.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase for backend services
- Stripe for payments
- Mapbox for location services

## Prerequisites

- Node.js 16 or higher
- A Supabase account
- A Stripe account (for payment processing)
- A Mapbox account (for maps and routing)

## Getting Started

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd towtrace
```

2. Install dependencies:
```sh
npm install
```

3. Set up your Supabase project:
   - Create a new project at [supabase.com](https://supabase.com)
   - Set up authentication providers
   - Run the database migrations
   - Configure RLS policies

4. Configure the required secrets in your Supabase project:
   - STRIPE_SECRET_KEY: Your Stripe secret key
   - MAPBOX_API_KEY: Your Mapbox API key

5. Start the development server:
```sh
npm run dev
```

## Development

You can edit files using your preferred IDE and method:
- Use your preferred code editor
- Edit files directly in GitHub
- Use GitHub Codespaces

## Building for Production

To create a production build:

```sh
npm run build
```

To preview the production build:

```sh
npm run preview
```

## Deployment

The project can be deployed to any static hosting platform:

1. Build the project:
```sh
npm run build
```

2. Deploy the `dist` directory to your chosen platform:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting

## Features

- Vehicle inventory management
- Impound lot management
- Dispatch system with AI route optimization
- Customer portal for vehicle status and payments
- Real-time tracking and notifications
- Analytics and reporting
- Role-based access control
- Multi-organization support

## Security

- All API keys and secrets are stored securely in Supabase
- Authentication via Supabase Auth
- Row Level Security (RLS) policies protect data access
- HTTPS required for all API calls
- Regular security audits and updates

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

