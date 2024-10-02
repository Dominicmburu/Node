import http from 'http'
import morgan from 'morgan'
import chalk from 'chalk';
import router from './route.js';

// CREATE SERVER
const server = http.createServer((req, res) => {
    router(req, res);
})

// LISTEN TO SERVER
const PORT = 3000;
const HOST = 'localhost'
server.listen(PORT, HOST, () => {
    console.log(chalk.green(`Server is running on http://${HOST}:${PORT}`));
})


