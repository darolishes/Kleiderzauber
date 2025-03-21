# Styles

This directory contains all global styles, variables, and utility classes for the application.

## Directory Structure

- `global/`: Global styles and base styles
  - `base.css`: Core styles and Tailwind directives
- `variables/`: CSS custom properties (variables)
  - `colors.css`: Color scheme variables
  - `layout.css`: Layout and spacing variables
  - `typography.css`: Typography-related variables
- `mixins/`: Reusable CSS patterns
  - `utils.css`: Utility classes and mixins
- `index.css`: Main entry point that imports all styles

## Usage Guidelines

1. Use CSS variables for consistent theming
2. Follow the established naming conventions
3. Keep styles modular and reusable
4. Use Tailwind utilities when possible
5. Add new variables to appropriate files

## Best Practices

1. Use CSS custom properties for theme values
2. Keep global styles minimal
3. Prefer utility classes over custom CSS
4. Follow BEM naming convention for custom classes
5. Document complex CSS patterns

## Contributing

When adding new styles:

1. Place them in the appropriate directory
2. Update the relevant index.css file
3. Follow the established naming conventions
4. Document any complex patterns
5. Test in both light and dark themes
