const express = require('express');
const path = require('path');


const app = express();


const routes = require('./lib/routes/routes.js');


app.use(express.json());


app.use(routes);


app.use(express.static(path.join(__dirname, 'lib', 'public'), { extensions: ['html'] }));


const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
    console.log(`Application server is listening on http://localhost:${PORT}/`);
});
