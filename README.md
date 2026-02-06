# Example Provider

This example project shows how to use PactFlow's Drift tool to ensure compliance with an OpenAPI specification.

## Repository Support

This project supports two repository backends, configurable at runtime:

- **In-Memory Repository** (default): No external dependencies, ideal for development
- **PostgreSQL Repository**: Persistent storage, suitable for production

See [POSTGRES_SETUP.md](POSTGRES_SETUP.md) for detailed PostgreSQL configuration.

## Drift API Conformance Testing

This project also includes Drift conformance tests that verify the API against the OpenAPI specification. Tests are available for both repository backends:

```bash
# In-memory repository tests
npm test -- api.test.js

# PostgreSQL repository tests (requires Docker and PostgreSQL)
npm run test:postgres
```

The PostgreSQL tests demonstrate advanced patterns for state management during API conformance testing, including:
- Direct database manipulation via HTTP state management server
- Lua-based test orchestration
- Operation-specific state setup and teardown

## Quick Start

### Development (In-Memory)

```bash
npm start
npm test
```

### Production-like (PostgreSQL)

```bash
npm run db:start
npm run start:postgres
npm run test:postgres
```
## Project Structure

- `src/product/` - Product API implementation
  - `repositories/` - Repository implementations (in-memory and PostgreSQL)
  - `product.routes.js` - API routes
  - `product.controller.js` - Request handlers
  - `api.test.js` - In-memory Quilt conformance tests
  - `api-postgres.test.js` - PostgreSQL Quilt conformance tests

- `quilt/` - Quilt test definitions for in-memory repository
  - `product.lua` - HTTP-based state management Lua hooks
  - `quilt.yaml` - Test scenarios

- `quilt-postgres/` - Quilt test definitions for PostgreSQL
  - `product-postgres.lua` - Direct database state manipulation Lua hooks
  - `quilt.yaml` - Test scenarios (identical to quilt/)

- `automation/` - Test automation
  - `drift.js` - Quilt test runner
  - `setup-postgres-state-http.js` - State management HTTP server
  - `test.routes.js` - HTTP test endpoints
