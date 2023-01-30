import { useMsal } from '@azure/msal-react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { acquireToken } from '../acquireToken';

let baseURL;

if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://hr-app-test-be.futransolutions.com';

} else {
    baseURL = 'http://localhost:5000';
}

export const useCandidates = () => {
    const { instance, accounts } = useMsal();
    const queryClient = useQueryClient();

    const role = window.localStorage.getItem('role');

    // const useGetCandidates = (filter) => useQuery('candidates', async () => {
    //     let query;
    //     let keys = Object.keys(filter);
    //     if (keys.length > 0 && keys.length === 1 ) {
    //         query = `?${keys[0]}=${filter[keys[0]]}`;
    //     } else if (keys.length > 0 && keys.length > 1) {
    //         query = '?';
    //         for (let i = 0; i < keys.length; i++) {
    //             query += `${keys[i]}=${filter[keys[i]]}&`
    //         }
    //     }
    //     const token = await acquireToken(instance, accounts);
    //     const client = axios.create({
    //         baseURL: baseURL,
    //         headers: {
    //         'Authorization': `Bearer ${token}`
    //         }
    //     });
    //     const { data } = await client.get(`/candidates${query ? query : ''}`);
    //     return data;
    // });

    const useGetCandidates = (filter) => useInfiniteQuery('candidates', async ({ pageParam = 1 }) => {
        let query;
        filter.page = pageParam;
        let keys = Object.keys(filter);
        if (keys.length > 0 && keys.length === 1) {
            query = `?${keys[0]}=${filter[keys[0]]}`;
        } else if (keys.length > 0 && keys.length > 1) {
            query = '?';
            for (let i = 0; i < keys.length; i++) {
                query += `${keys[i]}=${filter[keys[i]]}&`
            }
        }
        const token = await acquireToken(instance, accounts);

        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role
            }
        });
        const { data } = await client.get(`/candidates${query ? query : ''}`);

        return data;
    }, {
        getNextPageParam: (lastPage, allPages) => {
            const maxPages = lastPage.data.count / 30;
            const nextPage = allPages.length + 1;
            return nextPage <= maxPages ? nextPage : undefined;
        },
    });

    const createCandidate = useMutation(
        async (candidate) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-info': role

                }
            });
            const { data } = await client.post('/candidate', candidate);
            return data;
        },
        {
            onSuccess: (addedCandidate) => {
                queryClient.setQueryData('candidates', (currentCandidates) => {
                    return {
                        ...currentCandidates,
                        pages: currentCandidates.pages.map((page, i) => {
                            if (i === 0) {
                                return {
                                    status: 'success',
                                    statusCode: 200,
                                    message: 'Candidates fetched successfully',
                                    data: {
                                        count: page.data.count,
                                        rows: [addedCandidate.data, ...page.data.rows]
                                    }
                                }
                            }
                            return page;
                        })
                    };
                });
            },
            onError: (e) => {
                alert(e.response.data.message);
            }
        }
    );

    const updateCandidate = useMutation(
        async (reqInfo) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-info': role

                }
            });
            const { data } = await client.put(`/candidate/${reqInfo.id}`, reqInfo.formData);
            return data;
        },
        {
            onSuccess: (updatedCandidate) => {
                queryClient.setQueryData('candidates', (currentCandidates) => {

                    if (!updatedCandidate.data.isMailSent) {
                        alert('Mail not sent to candidate');
                    }
                    return {
                        ...currentCandidates,
                        pages: currentCandidates.pages.map((page) => {
                            return {
                                status: 'success',
                                statusCode: 200,
                                message: 'Candidates fetched successfully',
                                data: {
                                    count: page.data.count,
                                    rows: page.data.rows.map((candidate) => (candidate.candidateId === updatedCandidate.data.candidateId ? updatedCandidate.data : candidate))
                                }
                            }
                        })
                    };
                });
            },
            onError: (e) => {
                return alert(e.response.data.message);
            }
        },
    );

    const useCandidate = (id) => useQuery(['candidate', id], async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role

            }
        });
        const { data } = await client.get(`/candidate/${id}`);
        return data;
    });

    const changeStatus = useMutation(
        async (reqInfo) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-info': role

                }
            });
            const { data } = await client.delete(`/candidate/${reqInfo.id}`);
            return data;
        },
        {
            onSuccess: (updatedCandidate) => {
                queryClient.setQueryData('candidates', (currentCandidates) => {
                    return {
                        ...currentCandidates,
                        pages: currentCandidates.pages.map((page) => {
                            return {
                                status: 'success',
                                statusCode: 200,
                                message: 'Candidates fetched successfully',
                                data: {
                                    count: page.data.count,
                                    rows: page.data.rows.filter((candidate) => (candidate.candidate_id !== updatedCandidate.data.candidate_id))
                                }
                            }
                        })
                    };
                });
            },
        }
    );

    const uploadDocuments = useMutation(
        async (reqInfo) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-info': role

                }
            });
            const { data } = await client.post(`/uploadDocuments`, reqInfo.formData);
            return data;
        },
        {
            onSuccess: (updatedCandidate) => {
                queryClient.setQueryData('candidates', (currentCandidates) => {
                    return {
                        ...currentCandidates,
                        pages: currentCandidates.pages.map((page) => {
                            return {
                                status: 'success',
                                statusCode: 200,
                                message: 'Candidates fetched successfully',
                                data: {
                                    count: page.data.count,
                                    rows: page.data.rows.map((candidate) => (candidate.candidate_id === updatedCandidate.data.candidate_id ? updatedCandidate.data : candidate))
                                }
                            }
                        })
                    };
                });
            }
        }
    );

    const deleteDocument = useMutation(
        async (reqInfo) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-info': role

                }
            });
            const { data } = await client.post(`/uploadDocuments`, reqInfo.formData);
            return data;
        },
        {
            onSuccess: (updatedCandidate) => {
                queryClient.setQueryData('candidates', (currentCandidates) => {
                    return {
                        ...currentCandidates,
                        pages: currentCandidates.pages.map((page) => {
                            return {
                                status: 'success',
                                statusCode: 200,
                                message: 'Candidates fetched successfully',
                                data: {
                                    count: page.data.count,
                                    rows: page.data.rows.map((candidate) => (candidate.candidate_id === updatedCandidate.data.candidate_id ? updatedCandidate.data : candidate))
                                }
                            }
                        })
                    };
                });
            }
        }
    );

    // const createOnboarding = useMutation(
    //     async (onBoarding) => {
    //         const token = await acquireToken(instance, accounts);
    //         const client = axios.create({
    //             baseURL: baseURL,
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         const { data } = await client.post('/onboardingDetails', onBoarding);
    //         return data;
    //     },
    //     {
    //         onSuccess: (updatedCandidate) => {
    //             queryClient.setQueryData('candidates', (currentCandidates) => {
    //                 console.log(updatedCandidate)
    //                 return {
    //                     ...currentCandidates,
    //                     pages: currentCandidates.pages.map((page) => {
    //                         return {
    //                             status: 'success',
    //                             statusCode: 200,
    //                             message: 'Candidates fetched successfully',
    //                             data: {
    //                                 count: page.data.count,
    //                                 rows: page.data.rows.map((candidate) => (candidate.candidate_id === updatedCandidate.data.candidate_id ? updatedCandidate.data : candidate))
    //                             }
    //                         }
    //                     })
    //                 };
    //             });
    //         }
    //     }
    // );

    // const updateOnBoarding = useMutation(
    //     async (reqInfo) => {
    //         const token = await acquireToken(instance, accounts);
    //         const client = axios.create({
    //             baseURL: baseURL,
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         const { data } = await client.put(`/onboarding/${reqInfo.id}`, reqInfo.formData);
    //         return data;
    //     },
    //     {
    //         // onSuccess: () => {
    //         //     queryClient.invalidateQueries(['candidates']);
    //         // }
    //         onSuccess: (updatedCandidate) => {
    //             queryClient.setQueryData('candidates', (currentCandidates) => {
    //                 console.log(updatedCandidate)
    //                 return {
    //                     ...currentCandidates,
    //                     pages: currentCandidates.pages.map((page) => {
    //                         return {
    //                             status: 'success',
    //                             statusCode: 200,
    //                             message: 'Candidates fetched successfully',
    //                             data: {
    //                                 count: page.data.count,
    //                                 rows: page.data.rows.map((candidate) => (candidate.candidate_id === updatedCandidate.data.candidate_id ? updatedCandidate.data : candidate))
    //                             }
    //                         }
    //                     })
    //                 };
    //             });
    //         }
    //     }
    // );

    // const getOnBoarding = useQuery('getOnBoarding', async () => {
    //     const token = await acquireToken(instance, accounts);
    //     const client = axios.create({
    //         baseURL: baseURL,
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     });
    //     const { data } = await client.get(`/onboarding`);
    //     return data;
    // });

    return {
        useGetCandidates,
        createCandidate,
        updateCandidate,
        changeStatus,
        // updateOnBoarding,
        // getOnBoarding,
        useCandidate,
        uploadDocuments,
        // createOnboarding,
        deleteDocument
    }

};