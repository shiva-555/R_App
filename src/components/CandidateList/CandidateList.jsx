import React, { useState } from 'react';
import './CandidateList.css';
import Candidate from '../Candidate/Candidate';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';

const CandidateList = ({ candidates, setShowCandidateList, jobDetails }) => {
  const [toggleCandidate, setToggleCandidate] = useState({});

  const statusFields = [
    {
      Status: 'Screening',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' }
      ]
    },
    {
      Status: 'Identified',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
        { fieldName: 'Identified Date', fieldValue: 'identified_date' },
        { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
        { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' }
      ]
    },
    {
      Status: 'Scheduled',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
        { fieldName: 'Identified Date', fieldValue: 'identified_date' },
        { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
        { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' },
        { fieldName: 'InterView 1st Date', fieldValue: 'interviews', round: 1},
        { fieldName: 'InterView 2nd Date', fieldValue: 'interviews', round: 2},
      ]
    },
    {
      Status: 'Selected',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
        { fieldName: 'Selected Date', fieldValue: 'selected_or_rejected_date' },
        { fieldName: 'Identified Date', fieldValue: 'identified_date' },
        { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
        { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' }
      ]

    },
    {
      Status: 'Doc Verification Completed',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
        { fieldName: 'Doc Verification Date', fieldValue: 'document_verification_initiated_on' },
        { fieldName: 'Selected Date', fieldValue: 'selected_or_rejected_date' },
        { fieldName: 'Identified Date', fieldValue: 'identified_date' },
        { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
        { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' }
      ]
    },
    {
      Status: 'Offered',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Offered Salary', fieldValue: 'offered_salary' },
        { fieldName: 'Offer Date', fieldValue: 'offer_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
        { fieldName: 'Doc Verification Date', fieldValue: 'document_verification_initiated_on' },
        { fieldName: 'Selected Date', fieldValue: 'selected_or_rejected_date' },
        { fieldName: 'Identified Date', fieldValue: 'identified_date' },
        { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
        { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' }
      ]
    },
    {
      Status: 'Joined',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Offered Salary', fieldValue: 'offered_salary' },
        { fieldName: 'Offer Date', fieldValue: 'offer_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
        { fieldName: 'Joining Date', fieldValue: 'joining_date' },

        { fieldName: 'Doc Verification Date', fieldValue: 'document_verification_initiated_on' },
        { fieldName: 'Selected Date', fieldValue: 'selected_or_rejected_date' },
        { fieldName: 'Identified Date', fieldValue: 'identified_date' },
        { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
        { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' }
      ]
    },
    {
      Status: 'Disqualified',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'BackOut', fieldValue: 'backout_reason_id' }

      ]
    },
    {
      Status: 'Rejected',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'BackOut', fieldValue: 'backout_reason_id' }
      ]
    },
    {
      Status: 'BackOut',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'BackOut', fieldValue: 'backout_reason_id' }
      ]
    },
    {
      Status: 'BackUp',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'BackOut', fieldValue: 'backout_reason_id' }
      ]
    },
    {
      Status: 'Hold',
      Fields: [
        { fieldName: 'Candidate Name', fieldValue: 'candidate_name' },
        { fieldName: 'Email', fieldValue: 'candidate_email' },
        { fieldName: 'Mobile', fieldValue: 'candidate_phone' },
        { fieldName: 'Job Location', fieldValue: 'jobLocation' },
        { fieldName: 'Recruiter Name', fieldValue: 'createdBy' },
        { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
        { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
        { fieldName: 'BackOut', fieldValue: 'backout_reason_id' }
      ]
    },

  ]

  return (
    <div className='candidateList-block__overlay'>
      <div className="candidateList-block__container"> 

        <CloseIcon className='candidateList__icon candidateList__icon--close' onClick={(e) => {
          setShowCandidateList(false);
        }} />
        {/* <label>Choose Candidate</label>
       
            <ul className="list">
            {candidates.map((candidate) => <li className="list_item"><p onClick={(e) => {
              if (!toggleCandidate.hasOwnProperty(candidate.candidate_id)) {
                setToggleCandidate({[candidate.candidate_id]: true});
              } else {
                setToggleCandidate({});
              }
              }}>{candidate.candidate_name}</p><Candidate candidate={candidate} toggleCandidate={toggleCandidate}/></li> )}
            </ul> */}
        <div className='candidateList-block__tableContainer'>
          <h2>{jobDetails.jobCode} - {jobDetails.jobTitle} <br/> Status ({jobDetails.status})</h2>
          <table className="candidateList-block__table">
            <thead className='candidateList-block__tableHead'>
              <tr className='candidateList-block__tableHeadRow'>
                {
                  statusFields.filter((el) => el.Status === jobDetails?.status)[0]?.Fields.map((field) => <th style={{ border: "1px solid" }}>{field.fieldName}</th>)
                }
                {/* <th className='candidateList-block__tableHeadElem'>Job Code</th> */}
                {/* <th className='candidateList-block__tableHeadElem'>Candidate Name</th> */}
                {/* <th className='candidateList-block__tableHeadElem'>Job Title</th> */}
                {/* <th className='candidateList-block__tableHeadElem'>Tentative Doj</th>
                    <th className='candidateList-block__tableHeadElem'>Recruiter</th>
                    <th className='candidateList-block__tableHeadElem'>Reporting Manager</th>
                    <th className='candidateList-block__tableHeadElem'>Source</th>
                    <th className='candidateList-block__tableHeadElem'>Last Interview Date</th>
                    <th className='candidateList-block__tableHeadElem'>Current Salary</th>
                    <th className='candidateList-block__tableHeadElem'>Expected Salary</th> */}
                {/* {
                      jobDetails.status === 'Offered' && 
                      <>
                        <th className='candidateList-block__tableHeadElem'>Offered Salary</th>
                        <th className='candidateList-block__tableHeadElem'>Joining Date</th>
                      </>
                    } */}
              </tr>
            </thead >
            <tbody className='candidateList-block__tableBody'>
              {/* {candidates && candidates.map((candidate) =>
                <tr className='candidateList-block__tablBodyRow'> */}

              {candidates && candidates.map((data, i) => {
                return <tr className='candidateList-block__tablBodyRow' key={data.candidate_name}>
                  {statusFields.filter((el) => el.Status === jobDetails?.status)[0]?.Fields.map((field) => {
                    let value;
                    if (!data[field.fieldValue]) {
                      value = 'N/A';
                    } else {
                      if (typeof data[field.fieldValue] === 'object') {
                        if (data[field.fieldValue] instanceof Array && field.fieldValue === 'interviews') {
                          value = data[field.fieldValue].filter((interview) =>  {
                            return interview.interview_round === field.round
                          })[0]?.interview_date;
                          value = value ? value : 'N/A'
                        } else {
                          value = data[field.fieldValue].display_text ? data[field.fieldValue].display_text : data[field.fieldValue].display_name;
                        }                      
                      } else {
                        value = data[field.fieldValue]
                      }
                    }
                    return <td style={{ border: "1px solid" }}>{ moment(value).isValid() && typeof value !== 'number'? moment(value).utc().format('DD-MM-YYYY') : value}</td>
                  })}
                </tr >
              }
              )}

              {/* <td className='candidateList-block__tableBodyElem'>{candidate.jobTitle?.job_code}</td> */}
              {/* <td className='candidateList-block__tableBodyElem'>{candidate.candidate_name}</td> */}
              {/* <td className='candidateList-block__tableBodyElem'>{candidate.jobTitle?.job_title}</td> */}
              {/* <td className='candidateList-block__tableBodyElem'>{candidate?.tentative_date_of_joining ? moment(candidate?.tentative_date_of_joining).format('DD-MMM-YYYY') : 'N/A'}</td>
                      <td className='candidateList-block__tableBodyElem'>{candidate?.createdBy?.display_name}</td>
                      <td className='candidateList-block__tableBodyElem'>{candidate?.reportingManager?.display_name}</td>
                      <td className='candidateList-block__tableBodyElem'>{candidate.source?.display_text}</td>
                      <td className='candidateList-block__tableBodyElem'>{candidate.interviews.length > 0 ? moment(candidate.interviews[candidate.interviews.length - 1].interview_date).format('DD-MMM-YYYY') : 'N/A'}</td>
                      <td className='candidateList-block__tableBodyElem'>{candidate.current_ctc}</td>
                      <td className='candidateList-block__tableBodyElem'>{candidate.expected_ctc}</td> */}
              {/* {
                    jobDetails.status === 'Offered' &&
                    <>
                      <td className='candidateList-block__tableBodyElem'>{candidate.offered_salary}</td>
                      <td className='candidateList-block__tableBodyElem'>{moment(candidate.joined_date).format('DD-MMM-YYYY')}</td>
                    </>
                  } */}
              {/* </tr> */}
              {/* )} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  )
}

export default CandidateList
