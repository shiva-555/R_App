'use strict';

const db = require('../models/indexModel');
const { User } = db;
const { Role } = db;
const { RoleAssignment } = db;
const { Template } = db;
const { Candidate } = db;
const commonFunctions = require('../utils/commonFunctions');
const responseFormatter = require('../utils/responseFormatter');
const axios = require('axios');
const logger = require('../utils/logger');


//! Not Tested 
exports.createAppUser = async (req, res) => {
    let user, role, assignment;

    try {
        user = await User.findByPk(req.body.userId);
    } catch (e) {
        logger.error('Error occurred while creating user in createAppUser controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    try {
        role = await Role.findByPk(req.body.role);
    } catch (e) {
        logger.error('Error occurred while creating user in createAppUser controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (user) {
        return res.status(400).json(responseFormatter.responseFormatter({}, 'User already exist', 'bad request', 400));
    }

    try {
        user = await User.create({
            userId: req.body.userId,
            displayName: req.body.displayName,
            email: req.body.email,
            createdBy: req.user.userId,
            lastModifiedBy: req.user.userId
        });
    } catch (e) {
        logger.error('Error occurred while creating user in createAppUser controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (role) {
        try {
            assignment = await RoleAssignment.create({
                roleId: role.roleId,
                userId: user.userId,
                createdBy: req.user.userId,
                lastModifiedBy: req.user.userId
            });
        } catch (e) {
            logger.error('Error occurred while creating user in createAppUser controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }
    }

    return res.status(201).json(responseFormatter.responseFormatter(user, 'user successfully created', 'success', 201));
};

//! Not Tested   
exports.updateAppUser = async (req, res) => {
    let user, role, assignment;

    try {
        user = await User.findByPk(req.params.user_id, { where: { status: 'Active' } });
    } catch (e) {
        logger.error('Error occurred while finding user in updateAppUser controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (!user) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such user', 'unsuccessful', 404));
    }


    if (req.body.role) {
        try {
            role = await Role.findByPk(req.body.role);
        } catch (e) {
            logger.error('Error occurred while finding role in updateAppUser controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        if (role) {
            try {
                assignment = await RoleAssignment.findOne({
                    where: {
                        userId: user.userId,
                        roleId: role.roleId,
                        status: 'Active'
                    }
                });
            } catch (e) {
                logger.error('Error occurred while finding role assignment in updateAppUser controller %s:', JSON.stringify(e));
                return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
            }

            if (assignment) {
                return res.status(400).json(responseFormatter.responseFormatter({}, 'role already assigned', 'bad request', 400));
            }

            try {
                assignment = await RoleAssignment.create({
                    userId: user.userId,
                    roleId: role.roleId
                });
            } catch (e) {
                console.log(e);
                logger.error('Error occurred while create role assignment in updateAppUser controller %s:', JSON.stringify(e));
                return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
            }
        } else {
            return res.status(404).json(responseFormatter.responseFormatter({}, 'No such role', 'not found', 404));
        }
    }

    return res.status(200).json(responseFormatter.responseFormatter(user, 'Update successful', 'success', 200));
};

//! Copy pasted as it is
exports.getAllTenantUsers = async (req, res, next) => {
    let tenantUsers = [], data, token;

    try {
        token = await commonFunctions.getApplicationToken();
    } catch (e) {
        logger.error('Error occurred while generating token in getAllTenantUsers controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (req.query.email) {
        try {
            data = await axios.get(`https://graph.microsoft.com/v1.0/users/${req.query.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (e) {
            logger.error('Error occurred while getting tenant useres in getAllTenantUsers controller %s:', JSON.stringify(e));
            if (e.response.status === 404) {
                return res.status(404).json(responseFormatter.responseFormatter({}, 'No user with this email', 'bad request', 404));
            }
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }

        tenantUsers.push(data.data);
    } else {
        try {
            data = await axios.get('https://graph.microsoft.com/v1.0/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (e) {
            logger.error('Error occurred while getting tenant useres in getAllTenantUsers controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }
        tenantUsers = data.data.value;
    }

    return res.status(200).json(responseFormatter.responseFormatter(tenantUsers, 'fetched successfully', 'success', 200));
};

//! Copy pasted as it is
exports.getAllGuestUsers = async (req, res, next) => {
    let guestUsers = [], data, token;

    try {
        token = await commonFunctions.getApplicationToken();
    } catch (e) {
        logger.error('Error occurred while getting application token in getAllGuestUsers controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    if (req.query.email) {
        try {
            data = await axios.get(` https://graph.microsoft.com/v1.0/users?&$filter=userType eq 'Guest' AND mail eq '${req.query.email}'`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (e) {
            logger.error('Error occurred while getting users in getAllGuestUsers controller %s:', JSON.stringify(e));
            if (e.response.status === 404) {
                return res.status(404).json(responseFormatter.responseFormatter({}, 'No user with this email', 'bad request', 404));
            }
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }
        guestUsers.push(data.data.value[0]);
    } else {
        try {
            data = await axios.get(`https://graph.microsoft.com/v1.0/users?&$filter=userType eq 'Guest'`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (e) {
            logger.error('Error occurred while gettng guest users in getAllGuestUsers controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
        }
        guestUsers = data.data.value
    }

    return res.json(responseFormatter.responseFormatter(guestUsers, 'fetched successfully', 'success', 200));
};

exports.createMailRemainder = async (req, res, next) => {
    let template;

    req.body.createdById = req.user.userId;
    req.body.lastModifiedById = req.user.userId;

    try {
        template = await Template.create(req.body);
    }
    catch (e) {
        console.log(e);
        logger.error('Error Occured while creating Email Template in createEmailRemainder controller %s', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occured', 'error', 500));
    }

    return res.status(201).json(responseFormatter.responseFormatter(template, 'Email Template data created successfully', 'success', 201));
};

exports.updateMailRemainder = async (req, res, next) => {
    let template;


    console.log(req.body);
    console.log(req.params)

    try {
        template = await Template.findByPk(req.params.templateId);
    } catch (e) {
        logger.error('Error Occured while finding Email Template in Admin Controller %s:'.JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error Occured', 'error', 500));
    }

    if (!template) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such Email Template', 'unSuccessful', 400));
    }

    req.body.lastModifiedById = req.user.userId;

    try {
        template = await template.update(req.body);
    }
    catch (e) {
        logger.error('Error Occured while updating Email Template in Admin Controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error Occured', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(template, 'Email Template updated successfully', 'success', 200));

};

exports.getMailRemainder = async (req, res, next) => {
    let template;

    try {
        template = await Template.findAll({
            include: {
                all: true
            }
        });
    } catch (e) {
        logger.error('Error occurred while finding emailTemplates in getMailRemainder controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(template, 'success', 'success', 200));
};

// ! copy pasted as it is
exports.statusMailRemainder = async (req, res, next) => {
    let emailTemplate, searchCriteria;

    // client req query
    if (req.query.type === 'reminderTemplate') {
        searchCriteria = {
            candidateStatusId: req.params.status_id,
            templateType: 'isReminder',
            // status: 'Active'
        }
    }

    if (req.query.type === 'generalTemplate') {
        searchCriteria = {
            candidateStatusId: req.params.status_id,
            templateType: 'general',
            // status: 'Active'
        }
    }

    try {
        emailTemplate = await Template.findAll({
            where: searchCriteria,
            include: {
                all: true
            }

        });
    } catch (e) {
        console.log(e);
        logger.error('Error occurred while finding Status in getMailRemainder Status controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(emailTemplate, 'Status id fetched successfully', 'success', 200));
};

exports.updateCandidateStatus = async (req, res, next) => {

    let candidate;
    try {
        candidate = await Candidate.findByPk(req.params.candidate_id);
    } catch (e) {
        logger.error('Error occured while finding candidate in updateCandidate controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error Occurred while finding candidate', 'error', 500));
    }

    if (!candidate) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such candidate', 'unSuccessful', 404));
    }

    if (req.user.roleAssignments.role.roleName === 'Admin') {
        try {
            candidate = await candidate.update({ status: 'Inactive' });
        } catch (e) {
            logger.error('Error occurred while updating candidate in updateInterview controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred while updating status', 'error', 500));
        }
    }

    return res.status(200).json(responseFormatter.responseFormatter(candidate, 'Candidate Status Updated Successfully', 'success', 200));
}

//! copy pasted as it is
// exports.updateEmailTemplatesDuration = async(req, res, next) => {

//     let templates;

//     try {
//         templates = await EmailTemplate.update({duration_in_days: req.body.duration_in_days}, {where: {candidate_status: req.params.status_id}});
//     } catch (e) {
//         logger.error('Error occurred while updating duration in updateEmailTemplatesDUration controller %s:', JSON.stringify(e));
//         return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred while updating duration', 'error', 500));
//     }

//     return res.status(200).json(responseFormatter.responseFormatter(templates, 'Duration updated Successfully', 'success', 200));
// }

exports.addRole = async (req, res, next) => {
    let role;

    try {
        role = await Role.findOne({ where: { role: req.body.role.trim() } });
    } catch (e) {
        logger.error('Error occurred while finding role in addRole controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred while updating status', 'error', 500));
    }

    if (!role) {
        try {
            role = await Role.create({
                role: req.body.role.trim(),
                createdById: req.user.userId,
                lastModifiedById: req.user.userId
            });
        } catch (e) {
            logger.error('Error occurred while creating role in addRole controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred while updating status', 'error', 500));
        }
    } else {
        return res.status(400).json(responseFormatter.responseFormatter({}, 'Role Already Exist', 'bad request', 400));
    }

    return res.status(201).json(responseFormatter.responseFormatter(role, 'Role Added Successfully', 'success', 201));
};

exports.getRoles = async (req, res, next) => {
    let roles;

    try {
        roles = await Role.findAll({ where: { status: 'Active' } });
    } catch (e) {
        logger.error('Error occurred while finding roles in getRoles controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred while updating status', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(roles, 'Roles fetched Successfully', 'success', 200));
};

exports.assignRoleToUser = async (req, res, next) => {
    let role, user, assignment;

    try {
        user = await User.findByPk(req.body.userId);
    } catch (e) {
        logger.error('Error occurred while finding user in assignRoleToUser controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred while updating status', 'error', 500));
    }

    console.log(user);
    try {
        role = await Role.findOne({ where: { roleId: req.body.role.trim() } });
    } catch (e) {
        logger.error('Error occurred while finding role in assignRoleToUser controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred while updating status', 'error', 500));
    }


    if (!role) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such role', 'bad request', 404));
    }

    if (!user) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such User', 'bad request', 404));
    }

    try {
        assignment = await RoleAssignment.findOne({
            where: {
                userId: user.userId,
                roleId: role.roleId,
                status: 'Active'
            }
        });
    } catch (e) {
        logger.error('Error occurred while finding role assignment in assignRoleToUser controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred while updating status', 'error', 500));
    }

    if (!assignment) {
        try {
            assignment = await RoleAssignment.create({
                userId: user.userId,
                roleId: role.roleId,
                createdById: req.user.userId,
                lastModifiedById: req.user.userId
            });
        } catch (e) {
            logger.error('Error occurred while creating role assignment in assignRoleToUser controller %s:', JSON.stringify(e));
            return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred while updating status', 'error', 500));
        }
    } else {
        return res.status(400).json(responseFormatter.responseFormatter({}, 'Role Already Exist', 'bad request', 400));
    }

    return res.status(201).json(responseFormatter.responseFormatter(assignment, 'Role Added Successfully', 'success', 201));
};


exports.getHr = async (req, res, next) => {
    let hr
    try {
        hr = await User.findAll({
            include: [{
                model: RoleAssignment,
                as: 'roleAssignments',
                required: true,
                include: [{
                    
                        model: Role,
                        as: 'role',
                        required: true,
                        where: {
                            roleName: 'HR'
                        }
                    

                }]
            }]
        })
        return res.status(200).json(responseFormatter.responseFormatter(hr, 'Hr fetched Successfully', 'success', 200));
    }
    catch (e) {
        console.log(e);
        logger.error('Error occurred while finding Hr in getHR controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred while finding status', 'error', 500));
    }
}