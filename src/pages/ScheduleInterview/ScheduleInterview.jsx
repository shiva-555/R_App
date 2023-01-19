import React, { useState } from 'react';
import './ScheduleInterview.css';
import { useParams } from 'react-router-dom';
import AddOrUpdateInterview from '../../components/AddOrUpdateInterview/AddOrUpdateInterview';
import SpinLoader from '../../components/SpinLoader/SpinLoader';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useCandidates } from '../../helpers/hooks/candidatesHooks';
import { useMetaData } from '../../helpers/hooks/metaDataHooks';
import Box from '@mui/material/Box';


//!::::::::::::::::
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import EditIcon from '@mui/icons-material/Edit';

const ScheduleInterview = () => {
  const { candidate_id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const { useCandidate } = useCandidates();
  const candidate = useCandidate(candidate_id);
  const { interviewStatuses } = useMetaData();
  const [open1, setOpen1] = useState(false);

  if (candidate.isLoading || interviewStatuses.isLoading) {
    return <SpinLoader />
  }

  return (
    <Box m={8} mt={20} sx={{ boxShadow: 1 }} >

      {isModalOpen && <AddOrUpdateInterview setIsModalOpen={setIsModalOpen} interviewStatuses={interviewStatuses.data} candidate={candidate.data.data} editMode={editMode} setEditMode={setEditMode} interview={
        editMode ? candidate?.data.data.interviews?.filter((interview) => interview.interview_id === id)[0] : undefined
      } interviewRound={candidate?.data.data.interviews.length ? candidate?.data.data.interviews.length : 0} />}

      <AddCircleOutlineIcon className='scheduleInterview-block__icon ' onClick={(e) => {
        let candidateStatus = candidate?.data?.data.candidateStatus.displayText.status;
        let isFinalSelected = candidate?.data.data?.interviews.some((interview) => interview?.isFinalSelected === 'true');
        let selected = candidate?.data.data?.interviews[candidate?.data.data?.interviews.length - 1]?.interviewStatus === 'Selected';
        let cancelled = candidate?.data.data?.interviews[candidate?.data.data?.interviews.length - 1]?.interviewStatus === 'Cancelled';
        if (candidateStatus === 'Rejected' || candidateStatus === 'Disqualified' || candidateStatus === 'Back Out' || candidateStatus === 'Selected' || candidateStatus === 'Joined' || candidateStatus === 'Offered' || candidateStatus === 'Screening') {
          alert(`Can't Schedule Interview if candidated is in ${candidateStatus} status`);
        } else if (isFinalSelected) {
          alert("No need to schedule new interview if candidate status is already selected");
        } else if (candidate?.data.data?.interviews.length === 0 || selected || cancelled) {
          setIsModalOpen(true);
        } else {
          alert('Only Schedule Interview if candidate is selected in previous rounds or scheduling interview for 1st round!');
        }
      }} />

      {/* <Chip label="Schedule Interview" style={{ width: "200px", padding: "10px", fontWeight: 500, fontSize: "15px", marginBottom: "10px" }} icon={<AddCircleOutlineIcon />} color="primary" onClick={() => { setOpen1(true) }} /> */}

      <Table sx={{
        bgcolor: 'background.paper',
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        minWidth: 300,
      }}

      >
        <TableHead style={{ backgroundColor: "#243c80" }}>

          <TableRow
            sx={{
              boxShadow: 5,
              borderRadius: 5,
              p: 2,
              minWidth: 300,
              marginTop: 300
            }}

          >
            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Candidate Name</TableCell>
            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Candidate Email</TableCell>
            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Job Title</TableCell>
            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Panel Email</TableCell>
            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Interview Round</TableCell>
            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}>Interview Status</TableCell>
            <TableCell style={{ fontWeight: 500, fontSize: "15px", color: "white" }}></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {
            candidate?.data?.data?.interviews.length > 0 ?
              candidate?.data?.data?.interviews.map((interview) =>

                <TableRow hover
                  key={interview.interview_id}>
                  <TableCell>{candidate.data.data.candidateName}</TableCell>
                  <TableCell>{candidate.data.data.candidateEmail}</TableCell>
                  <TableCell>{interview?.jobTitle?.jobTitle ? interview?.jobTitle?.jobTitle : interview?.ceipalJob?.jobTitle}</TableCell>
                  <TableCell>{interview.panelEmail}</TableCell>
                  <TableCell>{interview.interviewRound}</TableCell>
                  <TableCell>{interview.interviewStatus}</TableCell>
                  <TableCell>  <EditIcon onClick={(e) => {
                    setId(interview.interview_id);
                    setOpen1(true)
                    setEditMode(true);
                    setIsModalOpen(true);
                  }} /></TableCell>

                </TableRow>) : <TableRow> No interview is scheduled for this candidate </TableRow>
          }


        </TableBody>
      </Table>

      {/* {open1 &&

        <AddOrUpdateInterview
          interviewStatuses={interviewStatuses.data}
          candidate={candidate.data.data}
          interview={editMode ? candidate?.data?.data?.interviews?.filter((interview) => interview.interviewId === id)[0] : undefined
          } interviewRound={candidate?.data?.data?.interviews.length ? candidate?.data.data.interviews.length : 0} />
      } */}

    </Box>

  )
}

export default ScheduleInterview;