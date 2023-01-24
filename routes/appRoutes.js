'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const appController = require('../controllers/appController');
const { authorizeRoles, checkUserExistInApp } = require('../middlewares/auth');
const { Validator } = require("express-json-validator-middleware");
const { validate } = new Validator();
const candidateSchema = require('../middlewares/candidateValidation');

const multer = require('multer');
const upload  = multer();

/* Middleware to check whether requesting user exist in app or not */
router.use(passport.authenticate('oauth-bearer', {session: false}), checkUserExistInApp);

/* User Routes */
router.get('/user', appController.getUser);
router.get('/appUsers', appController.getAppUsers);
router.get('/appUsers/:userId', appController.getAppUser);

/* Candidate Routes */
router.get('/candidates', authorizeRoles('Recruiter', 'Admin', 'TA Manager', 'HR'), appController.getCandidates);

router.post('/candidate', authorizeRoles('Recruiter','Admin', 'TA Manager', 'Admin'),
//  validate({body: candidateSchema}), 
 appController.createCandidate);
router.get('/candidate/:candidateId',authorizeRoles('Recruiter', 'Admin', 'TA Manager', 'HR'), appController.getCandidate)
router.put('/candidate/:candidateId',authorizeRoles('Recruiter', 'Admin', 'TA Manager', 'HR'), appController.updateCandidate);
router.post('/uploadDocuments', upload.single('file'), appController.uploadDocuments);
router.post('/candidate/:candidate_id/interview', authorizeRoles('Recruiter', 'Admin'), appController.scheduleInterview);
router.put('/candidate/:candidate_id/interview/:interview_id', appController.updateInterview);
router.get('/candidateReport', appController.getCandidatesReport);



/* Job Requisitions*/
//! Need to Add H Code
router.get('/jobRequisitions', authorizeRoles('Recruiter', 'Admin', 'TA Manager', 'HR'),appController.getJobRequisitions);
// router.post('/jobRequisition', upload.single('file'), appController.createJobRequisition, authorizeRoles('Admin', 'Recruitement Manager', 'Hiring Manager'));
// router.put('/jobRequisition/:job_id', upload.single('file'), appController.updateJobRequisition, authorizeRoles('Admin', 'Recruitement Manager', 'Hiring Manager'));
router.get('/getAllJobRequisitions',authorizeRoles('Recruiter', 'Admin', 'TA Manager', 'HR'), appController.getAllJobRequisitions)


/* Dashboard*/
router.get('/dashboard', authorizeRoles('Recruiter', 'Admin', 'TA Manager', 'HR'), appController.getDashboard);

/** Referal */
router.get('/getReferralByuserid', appController.getReferralByUserId);
// router.get('/getReferralByJobid', appController.getReferralByJob_id);
router.put('/assignCandidateToRecruiter/:candidateId', appController.assignCandidateToRecruiter); 
router.get('/getJobAssignedRecruiter', appController.getJobAssignedRecruiter)
// router.put('/assignCandidateToRecruiter/:candidate_id', appController.assignCandidateToRecruiter); 
// router.get('/getJobAssignedRecruiter', appController.getJobAssignedRecruiter)


module.exports = router;