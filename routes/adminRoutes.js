'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const adminController = require('../controllers/adminController');
const {authorizeRoles, checkUserExistInApp} = require('../middlewares/auth');


/* Middleware to check whether requesting user exist in app or not */
router.use(passport.authenticate('oauth-bearer', {session: false}), checkUserExistInApp
// , authorizeRoles('Admin, Recruiter')
);

router.post('/appUser', adminController.createAppUser);
router.put('/appUser/:user_id', adminController.updateAppUser);

router.get('/tenantUsers', adminController.getAllTenantUsers);
router.get('/guestUsers', adminController.getAllGuestUsers);

router.post('/mailRemainder', adminController.createMailRemainder);
router.put('/mailRemainder/:templateId', adminController.updateMailRemainder);
router.get('/getMailRemainder', adminController.getMailRemainder);

router.get('/getMailRemainder/:status_id', adminController.statusMailRemainder);
router.delete('/candidate/:candidate_id', adminController.updateCandidateStatus);
// router.put('/updateDuration/:status_id', adminController.updateEmailTemplatesDuration);

router.post('/addRole', adminController.addRole);
router.get('/roles', adminController.getRoles);
router.post('/assignRole', adminController.assignRoleToUser);

router.get('/hr', adminController.getHr);






module.exports = router;