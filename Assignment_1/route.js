import fs from 'fs';
import path from 'path';
import products from './db.js';

let all_products = [...products];

const updateDatabaseFile = (updatedProducts) => {
    const dbPath = path.resolve('db.js');
    const updatedContent = `let products = ${JSON.stringify(updatedProducts, null, 2)};\n\nexport default products;`;
    fs.writeFileSync(dbPath, updatedContent, 'utf8');
};

const router = async (req, res) => {
    const { url, method } = req;

    const sendJSONResponse = (statusCode, data) => {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(data));
    };

    // GET ALL PRODUCTS
    if (url === '/products' && method === 'GET') {
        sendJSONResponse(200, all_products);
    }

    // ADD A NEW PRODUCT
    else if (url === '/products' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { imageUrl, title, price, date, location, company } = JSON.parse(body);
            const newID = all_products.length > 0 ? all_products[all_products.length - 1].id + 1 : 1;
            const newProduct = {
                id: newID,
                imageUrl,
                title,
                price,
                date,
                location,
                company,
            };

            all_products.push(newProduct);
            updateDatabaseFile(all_products);
            sendJSONResponse(201, { message: "New product added", product: newProduct });
        });
    }

    // UPDATE A SPECIFIC PRODUCT
    else if (url.match(/\/products\/\d+/) && method === "PUT") {
        const id = parseInt(url.split("/")[2]);
        let body = '';
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const { imageUrl, title, price, date, location, company } = JSON.parse(body);
            const updateData = { imageUrl, title, price, date, location, company };

            const productIndex = all_products.findIndex(product => product.id === id);

            if (productIndex !== -1) {
                const updatedProd = { ...all_products[productIndex], ...updateData };
                all_products[productIndex] = updatedProd;

                updateDatabaseFile(all_products);
                sendJSONResponse(200, { message: "Product updated", product: updatedProd });
            } else {
                sendJSONResponse(404, { message: "Product not found" });
            }
        });
    }

    // DELETE A PRODUCT
    else if (url.match(/\/products\/\d+/) && method === "DELETE") {
        const id = parseInt(url.split("/")[2]);
        const prodIndex = all_products.findIndex(p => p.id === id);

        if (prodIndex !== -1) {
            all_products = all_products.filter(p => p.id !== id);
            updateDatabaseFile(all_products);
            sendJSONResponse(204, { message: 'Product deleted' });
        } else {
            sendJSONResponse(404, { message: 'Product not found' });
        }
    }

    // VIEW A SPECIFIC PRODUCT
    else if (url.match(/\/products\/\d+/) && method === "GET") {
        const id = parseInt(url.split("/")[2]);
        const product = all_products.find(p => p.id === id);

        if (product) {
            sendJSONResponse(200, product);
        } else {
            sendJSONResponse(404, { message: "Product not found" });
        }
    }

    // HANDLE UNKNOWN ROUTE
    else {
        sendJSONResponse(404, { message: 'Route not found' });
    }
};

export default router;
