# Story-6: Wardrobe Item Management Testing

## Directory Structure

```
story-6/
├── unit/                  # Unit tests
│   ├── __tests__/        # Test files
│   ├── __fixtures__/     # Test data
│   └── __utils__/        # Test helpers
├── integration/          # Integration tests
│   ├── __tests__/        # Test files
│   ├── __fixtures__/     # Test data
│   └── __utils__/        # Test helpers
└── e2e/                 # End-to-end tests
    ├── __tests__/        # Test files
    ├── __fixtures__/     # Test data
    └── __utils__/        # Test helpers
```

## Test Coverage Requirements

- Unit Tests: 90% coverage
- Integration Tests: 80% coverage
- E2E Tests: Critical paths covered
- Performance Tests: All metrics validated

## Testing Guidelines

### Unit Tests

1. Store Tests (`unit/__tests__/store/`)

   - Test all Zustand store actions
   - Verify state updates
   - Test error handling
   - Mock external dependencies

2. Component Tests (`unit/__tests__/components/`)
   - Test component rendering
   - Test user interactions
   - Test state changes
   - Test error states

### Integration Tests

1. API Tests (`integration/__tests__/api/`)

   - Test CRUD operations
   - Test error handling
   - Test authentication
   - Test rate limiting

2. Database Tests (`integration/__tests__/db/`)

   - Test schema validation
   - Test data persistence
   - Test relationships
   - Test policies

3. Storage Tests (`integration/__tests__/storage/`)
   - Test file uploads
   - Test image processing
   - Test access control
   - Test cleanup

### E2E Tests

1. User Flows (`e2e/__tests__/flows/`)

   - Test complete item upload flow
   - Test item management
   - Test filtering and sorting
   - Test offline functionality

2. Performance Tests (`e2e/__tests__/performance/`)
   - Test load times
   - Test image optimization
   - Test responsive behavior
   - Test memory usage

## Test Data

- Use fixtures for consistent test data
- Keep sensitive data out of tests
- Use meaningful test data names
- Document data relationships

## Running Tests

```bash
# Unit tests
npm run test:unit story-6

# Integration tests
npm run test:integration story-6

# E2E tests
npm run test:e2e story-6

# All tests
npm run test:story-6
```

## Writing Tests

1. Follow AAA pattern:

   - Arrange: Set up test data
   - Act: Execute the test
   - Assert: Verify the results

2. Naming Convention:

   - Files: `*.test.ts` or `*.test.tsx`
   - Describe blocks: Feature or component name
   - Test cases: Should describe expected behavior

3. Best Practices:
   - One assertion per test
   - Clear test descriptions
   - Proper error messages
   - Clean up after tests

## CI/CD Integration

Tests are automatically run:

- On pull requests
- Before deployment
- Nightly for performance tests

## Debugging Tests

1. Use test debugger:

   ```bash
   npm run test:debug story-6
   ```

2. Available tools:
   - Browser DevTools for E2E
   - VS Code debugger
   - Test explorers

## Performance Metrics

- Load time: < 2s
- Image processing: < 5s
- Scrolling: 60fps
- Memory: < 100MB

## Security Testing

- Validate file uploads
- Test access controls
- Check for XSS
- Verify data privacy
