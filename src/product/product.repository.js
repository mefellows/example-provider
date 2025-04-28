const Product = require('./product');

const products = [
    ["09", new Product("09", "CREDIT_CARD", "Gem Visa", "v1")],
    ["10", new Product("10", "CREDIT_CARD", "28 Degrees", "v1")],
    ["11", new Product("11", "PERSONAL_LOAN", "MyFlexiPay", "v2")],
];
class ProductRepository {

    constructor() {
        this.products = new Map(products);
    }

    async fetchAll() {
        return [...this.products.values()]
    }

    async getById(id) {
        return this.products.get(id);
    }

    async add(product) {
        return this.products.set(product.id, product);
    }
    
    setupProducts(products) {
        this.products = new Map();

        for (var product_id in products) {
            const product = products[product_id];
            this.products.set(product.id, new Product(product.id, product.type, product.name, product.version))
        }
    }

    resetProducts() {
        this.products = new Map(products);
    }
}

module.exports = ProductRepository;
