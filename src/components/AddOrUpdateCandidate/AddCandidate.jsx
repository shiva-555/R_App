// import React, { useState, useEffect, useContext } from 'react';
// import './AddCandidate.css';
// import CloseIcon from '@mui/icons-material/Close';
// import SpinLoader from '../SpinLoader/SpinLoader';
// import { UserContext } from '../Routes/Routes';
// import { useCandidates } from '../../helpers/hooks/candidatesHooks';
// import { useMetaData } from '../../helpers/hooks/metaDataHooks';
// import { useJobs } from '../../helpers/hooks/jobsHooks';
// import { useUsers } from '../../helpers/hooks/userHooks';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { render } from '@testing-library/react';
// import { DocumentUpload } from '../DocumentUpload/DocumentUpload';
// import OnBoardingForm from '../OnBoardingForm/OnBoardingForm';
// import { useQueries } from 'react-query';

// const AddOrUpdateCandidate = ({ setIsModalOpen, setEditMode, editMode, candidate, statuses, isModalOpen, afterSelectStatus }) => {
//   const [form, setForm] = useState({});
//   const [reportingManager, setReportingManager] = useState(null);
//   const [designation, setDesignation] = useState(null);
//   const [company, setCompany] = useState(null);
//   const [showDocumentUploadComp, setShowDocumentUploadComp] = useState(null);
//   const value = useContext(UserContext);
//   const [candidateStatuses, setCandidateStatuses] = useState(statuses);
//   const { createCandidate, updateCandidate, changeStatus, getOnBoarding, uploadDocuments } = useCandidates();
//   const { sources, jobLocations, backoutReasons, gender } = useMetaData();
//   const { jobs } = useJobs();
//   const [remark, setRemark] = useState(candidate?.remark);
//   const [showBtn, setShowBtn] = useState(false);
//   const [show, setShow] = useState(false);
//   const [ showOthers, setShowOthers ] = useState(candidate?.other_source !== null ? true : false);
//   const [candidateType, setCandidateType] = useState();
  

//   function inputDisable(statuses) {
//     const selectValue = document.querySelector('#candidate_status')?.value;

//     /* Restricting Form For Recruiter Role */
//     if (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'Recruiter')) {
//       let index = statuses.findIndex((status) => status.display_text === 'Doc Verification In Progress');
//       let disableStatuses = statuses.slice(index);

//       if (disableStatuses.some((status) => status.meta_data_id === selectValue)) {
//         return true;
//       }
//       return false;
//     } else {
//       const disableStatuses = statuses.filter((status) => status.display_text === 'Joined' || status.display_text === 'Disqualified' || status.display_text === 'Back Out' || status.display_text === 'Rejected');
//       if (disableStatuses.some((status) => status.meta_data_id === selectValue)) {
//         return true;
//       }
//       return false;
//     }
//   }

//   function required(requiredStatuses, candidateStatuses, selectedStatusId) {
//     const statuses = candidateStatuses.filter((status) => requiredStatuses.some((el) => el === status.display_text));
//     if (statuses.some((status) => status.meta_data_id === selectedStatusId)) {
//       return true;
//     }
//     return false;
//   }

//   function showFieldAccordingToStatus (status, canidateStatuses) {
//     const selectValue = document.querySelector('#candidate_status')?.value;
//     let index = candidateStatuses.findIndex((candidateStatus) => candidateStatus.meta_data_id === status.meta_data_id);
//     let statuses = canidateStatuses.slice(index);
//     if (statuses.some((status) => status.meta_data_id === selectValue)) {
//       return true;
//     }
//     return false;
//   }

//   function makeFieldsRequiredAsPerStatus (status, canidateStatuses) {
//     const selectValue = document.querySelector('#candidate_status')?.value;
//     let index = candidateStatuses.findIndex((candidateStatus) => candidateStatus.display_text === status);
//     let statuses = canidateStatuses.slice(index);
//     if (statuses.some((status) => status.meta_data_id === selectValue)) {
//       return true;
//     }
//     return false;
//   };

