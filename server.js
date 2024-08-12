// Initialize express server
const express = require('express');

const routes = require('./lib/routes/routes.js');

// Assigning the express server to the app variable so that we can use it in other files instead of using express() function again.
const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Setting up the middleware for api routes
app.use(routes);

// Setting up the middleware for Public folder
app.use(express.static('./lib/public', { extensions: ['html'] }));

// Assigning the port number to the PORT variable so that we can use it in other files instead of using the port number again.
const PORT = process.env.PORT || 3001;





app.listen(PORT, () => {
    console.log(`Application server is listening on http://localhost port: ${PORT}!`);
});
