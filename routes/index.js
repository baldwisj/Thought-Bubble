const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);
router.use((req, res) => res.send('Route Does Not Exist'));

module.exports = router;