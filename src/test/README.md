# Component Template Testing Suite

## Overview
This testing suite provides comprehensive validation for the AI UI Generator's component template system. It ensures that all templates render properly with JSON configurations following the MainPrompt.md format.

## Test Structure

### 🧪 Test Files

1. **`core.test.ts`** - Core system functionality
   - Component registry validation
   - Renderer functionality
   - Spec validation utilities
   - Component name extraction

2. **`components.test.ts`** - Individual component testing
   - Text & explanation components (text, insight-card, summary-card)
   - Chart components (line-chart, bar-chart, pie-chart, composed-chart)
   - Data display components (data-table)
   - Layout components (layout)
   - Feedback components (alert)
   - Edge cases and error handling
   - Legacy format support

3. **`integration.test.ts`** - End-to-end workflow testing
   - Complete dashboard scenarios from MainPrompt.md
   - Mixed format compatibility
   - Performance and scalability
   - Error recovery and robustness

4. **`coverage.test.ts`** - Registry coverage validation
   - Ensures all template components are registered
   - Provides comprehensive statistics
   - Validates component metadata integrity

### 🛠️ Test Utilities (`utils.ts`)

- **`renderFromSpec(spec)`** - Renders a component from JSON spec
- **`testComponentRender(spec)`** - Tests if component renders without errors
- **`validateSpec(spec)`** - Validates JSON spec structure
- **`extractComponentNames(spec)`** - Extracts all component names (including nested)
- **`createTestData`** - Generators for common test scenarios
- **`registryHelpers`** - Registry inspection utilities

### 📊 Test Fixtures (`fixtures.ts`)

Comprehensive test data covering all component categories:

- **Text Components**: Basic text, markdown, headings
- **Insight Cards**: Success, warning, error variants
- **Summary Cards**: System health, traffic summaries
- **Charts**: Line charts, bar charts, pie charts, composed charts
- **Data Tables**: Service metrics, error logs
- **Layouts**: Simple stacks, complex grids
- **Alerts**: All severity levels
- **Complex Scenarios**: Complete dashboards from MainPrompt.md
- **Edge Cases**: Empty data, null values, deep nesting

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- core.test.ts
npm test -- components.test.ts
npm test -- integration.test.ts
npm test -- coverage.test.ts
```

## Test Validation Features

### ✅ JSON Format Validation
- Validates both new (`name`/`templateProps`) and legacy (`type`/`props`) formats
- Ensures required fields are present
- Checks component exists in registry
- Validates nested component structures

### 🎨 Component Rendering Tests
- Tests actual React component rendering
- Validates props are passed correctly
- Ensures no rendering errors occur
- Tests with realistic data sets

### 🔄 Format Compatibility
- Tests mixed old/new format scenarios
- Validates nested format mixing
- Ensures backward compatibility

### 📈 Performance Validation
- Tests complex nested layouts
- Validates rendering performance
- Ensures scalability with large datasets

### 🛡️ Error Handling
- Tests graceful degradation with missing components
- Validates partial failure recovery
- Tests malformed JSON handling

## Expected Test Results

### Registry Coverage
The test suite validates that the following component categories are properly registered:

**Charts** (~20+ components):
- line-chart, bar-chart, pie-chart, area-chart, scatter-chart
- composed-chart, donut-chart, bubble-chart, gauge-chart, funnel-chart
- And many more from the charts/ directory

**Data Display** (~15+ components):
- data-table, data-grid, list, badge, chip, avatar
- calendar, timeline, kanban, etc.

**Layout** (~15+ components):
- layout, container, grid, stack, flexbox
- accordion, drawer, sidebar, etc.

**Feedback** (~10+ components):
- alert, toast, modal, dialog, snackbar
- progress, skeleton, etc.

### MainPrompt.md Examples
All examples from the MainPrompt.md are tested:
- Traffic analysis dashboard
- Error analysis dashboard  
- Color palette validation
- Component hierarchy validation

## Test Configuration

### Vitest Setup
- Environment: jsdom (for DOM simulation)
- Setup file: `src/test/setup.ts`
- Global test utilities available
- CSS processing enabled

### TypeScript Support
- Full TypeScript support with type checking
- Import aliases configured (`@/templates`, etc.)
- Strict type validation for component specs

## Debugging Failed Tests

### Common Issues
1. **Component not registered**: Check if component exports metadata
2. **Import path errors**: Verify relative imports in test files
3. **Props validation**: Ensure test data matches component prop types
4. **Registry initialization**: Components must be imported to register

### Debug Commands
```bash
# Run with verbose output
npm test -- --reporter=verbose

# Run specific test with logs
npm test -- --reporter=verbose core.test.ts

# Check registry state
npm test -- coverage.test.ts
```

## Extending Tests

### Adding New Component Tests
1. Add test data to `fixtures.ts`
2. Add component-specific tests to `components.test.ts`
3. Update integration scenarios if needed

### Adding New Test Scenarios
1. Create new spec in `fixtures.ts`
2. Add validation test in appropriate test file
3. Consider edge cases and error conditions

### Performance Testing
1. Use `Date.now()` timing around operations
2. Set reasonable performance thresholds
3. Test with large datasets

## Coverage Goals

- ✅ **100% Component Registration**: All templates should be discoverable
- ✅ **95%+ Render Success**: Components should render without errors
- ✅ **100% Format Support**: Both new and legacy JSON formats
- ✅ **MainPrompt.md Compliance**: All examples should validate and render
- ✅ **Error Resilience**: Graceful handling of edge cases

This testing suite ensures that the AI UI Generator can reliably render any JSON configuration following the MainPrompt.md specification.