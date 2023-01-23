import { useMsal } from '@azure/msal-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { acquireToken } from '../acquireToken';

let baseURL;

if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://44.199.164.191';
} else {
    baseURL = 'http://localhost:5000';
}

export const EmailRemainder = () => {
    const { instance, accounts } = useMsal();
    const queryClient = useQueryClient();

    
    const role = window.localStorage.getItem('role');

    const createEmailRemainder = useMutation(
        async (mailRemainder) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-info': role
                }
            });
            const { data } = await client.post('/mailRemainder', mailRemainder);
            return data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['getMailRemainder']);
            }
        }
    );

    const updateEmailRemainder = useMutation(
        async (reqInfo) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-info': role
                }
            });
            const { data } = await client.put(`/mailRemainder/${reqInfo.id}`, reqInfo.formData);
            return data;
        },
        {
            onSuccess: (updatedTemplate) => {
                queryClient.invalidateQueries(['getMailRemainder']);
            }
        }
    );

    const getEmailRemainder = useQuery('getMailRemainder', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get('/getMailRemainder?type=reminderTemplate');
        return data;
    });

    const useGetGeneralTemplate = (id) => useQuery(['generalTemplate', id], async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get(`/getMailRemainder/${id}?type=generalTemplate`);
        return data;
    }
    )

    const useEmailRemainder = (id) => useQuery(['mailRemainder', id], async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get(`/mailRemainder/${id}`);
        return data;
    });

    const useGetEmailRemainderStatus = (id) => useQuery(['getMailRemainder', id], async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get(`/getMailRemainder/${id}?type=reminderTemplate`);
        return data;
    })

    const updateDuration = useMutation(
        async (reqInfo) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-info': role
                }
            });
            const { data } = await client.put(`/updateDuration/${reqInfo.id}`, reqInfo.formData);
            return data;
        }
    );

    return {
        createEmailRemainder,
        updateEmailRemainder,
        getEmailRemainder,
        updateDuration,
        useGetEmailRemainderStatus,
        useEmailRemainder,
        useGetGeneralTemplate
    }
};

export const useAdmin = (role) => {
    const { instance, accounts } = useMsal();


    const roles = useQuery('roles', async () => {
    const role = window.localStorage.getItem('role');

        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role

            }
        });
        const { data } = await client.get('/roles');
        return data;
    });

    return {
        roles
    }
};

export const AssignRecruiter = () => {
    const { instance, accounts } = useMsal();
    const queryClient = useQueryClient();
    const role = window.localStorage.getItem('role');

    const assignCandidateToRecruiter = useMutation(
        async (reqInfo) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token}`,
                'user-info': role

                }
            });
            const { data } = await client.put(`/assignCandidateToRecruiter/${reqInfo.candidateId}`, reqInfo.formData);
            return data;
        },
        {
            onSuccess: (updatedCandidate) => {
                queryClient.invalidateQueries(['referalCandidate']);
            },
            onError: (e) => {
                return alert(e.response.data.message);
            }
        }

    );

    return {
        assignCandidateToRecruiter
    }
}