'use strict';

const express = require('express');
const metaDataController = require('../controllers/metaDataController');
const router = express.Router();
const { checkUserExistInApp, authorizeRoles} = require('../middlewares/auth');
const passport = require('passport');

router.use(passport.authenticate('oauth-bearer', { session: false }), checkUserExistInApp);

router.get('/metaData', metaDataController.getMetaData);

router.post('/metaData', metaDataController.createMetaData,authorizeRoles('Admin'));

router.put('/metaData/:meta_data_id', metaDataController.updateMetaData,authorizeRoles('Admin'));

module.exports = router;