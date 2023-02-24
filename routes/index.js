'use strict';

const express = require('express');
const router = express.Router();
const appRouter = require('./appRoutes');
const adminRouter = require('./adminRoutes');
const metaDataRouter = require('./metaDataRoutes');
const appController = require('../controllers/appController');

// offer letter template generation route
router.get('/download', appController.generateOfferLetter);
router.post('/Salary',appController.generateSalary);
router.get('/SalaryAll',appController.getAllCandidateSalary);
router.get('/salary/:CandidateSalaryId',appController.getSalarybyId)
router.put('/candidateSalary/:CandidateSalaryId',appController.updateCandidateSalary)


router.use(appRouter);
router.use(metaDataRouter);
router.use(adminRouter);

module.exports = router;