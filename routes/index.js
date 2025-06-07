const router = require('express').Router();
const userRoutes = require('./api/userRoutes');
// Will add thoughtRoutes later

router.use('/api/users', userRoutes);
router.use((req, res) => res.status(404).send('Not Found'));

module.exports = router;
