import React, { useState, useEffect, useContext } from 'react';
import './AddOrUpdateJobRequisition.css';
import SpinLoader from '../SpinLoader/SpinLoader';
import CloseIcon from '@mui/icons-material/Close';
import { useJobs } from '../../helpers/hooks/jobsHooks';
import { useUsers } from '../../helpers/hooks/userHooks';
import { useMetaData } from '../../helpers/hooks/metaDataHooks';
import { UserContext } from '../Routes/Routes';



const AddOrUpdateJobRequisition = ({ setIsModalOpen, setEditMode, editMode, job }) => {

  const value = useContext(UserContext);
  const [form, setForm] = useState({});
  const [assignedRecruiters, setAssignedRecruiters] = useState([]);
  const [assignedHiringManager, setAssignedHiringManager] = useState([]);
  const [assign, setAssign] = useState([]);

  const [hiringManagerAssignment, setHiringManagerAssignment] = useState([]);

  const [id, setId] = useState('');

  const [hiringManagerId, setHiringManagerId] = useState('');

  const { createJobRequisition, updateJobRequisition } = useJobs();

  const { hiringManagers, recruiters } = useUsers(value.data.role);

  const { jobRequisitionStatuses, jobTypes } = useMetaData();

  useEffect(() => {

    if (job?.assignments?.length > 0) {
      setAssignedRecruiters(job.assignments.map(assignment => assignment.assignedRecruiter));
      setAssign(job.assignments.map(assignment => assignment.assignedRecruiter));
    }

    if (job?.hiringManagerAssignments?.length > 0) {
      setAssignedHiringManager(job.hiringManagerAssignments.map(assignment => assignment.assignedHiringManger));
      setHiringManagerAssignment(job.hiringManagerAssignments.map(assignment => assignment.assignedHiringManger));
    }

    if (createJobRequisition.isSuccess || updateJobRequisition.isSuccess) {
      setEditMode(false);
      setIsModalOpen(false);
    }

  }, [createJobRequisition.isSuccess, updateJobRequisition.isSuccess]);

  // if(hiringManagers.isLoading || recruiters.isLoading || jobRequisitionStatuses.isLoading || jobTypes.isLoading || createJobRequisition.isLoading || updateJobRequisition.isLoading) {
  //   return <SpinLoader />
  // }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (assign.length > 0) {

      for (let i = 0; i < assignedRecruiters.length; i++) {
        let index = assign.findIndex(recruiter => recruiter.user_id === assignedRecruiters[i].user_id);
        if (index !== -1) {
          assign.splice(index, 1);
        }
      }

      if (assign.length > 0) {
        form.assignedRecruiters = JSON.stringify(assign);
      }

    }

    if (hiringManagerAssignment.length > 0) {
      for (let i = 0; i < assignedHiringManager.length; i++) {
        let index = hiringManagerAssignment.findIndex(manager => manager.user_id === assignedHiringManager[i].user_id);
        if (index !== -1) {
          hiringManagerAssignment.splice(index, 1);
        }
      }

      if (hiringManagerAssignment.length > 0) {
        form.assignedHiringManagers = JSON.stringify(hiringManagerAssignment);
      }
    }

    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    if (editMode) {
      updateJobRequisition.mutate({ id: job?.job_id, formData });
    } else {
      createJobRequisition.mutate(formData);
    }
  }

  console.log(job)
  return (
    <div className='addJobRequistion-block'>
      <div className='overlay-jobRequisiton'>
        <form className='jobRequisiton-block__form' action="" onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data">
          <CloseIcon className='addJobRequistion-block__icon addJobRequistion-block__icon--close' onClick={(e) => {
            setEditMode(false);
            setIsModalOpen(false)
          }} />
          <div className='jobRequisiton-block__col1'>

            <label htmlFor="job_code">Job Code</label>
            <input type="text" id='job_code' defaultValue={job?.jobCode} name='job_code' onChange={(e) => handleChange(e)} readOnly />

            <label htmlFor="company">Company</label>
            <input type="text" id='company' defaultValue={job?.company} name='company' onChange={(e) => handleChange(e)} readOnly />

            <label htmlFor="payRateType">Pay Rate</label>
            <input type="text" id='payRateType' defaultValue={job?.payRates[0]?.pay_rate} name='payRateType' onChange={(e) => handleChange(e)} readOnly />
            <label htmlFor="skills">Primary Skills</label>
            <input type="text" id='skills' defaultValue={job?.primarySkills} name='primarySkills' onChange={(e) => handleChange(e)} readOnly />

            {/* [11:47] Shivam Sharma */}
            <label htmlFor="assignmentContainer">Assigned Recruiters</label>
            <div id='assignmentContainer' className='jobRequisiton-block__assignmentContainer' onDragOver={(e) => {
              e.preventDefault();
              let recruiter = recruiters.data.data.filter((recruiter) => recruiter.user_id === id)[0];

              let index = assignedRecruiters.findIndex((elem) => {
                return elem.user_id === recruiter.user_id
              });

              let index2 = assign.findIndex((elem) => {
                return elem.user_id === recruiter.user_id
              });
              if (index === -1 && index2 === -1) {
                setAssign((prev) => [...prev, recruiter]);
              }
            }}>
              {assign?.map((recruiter) =>
                <p key={recruiter.user_id}>{recruiter.display_name}</p>
              )}
            </div>

            <label htmlFor="job_description">Job Description</label>
            <textarea className='jobRequisiton-block__jobDescription' name="jobDescription" id="jobDescription" cols="30" rows="10" defaultValue={job?.jobDescription} readOnly />

            <label htmlFor="priority">Priority</label>
            <select id='priority' name='priority' defaultValue={job?.priority} onChange={(e) => handleChange(e)} required>
              <option key="" value=""></option>
              <option key="High" value="High">High</option>
              <option key="Medium" value="Medium">Medium</option>
              <option key="Low" value="Low">Low</option>
            </select>

            {/* <label htmlFor="payRateType">Pay Rate Currency</label>
            <input type="text" id='payRateType' defaultValue={JSON.parse(job.payRates)[0].pay_rate_currency} name='payRateType'onChange={(e) => handleChange(e)} required/> */}

            {/* <label htmlFor="payRateType">Pay Rate Frequency Type</label>
            <input type="text" id='payRateType' defaultValue={JSON.parse(job.payRates)[0].pay_rate_pay_frequency_type} name='payRateType'onChange={(e) => handleChange(e)} required/>

            <label htmlFor="payRateType">Min Pay Rate</label>
            <input type="text" id='payRateType' defaultValue={JSON.parse(job.payRates)[0].min_pay_rate} name='payRateType'onChange={(e) => handleChange(e)} required/>

            <label htmlFor="payRateType">Employment Type</label>
            <input type="text" id='payRateType' defaultValue={JSON.parse(job.payRates)[0].pay_rate_employment_type} name='payRateType'onChange={(e) => handleChange(e)} required/> */}

            {/* <label className='jd_attachment' htmlFor="jd_attachment">Attachment</label>
              {!editMode ? <input required type="file" id="jd_attachment" name="file" onChange={(e) => {setForm({...form, [e.target.name]: e.target.files[0]})}}/> : <button className='' onClick={(e) =>  window.location.href = job?.job_description_path}>Download Attachment</button>} */}
          </div>

          <div className='jobRequisiton-block__col2'>
            <label htmlFor="job_title">Job Title</label>
            <input type="text" id='job_title' defaultValue={job?.jobTitle} name='job_title' onChange={(e) => handleChange(e)} readOnly />

            <label htmlFor="positions">No of Positions</label>
            <input type="number" id='positions' defaultValue={job?.noOfPositions} name='no_of_positions' onChange={(e) => handleChange(e)} readOnly />

            <label htmlFor="experience">Experience</label>
            <input type="text" id='experience' defaultValue={job?.experience} name='experience' onChange={(e) => handleChange(e)} readOnly />

            <label htmlFor="createdDate">Created Date</label>
            <input type="text" id='createdDate' defaultValue={job?.createdDate ? new Date(job?.createdDate).toLocaleDateString() : ''} name='createdDate' onChange={(e) => handleChange(e)} readOnly />

            <label htmlFor="assignmentContainer">Assigned Hiring Managers</label>
            <div id='assignmentContainer' className='jobRequisiton-block__assignmentContainer' onDragOver={(e) => {
              e.preventDefault();
              let manager = hiringManagers.data.data.filter((manager) => manager.user_id === hiringManagerId)[0];

              let index = assignedRecruiters.findIndex((elem) => {
                return elem.user_id === manager.user_id
              });

              let index2 = hiringManagerAssignment.findIndex((elem) => {
                return elem.user_id === manager.user_id
              });
              if (index === -1 && index2 === -1) {
                setHiringManagerAssignment((prev) => [...prev, manager]);
              }
            }}>
              {hiringManagerAssignment?.map((manager) =>
                <p key={manager.user_id}>{manager.display_name}</p>
              )}
            </div>

            <label htmlFor="can-engage">Can Engage External Consultants</label>
            <select id='can-engage' name='canEngageExternalConsultants' defaultValue={job?.canEngageExternalConsultants} onChange={(e) => handleChange(e)} required>
              <option key="" value=""></option>
              <option key="Yes" value="Yes">Yes</option>
              <option key="No" value="No">No</option>
            </select>

            <label htmlFor="job_type">Job Type</label>
            <select defaultValue={job?.jobTypeId} name="jobTypeId" id="jobTypeId" onChange={(e) => handleChange(e)} required>
              <option key="" value=""></option>
              {jobTypes?.data && jobTypes.data.data.map((jobType) =>
                <option key={jobType.metaDataId} value={jobType.metaDataId}>{jobType.displayText}</option>
              )}
            </select>

            <label htmlFor="status">Status</label>
            <select id='status' name='jobRequisitionStatusId' defaultValue={job?.jobRequisitionStatus?.metaDataId} onChange={(e) => handleChange(e)} disabled>
              <option key="" value=""></option>
              {jobRequisitionStatuses?.data && jobRequisitionStatuses.data.data.map((status) =>
                <option key={status.metaDataId} value={status.metaDataId}>{status.displayText.status}</option>
              )}
            </select>

            {/* <label htmlFor="hiringManager">Hiring Manager</label>
            <select  name="hiring_manager_id" id="hiringManager"  onChange={(e) => handleChange(e)} multiple required>
              <option key="" value=""></option>
              {managers?.data && managers.data.map((manager) =>
                <option key={manager.user_id} value={manager.user_id}>{manager.display_name}</option>
              )}
            </select> */}
            {/* <input type="text" id='hiringManager' name='hiringManager' onChange={(e) => handleChange(e)} required/> */}

            {/* <label htmlFor="designation">Designation</label>
            <input type="text" id='designation' defaultValue={job?.designation} name='designation'onChange={(e) => handleChange(e)} required/> */}

            <input className="addJobRequistion-block_btnSubmit" type="submit" value={`${editMode ? "Update" : "Add"}`} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddOrUpdateJobRequisition;

