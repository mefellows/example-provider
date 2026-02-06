// Set repository type for this test suite
process.env.REPOSITORY_TYPE = 'postgres';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '5432';
process.env.DB_USER = process.env.DB_USER || 'postgres';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
process.env.DB_NAME = process.env.DB_NAME || 'product_service';

const { runQuilt } = require('../../automation/drift');
const controller = require('./product.controller');
const bodyParser = require('body-parser');

// Setup provider server to verify
const app = require('express')();
const authMiddleware = require('../middleware/auth.middleware');
app.use(bodyParser.json());
app.use(authMiddleware);
app.use(require('./product.routes'));
app.use(require('../../automation/test.routes')); // Test only routes for setting up test state
const server = app.listen("8080");

describe("API Tests with Quilt - PostgreSQL", () => {
  // Ensure server and pg connection are closed
  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    const repo = controller.getRepository();
    if (repo && typeof repo.close === 'function') {
      await repo.close();
    }
  });

  it("Validates the API conforms to its OpenAPI Description using PostgreSQL", async () => {
    const exitCode = await runQuilt('postgres');
    expect(exitCode).toBe(0);
  })
});
