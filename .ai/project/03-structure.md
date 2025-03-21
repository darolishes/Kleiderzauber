# Project Structure

This document outlines the organization of files and folders in the Kleiderzauber project.

## Root Structure

```
/
├── /public              # Static assets
├── /src                 # Source code
├── /supabase            # Supabase configuration and types
├── /.ai                 # Project documentation and memory
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # Project overview
```

## Source Code Structure

```
/src
├── /api                # API client functions
├── /assets             # Project assets (icons, images)
├── /components         # Reusable UI components
│   ├── /auth           # Authentication components
│   ├── /closet         # Virtual closet components
│   ├── /outfit         # Outfit creation components
│   ├── /profile        # User profile components
│   └── /ui             # Common UI components
├── /hooks              # Custom React hooks
├── /layouts            # Page layout components
├── /pages              # Page components
├── /stores             # Zustand stores
├── /types              # TypeScript type definitions
├── /utils              # Utility functions
├── App.tsx             # Main App component
├── main.tsx            # Application entry point
└── supabase.ts         # Supabase client configuration
```

## Component Structure

Each component should have its own folder with the following structure:

```
/ComponentName
├── ComponentName.tsx             # Component implementation
├── ComponentName.test.tsx        # Component tests
└── index.ts                      # Export file for clean imports
```

## Naming Conventions

- **Folders**: Use kebab-case for folder names except for component folders
- **Component Folders**: Use PascalCase for component folder names
- **Component Files**: Use PascalCase for component files
- **Utility Files**: Use camelCase for utility and hook files
- **Test Files**: Add `.test.tsx` or `.test.ts` suffix
- **Type Files**: Use PascalCase for type definition files

## Import Conventions

- Use relative imports for local files
- Use absolute imports for global utilities and components
- Configure path aliases in tsconfig.json for cleaner imports

## File Organization Rules

1. Components should be organized by feature/domain
2. Shared components go in `/components/ui`
3. Each page should have its own file in `/pages`
4. API calls should be centralized in `/api`
5. State management should be organized by domain in `/stores`
6. Types should be centralized in `/types` with domain-specific organization
7. Utility functions should be grouped by purpose in `/utils`

## Future Considerations

As the project grows, we may need to:

1. Further organize components by sub-domains
2. Implement lazy loading for performance
3. Consider module federation for scalability
4. Add storybook for component documentation
5. Implement more granular code splitting
