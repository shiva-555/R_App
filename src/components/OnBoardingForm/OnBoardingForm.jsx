import React, { useState, useRef, useEffect, useContext } from 'react'
import { useMetaData } from '../../helpers/hooks/metaDataHooks';
import './OnBoardingForm.css'
import { useCandidates } from '../../helpers/hooks/candidatesHooks';
import CloseIcon from '@mui/icons-material/Close';
import { textAlign } from '@mui/system';
import { UserContext } from '../Routes/Routes';


import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Box } from '@mui/system';
import { FormControlLabel, FormControl, MenuItem, InputLabel, Select, TextField, Button } from '@mui/material';



function OnBoardingForm({ candidate, setShowOnBoarding }) {
    const value = useContext(UserContext);
    const [form, setForm] = useState({
        candidate_id: candidate.candidate_id
    });
    const { createOnboarding, updateOnBoarding } = useCandidates();
    const { costCenter, department, division, jobLocations, devices } = useMetaData();
    const [reportingManager, setReportingManager] = useState(null);

    const handleChange = (e) => {
        if (e.target.type === 'radio') {
            if (e.target.value === 'no') {
                setForm({
                    ...form,
                    [e.target.name]: false
                });
            } else {
                setForm({
                    ...form,
                    [e.target.name]: true
                });
            }
        } else {
            setForm({
                ...form,
                [e.target.name]: e.target.value
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!candidate.joiningDetails) {
            if (!form.cost_center_id || !form.cost_center_id || !form.joining_location_id || !form.candidate_reporting_manager ||
                !form.department_id || !form.offered_designation || !form.division_id || !form.device_id || !form.zoom_access || !form.ceipal_access || !form.simcard) {
                alert('please Enter all Required fields');
            }
            createOnboarding.mutate(form);
            alert('OnBoarding Details Saved successfully');
            setShowOnBoarding(false);
        } else {
            updateOnBoarding.mutate({ id: candidate.joiningDetails.onBoarding_id, formData: form });
            alert('OnBoarding Details Updated successfully');
            setShowOnBoarding(false);
        }
    }


    return (
        <>
            <form className='onBoarding-block__form' onSubmit={(e) => handleSubmit(e)}>
                <CloseIcon className="close" onClick={() => {
                    setShowOnBoarding(false);
                }} />

                <Box m={1} mt={1} sx={{ boxShadow: 1 }} >
         

                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Cost Center</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="costCenter"
                            label="Cost Center"
                            name="costCenter"
                            defaultValue={candidate?.data?.data.joiningDetails?.costCenter}
                            sx={{ width: 300, height: 50 }}
                            style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                            onChange={(e) => handleChange(e)}
                        >
                            {costCenter?.data && costCenter.data.data.map(cc =>
                                <MenuItem key={cc.metaDataId} value={cc.metaDataId}>{cc.displayText.costCenter}</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Department</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="department"
                            label="department"
                            name="department"
                            defaultValue={candidate?.data?.data.joiningDetails?.department}
                            sx={{ width: 300, height: 50 }}
                            style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                            onChange={(e) => handleChange(e)}
                        >
                            {department?.data && department.data.data.map(cc =>
                                <MenuItem key={cc.metaDataId} value={cc.metaDataId}>{cc.displayText.department}</MenuItem>
                            )}
                        </Select>
                    </FormControl>


                    <FormControl>
                        <InputLabel id="demo-simple-select-label">joining Location</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="joining Location"
                            label="joining Location"
                            name="joiningLocation"
                            defaultValue={candidate?.data?.data.joiningDetails?.joiningLocation}
                            sx={{ width: 300, height: 50 }}
                            style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                            onChange={(e) => handleChange(e)}
                        >
                            {jobLocations?.data && jobLocations.data.data.map(cc =>
                                <MenuItem key={cc.metaDataId} value={cc.metaDataId}>{cc.displayText.joiningLocation}</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl>
                        <InputLabel id="demo-simple-select-label">division</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="division"
                            label="division"
                            name="division"
                            defaultValue={candidate?.data?.data.joiningDetails?.division}
                            sx={{ width: 300, height: 50 }}
                            style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                            onChange={(e) => handleChange(e)}
                        >
                            {division?.data && division.data.data.map(cc =>
                                <MenuItem key={cc.metaDataId} value={cc.metaDataId}>{cc.displayText.division}</MenuItem>
                            )}
                        </Select>
                    </FormControl>


                    <FormControl>
                        <InputLabel id="demo-simple-select-label">devices</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="devices"
                            label="devices"
                            name="devices"
                            defaultValue={candidate?.data?.data.joiningDetails?.devices}
                            sx={{ width: 300, height: 50 }}
                            style={{ marginBottom: '20px', marginRight: "20px", borderRadius: "10px" }}
                            onChange={(e) => handleChange(e)}
                        >
                            {devices?.data && devices.data.data.map(cc =>
                                <MenuItem key={cc.metaDataId} value={cc.metaDataId}>{cc.displayText.devices}</MenuItem>
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
                            name='offeredDesignation'
                            defaultValue={candidate?.data?.data.joiningDetails?.offeredDesignation}
                            onChange={(e) => handleChange(e)}
                        />
                    </FormControl>



                </Box>
                <br />
                <Box>
                    <Button variant="contained">Submit</Button>

                    <Button variant="contained">Cancel</Button>
                </Box>


            </form>
            {/* <div className='onBoarding-block'> */}




            {/* <div className='onBoarding-block__col1'>

                        <label className='required'>Cost Center</label>
                        <select className='width' onChange={(e) => { handleChange(e) }} defaultValue={candidate?.joiningDetails?.cost_center_id} name='cost_center_id' id='cost_center'>
                            <option value="">Select Cost Center</option>
                            {costCenter?.data && costCenter.data.data.map((status) =>
                                <option name="status" key={status.meta_data_id} value={status.meta_data_id}>{status.display_text}</option>
                            )}
                        </select>

                        <label className='required'>Joining Location</label>

                        <select className='width' onChange={(e) => { handleChange(e) }} defaultValue={candidate?.job_location_id} name='joining_location_id' id='joining_location_id'>
                            <option value=""></option>
                            {jobLocations?.data && jobLocations.data.data.map((location) =>
                                <option name="status" key={location.meta_data_id} value={location.meta_data_id}>{location.display_text}</option>
                            )}

                        </select>

                        <label className='required' htmlFor="candidate_reporting_manager" style={{ marginTop: '0px' }}>Reporting Manager</label>
                        <input className="width" required type="text" id="candidate_reporting_manager" name="reporting_manager" placeholder="Enter Reporting Manager" onChange={(e) => handleChange(e)} defaultValue={candidate?.reporting_manager}/>
                        
                        <label className='required' style={{ marginTop: '0px' }}>Need Sim Card</label>
                        <div>
                            <label className='radio-label'>Yes</label>
                            <input className='radio-btn' type='radio' name='simcard' defaultChecked={candidate?.joiningDetails?.simcard === true} onChange={(e) => { handleChange(e) }} />

                            <label className='radio-label'>No</label>
                            <input className='radio-btn' type='radio' name='simcard' defaultChecked={candidate?.joiningDetails?.simcard === true} onChange={(e) => { handleChange(e) }} />

                        </div>

                        <input className='width btn-submit' type="submit" value="Submit" style={{ marginTop: '20px' }} />
    
                    </div>

                    <div className='onBoarding-block__col2'>

                        <label className='required'>Department</label>
                        <select className='width' onChange={(e) => { handleChange(e) }} defaultValue={candidate?.joiningDetails?.department_id} name='department_id' id='department'>
                            <option value="">Select Department</option>
                            {department?.data && department.data.data.map((status) =>
                                <option name="status" key={status.meta_data_id} value={status.meta_data_id}>{status.display_text}</option>
                            )}
                        </select>

                        <label className='required'>Offered Designation</label>
                        <input className='width' type='text' name='offered_designation' defaultValue={candidate?.joiningDetails?.offered_designation} placeholder='Enter designation' onChange={(e) => { handleChange(e) }} />

                        {
                            (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'IT Support'))
                            &&
                            <>
                                <label>Office365 Mail</label>
                                <input className='width' type='text' name='office365_email' defaultValue={candidate?.joiningDetails?.office365_email} placeholder='Enter Office Email' onChange={(e) => { handleChange(e) }} />
                            </>
                        }

                        <label className='required' style={{ marginTop: '10px' }}>Need Zoom Access</label>
                        <div>
                            <label className='radio-label'>Yes</label>
                            <input className='radio-btn' type='radio' name='zoom_access' defaultChecked={candidate?.joiningDetails?.zoom_access === true} onChange={(e) => { handleChange(e) }} />
                            <label className='radio-label'>No</label>
                            <input className='radio-btn' type='radio' name='zoom_access' defaultChecked={candidate?.joiningDetails?.zoom_access === false} onChange={(e) => { handleChange(e) }} />
                        </div>

                    </div>

                    <div className='onBoarding-block__col3'>

                        <label className='required'>Division</label>
                        <select className='width' onChange={(e) => { handleChange(e) }} defaultValue={candidate?.joiningDetails?.division_id} name='division_id' id='division'>
                            <option value="">Select Division</option>
                            {division?.data && division.data.data.map((status) =>
                                <option name="status" key={status.meta_data_id} value={status.meta_data_id}>{status.display_text}</option>
                            )}
                        </select>

                        <label className='required'>Device </label>
                        <select className='width' onChange={(e) => { handleChange(e) }} defaultValue={candidate?.joiningDetails?.device_id} name='device_id' id='devices'>
                            <option value="">Select Device</option>
                            {devices?.data && devices.data.data.map((device) =>
                                <option name="device" key={device.meta_data_id} value={device.meta_data_id}>{device.display_text}</option>
                            )}
                        </select>


                        <label className='required' style={{ marginTop: '10px' }}>Need Ceipal Access</label>

                        <div>
                            <label className='radio-label'>Yes</label>
                            <input className='radio-btn' type='radio' name='ceipal_access' defaultChecked={candidate?.joiningDetails?.ceipal_access === true} onChange={(e) => { handleChange(e) }} />
                            <label className='radio-label'>No</label>
                            <input className='radio-btn' type='radio' name='ceipal_access' defaultChecked={candidate?.joiningDetails?.ceipal_access === false} onChange={(e) => { handleChange(e) }} />
                        </div>

                        <button className='width btn-submit' onClick={(e) => setShowOnBoarding(false)} style={{ marginTop: '70px' }}>Cancel</button>
                    </div> */}



            {/* </div> */}
        </>
    )
}

export default OnBoardingForm