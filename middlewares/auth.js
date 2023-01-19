'use strict';

const db = require('../models/indexModel');
const { User } = db;
const { RoleAssignment } = db;
const { PermissionAssignment } = db;
const { Role } = db;
const { Permission } = db;
const { OrganizationTeam } = db;
const commonFunctions = require('../utils/commonFunctions');
const logger = require('../utils/logger');
const responseFormatter = require('../utils/responseFormatter');

exports.checkUserExistInApp = async (req, res, next) => {
  let user, dataToSave = {};

  /* checking requested user is in database or not */
  try {
    // console.log(req.authInfo.oid);
    user = await User.findByPk(req.authInfo.oid, {
      where: {
        status: 'Active'
      },
      include: [
        {
          model: RoleAssignment,
          as: 'roleAssignments',
          required: false,
          // attributes: [],
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['roleId', 'roleName', 'candidatesView', 'jobsView'],
              include: [
                {
                  model: PermissionAssignment,
                  as: 'permissionAssignments',
                  attributes: [],
                  include: {
                    model: Permission,
                    as: 'permission',
                    attributes: ['permissionId', 'permissionName']
                  }
                },
                {
                  model: OrganizationTeam,
                  as: 'organizationTeam',
                  attributes: ['organizationTeamId', 'organizationTeamName', 'candidatesView', 'jobsView']
                }
              ]
            }
          ]
        }
      ]
    });
  } catch (e) {
    console.log(e);
    logger.error('Error occurred while finding user in checkUserExistInApp middleware %s:', JSON.stringify(e));
    return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
  }

  // console.log(user);

  /* if user is not exist, creating user wihtout any role defined */
  if (!user) {
    dataToSave.userId = req.authInfo.oid;
    dataToSave.displayName = req.authInfo.name;
    dataToSave.email = req.authInfo.preferred_username;
    dataToSave.createdById = req.authInfo.oid;
    dataToSave.lastModifiedById = req.authInfo.oid;

    try {
      user = await User.create(dataToSave);
    } catch (e) {
      logger.error('Error occurred while creating user in checkUserExistInApp middleware %s:', JSON.stringify(e));
      return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }
  }

  req.user = user;

  next();
};

exports.authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      let userLoggedInRoleAssignment;

      // console.log('=========Authorize Role=================')

      if (req.headers['user-info']) {        
        if (req.user.roleAssignments.length > 0) {
          userLoggedInRoleAssignment = req.user.roleAssignments.filter((roleAssignment) => roleAssignment.role.roleName === req.headers['user-info'])[0];
        } else {
          return res.status(400).json(responseFormatter.responseFormatter({}, 'there is no role assosciated with the user', 'bad request', 400));
        }
      } else {
        return res.status(400).json(responseFormatter.responseFormatter({}, 'user role should be mentioned in the request object', 'bad request', 400));
      }

      if (!userLoggedInRoleAssignment) {
        return res.status(404).json(responseFormatter.responseFormatter({}, `user with ${req.headers['user-info']} this doesn't exsit`, 'bad request', 404));
      }

      if (!roles.some((role) => role === userLoggedInRoleAssignment.role.roleName)) {
        return res.status(403).json(responseFormatter.responseFormatter({}, `Role: ${req.headers['user-info']} is not allowed to access this resource`, 'forbidden access', 403));
      }

      req.user.roleAssignments = userLoggedInRoleAssignment;

      next();
    } catch (e) {
      console.log(e);
    }
  };
};