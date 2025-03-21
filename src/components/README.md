# Components

This directory contains all shared components used across the application. The components are organized into the following categories:

## Directory Structure

- `ui/`: Base UI components (buttons, inputs, cards, etc.)
- `layout/`: Layout components (containers, grids, etc.)
- `theme/`: Theme-related components (theme provider, theme switcher)
- `common/`: Shared business components used across features

## Usage Guidelines

1. Place components in the appropriate directory based on their purpose
2. Each component should:
   - Have a clear, single responsibility
   - Be well-documented with TypeScript types
   - Include necessary tests
   - Follow project coding standards

## Best Practices

1. Use named exports for all components
2. Keep components focused and composable
3. Implement proper prop validation
4. Document component APIs
5. Follow accessibility guidelines

## Contributing

When adding new components:

1. Place them in the appropriate directory
2. Update the relevant index.ts file
3. Add necessary tests
4. Document the component's API
5. Follow the project's coding standards
