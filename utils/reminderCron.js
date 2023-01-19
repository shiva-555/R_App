const logger = require('./logger');

(async function () {
    'use strict';
    const cron = require('node-cron');
    const db = require('../models/indexModel');
    const { MetaData } = db;
    const { Role } = db;
    const { RoleAssignment } = db;
    const { Op } = db;
    const { User } = db;
    const { Template } = db;
    const { Candidate } = db;
    const { JobRequisition } = db;
    const { Interview } = db;
    const { sequelize } = db
    const { Sequelize } = db;
    const commonFunctions = require('../utils/commonFunctions');
    const moment = require('moment');


    const sendMailToUsers = async (candidate, template) => {
        const user = candidate.createdBy;
        async function getHierarchy(user) {
            const users = [];
            async function getParent(user) {
                users.push(user);
                let parent = await user.getParent()
                if (parent) {
                    await getParent(parent);
                } else {
                    return;
                }
            };
            await getParent(user);
            return users;
        }

        const users = await getHierarchy(user);

        if (users.length) {
            for (let i = 0; i < users.length; i++) {
                let assignments = await users[i].getRoleAssignments();

                for (let j = 0; j < assignments.length; j++) {
                    let role = await assignments[j].getRole();
                    if (role.roleName === template.role.roleName) {
                        console.log('########################################');
                        console.log(users[i].email);
                        console.log(template?.duration);
                        console.log(template?.body);
                        console.log(candidate.createdBy.displayName);

                        try {
                            let temp = template?.body;
                            let regExp = /{[\w.]+}/g;
                            let retrievedResult = temp.match(regExp);

                            if (retrievedResult) {
                                for (let j = 0; j < retrievedResult.length; j++) {
                                    let regExp = /[\w.]+/g;
                                    let variableName = retrievedResult[j].match(regExp)[0];

                                    function recursion(candidate) {
                                        if (candidate) {
                                            if (candidate[variableName] && typeof candidate[variableName] !== 'object') {
                                                if (candidate[variableName] instanceof Date) {
                                                    temp = temp.replace(retrievedResult[j], moment(candidate[variableName]).format("dddd, MMMM Do YYYY"));
                                                } else {
                                                    temp = temp.replace(retrievedResult[j], candidate[variableName]);
                                                }
                                            } else if (typeof candidate === 'object') {
                                                for (const key in candidate) {
                                                    if (typeof candidate[key] === 'object') {
                                                        recursion(candidate[key]);
                                                    }
                                                    // else {
                                                    //   return;
                                                    // }
                                                }
                                            }
                                        }
                                    }
                                    recursion(candidate);
                                }
                            }
                            await commonFunctions.sendMail(users[i].email, template.subject,  { message: temp });
                        }
                        catch (e) {
                            console.log(e);
                            logger.error('Error occurred while Sending Mail to Recruiter Role  in sendReminder cron %s:', JSON.stringify(e));
                        }
                    }
                }
            }
        }
    };


    let sendReminder = async () => {
        let statuses;

        try {
            statuses = await MetaData.findAll({
                where: {
                    status: 'Active',
                    metaDataType: 'candidate_status'
                }
            });

        } catch (e) {
            logger.error('Error occurred while finding MetaData  in getMetaData cron %s:', JSON.stringify(e));
        }



        for (let i = 0; i < statuses.length; i++) {
            let templates, date;
            try {
                templates = await Template.findAll({
                    where: {
                        status: 'Active',
                        candidateStatusId: statuses[i].metaDataId,
                        templateType: 'isReminder',
                    },
                    include: [
                        {
                            model: Role,
                            as: 'role',
                            include: [
                                {
                                    model: RoleAssignment,
                                    as: 'roleAssignment',
                                    include: [
                                        {
                                            model: User,
                                            as: 'user'
                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                });
            } catch (e) {
                console.log(e);
            }


            if (statuses[i].displayText.status === 'Selected') {
                for (let j = 0; j < templates.length; j++) {
                    if (templates[j].duration) {
                        let candidates;
                        try {
                            candidates = await Candidate.findAll({
                                where: {
                                    candidateStatusId: statuses[i].metaDataId,
                                    status: 'Active'
                                },
                                include: [
                                    // {
                                    //     model: Interview,
                                    //     as: 'interviews',
                                    //     limit: 1,
                                    //     where: sequelize.where(sequelize.fn('datediff', date, sequelize.col('interviewDate')), {
                                    //         $gte: templates[j].duration
                                    //     }),
                                    //     order: [['interviewRound', 'DESC']]
                                    // },
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
                        }
                        if (candidates.length) {
                            for (let k = 0; k < candidates.length; k++) {
                                await sendMailToUsers(candidates[k], templates[j]);
                            }
                        }
                    }
                }
            }
        }
    };


    cron.schedule('* * * * *', async () => {

        try {
            await sendReminder();
        } catch (e) {
            console.log('Error occurred in cron schedule us %s', JSON.stringify(e));
        }
    }, {
        scheduled: true
    });

})();

