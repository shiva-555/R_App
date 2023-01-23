import { React, useState, useEffect, useContext } from 'react'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Swal from 'sweetalert2'
import { useMsal } from '@azure/msal-react';
import { Box } from '@mui/system';
import { CardContent, Typography, Grid, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import EditIcon from '@mui/icons-material/Edit';
import PersonSearchTwoToneIcon from '@mui/icons-material/PersonSearchTwoTone';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


import { useUsers } from '../../helpers/hooks/userHooks';
import { useJobs } from '../../helpers/hooks/jobsHooks';
import { useMetaData } from '../../helpers/hooks/metaDataHooks';
import { UserContext } from '../../components/Routes/Routes';
import { AssignRecruiter } from '../../helpers/hooks/adminHooks';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import CardSpinloader from '../../components/CardSpinloader/CardSpinloader';
import { CleaningServices } from '@mui/icons-material';

function getRecruiters(jobs, jobId) {
    let recruiters = [];

    for (let i = 0; i < jobs?.length; i++) {
        if (jobs[i].jobId === jobId) {
            if (jobs[i].jobAssignments && jobs[i].jobAssignments.length) {
                jobs[i].jobAssignments.forEach((assignment) => {
                    if (assignment.user.userId) {

                        recruiters.push({ userId: assignment.user.userId, displayName: assignment.user.displayName });
                    }
                });
            }
        }
    }
    return recruiters;
}

const Referal = () => {
    const { instance, accounts } = useMsal();
    const [search, setSearch] = useState({});
    const [open, setOpen] = useState();
    const [form, setForm] = useState({ "isReferal": true });
    const { addReferalCandidate, useGetReferalCandidates } = useUsers();
    const { recruiters, } = useUsers();
    const candidates = useGetReferalCandidates(accounts[0].localAccountId, search);
    const { candidateStatuses, gender } = useMetaData();
    const [currentCandidate, setCurrentCandidate] = useState(null);
    const { assignCandidateToRecruiter } = AssignRecruiter();
    const value = useContext(UserContext);

    const { jobs, JobsWithRecruiter, jobRequisitions } = useJobs()
    // console.log(JobsWithRecruiter?.data?.data)

    // let a = JobsWithRecruiter?.data?.data.map((job)=>{
    //     return job.jobTitle
    // })
    // console.log(a);
    useEffect(() => {
        if (JSON.stringify(search) === '{}') {
            candidates.refetch();
        }
    }, [JSON.stringify(search)])
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    const handlesubmit = (e) => {
        e.preventDefault();
        form.candidateStatusId = candidateStatuses?.data?.data.filter((status) => status.displayText.status === 'Screening')[0].metaDataId;
        form.company = jobs.data.data.filter((job) => job.jobId === form.jobId)[0].company;
        const formData = new FormData();
        Object.keys(form).forEach(key => {
            formData.append(key, form[key]);
        });
        console.log(form);
        if (form?.file) {

            console.log(form);
            addReferalCandidate.mutate(form, {
                onSuccess: (data) => {
                    formData.append('candidateId', data.data.candidateId);
                    formData.append('documentName', 'resume');
                    // uploadDocuments.mutate({formData});
                }
            });
            alert(`Candidate ${form.candidateName} successfully Created`)
            setOpen(false);
        } else {
            alert("Please add attachment")
        }
    }
    if (addReferalCandidate.isLoading
        // || uploadDocuments.isLoading   
    ) {
        return <CardSpinloader fileName={form?.file?.name} />
    }

    const handleUpdate = (e) => {
        if (currentCandidate) {
            console.log(form);
            console.log(currentCandidate);
            assignCandidateToRecruiter.mutate({ candidateId: currentCandidate, formData: form });
        }
    }
    function Reset() {
        setSearch({});
    }


    return (
        <>
            <Box m={8} mt={15} sx={{ boxShadow: 1 }} >

                <FormControl>

                    <Autocomplete
                        disablePortal
                        id="jobFilter"
                        name="job"
                        // value={search?.job ? JobsWithRecruiter?.data?.data.filter((job) => job.jobId === search.job)[0].jobTitle : undefined}
                        options={JobsWithRecruiter?.data?.data.map((job) => ({ label: job.jobTitle, value: job.jobId }))}
                        sx={{ width: 300 }}
                        style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                        // getOptionLabel={}
                        renderInput={(params) => <TextField {...params} label="Job-Title" />}
                        onChange={(e, job) => {
                            setSearch({ ...search, job: job.value })
                        }}
                    />
                </FormControl>

                <FormControl>
                    <InputLabel id="demo-simple-label">Status</InputLabel>
                    <Select
                        labelId="demo-simple-label"
                        id="candidateStatusId"
                        label="status"
                        name='candidateStatusId'
                        value={search?.status ? candidateStatuses?.data?.data.filter((status) => status.metaDataId === search.status)[0].displayText.status : undefined}
                        sx={{ width: 200, height: 50 }}
                        style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                        onChange={(e) => setSearch({ ...search, [e.target.name]: e.target.value })}>
                        {candidateStatuses?.data && candidateStatuses.data.data.map(status =>
                            <MenuItem key={status.metaDataId} value={status.metaDataId}>{status.displayText.status}</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <TextField type="text" name="keyword" label="" placeholder='search' value={search?.keyword ? search?.keyword : ''}
                    variant='outlined' onChange={(e) => setSearch({ ...search, [e.target.name]: e.target.value })} />

                <Button
                    variant="contained"
                    endIcon={<PersonSearchTwoToneIcon />}
                    sx={{ borderRadius: 3, }}
                    style={{
                        padding: "10px",
                        marginBottom: '20px',
                        marginLeft: '10px'
                    }}
                    onClick={(e) => { candidates.refetch() }}>
                    Search</Button>

                <Button variant="contained" sx={{ borderRadius: 3, }}
                    style={{ padding: "10px", marginBottom: '20px', marginLeft: '20px' }}
                    onClick={(e) => { Reset(e) }} > Reset </Button>

                <Button variant="contained" endIcon={<AddIcon />} sx={{ borderRadius: 3, }}
                    style={{ padding: "10px", marginBottom: '20px', marginLeft: '20px' }}
                    onClick={handleClickOpen}> Add Referal </Button>

                <Dialog fullWidth={true} maxWidth={'lg'} open={open} onClose={handleClose}> </Dialog>

                <Table sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    borderRadius: 2,
                    p: 2,
                    minWidth: 300,
                }}>
                    <TableHead >
                        <TableRow
                            sx={{
                                bgcolor: 'background.paper',
                                boxShadow: 5,
                                borderRadius: 5,
                                p: 2,
                                minWidth: 300,
                                marginTop: 300,
                                backgroundColor: "cornflowerblue",
                            }}
                            style={{ backgroundColor: "#243c80", color: "white" }}
                        >
                            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Referred By</TableCell>
                            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Name</TableCell>
                            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Job Title</TableCell>
                            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Status</TableCell>
                            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Recruiter Name</TableCell>

                            {
                                (window.localStorage.getItem('role') === ('HR', 'Admin', 'Hiring Manager', 'TA Manager', 'Recruiter')) &&
                                <>
                                    <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Recruiters</TableCell>
                                    <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Update</TableCell>

                                </>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {candidates?.data && candidates?.data?.data.map((candidate) => {
                            return <TableRow hover
                                key={candidate?.candidate?.candidateId}>
                                <TableCell>{candidate?.user?.displayName}</TableCell>
                                <TableCell>{candidate?.candidate?.candidateName}</TableCell>
                                <TableCell>{candidate?.candidate?.jobTitle.jobTitle}</TableCell>
                                <TableCell>{candidate?.candidate?.candidateStatus.displayText.status}</TableCell>
                                <TableCell>{candidate?.candidate?.createdBy?.displayName}</TableCell>
                                {
                                    (window.localStorage.getItem('role') === ('HR', 'Admin', 'Hiring Manager', 'TA Manager', 'Recruiter')) &&
                                    <>
                                        <TableCell>
                                            <InputLabel id="recruiter-select-label">Recruiters Name</InputLabel>
                                            <Select
                                                labelId="recruiter-select-label"
                                                id="recruiter-select"
                                                label="Recruiter"
                                                name='recruiter'
                                                sx={{ width: 300, height: 50, borderRadius: 4 }}
                                                defaultValue={candidate?.candidate?.createdById}
                                                // value={jobs?.data?.data[0].jobAssignments[0].user.displayName}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setCurrentCandidate(candidate?.candidate?.candidateId)
                                                }}>
                                                {/* {
                                                     JobsWithRecruiter?.data?.data && getRecruiters(JobsWithRecruiter?.data?.data, candidate?.candidate?.jobId).map((recruiter) =>
                                                        <MenuItem key={recruiter.userId} value={recruiter.userId}>{recruiter.displayName}</MenuItem>)
                                                } */}
                                                {
                                                    jobRequisitions?.data?.data && getRecruiters(jobRequisitions?.data?.data, candidate?.candidate.jobId).map((recruiter) => <MenuItem key={recruiter.userId}
                                                        value={recruiter.userId}>{recruiter.displayName}</MenuItem>)
                                                }

                                            </Select>
                                        </TableCell>

                                        <TableCell>
                                            <Button variant="outlined" endIcon={<EditIcon />} sx={{ borderRadius: 4 }}
                                                onClick={(e) => { handleUpdate(e) }}>Update</Button>
                                        </TableCell>
                                    </>
                                }

                            </TableRow>
                        })}
                    </TableBody>
                </Table>


                <Dialog open={open} onClose={handleClose}>
                    <DialogContent>
                        <Box m={2} p={2} marginLeft={5} overflow="hidden">
                            <Grid container spacing={{ xs: 5, md: 2 }} columns={{ xs: 50, sm: 50, md: 50 }}>
                                <Typography gutterBottom variant='h5' align='center' fontFamily={'sans-serif'}>
                                    Referal-Form
                                </Typography>
                                <card>
                                    <form onSubmit={(e) => handlesubmit(e)}>
                                        <CardContent m={40} >
                                            <TextField style={{ 'borderRadius': '50px' }} label="Candidate Name"
                                                name="candidateName" placeholder='Enter Candidate Full Name'
                                                variant='outlined' fullWidth margin='dense' onChange={(e) => handleChange(e)} required />
                                            <TextField type="email" name="candidateEmail" label="Email"
                                                placeholder='Enter Candidate Email' variant='outlined'
                                                fullWidth margin='dense' onChange={(e) => handleChange(e)} required />
                                            <TextField
                                                type="number"
                                                name="candidatePhone"
                                                label="Contact Number"
                                                InputProps={{ inputProps: { min: "999999999", max: "9999999999", step: "1" } }}
                                                placeholder='Enter Phone Number'
                                                variant='outlined'
                                                margin='dense'
                                                fullWidth
                                                onChange={(e) => handleChange(e)}
                                                required />

                                            <RadioGroup row
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                defaultValue="female"
                                                name="gender"
                                                onChange={(e) => handleChange(e)}>
                                                {gender?.data && gender?.data?.data.map((gen) =>
                                                    <FormControlLabel value={gen.metaDataId} control={<Radio required />} label={gen.displayText.gender} />
                                                )}

                                            </RadioGroup>
                                        </CardContent>

                                        <FormControl>
                                            <InputLabel id="demo-simple-select-label">Job-title</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="jobId"
                                                label="Job"
                                                name='jobId'
                                                required
                                                sx={{ width: 300, height: 50 }}
                                                onChange={(e) => handleChange(e)}>
                                                <MenuItem key="" value=""> Select Job Title</MenuItem>
                                                {jobs?.data && jobs?.data?.data.map((job) => {
                                                    if (job?.status === 'Active') {
                                                        return <MenuItem key={job.jobId} value={job.jobId}>{job.jobTitle}</MenuItem>
                                                    }
                                                })}
                                            </Select>
                                        </FormControl>

                                        <TextField required label="Experience" name="totalExperience"
                                            placeholder='Enter Your Experience' variant='outlined' margin='dense'
                                            sx={{ width: 300, height: 50 }} fullWidth onChange={(e) => handleChange(e)} />

                                        <TextField required type="key-skill" name="keySkills" label="keySkills"
                                            placeholder='Enter relevant key skill' sx={{ width: 300, height: 300 }}
                                            variant='outlined' margin='dense' multiline fullWidth
                                            onChange={(e) => handleChange(e)} />

                                        <Box mt={-30}>
                                            <FormControl>
                                                <InputLabel id="documents">{form?.file ? 'ReUpload' : 'Upload'}</InputLabel>
                                                <input
                                                    id='documents'
                                                    name='file'
                                                    required type="file"
                                                    accept=".doc,.docx,application/pdf"
                                                    onChange={(e) => {
                                                        if (e.target.files[0].size > 10 && (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                                            || e.target.files[0].type === '.docx' || e.target.files[0].type === 'application/pdf')) {
                                                            setForm({ ...form, [e.target.name]: e.target.files[0] });
                                                        } else {
                                                            alert('Document type should be PDf or Word only');
                                                            e.target.value = ''
                                                        }
                                                    }}
                                                />
                                            </FormControl>

                                            <Button size="small" sx={{ ml: '20px', mt: '100px' }} variant="contained" color="success" type='submit'>
                                                Submit
                                            </Button>

                                            <Button size="small" sx={{ ml: '20px', mt: '100px' }}
                                                endIcon={<CloseIcon />}
                                                variant="contained" color="primary"
                                                type='button' onClick={handleClose}>Close</Button>

                                        </Box>

                                    </form>
                                </card>
                            </Grid>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
        </>
    )
};

export default Referal;
