'use strict';

const db = require('../models/indexModel');
const { Template } = db;
const { Role } = db;
const { RoleAssignment } = db;
const { User } = db;
const axios = require('axios');
const qs = require('qs');
const _ = require('lodash');
const { parse } = require('dotenv');


//! Not tested
exports.getUserRoles = async (user) => {
    let assignments, roles = [];

    try {
        assignments = await user.getRoleAssignments();
    } catch (e) {
        return e;
    }

    if (assignments && assignments.length > 0) {
        for (let i = 0; i < assignments.length; i++) {
            let assignedRole;
            try {
                assignedRole = await assignments[i].getAssignedRoles();
            } catch (e) {
                return e;
            }

            if (assignedRole) {
                roles.push(assignedRole.roleName);
            }
        }
    }

    return roles;
}
//* Tested Working *
exports.getApplicationToken = async () => {
    const data = {
        grant_type: `${process.env.GRANT_TYPE}`,
        client_id: `${process.env.CLIENT_ID}`,
        scope: `${process.env.APPLICATION_SCOPE}`,
        client_secret: `${process.env.CLIENT_SECRET}`
    }

    let response;

    // Generating application token
    try {
        response = await axios.get(`${process.env.CLOUD_INSTANCE}${process.env.TENANT_ID}/oauth2/${process.env.VERSION}/token`, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
        });
    } catch (e) {
        return e;
    }
    return response.data.access_token;
};

