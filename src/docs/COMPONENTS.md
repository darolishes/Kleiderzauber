# Components Documentation

## Layout Components

### Layout (`src/components/Layout.tsx`)
The main layout component that provides the basic structure for all pages.
- Renders the header and main content area
- Uses Outlet from react-router-dom for nested routes
- Provides consistent padding and maximum width constraints

### Header (`src/components/Header/Header.tsx`)
The main navigation header component.
- Displays the app logo and title
- Contains navigation links
- Handles user authentication state
- Props: None (uses internal auth store)

### Navigation (`src/components/Header/Navigation.tsx`)
Navigation menu component with authentication-aware rendering.
- Shows different options for authenticated vs unauthenticated users
- Provides links to main app features
- Props:
  - `user: User | null` - Current user object
  - `onSignOut: () => void` - Sign out handler

## Page Components

### Home (`src/pages/Home.tsx`)
Landing page component showcasing the app's main features.
- Displays hero section with call-to-action
- Shows feature highlights in a grid layout
- Responsive design for all screen sizes

### Auth (`src/pages/Auth.tsx`)
Authentication page using Supabase Auth UI.
- Handles user sign-in and registration
- Redirects authenticated users to wardrobe
- Uses Supabase Auth UI theme

### Wardrobe (`src/pages/Wardrobe.tsx`)
Page for managing clothing items.
- Will include:
  - Clothing item grid
  - Upload functionality
  - Filtering and sorting
  - Item management

### Outfits (`src/pages/Outfits.tsx`)
Page for managing saved outfits.
- Will include:
  - Outfit gallery
  - Creation interface
  - Categorization
  - Search functionality

### TryOn (`src/pages/TryOn.tsx`)
Virtual try-on interface page.
- Will include:
  - Canvas for clothing manipulation
  - Controls for item positioning
  - Layer management
  - Save/load functionality

### Profile (`src/pages/Profile.tsx`)
User profile management page.
- Displays user information
- Shows email and user ID
- Will include additional profile management features

## Protected Route (`src/components/ProtectedRoute.tsx`)
Higher-order component for route protection.
- Prevents unauthorized access to protected routes
- Redirects to auth page if user is not authenticated
- Shows loading state during auth check

## Best Practices
- Use TypeScript for type safety
- Follow component composition patterns
- Implement proper error boundaries
- Use proper prop typing
- Maintain consistent styling with Tailwind CSS
- Keep components focused and single-responsibility
- Use proper loading states and error handling