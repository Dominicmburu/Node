const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const productsFilePath = path.join(__dirname, 'products.json');

// Utility function to read products from the JSON file
function readProducts() {
    const fileContent = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(fileContent);
}

// Utility function to write products to the JSON file
function writeProducts(products) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 4));
}

// Get all products
router.get('/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// Add a new product
router.post('/products', (req, res) => {
    const products = readProducts();
    const newProduct = req.body;
    newProduct.id = uuidv4(); // Generate a unique ID using uuid
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
});

// Update a product
router.put('/products/:id', (req, res) => {
    const products = readProducts();
    const productId = req.params.id;
    const updatedProduct = req.body;

    const productIndex = products.findIndex((product) => product.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        writeProducts(products);
        res.json({ message: 'Product updated successfully', product: products[productIndex] });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Delete a product
router.delete('/products/:id', (req, res) => {
    const products = readProducts();
    const productId = req.params.id;

    const newProducts = products.filter((product) => product.id !== productId);
    if (newProducts.length === products.length) {
        return res.status(404).json({ message: 'Product not found' });
    }

    writeProducts(newProducts);
    res.json({ message: 'Product deleted successfully' });
});

// Get product details by ID
router.get('/products/:id', (req, res) => {
    const products = readProducts();
    const productId = req.params.id;
    const product = products.find((product) => product.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Filter products by title and company
router.get('/products/filter', (req, res) => {
    const { title, company } = req.query;
    let products = readProducts();

    if (title) {
        products = products.filter((product) => product.title.toLowerCase().includes(title.toLowerCase()));
    }
    if (company) {
        products = products.filter((product) => product.company.toLowerCase().includes(company.toLowerCase()));
    }

    res.json(products);
});

module.exports = router;
