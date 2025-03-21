# Import Standards & Path Aliases

## Path Aliases

We use the following path aliases to maintain clean and consistent imports:

| Alias         | Path             | Purpose                                          |
| ------------- | ---------------- | ------------------------------------------------ |
| `@features/*` | `src/features/*` | Feature modules (auth, profile, wardrobe, theme) |
| `@shared/*`   | `src/shared/*`   | Shared components and utilities                  |
| `@utils/*`    | `src/utils/*`    | Utility functions                                |
| `@hooks/*`    | `src/hooks/*`    | Custom React hooks                               |
| `@store/*`    | `src/store/*`    | State management (Zustand stores)                |
| `@types/*`    | `src/types/*`    | Shared TypeScript types                          |
| `@pages/*`    | `src/pages/*`    | Page components                                  |

## Import Guidelines

1. **Feature Modules**

   ```typescript
   // ✅ Import from feature module root
   import { LoginForm, RegisterForm } from "@features/auth";

   // ❌ Don't import directly from feature components
   import { LoginForm } from "@features/auth/components/LoginForm";
   ```

2. **Shared Components**

   ```typescript
   // ✅ Import from component index
   import { Button } from "@shared/components/ui";

   // ❌ Don't use relative paths
   import { Button } from "../../components/ui/Button";
   ```

3. **Types**

   ```typescript
   // ✅ Import shared types
   import type { ClothingItem } from "@types/wardrobe";

   // ✅ Import feature-specific types
   import type { AuthState } from "@features/auth";
   ```

4. **Utilities & Hooks**

   ```typescript
   // ✅ Import utilities
   import { formatDate } from "@utils/date";

   // ✅ Import hooks
   import { useAuth } from "@hooks/useAuth";
   ```

## Barrel Files

Each feature and shared module should have an index.ts barrel file that:

1. Exports all public components/functions
2. Exports type definitions
3. Maintains clean public API

Example:

```typescript
// features/auth/index.ts
export { LoginForm, RegisterForm } from "./components";
export type { AuthState, User } from "./types";
export { AuthFeature } from "./AuthFeature";
```

## ESLint Rules

We enforce these standards with ESLint rules:

- No relative imports outside current directory
- Must use path aliases for cross-module imports
- Must import from barrel files when available
- Types must be imported using 'type' keyword

## Directory Structure

```
src/
├── features/          # Feature modules
│   ├── auth/         # Authentication feature
│   ├── profile/      # Profile management
│   ├── wardrobe/     # Wardrobe management
│   └── theme/        # Theme management
├── shared/           # Shared components
│   ├── components/   # UI components
│   └── utils/        # Shared utilities
├── utils/            # Global utilities
├── hooks/            # Custom React hooks
├── store/            # State management
├── types/            # Shared types
└── pages/            # Page components
```

## Migration Guide

When moving or creating new components:

1. Place in appropriate feature/shared directory
2. Create/update barrel file (index.ts)
3. Use path aliases for imports
4. Update existing imports to use new paths
5. Run ESLint to verify compliance
