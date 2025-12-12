const Product = require("./product");
const ProductRepository = require("./product.repository");

const repository = new ProductRepository();

exports.admin = async (req, res) => {
    console.log("admin");
    console.log(req.body);

    res.status(200).send();
};

exports.getAll = async (req, res) => {
    console.log("getAll");
    res.send(await repository.fetchAll())
};
exports.getById = async (req, res) => {
    console.log("getById", req.params.id);
    if (!req.params.id || Number.isNaN(parseInt(req.params.id)) ) {
        res.status(400).send({message: "Product ID is required"});
        return;
    }
    const product = await repository.getById(req.params.id);
    product ? res.send(product) : res.status(404).send({message: "Product not found"})
};
exports.create = async (req, res) => {
    console.log("create", req.body);
    try {
        const product = new Product(req.body.id, req.body.type, req.body.name, req.body.version);
        await repository.add(product);
        res.status(201).send()
    } catch (e) {
        res.status(400).send({message: "Invalid product"})
    }
};

exports.setup = async (req, res) => {
    console.log('setup', req.body)
    repository.setupProducts(req.body.products)
    res.status(200).send()
};

exports.teardown = async (req, res) => {
    console.log('teardown')
    repository.resetProducts()
    res.status(200).send()
};

exports.repository = repository;