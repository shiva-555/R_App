import React, { useState, useEffect } from 'react';
import './AddOrUpdateInterview.css';
import CloseIcon from '@mui/icons-material/Close';
import SpinLoader from '../SpinLoader/SpinLoader';
import { useInterviews } from '../../helpers/hooks/interviewsHooks';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
//!::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import moment from 'moment';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import useMediaQuery from '@mui/material/useMediaQuery';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useMetaData } from '../../helpers/hooks/metaDataHooks';
import Alert from '@mui/material/Alert';
import { ConnectingAirportsOutlined } from '@mui/icons-material';
const AddOrUpdateInterview = ({ setIsModalOpen, setEditMode, isModalOpen, candidate, editMode, interview, interviewRound, interviewStatuses }) => {
    const [form, setForm] = useState({});
    const theme = useTheme();
    const [statuses, setStatuses] = useState(interviewStatuses?.data);
    const [showFinalSelected, setShowFinalSelected] = useState(null);
    const { scheduleInterview, updateInterview } = useInterviews();
    const [interviewBody, setInterviewBody] = useState(interview?.interview_body);
    const [filters, setFilter] = useState({});
    const [selectedtime, setselectedTime] = React.useState();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [value, setValue] = useState();
    const [open, setOpen] = useState(true);

    useEffect(() => {

        if (!editMode) {
            setForm({ jobId: candidate?.jobTitle?.jobId, interviewRound: interviewRound + 1, interviewStatus: 'Scheduled' });
        } else {
            setShowFinalSelected(interview?.interviewStatus === 'Selected');
        }

        if (interviewStatuses?.data) {
            if (!editMode) {
                setStatuses(interviewStatuses?.data?.filter((status) => status?.displayText.status === 'Scheduled'));
            }
        }

        if (scheduleInterview.isSuccess || updateInterview.isSuccess) {
            setEditMode(false);
            setIsModalOpen(false);
        }
    }, [isModalOpen, editMode, candidate, scheduleInterview.isSuccess, updateInterview.isSuccess, interviewStatuses?.data]);

    if (scheduleInterview.isLoading || updateInterview.isLoading) {
        return <SpinLoader />
    }

    function reset() {
        document.getElementById('interview_start_time').value = '';
        document.getElementById('interview_date').value = '';
        document.getElementById('interview_duration').value = '';
        document.getElementById('interview_body').value = '';
    }

    const handleChange = (e) => {
        console.log(form)
        if (e.target.name === 'interviewStatus' && e.target.value === 'Selected') {
            setShowFinalSelected(true);
        }
        if (e.target.name === 'interviewStatus' && e.target.value === 'Scheduled') {
            reset();
        }
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        console.logt(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setForm({
            ...form,
            interviewDate: moment(filters?.interviewDate?.['$d']).format('YYYY-MM-DD'),
            interviewStartTime: filters?.interviewStartTime?.['$d'].format("YYYY-MM-DDTHH:mm:ss")

        })

        if (interviewBody && !editMode) form.interviewBody = interviewBody;
        if ((interviewBody !== interview?.interviewBody) && editMode) form.interviewBody = interviewBody;

        if (editMode) {
            updateInterview.mutate({ formData: form, candidate_id: candidate.candidateId, interview_id: interview.interviewId });
        } else {
            scheduleInterview.mutate({ formData: form, candidate_id: candidate.candidateId });
        }

    }

    const handleClose = () => {

        setOpen(false)
    };

    console.log(interview);

    return (
        <>
            <Dialog
                open={open}
                fullScreen={fullScreen}
                aria-labelledby="responsive-dialog-title"
                maxWidth='xl'
            >

                <DialogContent>
                    <h2 style={{
                        padding: '10px', backgroundColor: "cornflowerblue",
                        fontWeight: 700, fontSize: "20px", marginTop: "25px"
                    }} > Add Candidate Details </h2>
                    <hr />
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <CloseIcon className='addInterview-block__icon addInterview-block__icon--close' onClick={(e) => {
                            setEditMode(false);
                            setIsModalOpen(false)
                        }} />
                        <Box p={1} m={7} mt={4}

                            sx={{ boxShadow: 2 }} >
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
                                            readOnly
                                            value={candidate?.candidateName}
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
                                            placeholder='Enter Job Title'
                                            size='small'
                                            margin='normal'
                                            name='candidateEmail'
                                            readOnly
                                            type="email"
                                            value={candidate?.candidateEmail}
                                            variant="filled"
                                            onChange={(e) => handleChange(e)} />
                                    </FormControl>
                                </Grid>

                                <Grid item xs='auto'>
                                    <FormControl variant="standard" sx={{ width: 300 }} size="small" >
                                        <h3>Job Title</h3>

                                        <TextField
                                            labelId="select-job-title-label"
                                            id="jobTitle"
                                            name='jobTitle'
                                            variant="filled"
                                            size='small'
                                            margin='normal'
                                            value={candidate?.jobTitle?.jobTitle ? candidate?.jobTitle?.jobTitle : candidate?.ceipalJob?.jobTitle}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs='auto'>
                                    <FormControl variant="standard" sx={{ width: 300 }} size="small" >
                                        <h3>Interview Round</h3>

                                        <TextField
                                            labelId='interview_round'
                                            id='interviewRound'
                                            name='interviewRound'
                                            variant="filled"
                                            size='small'
                                            margin='normal'
                                            value={interview?.interviewRound ? interview?.interviewRound : interviewRound + 1}
                                            readOnly

                                            onChange={(e) => handleChange(e)}
                                        />
                                    </FormControl>

                                </Grid>

                                <Grid item xs='auto'>
                                    <FormControl variant="standard" sx={{ width: 300 }} size="small" >
                                        <h3>Time</h3>
                                        <input id='interviewStartTime'
                                            type="time"
                                            defaultValue={interview?.interviewStartTime}
                                            name="interviewStartTime"
                                            onChange={(e) => handleChange(e)}
                                            style={{ width: "300px", height: "50px", marginTop: "15px", }}
                                            required />
                                    </FormControl>



                                </Grid>
                                <Grid item xs='auto'>
                                    <FormControl variant="standard" sx={{ width: 300, mr: 2, mt: -1 }} size="small" >
                                        <h3>Interview Date</h3>
                                        <input
                                        style={{ width: 300, height: 50, fontSize: 15 }}
                                            id='interviewDate'
                                            type="date"
                                            name="interviewDate"
                                            required
                                            defaultValue={
                                                interview?.interviewDate
                                                    ? new Date(interview?.interviewDate).toISOString().split('T')[0]
                                                    : ''
                                            } onChange={(e) => handleChange(e)}
                                        />
                                    </FormControl>


                                    <FormControl variant="standard" sx={{ width: 300, ml: 3, mt: 2 }} size="small">

                                        <h3>Interview Duration</h3>
                                        <Select
                                            labelId='interviewDuration'
                                            id='interviewDuration'
                                            name="interviewDuration"
                                            variant="filled"
                                            defaultValue={interview?.interviewDuration?.toString()}
                                            onChange={(e) => handleChange(e)}

                                            required
                                            margin='normal'
                                        >
                                            <MenuItem key="" value=""> Select Interview Duration</MenuItem>
                                            <MenuItem key="15" value="15"> 15 Minutes </MenuItem>
                                            <MenuItem key="30" value="30"> 30 Minutes</MenuItem>
                                            <MenuItem key="45" value="45"> 45 Minutes</MenuItem>
                                            <MenuItem key="60" value="60"> 60 Minutes</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs='auto'>
                                    <h3>Interview Status</h3>
                                    <FormControl variant="standard" sx={{ width: 300, marginTop: 2 }} size="small">
                                        <InputLabel id="select-job-title-label">Interview Status</InputLabel>
                                        <Select
                                            labelId='interview_status'
                                            id='interviewStatusId'
                                            name='interviewStatus'
                                            variant="filled"
                                            defaultValue={interview?.interviewStatus}
                                            onChange={(e) => handleChange(e)}
                                            required
                                            margin='normal'
                                        >
                                            <MenuItem key="" value=""> Select Interview Status</MenuItem>
                                            {interviewStatuses && interviewStatuses?.data?.map((status) =>
                                                <MenuItem key={status.metaDataId} value={status.displayText.status}>{status.displayText.status}</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid Item xs='auto'>
                                    <FormControl variant="standard" sx={{ width: 300 }} size="small">
                                        <h3>Panel Email</h3>
                                        <TextField
                                            label='panelEmail'
                                            size='small'
                                            margin='normal'
                                            name='panelEmail'
                                            type='text'
                                            required
                                            defaultValue={interview?.panelEmail ? interview?.panelEmail : ''}
                                            value={form?.panelEmail}
                                            variant="filled"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </FormControl>
                                </Grid>

                            </Grid>
                            <Box>
                                <Grid item xs='auto'>
                                    <ReactQuill theme="snow" id='interview_body'defaultValue={interview?.interviewBody}
                                        name="remark"
                                        onChange={setInterviewBody} placeholder="Write Something"
                                        style={{ height: '120px', marginTop: "40px", width: "1100px", marginBottom: "50px", marginLeft: "10px" }}
                                    />
                                </Grid>
                            </Box>
                            {showFinalSelected &&
                                <>
                                    <FormControlLabel
                                        labelId="final-selected"
                                        label="Is Final Selected"
                                        defaultChecked={interview.isFinalSelected}
                                        type="checkbox"
                                        name="isFinalSelected"
                                        id="final-selected"
                                        value={true}
                                        onChange={(e) => handleChange(e)}
                                        control={<Checkbox defaultChecked />}
                                    />
                                </>
                            }
                            <Button
                                variant="contained"
                                sx={{ borderRadius: 3, ml: 1, mt: 2, p: 1, }}
                                type='submit'
                                value={`${editMode ? 'update' : 'Schedule Interview'}`}
                            > Update </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
        </>

    )
}

export default AddOrUpdateInterview;