//   const changeCandidateStatus = (e) => {
//     changeStatus.mutate({ id: candidate.candidate_id });
//     setReportingManager(null);
//     setEditMode(false);
//     setIsModalOpen(false);
//   }

//   useEffect(() => {
    
//     if (!value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'Admin')) {
//       if (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'Recruiter' || assignedRole.assignedRole.role === 'HR')) {
//         if (editMode) {
//           let holdStatus = statuses.filter((status) => status.display_text === 'Hold')[0];
//           if (candidate && candidate.candidate_status_id === holdStatus.meta_data_id) {
//             let selectedStatus = statuses.filter((status) => status.display_text === 'Selected')[0];
//             let index = statuses.findIndex((status) => status.meta_data_id === selectedStatus.meta_data_id);
//             setCandidateStatuses(statuses.slice(index));
//           } else {
//             let index = statuses.findIndex((status) => status.meta_data_id === candidate.candidateStatus.meta_data_id);
//             setCandidateStatuses(statuses.slice(index));
//           }
//         }
//       }
//     }

//     if (editMode) {
//       let job = jobs?.data?.data?.filter((job) => job.job_id === candidate.job_id)[0]
//       setReportingManager(job?.hiringManagerAssignments);

//       if (afterSelectStatus) {
//         setForm({
//           ...form,
//           candidate_status_id: afterSelectStatus
//         })
//       }
//     }

//     if (createCandidate.isSuccess || (updateCandidate.isSuccess && !showBtn)) {
//       setReportingManager(null);
//       setEditMode(false);
//       setIsModalOpen(false);
//     }

//   }, [isModalOpen, editMode, candidate, value?.data?.role, jobs?.data, statuses, createCandidate.isSuccess, updateCandidate.isSuccess]);

//   if (sources.isLoading || jobLocations.isLoading || backoutReasons.isLoading || createCandidate.isLoading || updateCandidate.isLoading) {
//     return <SpinLoader />
//   }

//   const handleChange = (e) => {

//     if(e.target.name === 'candidate_status_id'){
//       if(e.target.value === 'a5392787-669d-43cd-ba75-773c1a8ddc02'){
//         setShow(!show);
//       }
//     }

//     if (e.target.name === 'job_id') {
//       if (e.target.value === '') {
//         setReportingManager(null)
//       } else {
//         let job = jobs?.data?.data?.filter((job) => job.job_id === e.target.value)[0]
//         setReportingManager(job?.hiringManagerAssignments);
//         setCompany(job?.company);
//       }
//     }

//     if (e.target.name === 'candidate_type') {
//       if (e.target.value === 'no') {
//         setCandidateType(false);
//       } else {
//         setCandidateType(true);
//       }
//     }

//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     console.log(form);
//     if (re.test(form.candidate_email ? form.candidate_email : candidate?.candidate_email)) {
//       const formData = new FormData();

//       // if(!form.reporting_manager_id && !candidate?.reportingManager?.user_id) form.reporting_manager_id = reportingManager?.user_id;
//       // if(!form.designation && !candidate?.designation) form.designation = designation;
//       if (!form.company && !candidate?.company) form.company = company;
//       if (remark && !editMode) form.remark = remark;
//       if ((remark !== candidate?.remark) && editMode) form.remark = remark;

//       if (!editMode && !form.candidate_status_id) form.candidate_status_id = statuses?.filter((status) => status.display_text === 'Screening')[0].meta_data_id;

//       if (parseInt(form.expected_ctc) <= parseInt(form.current_ctc)) {
//         alert('Current CTC should be less than Expected CTC');
//         return;
//       }

//             // Input validation 
//             if(form.candidate_name != undefined)
//             {
//               if(!form.candidate_name.trim()){{
//                    alert('Please remove space from Input');
//                    return;
//                  }}
//             }
      
//             if(form.total_experience != undefined)
//             {
//               if(!form.total_experience.trim()){{
//                    alert('Please remove space from Input');
//                    return;
//                  }}
//             }
      
//             if(form.relevant_experience != undefined)
//             {
//               if(!form.relevant_experience.trim()){{
//                    alert('Please remove space from Input');
//                    return;
//                  }}
//             }
      
