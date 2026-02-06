// Set repository type for this test suite
process.env.REPOSITORY_TYPE = 'inmemory';

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

describe("API Tests with Drift", () => {
  // Ensure server and pg connection are closed
  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    const repo = controller.getRepository();
    if (repo && typeof repo.close === 'function') {
      await repo.close();
    }
  });

  it("Validates the API comforms to its OpenAPI Description", async () => {
    const exitCode = await runQuilt();
    expect(exitCode).toBe(0);
  })
});
