# Picstoria Frontend

A modern, responsive Next.js 14 frontend for the Picstoria AI-powered photo curation platform.

## Features

- AI-powered semantic photo search
- Beautiful masonry grid photo collections
- Smart tagging with AI suggestions
- Color palette extraction and copying
- Photo recommendations
- Search history tracking
- Dark mode support
- Responsive design for all devices

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- TanStack Query
- Framer Motion
- React Masonry CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (https://cosmocode.onrender.com)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at http://localhost:3000

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=https://cosmocode.onrender.com
```

For local development:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Pages

- `/` - Homepage with public search
- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset with token
- `/collection` - User's saved photos
- `/photo/[id]` - Photo detail with tags and recommendations
- `/history` - Search history

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://cosmocode.onrender.com`
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Architecture

- **Server-Side Rendering** - Fast initial page loads
- **API Proxy** - Rewrites to backend via Next.js config
- **Cookie-based Auth** - Secure JWT tokens in HTTP-only cookies
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic route-based splitting

## Design System

- Neutral, editorial aesthetic
- Inter font family
- 8px spacing system
- Comprehensive color system
- Dark mode support
- Accessible components

## Contributing

This is a production-ready application. Ensure all changes maintain:

- TypeScript type safety
- Responsive design
- Accessibility standards
- Security best practices
