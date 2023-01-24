import { useMsal } from '@azure/msal-react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { acquireToken } from '../acquireToken';

let baseURL;

if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://hr-app-test-be.futransolutions.com';

} else {
    baseURL = 'http://localhost:5000';
}

export const useInterviews = () => {
    const { instance, accounts } = useMsal();
    const queryClient = useQueryClient();
    const role = window.localStorage.getItem('role');



    const scheduleInterview = useMutation(
        async (reqInfo) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-info': role

                }
            });
            const { data } = await client.post(`/candidate/${reqInfo.candidate_id}/interview`, reqInfo.formData);
            return data;
        },
        {
            onSuccess: (scheduledInterview) => {
                queryClient.setQueryData(['candidate', scheduledInterview.data.candidate_id], (currentCandidate) => {
                    return {
                        status: 'success',
                        statusCode: 200,
                        message: 'Candidate fetched successfully',
                        data: {
                            ...currentCandidate.data,
                            interviews: [scheduledInterview.data, ...currentCandidate.data.interviews]
                        }
                    }
                });
                queryClient.invalidateQueries('candidates');
            },
        }
    );

    const updateInterview = useMutation(
        async (reqInfo) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-info': role

                }
            });
            const { data } = await client.put(`/candidate/${reqInfo.candidate_id}/interview/${reqInfo.interview_id}`, reqInfo.formData);
            return data;
        },
        {
            onSuccess: (updatedInterview) => {
                queryClient.setQueryData(['candidate', updatedInterview.data.candidateId], (currentCandidate) => {
                    return {
                        status: 'success',
                        statusCode: 200,
                        message: 'Candidate fetched successfully',
                        data: {
                            ...currentCandidate.data,
                            interviews: currentCandidate.data.interviews.map(
                                (interview) => (interview.interview_id === updatedInterview.data.interview_id ? updatedInterview.data : interview)
                            )
                        }
                    }
                });
                queryClient.invalidateQueries('candidates');
            },
        }
    );

    return {
        scheduleInterview,
        updateInterview
    }
};