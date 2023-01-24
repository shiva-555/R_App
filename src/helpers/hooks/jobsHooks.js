import { useMsal } from '@azure/msal-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { acquireToken } from '../acquireToken';

let baseURL;

if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://hr-app-test-be.futransolutions.com';

} else {
    baseURL = 'http://localhost:5000';
}

export const useJobs = () => {
    const {instance, accounts} = useMsal();
    const queryClient = useQueryClient();
    const role = window.localStorage.getItem('role');


    const jobs = useQuery('jobs', async() => {
        const token  = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
            'Authorization': `Bearer ${token}`,
            'user-info': role

            }
        });
        const { data } = await client.get('/jobRequisitions');
        return data;
    });

    const JobsWithRecruiter = useQuery('jobs', async() => {
        const token  = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
            'Authorization': `Bearer ${token}`,
            'user-info': role

            }
        });
        const { data } = await client.get('/getAllJobRequisitions');
        
        return data;
    });

    const createJobRequisition = useMutation(
        async (jobRequisition) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role

                }
            });
            const { data } = await client.post('/jobRequisition', jobRequisition);
            return data;
        },
        {
            onSuccess: (addedJobRequisiton) => {
                queryClient.setQueryData('jobs', (currentJobRequisitions) => {
                        return {
                            status: 'success', 
                            statusCode: 200, 
                            message: 'fetched successfully', 
                            data: [addedJobRequisiton.data, ...currentJobRequisitions.data]
                        }
                    }
                );
            },
        }
    );

    const updateJobRequisition = useMutation(
        async (reqInfo) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role

                }
            });
            const { data } = await client.put(`/jobRequisition/${reqInfo.id}`, reqInfo.formData);
            return data;
        },
        {
            onSuccess: (updatedJobRequisition) => {
                queryClient.setQueryData('jobs', (currentJobRequisitions) => {
                    return {
                        status: 'success', 
                        statusCode: 200, 
                        message: 'fetched successfully', 
                        data: currentJobRequisitions.data.map(
                            (jobRequisition) => (jobRequisition.job_id === updatedJobRequisition.data.job_id ? updatedJobRequisition.data : jobRequisition)
                        )
                    }
                });
            },
        }
    );

    const jobRequisitions = useQuery('recruitersJob', async() => {
        const token  = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        const { data } = await client.get(`/getJobAssignedRecruiter`);
        return data;
    })
    
    return {
        jobs,
        createJobRequisition,
        updateJobRequisition,
        JobsWithRecruiter,
        jobRequisitions
    }
}