import React, { useState } from 'react';
import AddOrUpdateJobRequistion from '../../components/AddOrUpdateJobRequisition/AddOrUpdateJobRequisition';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SpinLoader from '../../components/SpinLoader/SpinLoader';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { useJobs } from '../../helpers/hooks/jobsHooks';



import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box } from '@mui/system';
import Paper from '@mui/material/Paper';
import zIndex from '@mui/material/styles/zIndex';



const JobRequisition = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState('');
  const { jobs } = useJobs();


  if (jobs.isLoading) {
    return <SpinLoader />
  }

  return (

    <div style={{height:'auto',margin:'50px',marginTop:'10px'}}>

      <Paper>
        <Box m={10} sx={{ overflow: 'hidden'}}>
          <TableContainer sx={{ marginTop: 4, maxHeight: 900 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow sx={{
                  "& th": {
                    borderBottom: "2px solid black",
                    fontSize: "0.9rem",
                    color: "white",
                    backgroundColor: "#243c80",
                    borderLeft: "1px solid #3b4864",
                    height: '1px',
                    zIndex: 0
                  }
                }}>

                  <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Job Code</TableCell>
                  <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Job Type</TableCell>
                  <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Job Title</TableCell>
                  <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Priority</TableCell>
                  <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>No of Positions</TableCell>
                  <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Can Engage External Consultants </TableCell>
                  <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Status </TableCell>
                  <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Hiring Manager </TableCell>
                  <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Recruiter </TableCell>
                  <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Edit </TableCell>
                </TableRow>

              </TableHead>

              <TableBody>

                {jobs?.data && jobs?.data.data.map((job) => {

                  return <TableRow
                    hover
                    key={job?.job_id}>
                    <TableCell>{job?.jobCode}</TableCell>
                    <TableCell>{job?.jobType?.displayText}</TableCell>
                    <TableCell>{job?.jobTitle}</TableCell>
                    <TableCell>{job?.priority}</TableCell>
                    <TableCell>{job?.noOfPositions}</TableCell>
                    <TableCell>{job?.canEngageExternalConsultants}</TableCell>
                    <TableCell>{job?.status}</TableCell>
                    <TableCell>{job?.users.map((assingment, i, arr) => {

                      if (assingment.user.roleAssignments.some((roleAssignments) => roleAssignments.role.roleName === 'Hiring Manager')) {
                        return ((arr.length - 1) !== i) ? assingment.user.displayName + ', ' : assingment.user.displayName
                      }

                    })}</TableCell>

                    <TableCell>{job.users.map((assingment, i, arr) => {
                      if (assingment.user.roleAssignments.some((roleAssignments) => roleAssignments.role.roleName === 'Recruiter')) {
                        return ((arr.length - 1) !== i) ? assingment.user.displayName + ', ' : assingment.user.displayName
                      }
                    })}</TableCell>

                    <TableCell>

                      <ModeEditOutlineOutlinedIcon className='jobRequisition-block__icon' onClick={(e) => {
                        setId(job?.jobId);
                        setEditMode(true);
                        setIsModalOpen(true);
                      }} />

                    </TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {isModalOpen && <AddOrUpdateJobRequistion setIsModalOpen={setIsModalOpen} setEditMode={setEditMode} editMode={editMode} job={

        editMode ? jobs.data.data.filter(job => job.jobId === id)[0] : undefined
      } />}
    </div>
  )
};


export default JobRequisition;