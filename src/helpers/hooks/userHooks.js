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

export const useUsers = () => {
    const {instance, accounts} = useMsal();
    const queryClient = useQueryClient();
    const role = window.localStorage.getItem('role');



    const user = useQuery('user', async() => {
        const token  = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
            'Authorization': `Bearer ${token}`,
            'user-info': role
            }
        });
        const { data } = await client.get('/user');
        return data;
    });

    // const appUsers = useQuery('appUsers', async() => {
    //     const token  = await acquireToken(instance, accounts);
    //     const client = axios.create({
    //         baseURL: baseURL,
    //         headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'user-info': role
    //         }
    //     });
    //     const { data } = await client.get('/appUsers');
    //     return data;
    // });

    // const tenantUsers = useQuery('tenantUsers', async() => {
    //     const token  = await acquireToken(instance, accounts);
    //     const client = axios.create({
    //         baseURL: baseURL,
    //         headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'user-info': role
    //         }
    //     });
    //     const { data } = await client.get('/tenantUsers');
    //     return data;
    // });

    // const guestUsers = useQuery('guestUsers', async() => {
    //     const token  = await acquireToken(instance, accounts);
    //     const client = axios.create({
    //         baseURL: baseURL,
    //         headers: {
    //         'Authorization': `Bearer ${token}`
    //         }
    //     });
    //     const { data } = await client.get('/guestusers');
    //     return data;
    // },{
    //     enabled: role && role === 'Admin'
    // });

    const recruiters = useQuery('recruiters', async() => {
        const token  = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
            'Authorization': `Bearer ${token}`,
            'user-info': role
            }
        });
        const { data } = await client.get('/appUsers?role=Recruiter');
        return data;
    }, 
    // {
    //     enabled: role === 'Admin' ? true : false
    // }
    );

    // const hiringManagers = useQuery('hiringManagers', async() => {
    //     const token  = await acquireToken(instance, accounts);
    //     const client = axios.create({
    //         baseURL: baseURL,
    //         headers: {
    //         'Authorization': `Bearer ${token}`
    //         }
    //     });
    //     const { data } = await client.get('/appUsers?role=hiringManager',
        
    //     {
    //         headers: {
    //             'user-info': role
    //         }
    //     }
    //     );
    //     return data;
    // });

    // const createAppUser = useMutation(
    //     async (appUser) => {
    //         const token = await acquireToken(instance, accounts);
    //         const client = axios.create({
    //             baseURL: baseURL,
    //             headers: {
    //             'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         const { data } = await client.post('/appUser', appUser);
    //         return data;
    //     },
    //     {
    //         onSuccess: (addedAppUser) => {
    //             queryClient.setQueryData('appUsers', (currentAppUsers) => [
    //                 ...currentAppUsers,
    //                 addedAppUser,
    //             ]);
    //         },
    //     }
    // );

    // const useUpdateAppUser = (id) => useMutation(
    //     async (appUser) => {
    //         const token = await acquireToken(instance, accounts);
    //         const client = axios.create({
    //             baseURL: baseURL,
    //             headers: {
    //             'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         const { data } = await client.put(`/appUsers/${id}`, appUser);
    //         return data;
    //     },
    //     {
    //         onSuccess: (updatedAppUser) => {
    //             queryClient.setQueryData('appUsers', (currentAppUsers) =>
    //             currentAppUsers.map(
    //                     (appUser) => (appUser.id === updatedAppUser.id ? updatedAppUser : appUser)
    //                 )
    //             );
    //         },
    //     }
    // );

    const addReferalCandidate = useMutation(async (candidate) => {
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
        onSuccess: (updatedCandidate) => {
            queryClient.invalidateQueries(['referalCandidate']);
        },
        onError: (e) => {
            return alert(e.response.data.message);
        }
    }
    
    );

    const useGetReferalCandidates = (id, filter) => useQuery('referalCandidate', async () => {
        let query;
        let keys = Object.keys(filter);
        if (keys.length > 0 && keys.length === 1) {
            query = `&${keys[0]}=${filter[keys[0]]}`;
        } else if (keys.length > 0 && keys.length > 1) {
            query = '?';
            for (let i = 0; i < keys.length; i++) {
                query += `${keys[i]}=${filter[keys[i]]}&`
            }
        }
        const token  = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        const { data } = await client.get(`/getReferralByuserid?userId=${id}${query ? query : ''}`);
        return data;
    });

    const HR = useQuery('HR', async () => {
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-info': role

            }
        });
        const { data } = await client.get(`/hr`);
        return data;

    });

    return {
        user,
        // appUsers,
        // tenantUsers,
        // guestUsers,
        recruiters,
        HR,
        // hiringManagers,
        // createAppUser,
        // useUpdateAppUser
        addReferalCandidate,
        useGetReferalCandidates
    }
};