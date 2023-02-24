import { useMsal } from '@azure/msal-react';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { acquireToken } from '../acquireToken';

let baseURL;


if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://hr-app-test-be.futransolutions.com';

} else {
    baseURL = 'http://localhost:5000';
}

export const useSalary =()=>{
    const { instance, accounts } = useMsal();
     

    const CreateSalary = useMutation(
        async (generateSalary) => {
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                'Authorization': `Bearer ${token}`,
                // 'user-info': role

                }
            });
            const { data } = await client.post('/Salary', generateSalary);
            return data;
        }
    )
    // return CreateSalary


    const updateSalary = useMutation(
        async (updateSalary) =>{
            const token = await acquireToken(instance, accounts);
            const client = axios.create({
                baseURL: baseURL,
                headers: {
                'Authorization': `Bearer ${token}`,
                // 'user-info': role

                }
            });
            const { data } = await client.post('/candidateSalary/:CandidateSalaryId', updateSalary);
            return data;
        }
        
    )

    return {
        CreateSalary,
        updateSalary,
  
    }
       
    }


