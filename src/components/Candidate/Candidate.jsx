import React, {useState} from 'react';
import './Candidate.css';

const Candidate = ({candidate, toggleCandidate}) => {
    const [show, setShow] = useState(false);
    // 
  return (
    <ul style={{display: toggleCandidate[candidate.candidate_id] ? 'block' : 'none'}}>
        <li>Job Code - {candidate.jobTitle?.job_code}</li>
        <li>Job Title - {candidate.jobTitle?.job_title}</li>
        <li>Status - {candidate.candidateStatus?.display_text}</li>
        <li>Designation - {candidate?.designation}</li>
        {/* <li>Recruiter - </li> */}
        <li>Tentative DOJ - {candidate?.tentative_date_of_joining}</li>
        {/* <li>Reporting Manager - </li> */}
        <li>Source - {candidate.source?.dispaly_text}</li>
    </ul>
  )

}

export default Candidate