//             if (form.other_source) {
//               if (!form.other_source.trim()) {
//                 // console.log(form.other_source);
//                 alert('Please remove space from Source - Other');
//                 return;
//               }
//             }

//             if (form.expected_ctc) {
//               if (!form.expected_ctc.trim()) {
//                 // console.log(form.other_source);
//                 alert('Please remove space from Expected CTC');
//                 return;
//               }
//             }

//             if (form.current_ctc) {
//               if (!form.current_ctc.trim()) {
//                 // console.log(form.other_source);
//                 alert('Please remove space from Current CTC');
//                 return;
//               }
//             }

//             if (form.candidate_phone) {
//               if (!form.candidate_phone.trim()) {
//                 // console.log(form.other_source);
//                 alert('Please remove space from Candidate Phone');
//                 return;
//               }
//             }

//       Object.keys(form).forEach(key => {
//         if (key !== 'files') {
//           formData.append(key, form[key]);
//         }
//       });
      
//       if (editMode) {
//         if (form.files && candidate) {
//           const formData = new FormData();

//           for (let i = 0; i < form.files.length; i++) {
//             formData.append('documents', form.files[i]);
//           }

//           // formData.append('files', JSON.stringify(form.files));
//           formData.append('candidate_id', candidate.candidate_id);
//           // console.log(form.files);

//           uploadDocuments.mutate({formData});
//         }
//       }

//       if (editMode) {

//         if (statuses.filter((status) => status.display_text === 'Joined').some((status) => status.meta_data_id === form.candidate_status_id)) {
//           if (window.confirm('Confirm candidate details')) {
//             // setShowBtn(true);
//             updateCandidate.mutate({ formData, id: candidate.candidate_id });
//           }
//         } else {
//           updateCandidate.mutate({ formData, id: candidate.candidate_id });
//         }
//       } else {
//         createCandidate.mutate(formData);
//       }

//     } else {
//       alert('Please enter a valid email address');
//     }

//   }


//   return (
//     <div className='addCandidate-block'>
//       <div id='modal' className='overlay'>
//         {showDocumentUploadComp && <DocumentUpload candidate={candidate} showDocumentUploadComp={showDocumentUploadComp} setShowDocumentUploadComp={setShowDocumentUploadComp} statuses={statuses} />}
//         {show &&
//           <>
//             <div className='overlay1'>
//               <OnBoardingForm candidate={candidate} show={show} setShow={setShow} />
//             </div>
//           </>
//         }
//         <form encType='multipart/form-data' className='addCandidate-block__form' onSubmit={(e) => handleSubmit(e)}>
//           <CloseIcon className="close" onClick={() => {
//             setReportingManager(null);
//             setEditMode(false);
//             setIsModalOpen(false);
//           }} />

//           <div className='addCandidate-block__form-div1'>
//             {/* 1st Col */}
//             <div className='addCandidate-block__col1'>


//               <label htmlFor="candidate_jobs" className='required'>Job Title</label>
//               <select disabled={inputDisable(statuses)} className="width" name='job_id' id="candidate_jobs" onChange={(e) => {
//                 handleChange(e)
//               }} defaultValue={candidate?.job_id} required >
//                 <option key="" value="">Select Job Title</option>
//                 {jobs?.data && jobs.data.data.map((job) => {
//                   if (job?.jobRequisitionStatus?.display_text === 'Active' && job?.status === 'Active' && !editMode) {
//                     return <option key={job.assignment_id ? job.assignment_id : job.job_id} value={job?.assignedJob?.job_id ? job?.assignedJob?.job_id : job.job_id}><span>{job?.assignedJob?.job_code ? job.assignedJob.job_code : job.job_code} - </span>{job?.assignedJob?.job_title ? job.assignedJob.job_title : job.job_title}</option>
//                   } else {
//                     return <option key={job.assignment_id ? job.assignment_id : job.job_id} value={job?.assignedJob?.job_id ? job?.assignedJob?.job_id : job.job_id}><span>{job?.assignedJob?.job_code ? job.assignedJob.job_code : job.job_code} - </span>{job?.assignedJob?.job_title ? job.assignedJob.job_title : job.job_title}</option>
//                   }
//                 })}
//               </select>

              
//               <label htmlFor="candidate_isFresher" className='required'>Fresher?</label>
//               <div>
//                 <label className='radio-label'>Yes</label>
//                 <input required disabled={inputDisable(statuses)} id='candidate_isFresher' className='radio-btn' type='radio' name='candidate_type' value='true' onChange={(e) => { handleChange(e) }} defaultChecked={candidate?.candidate_type === true} />

