# Utilities

This directory contains utility functions and helpers used across the application. The utilities are organized into the following categories:

## Directory Structure

- `api/`: API-related utilities (request helpers, response handling)
- `formatting/`: Data formatting utilities (dates, numbers, strings)
- `validation/`: Form and data validation helpers
- `storage/`: Storage-related utilities (local storage, session storage)
- `helpers/`: General helper functions

## Usage Guidelines

1. Place utilities in the appropriate directory based on their purpose
2. Each utility should:
   - Be pure functions when possible
   - Have clear TypeScript types
   - Include necessary tests
   - Be well-documented with JSDoc comments

## Best Practices

1. Use named exports for all utilities
2. Keep functions focused and composable
3. Implement proper error handling
4. Document function parameters and return types
5. Follow functional programming principles where appropriate

## Contributing

When adding new utilities:

1. Place them in the appropriate directory
2. Update the relevant index.ts file
3. Add necessary tests
4. Document the utility's API
5. Follow the project's coding standards