//* Tested Working *
exports.sendCalendarInvite = async (candidate, recruiterEmail, candidateEmail, panelEmail, body, startTime, endTime, token) => {
    let response, attendees;

    if (panelEmail.includes(',')) {
        attendees = panelEmail.split(',').map((email) => ({ 'emailAddress': { 'address': email.trim() }, 'type': 'required' }))
    } else {
        attendees = [{
            "emailAddress": {
                "address": panelEmail.trim()
            }
        }]
    }

    // console.log(attendees);

    // console.log([
    //   {
    //     emailAddress: {
    //       address: `${candidateEmail}`
    //     },
    //     type: "required"
    //   }
    // ].concat(attendees));
    // sending calendate invite to panel and candidate
    try {
        console.log(candidate.dataValues);
        response = await axios.post(`${process.env.GRAPH_API_ENDPOINT}v1.0/users/${recruiterEmail}/calendar/events`, {
            subject: `Interview is scheduled for ${candidate.dataValues.candidateName}(${candidate.dataValues.jobTitle.jobTitle.split('-')[0]})`,
            body: {
                contentType: "HTML",
                content: `${body}`
            },
            start: {
                dateTime: `${startTime}`,
                timeZone: "India Standard Time"
            },
            end: {
                dateTime: `${endTime}`,
                timeZone: "India Standard Time"
            },
            location: {
                displayName: "Microsoft Teams"
            },
            attendees: [
                {
                    emailAddress: {
                        address: `${candidateEmail}`
                    },
                    type: "required"
                }
            ].concat(attendees),
            isOnlineMeeting: true,
            onlineMeetingProvider: "teamsForBusiness"
        }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        console.log(e);
        return e;
    }
    return response;
};

//* Tested Working *
exports.sendMailToPanel = async (candidate, sendTo, interviewBody) => {
    let token, response, recepients;

    // Getting application token
    try {
        token = await this.getApplicationToken();
    } catch (e) {
        return e;
    }

    if (sendTo.includes(',')) {
        recepients = sendTo.split(',').map((email) => ({ 'emailAddress': { 'address': email.trim() } }))
    } else {
        recepients = [{
            "emailAddress": {
                "address": sendTo.trim()
            }
        }]
    }


    try {
        response = await axios.post(`${process.env.GRAPH_API_ENDPOINT}v1.0/users/${candidate.createdBy.email}/sendMail`, {
            "message": {
                "subject": `Interview is scheduled for ${candidate.candidateName}(${candidate.jobTitle.jobTitle.split('-')[0]})`,
                "body": {
                    "contentType": "HTML",
                    "content": `
              <p>${interviewBody}</p>
              <br>
              <ul>
                <li>Name: ${candidate.candidateName}</li>
                <li>Total Experience: ${candidate.totalExperience}</li>
                <li>Relevant Experience: ${candidate.relevantExperience}</li>
                <li>Current CTC: ${candidate.currentCTC}</li>
                <li>Expected CTC: ${candidate.expectedCTC}</li>
                <li>Notice Period: ${candidate.noticePeriodInDays}</li>
              </ul>
              <br>
              <a href='${candidate.documents[0].downloadLink}' download>Download Candidate Resume</a>
            `
                },
                "toRecipients": recepients
            },
            "saveToSentItems": "true"
        }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        return e;
    }

    return response.data;
};

//! Working but Not tested
exports.uploadResumeToOneDrive = async (path, data, mimetype) => {
    let fileResponse, token;

    // Getting application token
    try {
        token = await this.getApplicationToken();
    } catch (e) {
        return e;
    }

    try {
        fileResponse = await axios.put(`${process.env.GRAPH_API_ENDPOINT}v1.0/users/${process.env.ONEDRIVE_USER}/drives/${process.env.ONEDRIVE_ID}/root:/Candidates/${path}:/content`, data, { headers: { Authorization: `Bearer ${token}`, "Content-Type": mimetype } });

    } catch (e) {
        console.log(e);
        return e;
    }

    return fileResponse.data;
}

//! Working but Not tested
exports.createOneDriveResumeLink = async (id) => {
    let link, token;

    // Getting application token
    try {
        token = await this.getApplicationToken();
    } catch (e) {
        return e;
    }

    try {
        link = await axios.post(`${process.env.GRAPH_API_ENDPOINT}v1.0/users/${process.env.ONEDRIVE_USER}/drives/${process.env.ONEDRIVE_ID}/items/${id}/createLink`, {
            "type": "view",
            "scope": "anonymous"
        }, { headers: { Authorization: `Bearer ${token}` } });

    } catch (e) {
        return e;
    }

    return link.data;
};

//! Not tested

exports.uploadAttachmentToSharepoint = async (filename, data, mimetype) => {
    let fileResponse, urlResponse, token;

    // Getting application token
    try {
        token = await this.getApplicationToken();
    } catch (e) {
        return e;
    }

    // Uploading Attachment to sharepoint
    try {
        fileResponse = await axios.put(`${process.env.GRAPH_API_ENDPOINT}v1.0/sites/${process.env.COMMON_SITE_ID}/drives/${process.env.COMMON_DRIVE_ID}/root:/Hiring/Candidates/${filename}:/content`, data, { headers: { Authorization: `Bearer ${token}`, "Content-Type": mimetype } });
    } catch (e) {
        return e;
    }

    // Getting downloadable link of attachment
    // try {
    //   urlResponse = await axios.get(`${process.env.GRAPH_API_ENDPOINT}v1.0/sites/${process.env.TEST_SITE_ID}/drives/${process.env.TEST_DRIVE_ID}/items/${fileResponse.data.id}?select=id,@microsoft.graph.downloadUrl`, {headers: {Authorization: `Bearer ${token}`}})
    // } catch (e) {
    //   return e;
    // }
    // console.log(urlResponse.data);

    // return urlResponse.data["@microsoft.graph.downloadUrl"];

    return fileResponse.data.webUrl
};

//! Not tested

exports.uploadDocumentsToSharepoint = async (path, data, mimetype) => {
    let fileResponse, token;

    // Getting application token
    try {
        token = await this.getApplicationToken();
    } catch (e) {
        return e;
    }

    // Uploading Attachment to sharepoint
    try {
        fileResponse = await axios.put(`${process.env.GRAPH_API_ENDPOINT}v1.0/sites/${process.env.COMMON_SITE_ID}/drives/${process.env.COMMON_DRIVE_ID}/root:/Documents/Candidates/${path}:/content`, data, { headers: { Authorization: `Bearer ${token}`, "Content-Type": mimetype } });
    } catch (e) {
        return e;
    }

    return fileResponse.data;
};

//! Not tested
exports.deleteDocumentFromSharepoint = async (id) => {
    let token, document;

    try {
        token = await this.getApplicationToken();
    } catch (e) {
        return e;
    }

    try {
        document = axios.delete(`${process.env.GRAPH_API_ENDPOINT}v1.0/sites/${process.env.COMMON_SITE_ID}/drives/${process.env.COMMON_DRIVE_ID}/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        return e;
    }

    return document.data;
};

exports.deleteDocumentFromOneDrive = async (id) => {
    let token, document;

    try {
        token = await this.getApplicationToken();
    } catch (e) {
        return e;
    }

    try {
        document = axios.delete(`${process.env.GRAPH_API_ENDPOINT}v1.0/sites/${process.env.COMMON_SITE_ID}/drives/${process.env.ONEDRIVE_ID}/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        return e;
    }

    return document.data;
};

//* Tested Working *

exports.sendMail = async (to, subject, template, table) => {
    let token, response, toRecipients;

    // Getting application token
    try {
        token = await this.getApplicationToken();
    } catch (e) {
        return e;
    }

    if (to instanceof Array) {
        toRecipients = to.map((mail) => ({
            "emailAddress": {
                "address": mail
            }
        }))
    } else {
        toRecipients = [{
            "emailAddress": {
                "address": to
            }
        }]
    }

    try {
        response = await axios.post(`${process.env.GRAPH_API_ENDPOINT}v1.0/users/helpdeskappconnections@futransolutions.com/sendMail`, {
            "message": {
                "subject": subject,
                "body": {
                    "contentType": "HTML",
                    "content": `
              ${template.message ?
                            `<p>${template.message}</p>
                <br>
                <br>
                `: ''
                        }
              ${table}
            `
                },
                "toRecipients": toRecipients
            },
            "saveToSentItems": "true"
        }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        return e;
    }

    return response.data;
};

//! Not tested

// exports.sendMailTemp = async (to, cc, subject, message) => {
//     let token, response;

//     // Getting application token
//     try {
//         token = await this.getApplicationToken();
//     } catch (e) {
//         return e;
//     }

//     try {
//         response = await axios.post(`${process.env.GRAPH_API_ENDPOINT}v1.0/users/helpdeskappconnections@futransolutions.com/sendMail`, {
//             "message": {
//                 "subject": subject,
//                 "body": {
//                     "contentType": "HTML",
//                     "content": `
//               ${message}
//             `
//                 },
//                 "toRecipients": [
//                     {
//                         "emailAddress": {
//                             "address": to,
//                         }
//                     }
//                 ],
//                 "ccRecipients": [
//                     {
//                         "emailAddress": {
//                             "address": cc
//                         }
//                     }
//                 ]
//             },
//             "saveToSentItems": "true"
//         }, { headers: { Authorization: `Bearer ${token}` } });
//     } catch (e) {
//         return e;
//     }

//     return response.data;
// };

//! Not tested

// exports.createExcelFileForDashboardReport = async (name, data, headingsObj) => {
//     let wb = new xl.Workbook();
//     let ws = wb.addWorksheet('Sheet 1');
//     const len = data.length;

//     let headings = Object.keys(headingsObj);
//     for (let i = 0; i < headings.length; i++) {
//         ws.cell(1, i + 1).string(headings[i]);
//     }

//     for (let i = 0; i < len; i++) {
//         for (let j = 0; j < headings.length; j++) {
//             ws.cell(i + 2, j + 1).string(data[i][headings[j]] ? data[i][headings[j]].toString() : '0');
//         }
//     }

//     return new Promise((resolve, reject) => {
//         wb.write(name, (err, stats) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(stats);
//             }
//         })
//     });
// };

//* Tested Working *
exports.generateTemplate = (template, candidate) => {
    try {
        const regExp = /{(.*?)}/g;
        // const retrievedResult = template.body.match(regExp);    
        let reg1 = /\?(.*?)\?/g;
        let reg2 = /\[(.*?)\]/g;
        let reg3 = /\`(.*?)\`/g;

        let required_docs, retrievedResult, splitTemplate, Combine_temp;

        splitTemplate = template.body.match(reg3);

        if (candidate.candidateType === 1) {
            required_docs = template.body.match(reg1);
        } else {
            required_docs = template.body.match(reg2);
        }

        if (required_docs != null) {
            required_docs = required_docs[0].slice(1, -1);
            Combine_temp = splitTemplate + required_docs;
            retrievedResult = Combine_temp.match(regExp);
        } else {
            Combine_temp = splitTemplate;
            retrievedResult = Combine_temp[0].match(regExp);
            // console.log('=========================');
            // console.log(retrievedResult)
        }

        if (retrievedResult?.length && retrievedResult?.length > 0) {
            for (let i = 0; i < retrievedResult.length; i++) {
                const regExp = /[^{\\}]+(?=})/g;
                const variableName = String(retrievedResult[i].match(regExp)[0]);

                function recursion(candidate) {
                    if (candidate) {
                        if (variableName.includes('.')) {
                            const nestedVariable = variableName.split('.');
                            const value = candidate[nestedVariable[0]][nestedVariable[1]];
                            if (value) {
                                template.body = template.body.replace(retrievedResult[i], value);
                            }
                        }
                        // console.log(candidate);
                        else if (candidate[variableName] && typeof candidate[variableName] !== 'object') {
                            if (candidate[variableName] instanceof Date) {
                                template.body = template.body.replace(retrievedResult[i], moment(candidate[variableName]).format("dddd, MMMM Do YYYY"));
                            } else {
                                template.body = template.body.replace(retrievedResult[i], candidate[variableName]);
                            }
                        } else if (typeof candidate === 'object') {
                            for (const key in candidate) {
                                if (typeof candidate[key] === 'object') {
                                    recursion(candidate[key]);
                                }
                            }
                        }
                    }
                }
                recursion(candidate);
            }
        }

        return template;
    } catch (e) {
        console.log(e);
    }
};

//* Tested Working *
exports.getHierarchy = async (associatedUsers) => {
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

    for (const key in associatedUsers) {
        if (associatedUsers[key]) {
            await getParent(associatedUsers[key]);
        }
    }

    return users;
};

//* Tested Working *
exports.sendMailNew = async (to, subject, body) => {
    try {
        // Getting application token
        const token = await this.getApplicationToken();

        const response = await axios.post(`${process.env.GRAPH_API_ENDPOINT}v1.0/users/helpdeskappconnections@futransolutions.com/sendMail`, {
            "message": {
                "subject": subject,
                "body": {
                    "contentType": "HTML",
                    "content": body,
                },
                "toRecipients": [
                    {
                        "emailAddress": {
                            "address": to
                        }
                    }
                ]
            },
            "saveToSentItems": "true"
        }, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (e) {
        console.log(e);
        return e;
    }
};

//* Tested Working *
exports.sendMailFromGeneralTemplate = async (status, candidate) => {
    try {
        let templates, associatedUsers;

        templates = await Template.findAll({
            where: {
                candidateStatusId: status,
                templateType: 'general',
                status: 'Active'
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
                        // {
                        //     model: candidate,
                        //     as: 'candidate'
                        // }
                    ]
                }
            ]
        });

        associatedUsers = {
            createdBy: candidate.createdBy,
            hr: candidate.hr
        };
        console.log(associatedUsers);
        const users = await this.getHierarchy(associatedUsers);

        if (users.length) {
            for (let i = 0; i < users.length; i++) {
                let user = {
                    roles: [],
                    email: users[i].email,
                    name: users[i].displayName
                };
                const assignments = await users[i].getRoleAssignments();
                for (let j = 0; j < assignments.length; j++) {
                    const role = await assignments[j].getRole();
                    user.roles.push(role.roleName);
                }
                users[i] = user;
            }
        };


        for (let i = 0; i < templates.length; i++) {

            if (templates[i].role.roleName !== 'Candidate' && templates[i].role.roleName !== 'Referal') {
                const sendToUsers = users.filter((user) => user.roles.includes(templates[i].role.roleName));

                if (sendToUsers.length && sendToUsers.length > 0) {
                    const candidateObj = JSON.parse(JSON.stringify(candidate));

                    for (let i = 0; i < sendToUsers.length; i++) {
                        // console.log(sendToUsers[i].roles[0], sendToUsers[i].name);
                        candidateObj[`${sendToUsers[i].roles[0]} Name`] = sendToUsers[i].name
                    }

                    const template = this.generateTemplate(templates[i], candidateObj);
                    if (sendToUsers.length && sendToUsers.length > 0) {
                        for (let i = 0; i < sendToUsers.length; i++) {
                            try {
                                // console.log('################################');
                                // console.log(template.subject);
                                // console.log(sendToUsers[i].email);
                                // console.log(template.body);
                                await this.sendMailNew(sendToUsers[i].email, template.subject, template.body);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }

            } else if (templates[i].role.roleName === 'Referal') {
                if(candidate.isReferal === true){
                    const template = this.generateTemplate(templates[i], JSON.parse(JSON.stringify(candidate)));
                    try {
                        console.log('################################');
                        console.log(template.subject);
                        console.log(candidate.referredBy.user.email);
                        console.log(template.body);
    
                        await this.sendMailNew(candidate.candidateEmail, template.subject, template.body);
                    } catch (e) {
                        console.log(e);
                    }
                }
            } else {
                const template = this.generateTemplate(templates[i], JSON.parse(JSON.stringify(candidate)));
                try {
                    // console.log('################################');
                    // console.log(template.subject);
                    // console.log(candidate.candidateEmail);
                    // console.log(template.body);

                    await this.sendMailNew(candidate.candidateEmail, template.subject, template.body);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    } catch (e) {
        console.log(e);
        return e;
    }
}