
const router = require('express').Router();


const notes = require('./api/notes');


router.use('/api/notes', notes);


module.exports = router;
