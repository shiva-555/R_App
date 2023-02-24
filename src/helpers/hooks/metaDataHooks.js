import { useMsal } from '@azure/msal-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { acquireToken } from '../acquireToken';

let baseURL;

if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://hr-app-test-be.futransolutions.com';

} else {
    baseURL = 'http://localhost:5000';
}

export const useMetaData = () => {
    const { instance, accounts } = useMsal();
    const role = window.localStorage.getItem('role');

    const candidateStatuses = useQuery('candidateStatuses', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=candidateStatuses');
        return data;
    });

    const interviewStatuses = useQuery('interviewStatuses', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role

            }
        });
        const { data } = await client.get('/metaData?type=interviewStatuses');
        return data;
    });

    const jobTypes = useQuery('jobTypes', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=jobTypes');
        return data;
    });

    const jobLocations = useQuery('jobLocations', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=jobLocations');
        return data;
    });

    const sources = useQuery('sources', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=sources');
        return data;
    });

    const jobRequisitionStatuses = useQuery('jobRequisitionStatuses', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=jobRequisitionStatuses');
        return data;
    });

    const backoutReasons = useQuery('backoutReasons', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=backoutReasons');
        return data;
    });

    const costCenter = useQuery('costCenter', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=costCenter');
        return data;
    });

    const department = useQuery('department', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=department');
        return data;
    });

    const division = useQuery('division', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=division');
        return data;
    });

    const devices = useQuery('devices', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=devices');
        return data;
    });

    const gender = useQuery('gender', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=gender');
        return data;
    });

    const salaryDetails = useQuery('salaryDetails', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/metaData?type=salary');
        return data;
    });

    return {
        candidateStatuses,
        interviewStatuses,
        jobTypes,
        jobLocations,
        sources,
        jobRequisitionStatuses,
        backoutReasons,
        costCenter,
        department,
        division,
        devices,
        gender,
        salaryDetails
    }
};