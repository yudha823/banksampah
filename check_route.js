const express = require('express');
const router = express.Router();
const checkController = require('../controllers/check_controller');

router.get('/test_api', checkController.test_api);

module.exports = router;
