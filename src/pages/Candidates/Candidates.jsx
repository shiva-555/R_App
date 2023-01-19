import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SpinLoader from '../../components/SpinLoader/SpinLoader';
import { useCandidates } from '../../helpers/hooks/candidatesHooks';
import { useMetaData } from '../../helpers/hooks/metaDataHooks';
import { useJobs } from '../../helpers/hooks/jobsHooks';
import { useUsers } from '../../helpers/hooks/userHooks';
import { UserContext } from '../../components/Routes/Routes';
import ReactQuill from 'react-quill';
//!---------------------------------------------
import { Box } from '@mui/system';
import { FormControlLabel, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import PersonSearchTwoToneIcon from '@mui/icons-material/PersonSearchTwoTone';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Swal from 'sweetalert2'
import Autocomplete from '@mui/material/Autocomplete';
const Candidates = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { createCandidate } = useCandidates();
  const [afterSelectStatuses, setAfterSelectStatuses] = useState(null);
  const value = useContext(UserContext);
  const [search, setSearch] = useState({});
  const navigate = useNavigate();
  const { useGetCandidates, updateCandidate } = useCandidates();
  const candidates = useGetCandidates(search);
  const { sources, jobLocations, backoutReasons, gender, candidateStatuses } = useMetaData();
  const { recruiters } = useUsers(value.data.role);
  const [form, setForm] = useState();
  const [company, setCompany] = useState(null);
  const [remark, setRemark] = useState(null);
  const [filter, setFilter] = useState(null);
  const { jobs } = useJobs()
  const [open, setOpen] = useState();
  const [value1, setValue1] = useState();


  function useHookWithRefCallback() {
    let fetching = false;
    const onScroll = async (event) => {
      const { scrollHeight, scrollTop, clientHeight } = event.target;

      if (!fetching && ((scrollHeight - scrollTop) <= (clientHeight * 2.5))) {
        fetching = true;
        if (candidates.hasNextPage) await candidates.fetchNextPage();
        fetching = false;
      }
    };
    const ref = useRef(null);
    const setRef = useCallback(node => {
      if (ref.current) {
        ref.current.removeEventListener("scroll", onScroll);
      }

      if (node) {
        node.addEventListener("scroll", onScroll);

      }

      ref.current = node
    }, [candidates.hasNextPage]);

    return [setRef];
  }

  const [ref] = useHookWithRefCallback();

  useEffect(() => {
    document.body.style.zoom = "80%";
    if (candidateStatuses?.data?.data) {
      console.log(candidateStatuses?.data?.data.slice(0,2));
      // setAfterSelectStatuses(candidateStatuses.data.data.filter((status) => (status.display_text === 'Offered' || status.display_text === 'Doc Verification In Progress' || status.display_text === 'Disqualified' || status.display_text === 'Hold' || status.display_text === 'Selected')));
    }
  }, [candidateStatuses?.data?.data]);

  if (candidates.isFetching && !candidates.isFetchingNextPage) {
    return <SpinLoader />
  }

  if (candidates.isLoading || candidateStatuses.isLoading || jobs.isLoading || updateCandidate.isLoading, recruiters.isLoading) {
    return <SpinLoader />
  }

  function Reset() {
    setSearch({});
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {

    if (e.target.name === 'jobId') {
      if (e.target.value === '') {
      } else {
        let job = jobs?.data?.data?.filter((job) => job.jobId === e.target.value)[0]
        setCompany(job?.company);
      }
    }

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    console.log(form);

  }

  const handlesubmit = (e) => {
    e.preventDefault();
    form.company = company;
    form.remark = remark;

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    
    if (parseInt(form.expected_ctc) <= parseInt(form.current_ctc)) {
      alert('Current CTC should be less than Expected CTC');
      return;
    }
    if (!form.remark) {
      alert('Please add candidate remark');
      return;
    }



    if (form?.file) {
      console.log('Creating file');
      console.log(form)
      createCandidate.mutate(form)
      alert("candidate sucessful created")
      setOpen(false)

    } else {
      alert("Please add attachment")
    }

  }

  return (
    <>
      <Box m={8} mt={15} sx={{ boxShadow: 1 }} >
        {/* <Autocomplete
          disablePortal
          id="combo-box-demo"
          label="Job"
          options={search?.job ? search.job : ''}
          sx={{ width: 300 }}
          // renderInput={(params) => <TextField {...params} label="Job" />}
          onChange={(e) => setSearch({ ...search, [e.target.name]: e.target.value })}
            // {jobs?.data && jobs.data.data.map(job =>
            //   <MenuItem key={job.job_title} value={job.job_id}>{job.job_title}</MenuItem>
            // )}
            
        />
         */}


        <FormControl>
          <InputLabel id="demo-simple-select-label">Job-title</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="jobFilter"
            label="Job"
            name="job"
            value={search?.job ? search.job : ''}
            sx={{ width: 300, height: 50 }}
            style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
            onChange={(e) => setSearch({ ...search, [e.target.name]: e.target.value })}
          >
            {jobs?.data && jobs.data.data.map(job =>
              <MenuItem key={job.job_title} value={job.job_id}>{job.job_title}</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="demo-simple-label">Status</InputLabel>
          <Select
            labelId="demo-simple-label"
            id="candidate_status_id"
            label="status"
            name='status'
            value={search.status ? search.status : ''}
            sx={{ width: 200, height: 50 }}
            style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
            onChange={(e) => setSearch({ ...search, [e.target.name]: e.target.value })}>
            {candidateStatuses?.data && candidateStatuses.data.data.map(status =>
              <MenuItem key={status.meta_data_id} value={status.meta_data_id}>{status.display_text}</MenuItem>
            )}
          </Select>
        </FormControl>


        <TextField type="text" name="keyword" label="" placeholder='search' value={search?.keyword ? search?.keyword : ''} variant='outlined' onChange={(e) => setSearch({ ...search, [e.target.name]: e.target.value })} />
        <Button
          variant="contained"
          endIcon={<PersonSearchTwoToneIcon />}
          sx={{ borderRadius: 3, }}
          style={{
            padding: "10px",
            marginBottom: '20px',
            marginLeft: '10px'
          }}
          onClick={(e) => { candidates.refetch() }}>Search</Button>
        <Button variant="contained" sx={{ borderRadius: 3, }}
          style={{ padding: "10px", marginBottom: '20px', marginLeft: '20px' }}
          onClick={(e) => { Reset(e) }} > Reset </Button>
        <Button variant="contained"
          endIcon={<AddIcon />}
          sx={{ borderRadius: 3, }}
          style={{ padding: "10px", marginBottom: '20px', marginLeft: '20px' }}
          onClick={handleClickOpen}> Add Candidate </Button>

        <Table sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: 2,
          p: 2,
          minWidth: 300,
        }}

        >
          <TableHead style={{ backgroundColor: "#243c80", color: "white" }}>

            <TableRow
              sx={{
                boxShadow: 5,
                borderRadius: 5,
                p: 2,
                minWidth: 300,
                marginTop: 300
              }}

            >
              <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Name</TableCell>
              <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Email</TableCell>
              <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Job Title</TableCell>
              <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Candidate Status</TableCell>
              <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Edit</TableCell>
              <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Scheduling</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {candidates?.data && candidates?.data.pages.map((page) => page.data.rows.map((candidate) => {
              return <TableRow hover
                key={candidate.candidateId}>
                <TableCell>{candidate.candidateName}</TableCell>
                <TableCell>{candidate.candidateEmail}</TableCell>
                <TableCell>{candidate.jobTitle?.jobCode} - {candidate.jobTitle?.jobTitle}</TableCell>
                <TableCell>{candidate.candidateStatus?.displayText?.status}</TableCell>
                <TableCell>  <EditIcon onClick={(e) => {
                  navigate(`/candidate/${candidate.candidateId}`);
                }} /></TableCell>
                <TableCell>  <AccountCircleIcon onClick={(e) => {
                  navigate(`/candidate/${candidate.candidateId}/interview`)
                }} /></TableCell>
              </TableRow>
            }
            ))}
          </TableBody>
        </Table>
        <div>
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            maxWidth='xxl'>
            <DialogContent>
              <h2 style={{
                padding: '10px', backgroundColor: "cornflowerblue",
                fontWeight: 700, fontSize: "20px",
              }} > Add Candidate Details </h2>
              <form onSubmit={(e) => handlesubmit(e)}>
                <Box sx={{
                  padding: "10px",
                  display: 'grid',
                  gap: 3,
                  gridTemplateColumns: 'repeat(4, 3fr)',
                  border: '#4774ce'
                }}>
                  <FormControl variant="standard" sx={{ width: 300 }} size="small">
                    <TextField

                      labelId="input-candidate-name-label"
                      id="outlined-required"
                      label="Candidate Name"
                      placeholder='Enter Candidate Name'
                      size='small'
                      margin='normal'
                      name='candidateName'
                      variant="filled"
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300 }} size="small">
                    <TextField
                      required
                      labelId="input-candidate-email-label"
                      id="outlined-required"
                      label="Candidate Email"
                      variant="filled"
                      placeholder='Enter email'
                      size='small'
                      margin='normal'
                      name='candidateEmail'
                      type="email"
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300 }} size="small">
                    <TextField
                      required
                      labelId="input-candidate-phone-number"
                      id="outlined-required"
                      label="Candidate Phone Number"
                      placeholder='Enter Candidate Phone Number'
                      size='small'
                      margin='normal'
                      type='number'
                      InputProps={{ inputProps: { min: "999999999", max: "9999999999", step: "1" } }}
                      name='candidatePhone'
                      variant="filled"
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, marginTop: 4.5 }} size="small">
                    <InputLabel id="select-job-title-label">Job Title</InputLabel>
                    <Select
                      labelId="select-job-title-label"
                      id="select-job-label"
                      variant="filled"
                      name='jobId'
                      required
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
                      onChange={(e) => handleChange(e)}
                    >
                      <MenuItem key="" value=""> Select Gender</MenuItem>
                      {gender?.data && gender?.data.data.map((gen) =>
                        <MenuItem key={gen.metaDataId} value={gen.metaDataId}>{gen.displayText.gender}</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, marginTop: 2 }} size="small">
                    Is Candidate Fresher?
                    <RadioGroup
                      row
                      aria-labelledby="input-radio-buttons-group-fresher-label"
                      name="candidateType"
                      required
                      onChange={(e) => handleChange(e)}

                    >
                      <FormControlLabel value="true" control={<Radio required={true} />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio required={true} />} label="No" />
                    </RadioGroup>
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, marginTop: 2 }} size="small">
                    Company Name
                    <TextField
                      required
                      labelId="input-candidate-name-label"
                      id="outlined-required"
                      label="Company Name"
                      placeholder='Enter Company Name'
                      size='small'
                      margin='normal'
                      variant="filled"
                      name='company'
                      value={company ? company : ''}
                      onChange={(e) => handleChange(e)}
                      disabled={true}
                    />
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, marginTop: 2 }} size="small">
                    Current CTC
                    <TextField
                      required
                      labelId="input-candidate-current_ctc-label"
                      id="outlined-required"
                      label="Current CTC"
                      placeholder='Enter Current CTC'
                      InputProps={{ inputProps: { min: "300000", max: Infinity, step: "1" } }} v
                      size='small'
                      margin='normal'
                      type='number'
                      variant="filled"
                      name='currentCTC'

                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, marginTop: 2 }} size="small">

                    Expected CTC
                    <TextField
                      required
                      labelId="input-candidate-expected-label"
                      id="outlined-required"
                      label="Expected CTC"
                      placeholder='Enter Expected CTC'
                      InputProps={{ inputProps: { min: "300000", max: Infinity, step: "1" } }}
                      size='small'
                      margin='normal'
                      variant="filled"
                      type='number'
                      name='expectedCTC'

                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, marginTop: 2 }} size="small">
                    Notice period in Days

                    <TextField
                      required
                      labelId="input-notice-days-label"
                      id="outlined-required"
                      label="Notice period in Days"
                      placeholder='Enter Notice period in days'
                      size='small'
                      margin='normal'
                      variant="filled"
                      type='number'
                      name='noticePeriodInDays'
                      // defaultValue={candidate?.data?.data.notice_period_in_days}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                  <FormControl variant="standard" sx={{ width: 300, marginTop: 4.5, }} size="small">
                    Candidate LWD
                    <TextField
                      required
                      inputFormat="DD/MM/YYYY"
                      type='date'
                      size='small'
                      name="candidateLastWorkingDate"
                      value={value1}
                      onChange={(e) => handleChange(e)}
                    >
                    </TextField>
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, marginTop: 4.5 }} size="small">
                    <InputLabel id="select-status-label">Status</InputLabel>
                    <Select
                      labelId="select-status-label"
                      id="select-status-label"
                      size='small'
                      margin='normal'
                      name='candidateStatusId'
                      required
                      onChange={(e) => handleChange(e)}
                    >
                      <MenuItem key="" value=""> Select Status</MenuItem>
                      {candidateStatuses?.data && candidateStatuses?.data?.data.slice(0,2).map((status) =>
                        <MenuItem key={status.metaDataId} value={status.metaDataId}>{status.displayText.status}</MenuItem>

                      )}
                    </Select>
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, marginTop: 2, }} size="small">
                    Source
                    <RadioGroup
                      row
                      aria-labelledby="input-radio-buttons-group-source-label"
                      name="sourceId"
                      required
                      onChange={(e) => handleChange(e)}
                    >
                      {sources?.data && sources.data.data.map((source) =>
                        <>
                          <FormControlLabel value={source.metaDataId} control={<Radio required={true} />} label={source.displayText.source} />
                        </>
                      )}
                    </RadioGroup>
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 320, marginTop: 2, }} size="small">
                    Job Location
                    <RadioGroup
                      row
                      aria-labelledby="input-radio-buttons-group-job-location-label"
                      name="jobLocationId"
                      required
                      onChange={(e) => handleChange(e)}
                    >
                      {jobLocations?.data && jobLocations.data.data.map((location) =>
                        <>
                          <FormControlLabel value={location.metaDataId} control={<Radio required={true} />} label={location.displayText.location} />
                        </>
                      )}
                    </RadioGroup>
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, marginTop: 2 }} size="small">
                    Total Experience
                    <TextField
                      required
                      labelId="input-total-experience-label"
                      id="outlined-required"
                      label="Total Experience"
                      placeholder='Enter Total Experience'
                      size='small'
                      margin='normal'
                      name='totalExperience'
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, marginTop: 2 }} size="small">
                    Relevant Experience
                    <TextField
                      required
                      labelId="input-total-experience-label"
                      id="outlined-required"
                      label="Relevant Experience"
                      placeholder='Enter Total Experience'
                      size='small'
                      margin='normal'
                      name='relevantExperience'
                      onChange={(e) => handleChange(e)}
                    />

                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, }} size="small">
                    Identified date
                    <TextField
                      required
                      inputFormat="DD/MM/YYYY"
                      type='date'
                      name="identifiedDate"
                      value={value1}
                      size='small'
                      onChange={(e) => handleChange(e)}
                    >
                    </TextField>
                  </FormControl>
                  <FormControl variant="standard" sx={{ width: 300 }} size="small">

                    Calling Date

                    <TextField
                      inputFormat="DD/MM/YYYY"
                      type='date'
                      name="candidateCallingDate"
                      value={value1}
                      size='small'
                      onChange={(e) => handleChange(e)}
                    >

                    </TextField>
                  </FormControl>

                  <FormControl variant="standard" sx={{ width: 300, mt: 3 }} size="small">

                    <TextField
                      id='attachment_path'
                      name='file'
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
                </Box>
                <>
                  <ReactQuill theme="snow" value={remark} onChange={setRemark} placeholder="Write Something"
                    style={{ height: '100px', marginTop: "10px", marginBottom: '40px' }} />
                </>
                <Button sx={{ ml: '20px', mt: '20px' }} size="small" variant="contained" color="success" type='submit'>
                  Submit
                </Button>
                <Button size="small" sx={{ ml: '20px', mt: '20px' }} endIcon={<CloseIcon />} variant="contained" color="primary" type='button'
                  onClick={handleClose}
                >Close</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Box>

    </>
  )
}

export default Candidates;