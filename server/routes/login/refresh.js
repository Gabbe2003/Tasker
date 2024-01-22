const express = require('express');
const router = express.Router();
const { handleRefreshToken } = require('../../controllers/log/refreshHanlder');

router.post('/', handleRefreshToken);

module.exports = router;
