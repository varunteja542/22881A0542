const express = require('express');
const cors = require('cors');
const app=express();
const port=3000;
const routes = require('./router/routes.js');
app.use(cors());
const logMiddleware = require('../LoggingMiddleware/log'); 

app.use(express.json());
app.use(logMiddleware); 
// const logger = require('../LoggingMiddleware/log');
// app.use(logger);
app.use('/', routes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