//                 <label className='radio-label'>No</label>
//                 <input required disabled={inputDisable(statuses)} id='candidate_isFresher' className='radio-btn' type='radio' name='candidate_type' value='false' onChange={(e) => { handleChange(e) }} defaultChecked={candidate?.candidate_type === false} />
//               </div>


//               {
//                 (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//                 &&
//                 <>
//                   <label htmlFor="candidate_company" className='required' style={{ marginTop: '20px' }}>Company</label>
//                   <input disabled={inputDisable(statuses)} className="width" required type="text" id="candidate_company" name="company" placeholder="Enter Company Name" defaultValue={candidate?.company ? candidate?.company : company} readOnly />
//                 </>
//               }

//               {
//                 (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//                 &&
//                 <>
//                   <label htmlFor="noticePeriod" className={makeFieldsRequiredAsPerStatus('Identified', candidateStatuses) ? 'required': ''}>Notice period in Days</label>
//                   <input disabled={inputDisable(statuses)} className="width" type="number" id='noticePeriod' defaultValue={candidate?.notice_period_in_days} name='notice_period_in_days' onChange={(e) => handleChange(e)} placeholder="Enter Notice Period" required={makeFieldsRequiredAsPerStatus('Identified', candidateStatuses)} />
//                 </>
//               }

//               <label className='radio-label' htmlFor="candidate_job_location" ><strong className='required'>Job Location</strong>
//                 <div>
//                   {jobLocations?.data && jobLocations.data.data.map((location) =>
//                     <>
//                       <input required disabled={inputDisable(statuses)} className='radio-btn' type="radio" name="job_location_id" onChange={(e) => handleChange(e)} id="candidate_job_location" key={location.meta_data_id} value={location.meta_data_id}
//                         defaultChecked={candidate?.jobLocation?.meta_data_id === location.meta_data_id}
//                       /><span>{location.display_text}</span>
//                     </>
//                   )}
//                 </div>
//               </label>

//               {editMode &&
//                 <>
//                   <label htmlFor="candidate_joining_date" className={required(['Offered'], statuses, form.candidate_status_id) ? 'required' : ''}>Joining Date</label>
//                   <input min={new Date().toISOString().split('T')[0]} className="width" type="date" id="candidate_joining_date" name="joining_date" defaultValue={candidate?.joining_date ? new Date(candidate?.joining_date).toISOString().split('T')[0] : ''
//                   } disabled={
//                     statuses.filter((status) => status.display_text === 'Offered').some((status) => status.meta_data_id === (form.candidate_status_id || afterSelectStatus)) === true ? false : true
//                   } required={
//                     statuses.filter((status) => status.display_text === 'Offered').some((status) => status.meta_data_id === form.candidate_status_id) === true ? true : false
//                   }
//                     onChange={(e) => handleChange(e)} />
//                 </>
//               }

//               {editMode &&
//                 <>
//                   {
//                     (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//                     &&
//                     <>
//                       <label htmlFor="document_verification_initiated_on" style={{ 'width': '220px' }}>Document Verification Initiated On</label>
//                       <input className="width" type="date" id="document_verification_initiated_on" name="document_verification_initiated_on" defaultValue={
//                         candidate?.document_verification_initiated_on
//                           ? new Date(candidate?.document_verification_initiated_on).toISOString().split('T')[0]
//                           : ''
//                       } readOnly />
//                     </>
//                   }
//                 </>
//               }

