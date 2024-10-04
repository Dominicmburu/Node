import http from 'http';
import morgan from 'morgan';
import chalk from 'chalk';
import router from './route.js';
import cors from 'cors';
import express from 'express';

// Set up express app for middleware
const app = express();
app.use(cors());  // Allow all origins to access the server
app.use(express.json());
app.use((req, res) => router(req, res));

// CREATE SERVER
const server = http.createServer(app);

// LISTEN TO SERVER
const PORT = 3000;
const HOST = 'localhost';
server.listen(PORT, HOST, () => {
    console.log(chalk.green(`Server is running on http://${HOST}:${PORT}`));
});
