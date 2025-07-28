const express = require('express');
const cors = require('cors');
const app=express();
const routes = require('./router/routes.js');
app.use(cors());
app.use(express.json());
const port=3000;
// const logger = require('../LoggingMiddleware/log');
// app.use(logger);
app.use('/', routes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