//               {
//                 (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//                 &&
//                 <>
//                   <label htmlFor="candidate_attachment" className='required'>Attachment</label>
//                   {!candidate?.attachment_path ? <input style={{ 'width': '200px', 'padding': '0px' }} accept=".doc,.docx,application/pdf" required type="file" id="candidate_attachment" name="file" onChange={(e) => {
//                     if (e.target.files[0].size > 10 && (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || e.target.files[0].type === '.docx' || e.target.files[0].type === 'application/pdf')) {
//                       setForm({ ...form, [e.target.name]: e.target.files[0] });
//                     } else {
//                       alert('Document type should be PDf or Word only');
//                       e.target.value = ''
//                     }
//                   }} /> : <button className='addCandidate-block__btnDownload' onClick={(e) => window.open(candidate?.attachment_path, '_blank', 'noopener,noreferrer')}>Download Resume</button>}
//                 </>
//               }

//               {
//                 editMode &&
//                 <>
//                   <label htmlFor="recruiter">Recruiter</label>
//                   <input className="width" id='recruiter' type="text" defaultValue={candidate?.createdBy?.display_name} disabled />
//                 </>
//               }

//               {editMode &&
//                 <>
//                   {
//                     (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//                     &&
//                     <>
//                       <label htmlFor="candidate_tentative_doj" className={required(['Doc Verification Completed'], statuses, form.candidate_status_id) ? 'required' : ''}>Tentative Doj</label>
//                       <input className="width" type="date" id="candidate_tentative_doj" name="tentative_date_of_joining" defaultValue={candidate?.tentative_date_of_joining ? new Date(candidate?.tentative_date_of_joining).toISOString().split('T')[0] : ''
//                       } required={statuses.filter((status) => status.display_text === 'Doc Verification Completed')[0].meta_data_id === (form?.candidate_status_id || candidate?.candidate_status_id || afterSelectStatus) ? true : false} readOnly={statuses.filter((status) => status.display_text === 'Doc Verification Completed')[0].meta_data_id === (form?.candidate_status_id || candidate?.candidate_status_id) ? false : true} onChange={(e) => handleChange(e)} />
//                     </>
//                   }
//                 </>
//               }

//             </div>
//             {/* 2nd Col */}
//             <div className='addCandidate-block__col2'>


//               <label htmlFor="gender" className='required'>Gender</label>
//               <select className="width" id="gender" name="gender" onChange={(e) => handleChange(e)} defaultValue={candidate?.gender} required>
//                 <option key="" value="">Select Gender</option>
//                 {gender?.data && gender.data.data.map((gen) =>
//                   <option key={gen.meta_data_id} value={gen.meta_data_id}>{gen.display_text}</option>
//                 )}
//               </select>

//               <label htmlFor="candidate_name" className='required' >Candidate Name</label>
//               <input disabled={inputDisable(statuses)} className="width" required type="text" id="candidate_name" name="candidate_name" placeholder='Enter Candidate Name' defaultValue={candidate?.candidate_name} onChange={(e) => handleChange(e)} />

              
//               <label htmlFor="candidate_phone" className='required' >Candidate Phone</label>
//               <input disabled={inputDisable(statuses)} className="width" required type="number" id="candidate_phone" name="candidate_phone" placeholder='Enter Candidate Phone' defaultValue={candidate?.candidate_phone} onChange={(e) => handleChange(e)} />

//               <label htmlFor="currentCTC" className={makeFieldsRequiredAsPerStatus('Identified', candidateStatuses) ? 'required' : ''}>Current CTC</label>
//               <input disabled={inputDisable(statuses)} className="width" type="number" id='currentCTC' min='100000' defaultValue={candidate?.current_ctc} name='current_ctc' onChange={(e) => handleChange(e)} placeholder="Enter Current CTC" required={makeFieldsRequiredAsPerStatus('Identified', candidateStatuses)} />

