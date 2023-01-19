import { useMsal } from '@azure/msal-react';
import { useQueryClient, useQuery } from 'react-query';
import axios from 'axios';
import { acquireToken } from '../acquireToken';
import moment from 'moment';

let baseURL;

if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://44.199.164.191';
} else {
    baseURL = 'http://localhost:5000';
}

export const useDashboard = () => {
    const {instance, accounts} = useMsal();
    const queryClient = useQueryClient();

    const useGetDashboard = (filter) => useQuery('dashboard', async () => {
        let query;
        let keys = Object.keys(filter);
        if (keys.length > 0 && keys.length === 1 ) {
            if(keys[0] === 'startDate' || keys[0] === 'endDate')
            {
                query = `?${keys[0]}=${moment(filter[keys[0]]['$d']).format('YYYY-MM-DD')}`;

            }else{
                query = `?${keys[0]}=${filter[keys[0]]}`;
            }
        } else if (keys.length > 0 && keys.length > 1) {
            query = '?';
            for (let i = 0; i < keys.length; i++) {
                if(keys[i] === 'startDate' || keys[i] === 'endDate'){
                    query += `${keys[i]}=${moment(filter[keys[i]]['$d']).format('YYYY-MM-DD')}&`
                }else{
                    query += `${keys[i]}=${filter[keys[i]]}&`
                }
            }
        }
        const token = await acquireToken(instance, accounts);
        const client = axios.create({
            baseURL: baseURL,
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        const { data } = await client.get(`/dashboard${query ? query : ''}`);

        return data;
    });

    // const useGetRecruiterDetails =  useQuery('recruiterDetails', async () => {
    //     const token = await acquireToken(instance, accounts);
    //     const client = axios.create({
    //         baseURL: baseURL,
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     });
    //     const { data } = await client.get(`/recruiterDetails`);
    //     return data;
    // }
    // )


    return {
        useGetDashboard,
        // useGetRecruiterDetails
    }

};