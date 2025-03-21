# Kleiderzauber - Virtual Wardrobe Application

A modern web application that helps users organize their clothing items, create outfits, and plan what to wear.

## Features

- 👕 Virtual clothing organization with categories and tags
- 👗 Outfit creation and composition tool
- 📅 Calendar integration for outfit planning
- 🔐 Secure authentication system
- 📸 Image upload with compression
- 📱 Responsive design for all devices
- 🏷️ Tagging system for seasons and occasions
- ❤️ Favorite outfits collection

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Storage**: Supabase Storage
- **State Management**: Zustand
- **Image Processing**: Canvas API
- **Routing**: React Router
- **File Upload**: React Dropzone
- **Image Compression**: browser-image-compression
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
/
├── /public              # Static assets
├── /src                 # Source code
│   ├── /api            # API client functions
│   ├── /assets         # Project assets (icons, images)
│   ├── /components     # Reusable UI components
│   ├── /hooks          # Custom React hooks
│   ├── /layouts        # Page layout components
│   ├── /pages          # Page components
│   ├── /stores         # Zustand stores
│   ├── /types          # TypeScript type definitions
│   ├── /utils          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Application entry point
│   └── supabase.ts     # Supabase client configuration
├── /supabase           # Supabase migrations and types
├── /.ai                # Project documentation and memory
├── index.html          # HTML entry point
└── ... config files    # Various configuration files
```

## Features in Detail

### Authentication

- Email/password authentication
- Social login options (Google, Apple)
- Protected routes
- Persistent auth state
- Profile management

### Virtual Wardrobe

- Upload and categorize clothing items
- Organize by category, color, season, etc.
- Tag items for occasions and weather
- Search and filter functionality

### Outfit Creation

- Mix and match clothing items
- Save outfit combinations
- Tag outfits for occasions and seasons
- Add to favorites for quick access

### Calendar Integration

- Plan outfits for upcoming events
- Associate outfits with calendar events
- View outfit history

## Development Approach

This project follows an Agile development workflow:

1. Project is organized in epics and stories
2. Documentation is maintained in the `.ai` directory
3. Implementation follows a Test-Driven Development approach
4. We use a component-based architecture with Zustand for state management

## Contributing

1. Read the project documentation in the `.ai` directory
2. Follow the Kleiderzauber project patterns and conventions
3. Write tests before implementing features
4. Ensure responsive design works on all device sizes
5. Maintain consistent code style with ESLint and TypeScript

## License

MIT License - feel free to use this project for personal or commercial purposes.
