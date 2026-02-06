// Test-only routes for setting up and tearing down test state for API testing
const router = require('express').Router();
const controller = require('../src/product/product.controller');
const Product = require('../src/product/product');

// Production guard - these routes should ONLY be available in test environments
const testOnlyGuard = (req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error('Test endpoint accessed outside of test environment');
        res.status(403).send({ message: 'Test endpoints are not available in this environment' });
        return;
    }
    next();
};

// State setup handlers - executed before each operation
const setupStateHandlers = {
    // getAllProducts operations - no special setup needed
    getAllProducts_Success: async (repo) => {
        await repo.setupProducts([
            new Product(9, "CREDIT_CARD", "Gem Visa", "v1"),
            new Product(10, "CREDIT_CARD", "28 Degrees", "v1"),
            new Product(11, "PERSONAL_LOAN", "MyFlexiPay", "v2"),
        ]);
    },
    getAllProducts_Unauthorized: async (repo) => {
        // No special state needed for unauthorized test
        await repo.resetProducts();
    },

    // createProduct operations - no special setup needed (creating new products)
    createProduct_Success: async (repo) => {
        await repo.resetProducts();
    },
    createProduct_SuccessWithExample: async (repo) => {
        await repo.resetProducts();
    },
    createProduct_Unauthorized: async (repo) => {
        await repo.resetProducts();
    },

    // getProductByID operations - setup depends on scenario
    getProductByID_Success: async (repo) => {
        // Product with ID 10 should exist
        await repo.setupProducts([
            { id: 10, type: "CREDIT_CARD", name: "28 Degrees", version: "v1" }
        ]);
    },
    getProductByID_InvalidID: async (repo) => {
        // State doesn't matter for invalid ID validation
        await repo.resetProducts();
    },
    getProductByID_NotFound: async (repo) => {
        // Database should be empty so product 99999 is not found
        await repo.setupProducts([]);
    },
    getProductByID_Unauthorized: async (repo) => {
        // State doesn't matter for authorization test
        await repo.resetProducts();
    },
};

// POST /test/setup/:operationId - Setup state before an operation
router.post('/test/setup/:operationId', testOnlyGuard, async (req, res) => {
    try {
        const operationId = req.params.operationId;
        
        if (!setupStateHandlers[operationId]) {
            return res.status(400).send({ 
                message: `Unknown operation: ${operationId}`,
                availableOperations: Object.keys(setupStateHandlers)
            });
        }

        // Get the initialized repository
        const repo = await controller.initializeRepository();
        
        // Execute the setup handler
        await setupStateHandlers[operationId](repo);
        
        res.status(200).send({ 
            message: `Successfully set up state for operation: ${operationId}` 
        });
    } catch (error) {
        console.error('Error setting up state:', error);
        res.status(500).send({ 
            message: 'Error setting up state',
            error: error.message 
        });
    }
});

// POST /test/teardown/:operationId - Teardown/cleanup state after an operation
router.post('/test/teardown/', testOnlyGuard, async (req, res) => {
    try {
        await repo.resetProducts();
        
        res.status(200).send({ 
            message: `Successfully tore down state for operation: ${operationId}` 
        });
    } catch (error) {
        console.error('Error tearing down state:', error);
        res.status(500).send({ 
            message: 'Error tearing down state',
            error: error.message 
        });
    }
});

// GET /test/operations - List available operations
router.get('/test/operations', testOnlyGuard, (req, res) => {
    res.status(200).send({
        availableOperations: Object.keys(setupStateHandlers)
    });
});

module.exports = router;
