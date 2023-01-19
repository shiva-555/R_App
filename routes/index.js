'use strict';

const express = require('express');
const router = express.Router();
const appRouter = require('./appRoutes');
const adminRouter = require('./adminRoutes');
const metaDataRouter = require('./metaDataRoutes');

router.use(metaDataRouter);
router.use(appRouter);
router.use(adminRouter);

module.exports = router;