//               {editMode &&
//                 <>
//                   <label htmlFor="candidate_offered_salary" className={required(['Offered'], statuses, form.candidate_status_id) ? 'required' : ''}>Offered Salary</label>
//                   <input className="width" type="number" id="candidate_offered_salary" name="offered_salary" defaultValue={candidate?.offered_salary} disabled={
//                     statuses.filter((status) => status.display_text === 'Offered').some((status) => status.meta_data_id === form.candidate_status_id) === true ? false : true
//                   } required={
//                     statuses.filter((status) => status.display_text === 'Offered').some((status) => status.meta_data_id === form.candidate_status_id) === true ? true : false
//                   } min='100000' onChange={(e) => handleChange(e)} />
//                 </>
//               }

//               {editMode &&
//                 <>
//                   {
//                     (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//                     &&
//                     <>
//                       <label htmlFor="candidate_selected_date">Selected or Rejected Date</label>
//                       <input className="width" type="date" id="candidate_selected_date" name="selected_or_rejected_date" defaultValue={
//                         candidate?.selected_or_rejected_date
//                           ? new Date(candidate?.selected_or_rejected_date).toISOString().split('T')[0]
//                           : ''
//                       } readOnly />
//                     </>
//                   }
//                 </>
//               }

//               {
//                 (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//                 &&
//                 <>
//                   <label className='radio-label' htmlFor="candidate_source"><strong className='required'>Source</strong>
//                     <div>
//                       {sources?.data && sources.data.data.map((source) =>
//                         <>
//                           <input disabled={inputDisable(statuses)} className='radio-btn' required type="radio" key={source.meta_data_id} onChange={(e) => handleChange(e)} name="source_id" value={source.meta_data_id} defaultChecked={candidate?.source?.meta_data_id === source.meta_data_id} onClick={(e) => {setShowOthers(false)}}/>{source.display_text}

//                         </>
//                       )}
//                          <input disabled={inputDisable(statuses)} name="source_id" className='radio-btn' required type="radio" onClick={(e) => setShowOthers(true)} defaultChecked={!candidate?.source?.meta_data_id} />
//                          <label className='radio-label'>Other</label>
//                     </div>

//                     { showOthers &&
//                       <>
//                         <input disabled={inputDisable(statuses)} className="width" type="text" id='other_source'  name='other_source'  onChange={(e) => handleChange(e)} placeholder="Enter here" defaultValue={candidate? candidate.other_source : ''} required />
//                       </>
//                     }

//                   </label>
//                 </>
//               }

//               <label htmlFor="totalExperience" className='required'>Total Experience (yr)</label>
//               <input disabled={inputDisable(statuses)} className="width" type="decimal" id='totalExperience' defaultValue={candidate?.total_experience} name='total_experience' onChange={(e) => handleChange(e)} placeholder="Enter Total Experience" required />

//               {
//                 (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//                 &&
//                 <>

//                   <label htmlFor="candidate_identified_date" className={makeFieldsRequiredAsPerStatus('Identified', candidateStatuses) ? 'required' : ''}>Identified Date</label>
//                   <input disabled={inputDisable(statuses)} className="width" type="date" id="candidate_identified_date" name="identified_date" defaultValue={
//                     candidate?.identified_date
//                       ? new Date(candidate?.identified_date).toISOString().split('T')[0]
//                       : ''
//                   } onChange={(e) => handleChange(e)} required={makeFieldsRequiredAsPerStatus('Identified', candidateStatuses)} />
//                 </>
//               }

//               {/* <label htmlFor="candidate_remark">Remark</label>
//               <textarea style={{ 'height': '90px' }} type="text" id="candidate_remark" name="remark" defaultValue={candidate?.remark} onChange={(e) => handleChange(e)}></textarea> */}


//             </div>
//             {/* 3rd Col */}
//             <div className='addCandidate-block__col3'>

//               <label htmlFor="candidate_email" className='required'>Candidate Email</label>
//               <input disabled={inputDisable(statuses)} className="width" required type="text" id="candidate_email" name="candidate_email" defaultValue={candidate?.candidate_email} onChange={(e) => handleChange(e)} placeholder="Enter Candidate Email"/>

