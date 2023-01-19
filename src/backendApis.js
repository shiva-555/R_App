import axios from "axios";
import { acquireToken } from "./helpers/acquireToken";

let baseUrl;
if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://44.199.164.191';
} else {
    baseUrl = 'http://localhost:5000';
}

export const getUser = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/user`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e?.response?.data?.message);
    }
    return response.data;
};

// candidate apis

export const getCandidate = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/candidate/${reqInfo.id}`, {headers: {Authorization: bearerToken}});
    } catch (e) {
        throw new Error(e);
    }
    return response.data;
};

export const getCandidates = async (reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response = await axios.get(`${baseUrl}/candidates${reqInfo.keyword ? `?keyword=${reqInfo.keyword}` : ''}${reqInfo.candidate_status_id ? `?status=${reqInfo.candidate_status_id}` : ''}${reqInfo.job ? `?job=${reqInfo.job}` : ''}`, {headers: {Authorization: bearerToken}});
    } catch (e) {
        throw new Error(e);
    }
    return response.data;
};

export const createCandidate = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;

    try {
        response =  await axios.post(`${baseUrl}/candidate`, reqInfo.formData, {headers: {Authorization: bearerToken}});
    } catch (e) {
        throw new Error(e.response.data.message);
    }
    return response.data;  
};

export const updateCandidate = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.put(`${baseUrl}/candidate/${reqInfo.id}`, reqInfo.formData, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e.response.data.message);
    }
    return response.data;
};

export const scheduleInterview = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.post(`${baseUrl}/candidate/${reqInfo.id}/interview`, reqInfo.formData, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

export const updateInterview = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.put(`${baseUrl}/candidate/${reqInfo.candidate_id}/interview/${reqInfo.interview_id}`, reqInfo.formData, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

// Get dashboard
export const getDashboardData = async (reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    let query;
    let keys = Object.keys(reqInfo.filter)
    if (keys.length > 0 && keys.length === 1 ) {
        query = `?${keys[0]}=${reqInfo.filter[keys[0]]}`;
    } else if (keys.length > 0 && keys.length > 1) {
        query = '?';
        for (let i = 0; i < keys.length; i++) {
            query += `${keys[i]}=${reqInfo.filter[keys[i]]}&`
        }
    }
    try {
        response =  await axios.get(`${baseUrl}/dashboard${query ? query : ''}`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

export const getJobRequisitions = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/jobRequisitions`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

export const getCeipalJobs = async (reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/ceipalJobs`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
}

export const createJobRequisition = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.post(`${baseUrl}/jobRequisition`, reqInfo.formData,{headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

export const updateJobRequisition = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.put(`${baseUrl}/jobRequisition/${reqInfo.id}`, reqInfo.formData,{headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

export const getRecruiters = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/appUsers?role=recruiter`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

export const getHiringManagers = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/appUsers?role=hiringManager`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

// Admin
export const getAllTenantUsers = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/tenantUsers${reqInfo.email ? `?email=${reqInfo.email}`: ""}`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e?.response?.data?.message);
    }
    return response.data;
};

export const getAllGuestUsers = async (reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/guestusers${reqInfo.email ? `?email=${reqInfo.email}`: ""}`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e?.response?.data?.message);
    }
    return response.data;
};

export const getAllAppUsers = async (reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/appUsers${reqInfo.email ? `?email=${reqInfo.email}`: ""}`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e?.response?.data?.message);
    }
    return response.data;
}

export const createAppUser = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.post(`${baseUrl}/appUser`, reqInfo.formData, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e.response.data.message);
    }
    return response.data;
};

export const updateAppUser = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.put(`${baseUrl}/appUser/${reqInfo.id}`, reqInfo.formData, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e.response.data.message);
    }
    return response.data;
};

// meta data apis
export const getCandidateStatuses = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/metaData?type=candidateStatuses`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

export const getSources = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/metaData?type=sources`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

export const getJobLocations = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/metaData?type=jobLocations`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

export const getBackoutReasons = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/metaData?type=backoutReasons`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

export const getJobTypes = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/metaData?type=jobTypes`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        throw new Error(e);
    }
    return response.data;
};

export const getInterviewStatuses = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/metaData?type=interviewStatuses`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        console.log(e);
    }
    return response.data;
};

export const getJobRequisitionStatuses = async(reqInfo) => {
    const token  = await acquireToken(reqInfo.instance, reqInfo.accounts);
    const bearerToken = `Bearer ${token}`;
    let response;
    try {
        response =  await axios.get(`${baseUrl}/metaData?type=jobRequisitionStatuses`, {headers: {Authorization: bearerToken}});
    } catch(e) {
        console.log(e);
    }
    return response.data;
};
