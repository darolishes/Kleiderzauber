# Export Standards

## Overview

This document outlines the export standards for the Kleiderzauber project. These standards are enforced through ESLint rules and should be followed across all TypeScript/JavaScript files.

## Core Rules

1. **Named Exports Only** 🎯

   - Use named exports instead of default exports
   - Export interfaces, types, and constants directly

   ```typescript
   // ✅ Good
   export function MyComponent() {}
   export interface MyProps {}
   export const MY_CONSTANT = 42;

   // ❌ Bad
   export default function MyComponent() {}
   ```

2. **Barrel Files** 📦

   - Use index.ts files to re-export from feature directories
   - Keep exports organized and grouped

   ```typescript
   // ✅ Good - feature/index.ts
   export { ComponentA } from "./components/component-a";
   export { ComponentB } from "./components/component-b";
   export type { Props } from "./types";

   // ❌ Bad - Importing directly from component files
   import { ComponentA } from "@features/feature/components/component-a";
   ```

3. **Export Location** 📍

   - Place exports at the end of the file
   - Group related exports together

   ```typescript
   // ✅ Good
   interface Props {}
   function Component() {}
   const CONSTANT = 42;

   export { Component, CONSTANT };
   export type { Props };

   // ❌ Bad
   export interface Props {}
   export function Component() {}
   export const CONSTANT = 42;
   ```

4. **Path Aliases** 🔄

   - Use path aliases (@/) instead of relative imports
   - Import from feature barrel files when available

   ```typescript
   // ✅ Good
   import { UserProfile } from "@/features/profile";
   import { Button } from "@/components/ui";

   // ❌ Bad
   import { UserProfile } from "../../features/profile/components/user-profile";
   import { Button } from "../../../components/ui/button";
   ```

## ESLint Rules

The following ESLint rules are configured to enforce these standards:

- `import/no-default-export`: Prevents default exports
- `import/prefer-default-export`: Disabled to encourage named exports
- `import/no-cycle`: Prevents circular dependencies
- `import/exports-last`: Enforces exports at the end of files
- `import/group-exports`: Encourages grouping exports together

## Examples

### Component Export

```typescript
// feature/components/my-component.tsx
interface Props {
  title: string;
}

function MyComponent({ title }: Props) {
  return <h1>{title}</h1>;
}

export { MyComponent };
export type { Props as MyComponentProps };
```

### Feature Barrel File

```typescript
// feature/index.ts
export { MyComponent } from "./components/my-component";
export { useMyHook } from "./hooks/my-hook";
export type { MyComponentProps } from "./components/my-component";
```

### Utility Exports

```typescript
// utils/formatting.ts
function formatDate(date: Date): string {}
function formatCurrency(amount: number): string {}

export { formatDate, formatCurrency };
```

## Migration Guide

1. Convert default exports to named exports
2. Move exports to the end of files
3. Create/update barrel files
4. Update imports to use path aliases
5. Run ESLint to verify compliance

## Common Issues and Solutions

1. **Circular Dependencies**

   - Split shared types into separate files
   - Use interface merging when needed
   - Consider restructuring component hierarchy

2. **Multiple Exports**

   - Group related exports together
   - Consider creating sub-features
   - Use barrel files effectively

3. **Path Resolution**
   - Configure path aliases in tsconfig.json
   - Update build configuration
   - Use IDE support for imports