//               {
//                 (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//                 &&
//                 <>
//                   <label htmlFor="expectedCTC" className={makeFieldsRequiredAsPerStatus('Identified', candidateStatuses) ? 'required' : ''}>Expected CTC</label>
//                   <input disabled={inputDisable(statuses)} className="width" type="number" id='expectedCTC' min='100000' defaultValue={candidate?.expected_ctc} name='expected_ctc' onChange={(e) => handleChange(e)} placeholder="Enter Expected CTC" required={makeFieldsRequiredAsPerStatus('Identified', candidateStatuses)} />
//                 </>
//               }

//               {editMode &&
//                 <>
//                   <label htmlFor="candidate_reporting_manager">Reporting Manager</label>
//                   <input className="width"  type="text" id="candidate_reporting_manager" name="reporting_manager" onChange={(e) => handleChange(e)} placeholder="Enter Reporting Manager" defaultValue={candidate?.reporting_manager}/>
//                   {/* <select disabled={inputDisable(statuses)} className="width" id="candidate_reporting_manager" name="reporting_manager_id" onChange={(e) => handleChange(e)} >
//                     <option key="" value=""></option>
//                     {reportingManager && reportingManager.map((reportingManager) => {
//                       return <option key={reportingManager.hiring_manager_id} value={reportingManager.assignedHiringManger.user_id} selected={reportingManager.assignedHiringManger.user_id === candidate?.reporting_manager_id}>{reportingManager.assignedHiringManger.display_name}</option>
//                     }
//                     )}
//                   </select> */}
//                 </>
//               }


//               {editMode &&
//                 <>
//                   {
//                     (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//                     &&
//                     <>
//                       <label htmlFor="candidate_offer_date">Offer Date</label>
//                       <input className="width" type="date" id="candidate_offer_date" name="offer_date" defaultValue={
//                         candidate?.offer_date ? new Date(candidate?.offer_date).toISOString().split('T')[0] : ''
//                       } readOnly />
//                     </>
//                   }
//                 </>
//               }

//               <label htmlFor="candidate_lwp" >Candidate LWD</label>
//               <input className="width" type="date" id="candidate_last_working_date" defaultValue={candidate?.candidate_last_working_date
//               ? new Date(candidate?.candidate_last_working_date).toISOString().split('T')[0]
//                       : ''} name="candidate_last_working_date" onChange={(e) => handleChange(e)}/>
                

//               <label htmlFor="candidate_status">Status</label>
//               {
//                 !editMode ?
//                   <select disabled={inputDisable(statuses)} className="width" required id="candidate_status" onChange={(e) => handleChange(e)} name="candidate_status_id">
//                     {candidateStatuses && candidateStatuses.map((status) => {
//                       if (status.display_text === 'Identified' || status.display_text === 'Screening') {
//                         return <option key={status.meta_data_id} value={status.meta_data_id}>{status.display_text}</option>
//                       }
//                     }
//                     )}
//                   </select> :
//                   <select className="width" required id="candidate_status" onChange={(e) => handleChange(e)} defaultValue={candidate?.candidateStatus.meta_data_id} name="candidate_status_id">
//                     {candidateStatuses && candidateStatuses.map((status) =>
//                       <option key={status.meta_data_id} value={status.meta_data_id}>{status.display_text}</option>
//                     )}
//                   </select>
//               }

//               {/* <label htmlFor="candidate_key_details">Key details of candidate</label>
//                 <textarea id="candidate_key_details" name="key_details_of_candidate" defaultValue={candidate?.key_details_of_candidate} onChange={(e) => handleChange(e)}></textarea> */}

//               <label htmlFor="relevantExperience" className='required'>Relevant Experience</label>
//               <input disabled={inputDisable(statuses)} className="width" type="text" id='relevantExperience' defaultValue={candidate?.relevant_experience} name='relevant_experience' onChange={(e) => handleChange(e)} placeholder="Enter Relevant Experience" required />

//               <label htmlFor="callingDate" className='required'>Calling Date</label>
//               <input disabled={inputDisable(statuses)} className="width" type="date" id='callingDate' defaultValue={
//                 candidate?.candidate_calling_date
//                       ? new Date(candidate?.candidate_calling_date).toISOString().split('T')[0]
//                       : ''
//                 } name='candidate_calling_date' onChange={(e) => handleChange(e)} placeholder="Enter Candidate Calling Date" required />


