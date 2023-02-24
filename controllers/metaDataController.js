'use strict';

const db = require('../models/indexModel');
const { MetaData } = db;
const logger = require('../utils/logger');
const responseFormatter = require('../utils/responseFormatter');

exports.getMetaData = async (req, res) => {
    let metaData, searchCriteria;

    if (req.query.type === 'interviewStatuses') {
        searchCriteria = {
            metaDataType: 'interview_status',
            status: 'Active'
        }
    } 

    if (req.query.type === 'candidateStatuses') {
        searchCriteria = {
            metaDataType: 'candidate_status',
            status: 'Active'
        }
    }

    if (req.query.type === 'backoutReasons') {
        searchCriteria = {
            metaDataType: 'backout_reason',
            status: 'Active'
        }
    }

    if (req.query.type === 'jobTypes') {
        searchCriteria = {
            metaDataType: 'job_type',
            status: 'Active'
        }
    } 

    if (req.query.type === 'jobLocations') {
        searchCriteria = {
            metaDataType: 'job_location',
            status: 'Active'
        }
    } 

    if (req.query.type === 'sources') {
        searchCriteria = {
            metaDataType: 'source',
            status: 'Active'
        }
    } 

    if (req.query.type === 'jobRequisitionStatuses') {
        searchCriteria = {
            metaDataType: 'job_requisition_status',
            status: 'Active'
        }
    } 

    if (req.query.type === 'costCenter') {
        searchCriteria = {
            metaDataType: 'cost_center',
            status: 'Active'
        }
    } 

    if (req.query.type === 'department') {
        searchCriteria = {
            metaDataType: 'department',
            status: 'Active'
        }
    } 

    if (req.query.type === 'division') {
        searchCriteria = {
            metaDataType: 'division',
            status: 'Active'
        }
    } 

    if (req.query.type === 'devices') {
        searchCriteria = {
            metaDataType: 'devices',
            status: 'Active'
        }
    } 

    if (req.query.type === 'gender') {
        searchCriteria = {
            metaDataType: 'gender',
            status: 'Active'
        }
    } 

    if (req.query.type === 'salary') {
        searchCriteria = {
            metaDataType: 'salary',
            status: 'Active'
        }
    } 

    console.log(searchCriteria);

    try {
        metaData = await MetaData.findAll({
            where: searchCriteria,
            attributes: [
                'metaDataId',
                'metaDataType',
                'displayText',
                'order'
            ],
            order: [['order', 'ASC']]
        });
    } catch (e) {
        logger.error('Error occurred while finding metaData in getMetaData controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }
    
    if(!metaData) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No meta data',  'unsucessful', 404));
    }

    return res.status(200).json(responseFormatter.responseFormatter(metaData, 'fetched successfully', 'success', 200));
}

exports.createMetaData = async (req, res) => {
    let metaData;
    
    req.body.createdById = req.user.userId;
    req.body.lastModifiedById = req.user.userId;

    try {
        metaData = await MetaData.create(req.body);
    } catch (e) {
        logger.error('Error occurred while creating meta data in createMetaData controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }
    
    return res.status(201).json(responseFormatter.responseFormatter(metaData, 'Meta data created successful', 'success', 201));
};

exports.updateMetaData = async (req, res) => {
    let metaData;

    try {
        metaData = await MetaData.findByPk(req.params.meta_data_id, {where: {status: 'Active'}});
    } catch (e) {
        logger.error('Error occurred while finding meta data in updateMetaData controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }
    
    if(!metaData) {
        return res.status(404).json(responseFormatter.responseFormatter({}, 'No such meta data',  'unsucessful', 404));
    }

    req.body.lastModifiedById = req.user.userId;

    try {
        metaData = await metaData.update(req.body);
    } catch (e) {
        logger.error('Error occurred while updating meta data in updateMetaData controller %s:', JSON.stringify(e));
        return res.status(500).json(responseFormatter.responseFormatter({}, 'An error occurred', 'error', 500));
    }

    return res.status(200).json(responseFormatter.responseFormatter(metaData, 'Meta data updated successful', 'success', 200));
};