import React, { useState, useEffect, } from 'react';

import { useJobs } from '../../helpers/hooks/jobsHooks';
import { useMetaData } from '../../helpers/hooks/metaDataHooks';
import { useCandidates } from '../../helpers/hooks/candidatesHooks';
import { useUsers } from '../../helpers/hooks/userHooks';
import ReactQuill from 'react-quill';

import OnBoardingForm from '../../components/OnBoardingForm/OnBoardingForm';
import DocumentUpload from '../../components/DocumentUpload/DocumentUpload';

//!--------------------MUI------------
import moment from 'moment';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { FormControlLabel, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { useLocation } from 'react-router-dom';


const Candidate = () => {
  const location = useLocation();
  const candidateId = location.pathname.split('/')[2];
  const { sources, jobLocations, backoutReasons, gender, candidateStatuses, costCenter, department, division, devices } = useMetaData();

  const { useCandidate, updateCandidate, deleteDocument, uploadDocuments } = useCandidates();
  const candidate = useCandidate(candidateId);
  const [form, setForm] = useState();
  const { jobs } = useJobs()
  const [company, setCompany] = useState(null);
  const [showOnBoarding, setShowOnBoarding] = useState(false);
  const [showDocument, setshowDocument] = useState(false);
  const [remark1, setRemark] = useState();
  const [value1, setValue1] = useState();
  const { HR } = useUsers()

  const handleChange = (e) => {
    console.log()

    if (e.target.name === 'jobId') {

      if (e.target.value === '') {
      } else {
        console.log(jobs?.data?.data?.filter((job) => job.jobId === e.target.value)[0])
        let job = jobs?.data?.data?.filter((job) => job.jobId === e.target.value)[0]
        setCompany(job?.company);
      }
    }

    if (e.target.name === 'candidateStatusId') {
      if (e.target.value === 'a5392787-669d-43cd-ba75-773c1a8ddc02') {

        setShowOnBoarding(true);
      }
    }

    if (e.target.name === 'candidateStatusId') {
      if (e.target.value === '9098ccd3-b893-4f82-bbb1-b5663a596a71') {

        setShowOnBoarding(true);
      }
    }

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  const handlesubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    if (parseInt(form.expected_ctc) <= parseInt(form.current_ctc)) {
      alert('Current CTC should be less than Expected CTC');
      return;
    }


    if (form?.file) {
      updateCandidate.mutate({ id: candidateId, formData: form },
        {
          onSuccess: (data) => {
            if (form.file) {
              formData.append('candidateId', data.data.candidateId);
              formData.append('documentName', 'resume');
              uploadDocuments.mutate({ formData }, {
                onError: (e) => {
                  alert(e.response.data.message);
                }
              });
            }
          }
        });
    }
    else {
      updateCandidate.mutate({ id: candidateId, formData: form },
        {
          onSuccess: (data) => {
            alert('success')
          }
        },
        {
          onSuccess: (data) => {
            alert('error')
          }
        }
      )
    }
  }

  useEffect(() => {
    document.body.style.zoom = "80%";
  }, []);

  console.log(candidate);
  return (
    <>
      {showDocument &&
        <>
          <DocumentUpload candidate={candidate?.data?.data} showDocument={showDocument}
            setshowDocument={setshowDocument}
          // statuses={statuses}
          />
        </>
      }

      {!candidate.isLoading &&

        <form onSubmit={(e) => handlesubmit(e)}>
          <Box m={8} mt={20} sx={{ boxShadow: 1 }} >

            <h2 style={{
              marginTop: '80px', padding: '10px', backgroundColor: "#243c80",
              color: "white", fontWeight: 500, fontSize: "18px",
            }} > Personal Details </h2>
            <hr />
            <Grid container m={2} gap={5}>
              <Grid Item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300 }} size="small">
                  <h3>Candidate Name</h3>
                  <TextField

                    labelId="input-candidate-name-label"
                    id="outlined-required"
                    label="Candidate Name"
                    placeholder='Enter Candidate Name'
                    size='small'
                    margin='normal'
                    name='candidateName'
                    variant="filled"
                    required
                    defaultValue={candidate?.data?.data.candidateName ? candidate?.data?.data?.candidateName : ''}
                    onChange={(e) => handleChange(e)} />
                </FormControl>
              </Grid>
              <Grid Item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300 }} size="small">
                  <h3>Candidate Email</h3>
                  <TextField

                    labelId="input-candidate-email-label"
                    id="outlined-required"
                    label="Candidate Email"
                    placeholder='Enter Candidate Email'
                    size='small'
                    margin='normal'
                    name='candidateEmail'
                    required
                    defaultValue={candidate?.data?.data.candidateEmail}
                    variant="filled"
                    onChange={(e) => handleChange(e)} />
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300 }} size="small">

                  <h3>Candidate Phone Number</h3>
                  <TextField
                    required
                    labelId="input-candidate-phone-number"
                    id="outlined-required"
                    label="Candidate Phone Number"
                    placeholder='Enter Candidate Phone Number'
                    size='small'
                    margin='normal'
                    type='number'
                    name='candidatePhone'
                    defaultValue={candidate?.data?.data.candidatePhone}
                    variant="filled"

                    onChange={(e) => handleChange(e)} />
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <h3>Gender</h3>

                <FormControl variant="standard" sx={{ width: 300, marginTop: 2 }} size="small">
                  <InputLabel id="select-gender-label">Gender</InputLabel>
                  <Select
                    labelId="select-gender-label"
                    id="demo-simple-select"
                    label="Gender"
                    size='small'
                    margin='normal'
                    name='gender'
                    variant="filled"
                    required
                    defaultValue={candidate?.data?.data.gender}
                    onChange={(e) => handleChange(e)}

                  >
                    <MenuItem key="" value=""> Select Gender</MenuItem>
                    {gender?.data && gender?.data?.data.map((gen) =>
                      <MenuItem key={gen.metaDataId} value={gen.metaDataId}>{gen.displayText.gender}</MenuItem>
                    )}
                  </Select>
                </FormControl>


              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300 }} size="small">
                  <h3>Total Experience</h3>
                  <TextField
                    required
                    labelId="input-total-experience-label"
                    id="outlined-required"
                    label="Total Experience"
                    placeholder='Enter Total Experience'
                    size='small'
                    margin='normal'
                    name='totalExperience'
                    defaultValue={candidate?.data?.data.totalExperience}
                    variant="filled"
                    onChange={(e) => handleChange(e)}
                  />

                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300 }} size="small">
                  <h3>Relevant Experience</h3>
                  <TextField
                    required
                    labelId="input-total-experience-label"
                    id="outlined-required"
                    label="Relevant Experience"
                    placeholder='Enter Total Experience'
                    size='small'
                    margin='normal'
                    name='relevantExperience'

                    defaultValue={candidate?.data?.data.relevantExperience}
                    variant="filled"
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <h3>Candidate LWD</h3>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">

                  <input
                    style={{ width: 300, height: 50, fontSize: 15 }}
                    inputFormat="DD/MM/YYYY"
                    type="date"
                    id="candidateLastWorkingDate"
                    name="candidateLastWorkingDate"
                    defaultValue={
                      candidate?.data?.data.candidateLastWorkingDate
                        ? new Date(candidate?.data?.data.candidateLastWorkingDate).toISOString().split('T')[0]
                        : ''
                    } onChange={(e) => handleChange(e)} />
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <h3>Identified date</h3>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">

                  <input
                    style={{ width: 300, height: 50, fontSize: 15 }}
                    type="date"
                    id="identifiedDate"
                    name="identifiedDate"
                    defaultValue={
                      candidate?.data?.data.identifiedDate
                        ? new Date(candidate?.data?.data.identifiedDate).toISOString().split('T')[0]
                        : ''
                    } onChange={(e) => handleChange(e)} />

                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300 }} size="small">
                  <h3>Notice period in Days</h3>
                  <TextField
                    required
                    labelId="input-notice-days-label"
                    id="outlined-required"
                    label="Notice period in Days"
                    placeholder='Enter Notice period in days'
                    size='small'
                    margin='normal'
                    type='number'
                    name='noticePeriodInDays'
                    defaultValue={candidate?.data?.data?.noticePeriodInDays}
                    variant="filled"
                    // defaultValue={candidate?.data?.data.notice_period_in_days}
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">
                  <h3>Is Candidate Fresher?</h3>
                  <RadioGroup
                    row
                    required
                    aria-labelledby="input-radio-buttons-group-fresher-label"
                    name="candidateType"
                    variant="filled"
                    defaultValue={candidate?.data?.data?.candidateType}
                    onChange={(e) => handleChange(e)}
                  >
                    <FormControlLabel value="true" control={<Radio required={true} />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio required={true} />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>


            <h2 style={{
              marginTop: '80px', padding: '10px', backgroundColor: "#243c80",
              color: "white", fontWeight: 500, fontSize: "18px",
            }}  >Professional Details</h2>
            <hr />

            <Grid container m={2} gap={5}>
              <Grid item xs='auto'>

                <FormControl variant="standard" sx={{ width: 300, marginTop: 4.5 }} size="small">
                  <InputLabel id="select-job-title-label">Job Title</InputLabel>
                  <Select
                    labelId="select-job-title-label"
                    id="select-job-label"
                    variant="filled"
                    name='jobId'
                    required
                    defaultValue={candidate?.data?.data.jobId}

                    onChange={(e) => handleChange(e)}
                    margin='normal'
                  >
                    <MenuItem key="" value=""> Select Job Title</MenuItem>
                    {jobs?.data && jobs?.data?.data.map((job) => {

                      if (job?.status === 'Active') {
                        return <MenuItem key={job.jobId} value={job.jobId}>{job.jobTitle}</MenuItem>
                      }
                    })}
                  </Select>
                </FormControl>


              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300 }} size="small">
                  <h3>Company Name</h3>
                  <TextField
                    required
                    labelId="input-candidate-name-label"
                    id="outlined-required"
                    placeholder='Enter Company Name'
                    size='small'

                    margin='normal'
                    name='company'
                    variant="filled"
                    value={candidate?.data?.data.company}
                    onChange={(e) => handleChange(e)}
                    disabled={true}
                  />
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300 }} size="small">
                  <h3>Current CTC</h3>
                  <TextField
                    required
                    labelId="input-candidate-current_ctc-label"
                    id="outlined-required"
                    label="Current CTC"
                    placeholder='Enter Current CTC'

                    size='small'
                    margin='normal'
                    type='number'
                    name='currentCTC'
                    variant="filled"
                    defaultValue={candidate?.data?.data.currentCTC}
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300 }} size="small">
                  <h3>Expected CTC</h3>
                  <TextField
                    required
                    labelId="input-candidate-current_ctc-label"
                    id="outlined-required"
                    label="Expected CTC"
                    placeholder='Enter Expected CTC'
                    InputProps={{ inputProps: { min: "300000", max: Infinity, step: "1" } }}
                    size='small'
                    margin='normal'
                    type='number'
                    name='expectedCTC'
                    variant="filled"
                    defaultValue={candidate?.data?.data.expectedCTC}
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300 }} size="small">
                  <h3>Offered Salary</h3>
                  <TextField
                    required
                    id="outlined-required"
                    label="Offered Salary"
                    placeholder='Enter Offered Salary'
                    InputProps={{ inputProps: { min: "300000", max: Infinity, step: "1" } }}
                    size='small'
                    margin='normal'
                    type='number'
                    name='offeredSalary'
                    variant="filled"
                    defaultValue={candidate?.data?.data.offeredSalary}
                    onChange={(e) => handleChange(e)} />
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300, }} size="small">
                  <h3>Source</h3>
                  <RadioGroup
                    row
                    aria-labelledby="input-radio-buttons-group-source-label"
                    name="sourceId"
                    variant="filled"
                    defaultValue={candidate?.data?.data?.sourceId}
                    onChange={(e) => handleChange(e)}
                  >
                    {sources?.data && sources.data.data.map((source) =>
                      <>
                        <FormControlLabel value={source.metaDataId} control={<Radio required={true} />} label={source.displayText.source} />
                      </>
                    )}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 320, }} size="small">
                  <h3>Job Location</h3>
                  <RadioGroup
                    row
                    aria-labelledby="input-radio-buttons-group-job-location-label"
                    name="jobLocationId"
                    variant="filled"
                    defaultValue={candidate?.data?.data?.jobLocationId}
                    onChange={(e) => handleChange(e)}
                  >
                    {jobLocations?.data && jobLocations.data.data.map((location) =>
                      <>
                        <FormControlLabel value={location.metaDataId} control={<Radio required={true} />} label={location.displayText.location} />
                      </>
                    )}
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* <Grid item xs='auto'>
                {
                  candidate?.data?.data?.documents.some((document) => document?.documentName === 'resume') ?
                    <>
                      <Button onClick={(e) => window.open(candidate?.documents.filter(document => document?.documentName === 'resume')[0].downloadLink, '_blank', 'noopener,noreferrer')}>Download</Button>
                    </>
                    :
                    <FormControl variant="standard" sx={{ width: 300, mt: 3 }} size="small">

                      <TextField
                        id='attachment_path'
                        name='documents'
                        required type="file"
                        size='small'
                        accept=".doc,.docx,application/pdf"

                        onChange={(e) => {
                          if (e.target.files[0].size > 10 && (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || e.target.files[0].type === '.docx' || e.target.files[0].type === 'application/pdf')) {
                            setForm({ ...form, [e.target.name]: e.target.files[0] });
                          } else {
                            alert('Document type should be PDf or Word only');
                            e.target.value = ''
                          }
                        }}
                      />
                    </FormControl>
                }
              </Grid> */}
            </Grid>

            <h2 style={{
              marginTop: '80px', padding: '10px', backgroundColor: "#243c80",
              color: "white", fontWeight: 500, fontSize: "18px",
            }}> Interview schedule Details</h2>
            <hr />
            <Grid container m={2} gap={5}>
              <Grid item xs='auto'>
                <h3>Calling Date</h3>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">

                  <input
                    style={{ width: 300, height: 50, fontSize: 15 }}
                    type="date"
                    id="candidateCallingDate"
                    name="candidateCallingDate"
                    defaultValue={
                      candidate?.data?.data.candidateCallingDate
                        ? new Date(candidate?.data?.data.candidateCallingDate).toISOString().split('T')[0]
                        : ''
                    } onChange={(e) => handleChange(e)} />

                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <h3>Selected or Rejected Date</h3>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">

                  <input
                    style={{ width: 300, height: 50, fontSize: 15 }}
                    type="date"
                    id="selectedRejectedDate"
                    name="selectedRejectedDate"
                    defaultValue={
                      candidate?.data?.data.selectedRejectedDate
                        ? new Date(candidate?.data?.data.selectedRejectedDate).toISOString().split('T')[0]
                        : ''
                    } onChange={(e) => handleChange(e)} />


                </FormControl>

              </Grid>
              <Grid item xs='auto'>
                <h3>document verification initiated on</h3>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">

                  <input
                    style={{ width: 300, height: 50, fontSize: 15 }}
                    type="date"
                    id="documentVerificationInitiatedOn"
                    name="documentVerificationInitiatedOn"
                    defaultValue={
                      candidate?.data?.data.documentVerificationInitiatedOn
                        ? new Date(candidate?.data?.data.documentVerificationInitiatedOn).toISOString().split('T')[0]
                        : ''
                    } onChange={(e) => handleChange(e)} />


                </FormControl>

              </Grid>
              <Grid item xs='auto'>
                <h3>Offer Date</h3>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">

                  <input
                    style={{ width: 300, height: 50, fontSize: 15 }}
                    type="date"
                    id="offerDate"
                    name="offerDate"
                    defaultValue={
                      candidate?.data?.data.offerDate
                        ? new Date(candidate?.data?.data.offerDate).toISOString().split('T')[0]
                        : ''
                    } onChange={(e) => handleChange(e)} />


                </FormControl>

              </Grid>
              <Grid item xs='auto'>
                <h3>Tentative Date of Joining</h3>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">
                  <input
                    style={{ width: 300, height: 50, fontSize: 15 }}
                    type="date"
                    id="joiningDate"
                    name="joiningDate"
                    defaultValue={
                      candidate?.data?.data.joiningDate
                        ? new Date(candidate?.data?.data.joiningDate).toISOString().split('T')[0]
                        : ''
                    } onChange={(e) => handleChange(e)} />

                </FormControl>

              </Grid>
              <Grid item xs='auto'>
                <h3>Joining Date</h3>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">
                  <input
                    style={{ width: 300, height: 50, fontSize: 15 }}
                    type="date"
                    id="tentativeDateOfJoining"
                    name="tentativeDateOfJoining"
                    defaultValue={
                      candidate?.data?.data.tentativeDateOfJoining
                        ? new Date(candidate?.data?.data.tentativeDateOfJoining).toISOString().split('T')[0]
                        : ''
                    } onChange={(e) => handleChange(e)} />


                </FormControl>
              </Grid>
            </Grid>

            <h2 style={{
              marginTop: '80px', padding: '10px', backgroundColor: "#243c80",
              color: "white", fontWeight: 500, fontSize: "18px",
            }}   > Recruiter Details</h2>
            <hr />
            <Grid container m={2} gap={5}>

              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">
                  <h3>Recruiter</h3>
                  <TextField
                    required
                    labelId="input-recruiter-label"
                    id="outlined-required"
                    placeholder='Enter Recruiter Name'
                    size='small'
                    margin='normal'
                    name='createdById'
                    variant="filled"
                    value={candidate?.data?.data?.createdById}
                    disabled={true}
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">
                  <h3>Reporting Manager</h3>
                  <TextField

                    labelId="input-reporting-manager-label"
                    id="reporting_manager_id"
                    label="Reporting Manager"
                    placeholder='Enter Reporting Manager'
                    size='small'
                    margin='normal'
                    name='reportingManager'
                    variant="filled"
                    defaultValue={candidate?.data?.data.reportingManager}
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 6, }} size="small">
                  <InputLabel id="demo-simple-select-label">BackOut / Disqualified Reason</InputLabel>

                  <Select
                    labelId="demo-simple-select-label"
                    id="backout_reason_id"
                    label="BackOut / Disqualified Reason"
                    size='small'
                    margin='normal'
                    name='backoutReasonId'
                    defaultValue={candidate?.data?.data.backoutReasonId}
                    variant="filled"
                    onChange={(e) => handleChange(e)}

                  >
                    <MenuItem key="" value=""> Select Reason</MenuItem>
                    {backoutReasons?.data && backoutReasons.data.data.map((backoutReason) =>
                      <MenuItem key={backoutReason.metaDataId} value={backoutReason.metaDataId}>{backoutReason.displayText.backout}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs='auto'>

                <FormControl variant="standard" sx={{ width: 300, marginTop: 6 }} size="small">
                  <InputLabel id="select-status-label">Status</InputLabel>
                  <Select
                    labelId="select-status-label"
                    id="candidate_status_id"
                    size='small'
                    margin='normal'
                    required
                    name='candidateStatusId'
                    variant="filled"
                    defaultValue={candidate?.data?.data?.candidateStatusId}
                    onChange={(e) => handleChange(e)}
                  >
                    {candidateStatuses?.data?.data && candidateStatuses?.data?.data.map((status) =>
                      <MenuItem key={status.metaDataId} value={status.metaDataId}>{status.displayText.status}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>


              {/* <Grid item xs='auto'>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 4 }} size="small">
                  <InputLabel id="select-hr">HR</InputLabel>
                  <Select
                    labelId="select-hr"
                    id="HR"
                    name='hrId'
                    label='HR'
                    variant="filled"
                    required
                    onChange={(e) => handleChange(e)}
                    margin='normal'
                    defaultValue={candidate?.data?.data?.hrId}>
                    <MenuItem key="" value=""> Select HR</MenuItem>
                    {HR?.data.map((h) => {
                      return <MenuItem key={h.userId} value={h?.userId}>{h?.displayName}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </Grid> */}


            </Grid>

            <h2 style={{
              marginTop: '80px', padding: '10px', backgroundColor: "#243c80",
              color: "white", fontWeight: 500, fontSize: "18px",
            }}   > Documents </h2>
            <hr />

            <Grid container m={2} gap={5}>

              <Grid item xs='auto'>
                <h3>Upload File</h3>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">

                  <TextField
                    id='attachment_path'
                    name='file'
                    required
                    type="file"
                    accept=".doc,.docx,application/pdf"
                    onChange={(e) => {
                      if (e.target.files[0].size > 10 && (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || e.target.files[0].type === '.docx' || e.target.files[0].type === 'application/pdf')) {
                        setForm({ ...form, [e.target.name]: e.target.files[0] });
                      } else {
                        alert('Document type should be PDf or Word only');
                        e.target.value = ''
                      }
                    }}
                  />
                </FormControl>

              </Grid>


              <Grid item xs='auto'>
                <h3>Upload documents</h3>
                <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">

                  <Button variant='contained' onClick={(e) => setshowDocument(true)}>Uploaded documents</Button>
                </FormControl>
              </Grid>
            </Grid>
            {showOnBoarding &&

              <>


                <h2 style={{
                  marginTop: '80px', padding: '10px', backgroundColor: "#243c80",
                  color: "white", fontWeight: 500, fontSize: "18px",
                }}   > OnBoarding Details </h2>
                <hr />
                <Grid container m={2} gap={5}>


                  <FormControl>
                    <InputLabel id="demo-simple-select-label">Cost Center</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="costCenter"
                      name="joiningDetails.costCenter"
                      defaultValue={candidate?.data?.data.joiningDetails?.costCenter}
                      sx={{ width: 300, height: 50 }}
                      style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                      onChange={(e) => handleChange(e)}
                    >
                      {costCenter?.data && costCenter.data.data.map(cc =>
                        <MenuItem key={cc.metaDataId} value={cc.displayText.costCenter}>{cc.displayText.costCenter}</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel id="demo-simple-select-label">Department</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="department"
                      label="department"
                      name="joiningDetails.department"
                      defaultValue={candidate?.data?.data.joiningDetails?.department}
                      sx={{ width: 300, height: 50 }}
                      style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                      onChange={(e) => handleChange(e)}
                    >
                      {department?.data && department.data.data.map(cc =>
                        <MenuItem key={cc.metaDataId} value={cc.displayText}>{cc.displayText.department}</MenuItem>
                      )}
                    </Select>
                  </FormControl>


                  <FormControl>
                    <InputLabel id="demo-simple-select-label">joining Location</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="joining Location"
                      label="joining Location"
                      name="joiningDetails.joiningLocation"
                      defaultValue={candidate?.data?.data.joiningDetails?.joiningLocation}
                      sx={{ width: 300, height: 50 }}
                      style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                      onChange={(e) => handleChange(e)}
                    >
                      {jobLocations?.data && jobLocations.data.data.map(cc =>
                        <MenuItem key={cc.metaDataId} value={cc.displayText}>{cc.displayText.location}</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel id="demo-simple-select-label">division</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="division"
                      label="division"
                      name="joiningDetails.division"
                      defaultValue={candidate?.data?.data.joiningDetails?.division}
                      sx={{ width: 300, height: 50 }}
                      style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                      onChange={(e) => handleChange(e)}
                    >
                      {division?.data && division.data.data.map(cc =>
                        <MenuItem key={cc.metaDataId} value={cc.displayText}>{cc.displayText.division}</MenuItem>
                      )}
                    </Select>
                  </FormControl>


                  <FormControl>
                    <InputLabel id="demo-simple-select-label">devices</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="devices"
                      label="devices"
                      name="joiningDetails.devices"
                      defaultValue={candidate?.data?.data.joiningDetails?.devices}
                      sx={{ width: 300, height: 50 }}
                      style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                      onChange={(e) => handleChange(e)}
                    >
                      {devices?.data && devices.data.data.map(cc =>
                        <MenuItem key={cc.metaDataId} value={cc.displayText}>{cc.displayText.device}</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300 }} size="small">
                    <h3>Offered Desgination</h3>
                    <TextField
                      required
                      id="outlined-required"
                      label="offered Designation"
                      variant="filled"
                      placeholder='Enter designation'
                      size='small'
                      margin='normal'
                      name='joiningDetails.offeredDesignation'
                      defaultValue={candidate?.data?.data.joiningDetails?.offeredDesignation}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>


                </Grid>
              </>
            }



            {/* {window.localStorage.getItem('role') === 'HR' && 

            } */}

            <Grid item xs='auto'>
              <ReactQuill theme="snow" name='remark' value={remark1} onChange={setRemark} placeholder="Write Something"
                style={{ height: '100px', margin: "19px" }} />
              <Button
                variant="contained"
                sx={{ borderRadius: 3 }}
                style={{
                  padding: "10px", width: "250px", marginTop: "50px",
                }}
                type="submit"
                onClick={(e) => handlesubmit(e)}
              > Update </Button>

            </Grid>
          </Box>
        </form>
      }
    </>)
}

export default Candidate