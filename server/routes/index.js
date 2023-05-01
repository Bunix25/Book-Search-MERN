const router = require('express').Router();
const path = require('path');
const apiRoutes = require('./api');

// Use the apiRoutes middleware for any routes starting with "/api"
router.use('/api', apiRoutes);

// Serve the React front-end in production by sending the index.html file in the build folder
router.use((req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

module.exports = router;

