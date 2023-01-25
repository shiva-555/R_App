'use strict';

const db = require('../models/indexModel');
const { User } = db;
const { Candidate } = db;
const { MetaData } = db;
const { CandidateStatusHistory } = db;
const { JobRequisition } = db;
const { JobAssignment } = db;
const { Interview } = db;
const { RoleAssignment } = db;
const { Role } = db;
const { ReferralCandidate } = db;
const { Op } = db;
const { sequelize } = db;
const moment = require('moment');
const logger = require('../utils/logger');
const commonFunctions = require('../utils/commonFunctions');
const responseFormatter = require('../utils/responseFormatter');
const axios = require('axios');

exports.getUser = async (req, res) => {
    return res.status(200).json(responseFormatter.responseFormatter(req.user, 'user fetched successfully', 'success', 200));
};

exports.getAppUser = async (req, res) => {
    let user;

    try {
        user = await User.findByPk(req.params.userId, { where: { status: 'Active' } });
    } catch (e) {
        logger.error('Error occurred while finding user in getAppUser controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (!user) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such user', 'unsuccessful', 404));
    }

    return res.status(200).json(responseFormatter.responseFormatter(user, 'fetched successful', 'success', 200));
};

exports.getAppUsers = async (req, res) => {
    let users, searchCriteria = {}, includeCriteria = [];

    searchCriteria.status = 'Active';
    searchCriteria.email = {
        [Op.like]: `%${req.query.email ? req.query.email : ''}%`
    };

    includeCriteria.push({
        model: RoleAssignment,
        as: 'roleAssignments',
        required: true,
        include: {
            model: Role,
            as: 'role',
            // where: {
            //     roleName: req.query.role
            // }
        }
    });

    try {
        users = await User.findAll({
            where: searchCriteria,
            include: includeCriteria
        });
    } catch (e) {
        console.log(e);
        logger.error('Error occurred while finding users in getAppUsers controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(users, 'fetched successful', 'success', 200));
};

//! need to validate //! Add role 
exports.getCandidates = async (req, res) => {
    try {
        let childUsers, userIds = [req.user.userId], candidates = [], searchCriteria = {}, includeCriteria = [], limit, offset;

        /* Getting Role of requesting user */
        const role = req.user.roleAssignments.role;

        /* Finding all child users */
        try {
            childUsers = await req.user.getChilderens();
        } catch (e) {
            logger.error('Error occurred while getting child usres in getCandidates controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        if (childUsers && childUsers.length > 0) {
            const len = childUsers.length;
            for (let i = 0; i < len; i++) {
                userIds.push(childUsers[i].userId);
            }
        }

        if (req.query.user) {
            searchCriteria.createById = req.query.user;
        }

        if (req.query.status) {
            searchCriteria.candidateStatusId = req.query.status;
        }

        if (req.query.job) {
            searchCriteria.jobId = req.query.job;
        }

        if (req.query.company) {
            searchCriteria.company = req.query.company;
        }

        includeCriteria.push(
            {
                model: JobRequisition,
                as: 'jobTitle'
            },
            {
                model: MetaData,
                as: 'candidateStatus'
            },
        );

        if (role.candidatesView) {
            if (!role.candidatesView.showAll) {

                if (role.candidatesView.isHierarchy) {
                    searchCriteria[Op.or] = [
                        {
                            createdById: {
                                [Op.in]: userIds
                            }
                        },
                        {
                            hrId: {
                                [Op.in]: userIds
                            }
                        }
                    ]
                }

                if (role.candidatesView.statusWise) {
                    includeCriteria.push({
                        model: MetaData,
                        as: 'candidateStatus',
                        required: true,
                        where: {
                            displayText: {
                                status: {
                                    [Op.in]: role.candidatesView.status
                                }
                            }
                        },
                    });
                }

            }
        } else {
            return res.status(400).json(responseFormatter.responseFormatter({}, 'Candidates view is not assigned to this role', 'bad request', 400));
        }

        if (req.query.page) {
            offset = req.query.page == 1 ? 0 : parseInt(req.query.page) * 20;
            limit = 20;
        }

        try {
            candidates = await Candidate.findAndCountAll({
                where: searchCriteria,
                include: includeCriteria,
                limit,
                offset
            });
        } catch (e) {
            logger.error('Error occurred while finding candidates in getCandidates controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        /* success */
        return res.status(200).json(responseFormatter.responseFormatter(candidates, 'candidates fetched successfully', 'success', 200));
    } catch (e) {
        logger.error('Error occurred in getCandidates controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }
};

//! getting error at organization VIew
exports.getCandidate = async (req, res) => {
    let candidate;

    try {
        candidate = await Candidate.findOne({
            where: {
                candidateId: req.params.candidateId,
            },
            include: [
                {
                    model: MetaData,
                    as: 'candidateStatus'
                },
                {
                    model: Interview,
                    as: 'interviews',
                    include: [
                        {
                            model: JobRequisition,
                            as: 'jobTitle',
                        }
                    ]
                },
                {
                    model: JobRequisition,
                    as: 'jobTitle',
                },
                {
                    model: User,
                    as: 'createdBy',
                },
            ],
            order: [[{ model: Interview, as: 'interviews' }, 'createdDate', 'DESC']],
        });
    } catch (e) {
        logger.error('Error occurred while finding candidate in getCandidate controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(candidate, 'Candidate fetched successfully', 'success', 200));
};

//! need to add request body validation
exports.createCandidate = async (req, res) => {
    let checkJob, checkCandidate, candidate, isJobRequisitionAssinged, candidateRole;

    try {
        console.log(req.body);
        checkJob = await JobRequisition.findByPk(req.body.jobId);
    } catch (e) {
        console.log(e);
        logger.error('Error occurred while finding job in createCandidate controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (!checkJob) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'no such job', 'Bad Request', 404));
    }

    try {
        checkCandidate = await Candidate.findOne({
            where: {
                candidateEmail: req.body.candidateEmail,
                jobId: req.body.jobId
            }
        })
    } catch (e) {
        logger.error('Error occurred while finding candidate in createCandidate controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (checkCandidate) {
        return res.status(400).json(responseFormatter.responseFormatter({}, 'Candidate with this email already applied for this job', 'Bad Request', 400));
    }

    if (req.user.roleAssignments.role.roleName === 'Recruiter') {
        try {
            isJobRequisitionAssinged = await JobAssignment.findOne({
                where: {
                    jobId: req.body.jobId,
                    userId: req.user.userId
                }
            });
        } catch (e) {
            logger.error('Error occurred checking assignment of job requisition to recruiter in createCandidate controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        if (!isJobRequisitionAssinged) {
            return res.status(400).json(responseFormatter.responseFormatter({}, 'You can only create canidate entry for the job that are assigned to you', 'Bad Request', 400))
        }
    }

    req.body.createdById = req.user.userId;
    req.body.lastModifiedById = req.user.userId;

    try {
        candidate = await Candidate.create(req.body);
    } catch (e) {
        logger.error('Error occurred while creating candidate in createCandidate controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    // try {
    //     candidateRole = await RoleAssignment.findOne({
    //         roleName: 'Candidate'
    //     });
    // } catch (e) {
    //     logger.error('Error occurred while finding candidate role in createCandidate controller %s:', JSON.stringify(e));
    //     return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    // }

    // try {
    //     await RoleAssignment.create({
    //         candidateId: candidate.candidateId,
    //         roleId: candidateRole.roleId,
    //         createdById: candidate.createdById,
    //         lastModifiedById: candidate.lastModifiedById
    //     })
    // } catch (e) {
    //     logger.error('Error occurred while assinging candidate role in createCandidate controller %s:', JSON.stringify(e));
    //     return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    // }

    if (req.body.candidateStatusId) {
        try {
            await CandidateStatusHistory.create({
                candidateStatusId: req.body.candidateStatusId,
                candidateId: candidate.candidateId,
                createdById: candidate.createdById,
                lastModifiedById: candidate.lastModifiedById
            });
        } catch (e) {
            logger.error('Error occurred while saving candidate status history in createCandidate hook %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }
    }

    if (req.body.isReferal) {
        try {
            await ReferralCandidate.create({
                candidateId: candidate.candidateId,
                userId: req.user.userId,
                createdById: req.user.userId,
                lastModifiedById: req.user.userId
            });
        } catch (e) {
            logger.error('Error occurred while creating candidate referal in createCandidate controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }
    }

    try {
        candidate = await Candidate.findByPk(candidate.candidateId, {
            include: [
                {
                    model: MetaData,
                    as: 'candidateStatus',
                    attributes: ['metaDataId', 'displayText']
                },
                {
                    model: MetaData,
                    as: 'source',
                    attributes: ['metaDataId', 'displayText']
                },
                {
                    model: MetaData,
                    as: 'jobLocation',
                    attributes: ['metaDataId', 'displayText']
                },
                {
                    model: JobRequisition,
                    as: 'jobTitle',
                    attributes: ['jobId', 'jobTitle', 'jobCode']
                },
                {
                    model: User,
                    as: 'createdBy',
                    attributes: ['userId', 'displayName']
                }
            ]
        });
    } catch (e) {
        logger.error('Error occurred while finding candidate in createCandidate controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(201).json(responseFormatter.responseFormatter(candidate, 'Candidate created successfully', 'success', 201));
};

//! need to add request body validation
exports.updateCandidate = async (req, res) => {
    let candidate, isJobRequisitionAssinged, currentDate, statuses, isMailsent = true;

    console.log(req.body)
    try {
        candidate = await Candidate.findByPk(req.params.candidateId, {
            include: [
                {
                    model: Interview,
                    as: 'interviews'
                },
                {
                    model: User,
                    as: 'createdBy',
                },

                {
                    model: JobRequisition,
                    as: 'jobTitle'
                },

                {
                    model: MetaData,
                    as: 'candidateStatus',
                },
            ]
        });
    } catch (e) {
        console.log(e);
        logger.error('Error occurred while finding candidate in updateCandidate controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (!candidate) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such candidate', 'unsuccessful', 404));
    }

    if (req.user.roleAssignments.role.roleName === 'Recruiter') {
        try {
            isJobRequisitionAssinged = await JobAssignment.findOne({
                where: {
                    jobId: candidate.jobId,
                    userId: req.user.userId,
                }
            });
        } catch (e) {
            console.log(e);
            logger.error('Error occurred checking assignment of job requisition to recruiter in updateCandidate controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        if (!isJobRequisitionAssinged) {
            return res.status(400).json(responseFormatter.responseFormatter({}, 'You can only update canidate entry for the job that are assigned to you', 'Bad Request', 400))
        }
    }

    try {
        statuses = await MetaData.findAll({ where: { metaDataType: 'candidate_status', status: 'Active' } });
    } catch (e) {
        logger.error('Error occurred while finding candidate statuses in updateCandidate controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    //! Need to verify 
    if (req.body.candidateStatusId) {
        if (candidate.candidateStatusId !== req.body.candidateStatusId) {
            for (let i = 0; i < statuses.length; i++) {
                if (statuses[i].displayText.status === 'Offered') {
                    if (statuses[i].metaDataId === req.body.candidateStatusId) {
                        if (!req.body.offerDate) {
                            req.body.offerDate = new Date();
                        }
                    }
                }
                else if (statuses[i].displayText.status === 'Doc Verification Completed') {
                    if (statuses[i].metaDataId === req.body.candidateStatusId) {
                        if (!req.body.documentVerificationInitiatedOn) {
                            req.body.documentVerificationInitiatedOn = new Date();
                        }
                        if (!req.body.documentVerificationInitiatedOn && req.body.tentativeDateOfJoining) {
                            req.body.documentVerificationInitiatedOn = new Date();
                            req.body.tentativeDateOfJoining = new Date(req.body.tentativeDateOfJoining);
                        }
                    }
                }
                else if (statuses[i].displayText.status === 'Joined') {
                    if (statuses[i].metaDataId === req.body.candidateStatusId) {
                        if (!req.body.joiningDate) {
                            req.body.joiningDate = new Date();
                        }
                    }
                }
                else if (statuses[i].displayText.status === 'Selected') {
                    if (statuses[i].metaDataId === req.body.candidateStatusId) {
                        if (!req.body.selectedRejectedDate) {
                            req.body.selectedRejectedDate = new Date();
                        }
                    }
                }
                else if (statuses[i].displayText.status === 'Rejected') {
                    if (statuses[i].metaDataId === req.body.candidateStatusId) {
                        if (!req.body.selectedRejectedDate) {
                            req.body.selectedRejectedDate = new Date();
                        }
                    }
                }

            }
            try {
                await commonFunctions.sendMailFromGeneralTemplate(req.body.candidateStatusId, candidate);
            } catch (e) {
                isMailsent = false;
                logger.error('Error occurred while sending mail candidate in updateCandidate controller %s:', JSON.stringify(e));
                return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
            }
        }
    }

    req.body.lastModifiedById = req.user.userId;


    try {
        await Candidate.update(req.body, { where: { candidateId: candidate.candidateId } });
    } catch (e) {
        console.log(e);
        logger.error('Error occurred while updating candidate in updateCandidate controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (req.body.candidateStatusId) {
        try {
            await CandidateStatusHistory.create({
                candidateStatusId: req.body.candidateStatusId,
                candidateId: candidate.candidateId,
                createdById: candidate.lastModifiedById,
                lastModifiedById: candidate.lastModifiedById
            });
        } catch (e) {
            logger.error('Error occurred while saving candidate status history in createCandidate hook %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }
    }

    try {
        candidate = await Candidate.findByPk(candidate.candidateId, {
            include: [
                {
                    model: MetaData,
                    as: 'source',
                    attributes: ['metaDataId', 'displayText']
                },
                {
                    model: MetaData,
                    as: 'jobLocation',
                    attributes: ['metaDataId', 'displayText']
                },
                {
                    model: JobRequisition,
                    as: 'jobTitle',
                    attributes: ['jobId', 'jobTitle', 'jobCode']
                },
                {
                    model: User,
                    as: 'createdBy',
                    attributes: ['userId']
                },
                {
                    model: MetaData,
                    as: 'candidateStatus',
                    attributes: ['metaDataId', 'displayText']
                },
            ],
            raw: true,
            nest: true
        });
    } catch (e) {
        logger.error('Error occurred while finding candidate in updateCandidate controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    candidate.isMailSent = isMailsent;

    return res.status(200).json(responseFormatter.responseFormatter(candidate, 'Candidate updated successfully', 'success', 200));
};

//! need to append document details
exports.uploadDocuments = async (req, res, next) => {
    let candidate;


    if (!req.body.candidateId) {
        return res.status(400).json(responseFormatter.responseFormatter({}, 'candidate id is required', 'bad request', 400));
    }

    try {
        candidate = await Candidate.findByPk(req.body.candidateId);
    } catch (e) {
        logger.error('Error occurred while finding candidate in uploadDocuments controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (!candidate) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such candidate', 'bad request', 404));
    }

    if (req.body.delete) {
        if (candidate.documents && candidate.documents.length > 0) {
            try {
                let documents = candidate.documents;
                const document = documents.filter((document) => document.documentName === req.body.documentName);

                if (document[0].sharepointId) {
                    await commonFunctions.deleteDocumentFromSharepoint(document.sharepointId);
                }

                if (document[0].oneDriveId) {
                    await commonFunctions.deleteDocumentFromOneDrive(document.oneDriveId);
                }

                documents = documents.filter((document) => document.documentName !== req.body.documentName);
                await candidate.update({ documents: documents });
            } catch (e) {
                logger.error('Error occurred while deleting document in uploadDocuments controller %s:', JSON.stringify(e));
                return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
            }
        }
    }

    if (req.body.documentName === 'resume' && !req.body.delete) {
        let uploadedDocument, link;
        if (process.env.NODE_ENV === 'production') {
            const formData = new FormData();

            formData.append("document_fields.1", req.file.buffer, req.file.originalname);
            formData.append("job_id", candidate.jobId);
            formData.append("applicant_id", '0');
            formData.append("type", 'applyWithoutRegistration');
            formData.append("standard_fields.email", candidate.candidateEmail);
            formData.append("standard_fields.firstname", candidate.candidateName);

            try {
                uplaodOnCeipal = await axios.post('https://api.ceipal.com/T2wvS251Y1BDOE9sNTFtVHJ5elZtZz09/ApplyJobWithOutRegistrationCareerPage/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } catch (e) {
                logger.error('Error occurred while uploading candidate details to ceipal in createCandidate controller %s:', JSON.stringify(e));
                return res.status(500).json(responseFormatter.responseFormatter(e, 'Error occurred while uploading candidate details to ceipal', 'bad request', 500));
            }
        }

        //! uploading to OneDrive
        try {
            let folderName = candidate.candidateEmail;
            let fileExt = req.file.originalname.slice(req.file.originalname.lastIndexOf('.'));
            let filename = req.file.originalname.replace(fileExt, '');
            let path = `${folderName}/${filename}.${fileExt}`
            uploadedDocument = await commonFunctions.uploadResumeToOneDrive(path, req.file.buffer, req.file.mimetype);
        } catch (e) {
            logger.error('Error occurred while uploading resume to oneDrive in uploadDocuments controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        //! generating link of OneDrive
        if (uploadedDocument) {
            try {
                link = await commonFunctions.createOneDriveResumeLink(uploadedDocument.id);
            } catch (e) {
                logger.error('Error occurred while uploading resume to oneDrive in uploadDocuments controller %s:', JSON.stringify(e));
                return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
            }
        }

        //! updating candidate
        if (link) {
            if (candidate.documents && candidate.documents.length > 0) {
                let documents = candidate.documents;
                documents.push({ documentName: 'resume', oneDriveId: uploadedDocument.id, downloadLink: link.link.webUrl });
                try {
                    await candidate.update({ documents: documents });
                } catch (e) {
                    logger.error('Error occurred while creating document entry in uploadDocuments controller %s:', JSON.stringify(e));
                    return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
                }
            } else {
                let documents = [{ documentName: 'resume', oneDriveId: uploadedDocument.id, downloadLink: link.link.webUrl }];
                try {
                    await candidate.update({ documents: documents });
                } catch (e) {
                    logger.error('Error occurred while creating document entry in uploadDocuments controller %s:', JSON.stringify(e));
                    return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
                }
            }

        }
    }

    if (req.file && !req.body.delete) {
        let uploadedDocument;
        try {
            let folderName = candidate.candidateEmail;
            let fileExt = req.file.originalname.slice(req.file.originalname.lastIndexOf('.'));
            let filename = req.file.originalname.replace(fileExt, '');
            let path = `${folderName}/${filename}.${fileExt}`
            uploadedDocument = await commonFunctions.uploadDocumentsToSharepoint(path, req.file.buffer, req.file.mimetype);
        } catch (e) {
            console.log(e);
            logger.error('Error occurred while uploading document to sharepoint in uploadDocuments controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        //! updating candidate
        if (req.body.documentName !== 'resume') {
            if (uploadedDocument.webUrl) {
                if (candidate.documents && candidate.documents.length > 0) {
                    let documents = candidate.documents;
                    documents.push({ documentName: req.body.documentName, downloadLink: uploadedDocument.webUrl, sharepointId: uploadedDocument.id });
                    try {
                        await candidate.update({ documents: documents });
                    } catch (e) {
                        logger.error('Error occurred while creating document entry in uploadDocuments controller %s:', JSON.stringify(e));
                        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
                    }
                } else {
                    let documents = [{ documentName: req.body.documentName, downloadLink: uploadedDocument.webUrl, sharepointId: uploadedDocument.id }];
                    try {
                        await candidate.update({ documents: documents });
                    } catch (e) {
                        logger.error('Error occurred while creating document entry in uploadDocuments controller %s:', JSON.stringify(e));
                        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
                    }
                }
            }
        } else {
            if (uploadedDocument.webUrl) {
                if (candidate.documents && candidate.documents.length > 0) {
                    let documents = candidate.documents;
                    documents.forEach((document) => {
                        if (document.documentName === 'resume') {
                            document.sharepointId = uploadedDocument.id
                        }
                    });
                    try {
                        await candidate.update({ documents: documents });
                    } catch (e) {
                        logger.error('Error occurred while creating document entry in uploadDocuments controller %s:', JSON.stringify(e));
                        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
                    }
                }
            }
        }
    }

    try {
        candidate = await Candidate.findByPk(candidate.candidateId, {
            include: [
                {
                    model: MetaData,
                    as: 'candidateStatus'
                },
                {
                    model: MetaData,
                    as: 'source'
                },
                {
                    model: MetaData,
                    as: 'jobLocation'
                },
                {
                    model: JobRequisition,
                    as: 'jobTitle'
                },
                {
                    model: User,
                    as: 'createdBy'
                }
            ]
        });
    } catch (e) {
        console.log(e);
        logger.error('Error occurred while finding candidate in uploadDocuments controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(candidate, 'documents upload successfully', 'success', 200));
};

exports.scheduleInterview = async (req, res) => {
    let candidate, status, token, invite, mail, interview;

    console.log(req.params);
    try {
        candidate = await Candidate.findByPk(req.params.candidate_id, {
            include: [
                {
                    model: User,
                    as: 'createdBy'
                },
                {
                    model: JobRequisition,
                    as: 'jobTitle'
                }
            ]
        });

    } catch (e) {
        console.log(e);
        logger.error('Error occurred while finding candidate in scheduleInterview controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    try {
        // status = await MetaData.findOne({ where: { displayText: 'Scheduled',  metaDataType: 'candidate_status' } });
        status = await MetaData.findOne({ where: { displayText: { "status": { [Op.eq]: "Scheduled" } }, metaDataType: "candidate_status" } })
    } catch (e) {
        console.log(e);
        logger.error('Error occurred while finding meta data status in scheduleInterview controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (!status) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No status found', 'unsuccessful', 404));
    }

    if (!candidate) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such candidate', 'unsuccessful', 404));
    }

    req.body.createdById = req.user.userId;
    req.body.lastModifiedById = req.user.userId;
    req.body.candidateId = req.params.candidate_id;


    if (req.body.interviewStatus === 'Scheduled') {
        const time = req.body.interviewStartTime.split(':');

        const startTime = moment(req.body.interviewDate).startOf('day');
        startTime.set({ hour: time[0], minute: time[1], millisecond: 0 });
        // startTime.add(time[1], 'minutes'); 
        const start = startTime.format('YYYY-MM-DDTHH:mm:ss');

        const endTime = moment(startTime);
        endTime.add(req.body.interviewDuration, 'minutes');
        const end = endTime.format('YYYY-MM-DDTHH:mm:ss');

        // send calender invite
        try {
            token = await commonFunctions.getApplicationToken();
        } catch (e) {
            logger.error('Error occurred while getting application token in scheduleInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        let inviteBody = req.body.interviewBody + `<br><a href='${candidate.documents}' download>Download Candidate Resume</a>`;
        + `<br> Current CTC: ${candidate.currentCTC}` + `<br> Expected CTC: ${candidate.expectedCTC}` + `<br> Notice Period: ${candidate.noticePeriodInDays}` + `<br><a href='${candidate.documents}' download>Download Candidate Resume</a>`;


        try {
            invite = await commonFunctions.sendCalendarInvite(candidate, candidate.createdBy.email, candidate.candidateEmail, req.body.panelEmail, inviteBody, start, end, token);
        } catch (e) {
            console.log(e);
            logger.error('Error occurred while sending calendar invite in scheduleInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        try {
            mail = await commonFunctions.sendMailToPanel(candidate, req.body.panelEmail, req.body.interviewBody);
        } catch (e) {
            logger.error('Error occurred while sending email to panel in updateInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        try {
            interview = await Interview.create(req.body);
        } catch (e) {
            logger.error('Error occurred while creating interview in scheduleInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        try {
            candidate = await candidate.update({ candidateStatusId: status.metaDataId, lastModifiedById: req.user.userId });
        } catch (e) {
            logger.error('Error occurred while updating candidate in scheduleInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

    } else {
        try {
            interview = await Interview.create(req.body);
        } catch (e) {
            logger.error('Error occurred while creating interview in scheduleInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }
    }

    try {
        interview = await Interview.findByPk(interview.interviewId, {
            include: {
                model: JobRequisition,
                as: 'jobTitle'
            }
        });
    } catch (e) {
        logger.error('Error occurred while finding interview in scheduleInterview controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(201).json(responseFormatter.responseFormatter(interview, 'Interview scheduled successful', 'success', 201));
};

exports.updateInterview = async (req, res) => {
    let interview, candidate, metaData, token;
    try {
        interview = await Interview.findByPk(req.params.interview_id);
    } catch (e) {
        logger.error('Error occurred while getting interview in updateInterview controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (!interview) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such interview', 'bad request', 404));
    }

    try {
        candidate = await Candidate.findByPk(req.params.candidate_id, {
            include: [
                {

                    model: User,
                    as: 'createdBy',
                    attributes: ['userId', 'email', 'displayName']
                },
                {
                    model: JobRequisition,
                    as: 'jobTitle',
                    attributes: ['jobId', 'jobTitle']
                }
            ]
        });
    } catch (e) {
        logger.error('Error occurred while getting candidate in updateInterview controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (!candidate) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such candidate', 'bad request', 404));
    }

    req.body.lastModifiedById = req.user.userId;

    if (req.body.isFinalSelected === 'Yes') {

        try {
            metaData = await MetaData.findOne({ where: { displayText: { "status": { [Op.eq]: "Selected" } }, metaDataType: 'candidate_status', status: 'Active' } });
        } catch (e) {
            logger.error('Error occurred while finding meta data in updateInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        try {
            candidate = await candidate.update({ candidateStatusId: metaData.metaDataId, selectedRejectedDate: new Date(), lastModifiedById: req.user.userId });
        } catch (e) {
            logger.error('Error occurred while updating candidate in updateInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

    }

    if (req.body.interviewStatus === 'Rejected') {
        try {
            metaData = await MetaData.findOne({ where: { displayText: { "status": { [Op.eq]: "Rejected" } }, metaDataType: 'candidate_status', status: 'Active' } });
        } catch (e) {
            logger.error('Error occurred while finding meta data in updateInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        try {
            candidate = await candidate.update({ candidateStatusId: metaData.metaDataId, selected_or_rejected_date: new Date(), lastModifiedById: req.user.userId });
        } catch (e) {
            logger.error('Error occurred while updating candidate in updateInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }
    }

    if ((req.body.interviewStatus === 'Scheduled' || req.body.interviewDate || req.body.interviewStartTime || req.body.interviewDuration) && (req.body.interviewStatus !== 'Selected' || req.body.interviewStatus !== 'Rejected')) {
        let invite, mail;

        console.log(req.body);
        const time = req.body.interviewStartTime ? req.body.interviewStartTime.split(':') : interview.interviewStartTime.split(':');

        const startTime = moment(req.body.interviewDate ? req.body.interviewDate : interview.interviewDate).startOf('day');
        startTime.set({ hour: time[0], minute: time[1], millisecond: 0 });
        // startTime.add(time[1], 'minutes'); 
        const start = startTime.format('YYYY-MM-DDTHH:mm:ss');

        const endTime = moment(startTime);
        endTime.add(req.body.interviewDuration ? req.body.interviewDuration : interview.interviewDuration, 'minutes');
        const end = endTime.format('YYYY-MM-DDTHH:mm:ss');

        // send calender invite
        try {
            token = await commonFunctions.getApplicationToken();
        } catch (e) {
            console.log(e);
            logger.error('Error occurred while getting application token in updateInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        let inviteBody = req.body.interviewBody ? `<p>${req.body.interviewBody}</p>` : `<p>${interview.interviewBody}</p>` + `<br><a href='${candidate.documents}' download>Download Candidate Resume</a>`;
        + `<br> candidate current ctc: ${candidate.currentCTC}` + `<br> candidate.expected_ctc: ${candidate.expectedCTC}` + `<br> candidate.notice_period_in_days: ${candidate.noticePeriodInDays}` + `<br><a href='${candidate.documents}' download>Download Candidate Resume</a>`;

        try {
            invite = await commonFunctions.sendCalendarInvite(candidate, candidate.createdBy.email, candidate.candidateEmail, req.body.panelEmail ? req.body.panelEmail : interview.panelEmail, inviteBody, start, end, token);
        } catch (e) {
            console.log(e);
            logger.error('Error occurred while sending calendar invite in updateInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        try {
            mail = await commonFunctions.sendMailToPanel(candidate, req.body.panelEmail ? req.body.panelEmail : interview.panelEmail, req.body.interviewBody ? req.body.interviewBody : interview.interviewBody);
        } catch (e) {
            logger.error('Error occurred while sending calendar invite in updateInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        // req.body.created_by = req.user.user_id;
        // try {
        //     interview = await Interview.create(req.body);
        // } catch (e) {
        //     logger.error('Error occurred while creating interview in updateInterview controller %s:', JSON.stringify(e));
        //     return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        // }

        try {
            metaData = await MetaData.findOne({ where: { displayText: { "status": { [Op.eq]: "Scheduled" } }, metaDataType: 'candidate_status', status: 'Active' } });
        } catch (e) {
            logger.error('Error occurred while finding meta data in updateInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }



        try {
            candidate = await candidate.update({ candidateStatusId: metaData.metaDataId, lastModifiedById: req.user.userId });
        } catch (e) {
            console.log(e)
            logger.error('Error occurred while updating candidate in updateInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        // delete req.body.created_by
    }


    try {
        interview = await interview.update(req.body);
    } catch (e) {
        console.log(e)
        logger.error('Error occurred while updating interview in updateInterview controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    try {
        interview = await Interview.findByPk(interview.interviewId, {
            include: {
                model: JobRequisition,
                as: 'jobTitle'
            }
        });
    } catch (e) {
        logger.error('Error occurred while finding interview in updateInterview controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(interview, 'updated successfully', 'success', 200));
};

exports.getCandidatesReport = async (req, res, next) => {
    let candidates;

    try {
        candidates = await Candidate.findAll({
            include: {
                all: true
            }
        });
    } catch (e) {
        logger.error('Error occurred while finding candidates in getCandidatesReport controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(200).json(candidates);
}

exports.getReferralByUserId = async (req, res, next) => {
    let searchCriteria = {}, includeCriteria = {};

    if (req.query.userId) {
        searchCriteria.userId = req.query.userId;
    }

    if (req.query.job) {
        includeCriteria.jobId = req.query.job;
    }

    if (req.query.status) {
        includeCriteria.candidateStatusId = req.query.status;
    }


    if (req.query.keyword) {
        includeCriteria[Op.or] = [
            {
                candidateName: {
                    [Op.like]: `%${req.query.keyword ? req.query.keyword : ''}%`
                }
            },
            {
                candidateEmail: {
                    [Op.like]: `%${req.query.keyword ? req.query.keyword : ''}%`
                }
            }
        ]
    }

    let candidate = await ReferralCandidate.findAll({
        attributes: ['createdById', 'candidateId'],
        where: searchCriteria,
        include: [
            {
                model: Candidate,
                as: 'candidate',
                where: includeCriteria,
                include: [{
                    model: JobRequisition,
                    as: 'jobTitle',
                    attributes: ['jobId', 'jobTitle']
                },
                {
                    model: MetaData,
                    as: 'candidateStatus',
                    attributes: ['displayText', 'metaDataType', 'order']
                },
                {
                    model: User,
                    as: 'createdBy'
                }
                ]
            },
            {
                model: User,
                as: 'user'
            }
        ]

    })
    return res.status(200).json(responseFormatter.responseFormatter(candidate, 'success', 200));
}

//! we Find Candidate BY JOB Role
exports.getReferralByJob_id = async (req, res, next) => {
    let searchCriteria = {};


    if (req.query.jobId) {
        searchCriteria.jobId = req.query.jobId;
        searchCriteria.referal = true
    }
    let candidate = await Candidate.findAll({
        where: searchCriteria,
    });


    return res.status(200).json(responseFormatter.responseFormatter(candidate, 'success', 'success', 200));
}

//!candidate table me created_by  update Recruiter_id assignCandidateToRecruiter 
exports.assignCandidateToRecruiter = async (req, res, next) => {
    let candidate;
    try {
        await Candidate.update({ createdById: req.body.recruiter }, { where: { candidateId: req.params.candidateId } });
    } catch (e) {
        logger.error('Error Occured while updating referal Candidate in App  Controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error Occured', 'error', 500));
    }

    try {
        candidate = await Candidate.findByPk(req.params.candidateId, {
            include: [
                {
                    model: MetaData,
                    as: 'source',
                    attributes: ['metaDataId', 'displayText']
                },
                {
                    model: MetaData,
                    as: 'jobLocation',
                    attributes: ['metaDataId', 'displayText']
                },
                {
                    model: JobRequisition,
                    as: 'jobTitle',
                    attributes: ['jobId', 'jobTitle', 'jobCode']
                },
                {
                    model: User,
                    as: 'createdBy',
                    attributes: ['userId']
                },
                {
                    model: MetaData,
                    as: 'candidateStatus',
                    attributes: ['metaDataId', 'displayText']
                },

            ]
        });
    } catch (e) {
        logger.error('Error occurred while finding candidate in updateCandidate controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(candidate, 'success ', 'success', 200))
}

exports.getJobAssignedRecruiter = async (req, res, next) => {
    let RecruitersJob, searchCriteria, includeCriteria = [];


    try {
        RecruitersJob = await JobRequisition.findAll({
            include: [
                {
                    model: JobAssignment,
                    as: 'jobAssignments',
                    include: [
                        {
                            model: User,
                            as: 'user'
                        }
                    ]
                },
            ]
        })
    } catch (e) {
        console.log(e);
        logger.error('Error Occured while getting jobs of recruiter in App  Controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error Occured', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(RecruitersJob, 'fetched successfully', 'success', 200));
}

/* copy pasted as it is */
// exports.createJobRequisition = async (req, res, next) => {
//     let jobRequisition, token, fileUrl;

//     req.body.created_by = req.user.user_id;
//     req.body.last_modified_by = req.user.user_id;

//     if (req.file) {
//         // try {
//         //     token = await commonFunctions.getApplicationToken();
//         // } catch (e) {
//         //     logger.error('Error occurred while getting application token in createJobRequisition controller %s:', JSON.stringify(e));
//         //     return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
//         // }

//         let filename = `${req.file.originalname.split('.')[0]}-${new Date().getTime()}`;
//         let fileExt = req.file.originalname.split('.')[1];
//         try {
//             fileUrl = await commonFunctions.uploadAttachmentToSharepoint(`${filename}.${fileExt}`, req.file.buffer, req.file.mimetype, 'Job Description');
//         } catch (e) {
//             logger.error('Error occurred while uploading attachment to sharepoint in createJobRequisition controller %s:', JSON.stringify(e));
//             return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
//         }

//         req.body.job_description_path = fileUrl;
//     }

//     try {
//         jobRequisition = await JobRequisition.create(req.body);
//     } catch (e) {
//         logger.error('Error occurred while creating job requisition in createJobRequisition controller %s:', JSON.stringify(e));
//         return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
//     }

//     if (req.body.assignedRecruiters) {
//         let assginedRecruiters = JSON.parse(req.body.assignedRecruiters);

//         for (let i = 0; i < assginedRecruiters.length; i++) {
//             try {
//                 assignment = await JobRequisitionsRecruitersAssingment.create({
//                     recruiter_id: assginedRecruiters[i].user_id,
//                     job_id: jobRequisition.job_id,
//                     created_by: req.user.user_id,
//                     last_modified_by: req.user.user_id
//                 });
//             } catch (e) {
//                 logger.error('Error occurred while assigning job requisition in updateJobRequisition controller %s:', JSON.stringify(e));
//                 return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
//             }
//         }
//     }

//     if (req.body.assignedHiringManagers) {
//         let assignedHiringManagers = JSON.parse(req.body.assignedHiringManagers);

//         for (let i = 0; i < assignedHiringManagers.length; i++) {
//             try {
//                 assignment = await jobRequisitionHiringManagerAssignment.create({
//                     hiring_manager_id: assignedHiringManagers[i].user_id,
//                     job_id: jobRequisition.job_id,
//                     created_by: req.user.user_id,
//                     last_modified_by: req.user.user_id
//                 });
//             } catch (e) {
//                 logger.error('Error occurred while assigning job requisition in updateJobRequisition controller %s:', JSON.stringify(e));
//                 return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
//             }
//         }
//     }

//     try {
//         jobRequisition = await JobRequisition.findByPk(jobRequisition.job_id, {
//             include: [
//                 {
//                     model: MetaData,
//                     as: 'jobRequisitionStatus',
//                     attributes: ['meta_data_id', 'display_text']
//                 },
//                 {
//                     model: MetaData,
//                     as: 'jobType',
//                     attributes: ['meta_data_id', 'display_text']
//                 },
//                 {
//                     model: JobRequisitionsRecruitersAssingment,
//                     as: 'assignments',
//                     attributes: ['recruiter_id'],
//                     include: {
//                         model: User,
//                         as: 'assignedRecruiter',
//                         attributes: ['user_id', 'display_name']
//                     }
//                 },
//                 {
//                     model: jobRequisitionHiringManagerAssignment,
//                     as: 'hiringManagerAssignments',
//                     attributes: ['hiring_manager_id'],
//                     include: {
//                         model: User,
//                         as: 'assignedHiringManger',
//                         attributes: ['user_id', 'display_name']
//                     }
//                 }
//             ]
//         });
//     } catch (e) {
//         logger.error('Error occurred while creating job requisition in createJobRequisition controller %s:', JSON.stringify(e));
//         return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
//     }

//     return res.status(201).json(responseFormatter.responseFormatter(jobRequisition, 'successful created', 'success', 201));
// };
/* copy pasted as it is */
// exports.updateJobRequisition = async (req, res, next) => {
//     let jobRequisition, assignment;

//     try {
//         jobRequisition = await JobRequisition.findByPk(req.params.job_id, { where: { status: 'Active' } });
//     } catch (e) {
//         logger.error('Error occurred while finding job requisition in updateJobRequisition controller %s:', JSON.stringify(e));
//         return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
//     }

//     if (!jobRequisition) {
//         return res.status(404).json(responseFormatter.responseFormatter({}, 'No such job requisition', 'unsuccessful', 404));
//     }

//     if (req.body.assignedRecruiters) {
//         let assginedRecruiters = JSON.parse(req.body.assignedRecruiters);

//         for (let i = 0; i < assginedRecruiters.length; i++) {
//             try {
//                 assignment = await JobRequisitionsRecruitersAssingment.create({
//                     recruiter_id: assginedRecruiters[i].user_id,
//                     job_id: req.params.job_id,
//                     created_by: req.user.user_id,
//                     last_modified_by: req.user.user_id
//                 });
//             } catch (e) {
//                 logger.error('Error occurred while assigning job requisition in updateJobRequisition controller %s:', JSON.stringify(e));
//                 return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
//             }
//         }

//         delete req.body.assignedRecruiters;
//     }

//     if (req.body.assignedHiringManagers) {
//         let assignedHiringManagers = JSON.parse(req.body.assignedHiringManagers);

//         for (let i = 0; i < assignedHiringManagers.length; i++) {
//             try {
//                 assignment = await jobRequisitionHiringManagerAssignment.create({
//                     hiring_manager_id: assignedHiringManagers[i].user_id,
//                     job_id: jobRequisition.job_id,
//                     created_by: req.user.user_id,
//                     last_modified_by: req.user.user_id
//                 });
//             } catch (e) {
//                 logger.error('Error occurred while assigning job requisition in updateJobRequisition controller %s:', JSON.stringify(e));
//                 return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
//             }
//         }

//         delete req.body.assignedHiringManagers
//     }

//     req.body.last_modified_by = req.user.user_id;

//     try {
//         jobRequisition = await jobRequisition.update(req.body);
//     } catch (e) {
//         logger.error('Error occurred while updating job requisition in updateJobRequisition controller %s:', JSON.stringify(e));
//         return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
//     }

//     try {
//         jobRequisition = await JobRequisition.findByPk(jobRequisition.job_id, {
//             include: [
//                 {
//                     model: MetaData,
//                     as: 'jobRequisitionStatus',
//                     attributes: ['meta_data_id', 'display_text']
//                 },
//                 {
//                     model: MetaData,
//                     as: 'jobType',
//                     attributes: ['meta_data_id', 'display_text']
//                 },
//                 {
//                     model: JobRequisitionsRecruitersAssingment,
//                     as: 'assignments',
//                     attributes: ['recruiter_id'],
//                     include: {
//                         model: User,
//                         as: 'assignedRecruiter',
//                         attributes: ['user_id', 'display_name']
//                     }
//                 },
//                 {
//                     model: jobRequisitionHiringManagerAssignment,
//                     as: 'hiringManagerAssignments',
//                     attributes: ['hiring_manager_id'],
//                     include: {
//                         model: User,
//                         as: 'assignedHiringManger',
//                         attributes: ['user_id', 'display_name']
//                     }
//                 }
//             ]
//         });
//     } catch (e) {
//         logger.error('Error occurred while finding job requisition in updateJobRequisition controller %s:', JSON.stringify(e));
//         return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
//     }

//     return res.status(200).json(responseFormatter.responseFormatter(jobRequisition, 'successfully updated', 'success', 200));
// };


//! Tested Working

exports.getJobRequisitions = async (req, res, next) => {
    let jobRequisitions, searchCriteria, includeCriteria = [], userIds = [req.user.userId], childUsers;

    /* Getting Role of requesting user */
    const role = req.user.roleAssignments.role;

    /* Finding all child users */
    try {
        childUsers = await req.user.getChilderens();
    } catch (e) {
        console.log(e);
    }


    if (childUsers && childUsers.length > 0) {
        const len = childUsers.length;
        for (let i = 0; i < len; i++) {
            userIds.push(childUsers[i].userId);
        }
    }



    if (role?.jobsView) {
        if (!role.jobsView.showAll) {
            if (role.jobsView.isHierarchy) {
                includeCriteria.push(
                    {
                        model: JobAssignment,
                        as: 'jobAssignments',
                        required: true,
                        where: {
                            userId: {
                                [Op.in]: userIds
                            }
                        }
                    },

                    {
                        model: JobAssignment,
                        as: 'users',
                        include: [
                            {
                                model: User,
                                as: 'user',
                                include: [
                                    {
                                        model: RoleAssignment,
                                        as: 'roleAssignments',
                                        include: [
                                            {
                                                model: Role,
                                                as: 'role'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                );

            } else {
                includeCriteria.push(
                    {
                        model: JobAssignment,
                        as: 'jobAssignments',
                        required: false
                    }
                );
            }
        }
    } else {
        return res.status(400).json(responseFormatter.responseFormatter({}, 'Candidates view is not assigned to this role', 'bad request', 400));
    }

    try {
        jobRequisitions = await JobRequisition.findAll({
            where: searchCriteria,
            include: includeCriteria
        });

    } catch (e) {
        console.log(e)
        logger.error('Error occurred while finding job requisitions in getJobRequisitions controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(jobRequisitions, 'fetched successfully', 'success', 200));
};

exports.getAllJobRequisitions = async (req, res, next) => {
    let jobRequisitions, searchCriteria, includeCriteria = [], userIds = [req.user.userId], childUsers;

    /* Getting Role of requesting user */
    // const role = req.user.roleAssignments.role;

    includeCriteria.push(
        {
            model: JobAssignment,
            as: 'jobAssignments',
            required: false,
            include: {
                model: User,
                as: 'user'
            }
        }
    );

    try {
        jobRequisitions = await JobRequisition.findAll({
            where: searchCriteria,
            include: includeCriteria
        });
    } catch (e) {
        logger.error('Error occurred while finding job requisitions in getJobRequisitions controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(jobRequisitions, 'fetched successfully', 'success', 200));
};


exports.getDashboard = async (req, res, next) => {
    let jobs, childUsers, statuses, userIds = [req.user.userId], dashboardData, searchCriteria = {}, includeCriteria = [], candidateSearchCriteria = { where: {} };



    const role = req.user.roleAssignments.role;

    /* Finding all child users */
    try {
        childUsers = await req.user.getChilderens();
    } catch (e) {
        console.log(e);
        logger.error('Error occurred while getting child usres in getCandidates controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (childUsers && childUsers.length > 0) {
        const len = childUsers.length;
        for (let i = 0; i < len; i++) {
            userIds.push(childUsers[i].userId);
        }
    }

    if (req.query.recruiter) {
        userIds = [req.query.recruiter]
    }

    if (req.query.startDate && req.query.endDate) {
        searchCriteria = {
            [Op.gte]: new Date(req.query.startDate),
            [Op.lte]: new Date(req.query.endDate).setHours(24)
        }
    }

    if (role.candidatesView) {
        if (role.candidatesView.isHierarchy) {
            candidateSearchCriteria.where = {
                createdById: {
                    [Op.in]: userIds
                }
            }
        }

        if (role.candidatesView.showAll) {

        }
    }

    if (role.jobsView) {
        if (role.jobsView.isHierarchy) {
            includeCriteria.push({
                model: JobAssignment,
                as: 'jobAssignments',
                where: {
                    userId: {
                        [Op.in]: userIds
                    }
                },
            });
        }

        if (role.jobsView.showAll) {
            includeCriteria.push({
                model: JobAssignment,
                as: 'jobAssignments'
            });
        }
    }

    includeCriteria.push(
        {
            model: Candidate,
            as: 'candidates',
            required: false,
            ...candidateSearchCriteria,
            include: [
                {
                    model: CandidateStatusHistory,
                    as: 'statusHistory',
                    required: true,
                    where: {
                        candidateStatusId: {
                            [Op.eq]: sequelize.col('candidates.candidateStatusId'),
                        },
                        createdDate: {
                            [Op.and]: {
                                // [Op.gte]: sequelize.col('candidates.last_modified_date'),
                                ...searchCriteria
                            }
                        }
                    },
                    attributes: []
                },

                {
                    model: MetaData,
                    as: 'candidateStatus',
                    // attributes: ['metaDataId', 'displayText']

                },
                {
                    model: JobRequisition,
                    as: 'jobTitle',
                    // attributes: ['job_id', 'job_title']

                },
                {
                    model: User,
                    as: 'createdBy',
                    // attributes: ['userId', 'displayName']
                },
                {
                    model: Interview,
                    as: 'interviews',
                    // attributes: ['interviewId', 'interviewRound', 'panelEmail', 'interviewDate'],
                    order: [["interviewRound", 'DESC']]
                }
            ],
        },
    )

    /* Getting all candidate statuses */
    try {
        statuses = await MetaData.findAll({
            where: {
                status: 'Active',
                metaDataType: 'candidate_status'
            }
        });
    } catch (e) {
        console.log(e);
        logger.error('Error occurred while finding statuses in getDashboard controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }


    /* Getting all jobs */
    try {
        jobs = await JobRequisition.findAll({
            //             where: { status: 'Active' },
            // attributes: ['job_title', 'job_code', 'job_type_id', 'priority', 'can_engage_external_consultants', 'created_date', 'no_of_positions'],
            include: includeCriteria,
            // order: [["createdDate", 'DESC'], [{ model: Candidate, as: 'candidates' }, { model: Interview, as: 'interviews' }, 'interviewRound', 'DESC']]
        });
    } catch (e) {
        console.log(e);
        logger.error('Error occurred while finding data in getDashboard controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    /* Getting Dashboard data */
    dashboardData = jobs.map((job) => {
        let data = {
            jobCode: job.jobCode,
            jobTitle: job.jobTitle,
            jobType: job.jobType,
            priority: job.priority,
            noOfPositions: job.noOfPositions,
            canEngageExternalConsultants: job.canEngageExternalConsultants,
            jobCreated: moment(job.createdDate, 'DD-MMM-YYYY'),
            jobStatus: job?.status,
            jobAge: '',
            // assignedRecruiters: job.assignments.map((assignment) => assignment.assignedRecruiter.displayName),
            // assignedHiringManager: job.hiringManagerAssignments.map((assignment) => assignment.assignedHiringManger.display_name),
            total: job.candidates?.length
        }

        const createdDate = moment(data?.jobCreated);
        const todayDate = moment();
        const dayDiff = todayDate.diff(createdDate, 'd');
        data.jobAge = dayDiff;

        for (let i = 0; i < statuses?.length; i++) {
            let candidates = job.candidates.filter((candidate) => {
                return candidate.candidateStatusId === statuses[i].metaDataId;
            });
            data[statuses[i]?.displayText.status] = {
                count: candidates.length,
                candidates
            }
        }
        return data;
    });

    dashboardData.sort((a, b) => b.total - a.total);

    /* success */
    return res.status(200).json(responseFormatter.responseFormatter(dashboardData, 'fetched successfully', 'success', 200));
};
