import React, {useState} from 'react';
import './AssignJobRequisition.css';
import { useQuery, useMutation } from 'react-query';
import { useMsal } from '@azure/msal-react';
import { getRecruiterAssignedjobs, assignJobRequisition } from '../../backendApis';
import SpinLoader from '../SpinLoader/SpinLoader';
import CloseIcon from '@mui/icons-material/Close';

const AssignJobRequisition = ({user, jobs, setIsModalOpen2}) => {
    const {instance, accounts} = useMsal();
    const [form, setForm] = useState({recruiter_id: user.user_id});

    const {data: assignedJobs, isLoading: jobLoading} = useQuery('getRecruiterAssignedJob', () => getRecruiterAssignedjobs({instance, accounts, id: user.user_id}), {retry: false} )
    const {mutate, isLoading } = useMutation('assignJobRequisition', assignJobRequisition);
    
    console.log(assignedJobs);

    if(isLoading || jobLoading) {
        return <SpinLoader />
    }

    const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        if(!form.hasOwnProperty('job_id')){
            form.job_id = jobs[0].job_id
        }

        Object.keys(form).forEach(key => {
            formData.append(key, form[key]);
        });

        mutate({instance, accounts, formData});
        setIsModalOpen2(false);
    }

  return (
    <div className='assign-block'>
    <div className='assign-block__overlay'>
        <form action="" className='assign-block__form' onSubmit={(e) => handleSubmit(e)}>
        <CloseIcon className="assign-block__close" onClick={() => {
          setIsModalOpen2(false);
          }}/>
            <label htmlFor="dispaly_name">Display Name</label>
            <input id="display_name" type="text" value={user.display_name} readOnly/>
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={user.email} readOnly />
            <label htmlFor="jobs">Assigned Jobs</label>
            <select name="jobs" id="jobs" readOnly>
                {assignedJobs?.data && assignedJobs?.data.map((job) => 
                    <option key={job.assignment_id} value={job.assignedJob.job_id}>{job.assignedJob.job_title}</option>
                )}
            </select>
            <label  htmlFor="jobs1">Assign jobs</label>
            <select name="job_id" id="jobs1" onChange={(e) => handleChange(e)}>
                {jobs && jobs?.map((job) => 
                    <option key={job.job_id} value={job.job_id}>{job.job_title}</option>
                )}
            </select>
            <input className='assign-block__submit' type="submit" value="Assign" />
        </form>
    </div>
</div>
  )
}

export default AssignJobRequisition