//               {/* <label htmlFor="candidate_uploaded_on_ciepal">uploaded on ciepal</label>
//                 <select className="width" required id="candidate_uploaded_on_ciepal" onChange={(e) => handleChange(e)} defaultValue={candidate?.uploaded_on_ciepal} name="uploaded_on_ciepal">
//                   <option key="" value=""></option>
//                   <option key="Yes" value="Yes">Yes</option>
//                   <option key="No" value="No">No</option>
//                 </select> */}

//               {
//                 editMode &&
//                 <>
//                   {
//                     (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//                     &&
//                     <>
//                       <label htmlFor="candidate_backout_reason" className={required(['Disqualified', 'Rejected', 'Back Out'], statuses, form.candidate_status_id) ? 'required' : ''}>Backout/Disqualified Reason</label>
//                       <select className="width" id="candidate_backout_reason" onChange={(e) => handleChange(e)} defaultValue={candidate?.backout_reason_id} name="backout_reason_id" required={statuses.filter((status) => status.display_text === 'Disqualified' || status.display_text === 'Back Out' || status.display_text === 'Rejected').some((status) => status.meta_data_id === form.candidate_status_id) === true ? true : false} disabled={statuses.filter((status) => status.display_text === 'Disqualified' || status.display_text === 'Back Out' || status.display_text === 'Rejected').some((status) => status.meta_data_id === form.candidate_status_id) === true ? false : true}>
//                         <option key="" value=""></option>
//                         {backoutReasons?.data && backoutReasons.data.data.map((backoutReason) =>
//                           <option key={backoutReason.meta_data_id} value={backoutReason.meta_data_id}>{backoutReason.display_text}</option>
//                         )}
//                       </select>
//                     </>
//                   }
//                 </>
//               }

//               {/* 
//               {
//                 editMode && 
//                 <>
//                   <label htmlFor="candidate_documents">Upload Documents</label>
//                   <input style={{ 'width': '200px', 'padding': '0px'}} required type="file" id="candidate_documents"  name="files" onChange={(e) => {
//                     if (!form[e.target.name]) {
//                       form[e.target.name] = [];
//                     }

//                     if (e.target.files) {
//                       for (let i = 0; i < e.target.files.length; i++) {
//                         if (!form[e.target.name].some((f) => f.name === e.target.files[i].name)) {
//                           let document = e.target.files[i];
//                           form[e.target.name].push(document);
//                           setForm({ ...form, [e.target.name]: form[e.target.name]});
//                         }
//                       } 
//                     }

//                   }} multiple="multiple"/>
//                 </>
//               } */}

//               {
//                 (editMode && showFieldAccordingToStatus(statuses.filter((status) => status.display_text === 'Selected')[0], statuses))  && <button className='addCandidate-block__uploadBtn' onClick={(e) => {
//                   e.preventDefault();
//                   setShowDocumentUploadComp(true)
//                 }}>Upload Candidate Documents</button>
//               }
//             </div>
//           </div>

//           <div className='addCandidate-block__form-div2'>
//             {
//               (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role !== 'HR'))
//               &&
//               <>
//                 <label htmlFor="candidate_remark">Remark</label>
//                 <ReactQuill theme="snow" value={remark} onChange={setRemark} placeholder="Write Something" style={{ height: '100px', marginBottom: '40px' }} />
//                 <br />
//               </>
//             }


//             <input className='width btn-submit' type="submit" value={editMode ? "Update" : "Add"} />
            
//             {candidate?.joiningDetails &&
//               <>
//                 <input className='width btn-joining' value="Joining Details" onClick={(e) => setShow(!show)}/>
//               </>
//             }

//             {(value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'Admin')) &&
//               <>
//                 {editMode &&
//                   <>
//                     {value?.data?.role === 'Admin' &&
//                       <button className='width btn-status' onClick={(e) => changeCandidateStatus(e)}>Delete</button>
//                     }
//                   </>
//                 }
//               </>
//             }

//           </div>
//         </form>


//       </div>
//     </div>
//   )
// };

// export default AddOrUpdateCandidate;