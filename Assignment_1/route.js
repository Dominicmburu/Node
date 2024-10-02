import chalk from 'chalk'
import { uuid } from 'uuidv4';
import products from './db.js';

let all_pproducts = [...products];

const router = async (req, res) => {
    const { url, method } = req

    const sendJSONResponse = (statusCode, data) => {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(data));
    }

    // GET ALL PRODUCTS
    if(url === '/products' && method === 'GET'){
        if(all_pproducts.length > 0){
            sendJSONResponse(200, all_pproducts);
        }
        else{
            sendJSONResponse(404, {message: 'No products found'});
        }
    }
}

export default router