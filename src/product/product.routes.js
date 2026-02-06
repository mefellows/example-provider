const router = require('express').Router();
const controller = require('./product.controller');

router.get("/products/:id", controller.getById);
router.get("/products", controller.getAll);
router.post("/products", controller.create);
router.post("/admin", controller.admin);

/// Test routes
if (process.env.NODE_ENV === 'test') {
  console.log('registering dev endpoints')
  router.post("/setup", controller.setup);
  router.post("/teardown", controller.teardown);
}

module.exports = router;
