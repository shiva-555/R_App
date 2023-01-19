import React, { useState, useContext, useRef } from 'react';
import './Dashboard.css';
import SpinLoader from '../../components/SpinLoader/SpinLoader';
import { UserContext } from '../../components/Routes/Routes';
import CandidateList from '../../components/CandidateList/CandidateList';
import { useDashboard } from '../../helpers/hooks/dashboardHooks';
import { useUsers } from '../../helpers/hooks/userHooks';
import { useMetaData } from '../../helpers/hooks/metaDataHooks';
import moment from 'moment';

import * as xl from 'xlsx';
import * as fileSaver from 'file-saver';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Cell, CartesianGrid, XAxis, YAxis, Bar, BarChart, Tooltip } from 'recharts';

import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';


const exportToCSV = (apiData, fileName, selectedColumns) => {
  let excelData = [...apiData];

  const candidates = [];
  for (let i = 0; i < apiData.length; i++) {
    for (const key in apiData[i]) {
      let value, value1;
      if (apiData[i][key] && typeof apiData[i][key] === 'object' && apiData[i][key].hasOwnProperty('candidates')) {
        value = apiData[i][key].candidates;
        value1 = value?.map((el) => [{ RecruiterName: el.createdBy?.display_name, CandidateName: el.candidate_name, Remark: el.remark, CreatedDate: moment(el.created_date).utc().format('DD-MM-YYYY'), Status: el.candidateStatus?.display_text, JoiningDate: moment(el.joining_date).utc().format('DD-MM-YYYY'), ScheduledDate: moment(el.interviews[0]?.interview_date).utc().format('DD-MM-YYYY'), CallingDate: moment(el.candidate_calling_date).utc().format('DD-MM-YYYY'), CandidateEmail: el.candidate_email, CandidatePhone: el.candidate_phone, JobTitle: el.jobTitle?.job_title, location: el.jobLocation.display_text, Company: el.company, Source: el.source?.display_text, TotalExperience: el.total_experience, RelevantExperience: el.relevant_experience }]);
        for (let j = 0; j < value1.length; j++) {
          candidates.push(...value1[j]);
        }
      }
    }
  }

  excelData = excelData.map((obj) => {
    const data = { ...obj };

    for (const key in data) {
      if (selectedColumns?.some((column) => column.value === key)) {
        if ((typeof data[key] === 'object') && (key !== 'assignedRecruiters' && key !== 'assignedHiringManager')) {
          data[key] = data[key].count
        } else if (key === 'assignedHiringManager') {
          if (data[key].length > 0) {
            let hiringManagerNames = ''
            for (let i = 0; i < data[key].length; i++) {
              if (i === 0) {
                hiringManagerNames += data[key][i];
              } else {
                hiringManagerNames += ', ' + data[key][i];
              }
            }
            data[key] = hiringManagerNames;
          }
        }
      } else if (key === 'total' || key === 'assignedRecruiters' || key === 'job_code' || key === 'job_title' || key === 'job_type') {
        if (key === 'assignedRecruiters') {
          if (data[key].length > 0) {
            let recruiterNames = ''
            for (let i = 0; i < data[key].length; i++) {
              if (i === 0) {
                recruiterNames += data[key][i];
              } else {
                recruiterNames += ', ' + data[key][i];
              }
            }
            data[key] = recruiterNames;
          }
        }
        else {
          data[key] = data[key];
        }
      } else if (key === 'Joined' || key === 'Offered' || key === 'Selected' || key === 'Scheduled' || key === 'Scheduled' || key === 'Identified' || key === 'Screening') {
        data[key] = data[key]?.count
      } else {
        delete data[key];
      }
    }

    return data;
  });

  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const ws = xl.utils.json_to_sheet(excelData);
  const ws1 = xl.utils.json_to_sheet(candidates);
  const wb = {
    SheetNames: ["RecruiterDetails", "data"],
    Sheets: { data: ws, RecruiterDetails: ws1 },
  };

  const excelBuffer = xl.write(wb, { bookType: "xlsx", type: "array" });
  const fileData = new Blob([excelBuffer], { type: fileType });
  fileSaver.saveAs(fileData, fileName + fileExtension);
};

const columnNames = [{ label: 'Job Age(Days)', value: 'job_age' }, { label: 'Priority', value: 'priority' }, { label: 'Hiring Manager', value: 'assignedHiringManager' }, { label: 'Can engage external consultants?', value: 'can_engage_external_consultants' }, { label: 'Job Status', value: 'job_status' }, { label: 'Job Created', value: 'job_created' }, { label: 'Number of Positions', value: 'no_of_positions' }, { value: 'Disqualified', label: 'Disqualified' }, { value: 'Rejected', label: 'Rejected' }, { value: 'Back Out', label: 'Back Out' }, { value: 'Back Up', label: 'Back Up' }, { value: 'Hold', label: 'Hold' }];

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
      { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' }
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
      { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
      { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' },
      { fieldName: 'Identified Date', fieldValue: 'identified_date' },
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
      { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
      { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' },
      { fieldName: 'Identified Date', fieldValue: 'identified_date' },
      { fieldName: 'InterView 1st Date', fieldValue: 'interviews', round: 1 },
      { fieldName: 'InterView 2nd Date', fieldValue: 'interviews', round: 2 }
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
      { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
      { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' },
      { fieldName: 'Identified Date', fieldValue: 'identified_date' },
      { fieldName: 'InterView 1st Date', fieldValue: 'interviews', round: 1 },
      { fieldName: 'InterView 2nd Date', fieldValue: 'interviews', round: 2 },
      { fieldName: 'Selected Date', fieldValue: 'selected_or_rejected_date' }

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
      { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
      { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' },
      { fieldName: 'Identified Date', fieldValue: 'identified_date' },
      { fieldName: 'InterView 1st Date', fieldValue: 'interviews', round: 1 },
      { fieldName: 'InterView 2nd Date', fieldValue: 'interviews', round: 2 },
      { fieldName: 'Selected Date', fieldValue: 'selected_or_rejected_date' },
      { fieldName: 'Doc Verification Date', fieldValue: 'document_verification_initiated_on' }
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
      { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
      { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
      { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
      { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' },
      { fieldName: 'Identified Date', fieldValue: 'identified_date' },
      { fieldName: 'InterView 1st Date', fieldValue: 'interviews', round: 1 },
      { fieldName: 'InterView 2nd Date', fieldValue: 'interviews', round: 2 },
      { fieldName: 'Selected Date', fieldValue: 'selected_or_rejected_date' },
      { fieldName: 'Doc Verification Date', fieldValue: 'document_verification_initiated_on' },
      { fieldName: 'Offer Date', fieldValue: 'offer_date' },
      { fieldName: 'Offered Salary', fieldValue: 'offered_salary' },
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
      { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
      { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
      { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
      { fieldName: 'Notice Period', fieldValue: 'notice_period_in_days' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' },
      { fieldName: 'Identified Date', fieldValue: 'identified_date' },
      { fieldName: 'InterView 1st Date', fieldValue: 'interviews', round: 1 },
      { fieldName: 'InterView 2nd Date', fieldValue: 'interviews', round: 2 },
      { fieldName: 'Selected Date', fieldValue: 'selected_or_rejected_date' },
      { fieldName: 'Doc Verification Date', fieldValue: 'document_verification_initiated_on' },
      { fieldName: 'Offer Date', fieldValue: 'offer_date' },
      { fieldName: 'Offered Salary', fieldValue: 'offered_salary' },
      { fieldName: 'Joining Date', fieldValue: 'joining_date' },
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
      { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
      { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
      { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
      { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' },
      { fieldName: 'Identified Date', fieldValue: 'identified_date' },
      { fieldName: 'InterView 1st Date', fieldValue: 'interviews', round: 1 },
      { fieldName: 'InterView 2nd Date', fieldValue: 'interviews', round: 2 },
      { fieldName: 'Selected/Rejected Date', fieldValue: 'selected_or_rejected_date' },
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
      { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
      { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
      { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
      { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' },
      { fieldName: 'Identified Date', fieldValue: 'identified_date' },
      { fieldName: 'InterView 1st Date', fieldValue: 'interviews', round: 1 },
      { fieldName: 'InterView 2nd Date', fieldValue: 'interviews', round: 2 },
      { fieldName: 'Selected/Rejected Date', fieldValue: 'selected_or_rejected_date' },
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
      { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
      { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
      { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
      { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' },
      { fieldName: 'Identified Date', fieldValue: 'identified_date' },
      { fieldName: 'InterView 1st Date', fieldValue: 'interviews', round: 1 },
      { fieldName: 'InterView 2nd Date', fieldValue: 'interviews', round: 2 },
      { fieldName: 'Selected/Rejected Date', fieldValue: 'selected_or_rejected_date' },
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
      { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
      { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
      { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
      { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' },
      { fieldName: 'Identified Date', fieldValue: 'identified_date' },
      { fieldName: 'InterView 1st Date', fieldValue: 'interviews', round: 1 },
      { fieldName: 'InterView 2nd Date', fieldValue: 'interviews', round: 2 },
      { fieldName: 'Selected/Rejected Date', fieldValue: 'selected_or_rejected_date' },
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
      { fieldName: 'Reporting Manager', fieldValue: 'reporting_manager' },
      { fieldName: 'Calling date', fieldValue: 'candidate_calling_date' },
      { fieldName: 'Current CTC', fieldValue: 'current_ctc' },
      { fieldName: 'Expected CTC', fieldValue: 'expected_ctc' },
      { fieldName: 'Screening Date', fieldValue: 'created_date' },
      { fieldName: 'Identified Date', fieldValue: 'identified_date' },
      { fieldName: 'InterView 1st Date', fieldValue: 'interviews', round: 1 },
      { fieldName: 'InterView 2nd Date', fieldValue: 'interviews', round: 2 },
      { fieldName: 'BackOut', fieldValue: 'backout_reason_id' }
    ]
  },

]

const Dashboard = () => {

  const { candidateStatuses } = useMetaData();
  const { useGetDashboard } = useDashboard();
  const [filter, setFilter] = useState({});
  const [jobDetails, setJobDetails] = useState(null)
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showCandidateList, setShowCandidateList] = useState(null);
  const [candidates, setCandidates] = useState(null);
  const dashboard = useGetDashboard(filter);
  const value = useContext(UserContext);
  const { hiringManagers, recruiters } = useUsers(value.data.assignedRoles[0].assignedRole.role);
  const [jobSelectedColumns, setJobSelectedColumns] = useState([]);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [scroll, setScroll] = React.useState('paper');

  const [showGraph, setShowGraph] = React.useState(false);
  const [showGraph1, setShowGraph1] = React.useState(false);
  const [graphCurrentRecruiter, setgraphCurrentRecruiter] = React.useState('');

  useEffect(() => {

    if (dashboard?.data?.data) {
      setJobSelectedColumns(dashboard?.data?.data.map((job) => job.job_title));
    }

    if (JSON.stringify(filter) === '{}') {
      dashboard.refetch();
    }

  }, [dashboard?.data?.data, JSON.stringify(filter)]);


  if (dashboard.isLoading || hiringManagers.isLoading || recruiters.isLoading || dashboard.isFetching) {
    return <SpinLoader />
  }

  function reset() {
    setFilter({});
    dashboard.refetch();
  }

  const handleClose = () => {
    setOpen(false);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 500,
      },
    },
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedColumns(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleJob = (event) => {
    const { target: { value }, } = event;

    if (value[value.length - 1] === "all") {
      setJobSelectedColumns(jobSelectedColumns.length === dashboard?.data?.data.length ? [] : dashboard?.data?.data.map((job) => job.job_title));
      return;
    }
    setJobSelectedColumns(typeof value === 'string' ? value.split(',') : value,);
  }

  const recruiterDetails = [];
  for (let i = 0; i < dashboard?.data?.data.length; i++) {
    for (const key in dashboard?.data?.data[i]) {
      let v, v1;
      if (dashboard.data.data[i][key] && typeof dashboard.data.data[i][key] === 'object' && dashboard.data.data[i][key].hasOwnProperty('candidates')) {
        v = dashboard.data.data[i][key].candidates;
        v1 = v?.map((el) => [{ RecruiterName: el.createdBy?.display_name, CandidateName: el.candidate_name, Remark: el.remark, Status: el.candidateStatus?.display_text, ScheduledDate: moment(el.interviews[0]?.interview_date).utc().format('DD-MM-YYYY'), CallingDate: moment(el.candidate_calling_date).utc().format('DD-MM-YYYY'), CandidateEmail: el.candidate_email, CandidatePhone: el.candidate_phone, JobTitle: el.jobTitle?.job_title, location: el.jobLocation?.display_text, Company: el.company, Source: el.source?.display_text, TotalExperience: el.total_experience, RelevantExperience: el.relevant_experience }]);
        for (let j = 0; j < v1.length; j++) {
          recruiterDetails.push(...v1[j]);
        }
      }
    }
  }

  const groups = recruiterDetails.reduce((groups, item) => {
    const group = (groups[item.RecruiterName] || []);
    group.push(item);
    groups[item.RecruiterName] = group;
    return groups;
  }, {});

  const recruiterNames = Object.keys(groups);
  const graphData = [];
  for (let i = 0; i < recruiterNames.length; i++) {
    graphData.push({
      Name: recruiterNames[i],
      Candidates: groups[recruiterNames[i]].length,
      // Status: groups[recruiterNames[i]][i]?.Status
    })
  }

  const status = groups[recruiterNames[graphCurrentRecruiter]]?.map((el) => [el.Status]);
  const count = [];
  candidateStatuses?.data?.data?.forEach(element => {
    let obj = {};
    if (status) {
      obj.Name = element.display_text;
      obj.count = status.filter((el) => el[0] === element.display_text).length ? status.filter((el) => el[0] === element.display_text).length : 0;
      count.push(obj);
    }
  });

  return (

    <Box sx={{ flexGrow: 1, marginTop: '7%',margin:'80px' }}>
      <Grid container>
        {showCandidateList && <CandidateList candidates={candidates} setShowCandidateList={setShowCandidateList} jobDetails={jobDetails} />}
        <Grid item xs='auto'>
          {(value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'Admin') || value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'Hiring Manager')) &&
            <>
              <FormControl sx={{ m: 1, minWidth: 120 }} >
                <InputLabel id="select-hiringManager-label">Hiring Manger</InputLabel>
                <Select
                  labelId="select-hiringManager-label"
                  id="hiringManager"
                  label="Select Hiring Manger"
                  value={filter?.hiringManager}
                  onChange={(e) => { setFilter({ ...filter, hiringManager: e.target.value }) }}
                >

                  <MenuItem value=""></MenuItem>
                  {hiringManagers?.data && hiringManagers.data.data.map(manager =>
                    <MenuItem key={manager.user_id} value={manager.user_id}>{manager.display_name}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </>
          }
        </Grid>

        <Grid item xs='auto'>
          {
            (value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'Admin') || value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'Hiring Manager')) &&
            <>
              <FormControl sx={{ m: 1, minWidth: 120 }} >
                <InputLabel id="select-recruiter-label">Recruiter</InputLabel>
                <Select
                  labelId="select-recruiter-label"
                  label="Select Recruiter"
                  id="recruiter-select"
                  value={filter?.recruiter}
                  onChange={(e) => { setFilter({ ...filter, recruiter: e.target.value }) }}
                >
                  <MenuItem value=""></MenuItem>
                  {recruiters?.data && recruiters.data.data.map(recruiter =>
                    <MenuItem key={recruiter.user_id} value={recruiter.user_id}>{recruiter.display_name}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </>
          }
        </Grid>

        <Grid item xs='auto'>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                id="startDate"
                value={filter?.startDate ? filter?.startDate : null}
                onChange={(newDate) => {
                  setFilter({ ...filter, startDate: newDate});
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>

        <Grid item xs='auto'>
          <FormControl sx={{ m: 1, minWidth: 120 }} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                id="endDate"
                value={filter?.endDate ? filter?.endDate : null}
                onChange={(newDate) => {
                  setFilter({ ...filter, endDate: newDate});
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>

        <Grid item xs='auto'>

          <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel id="select-columns-label">Select Columns</InputLabel>
            <Select
              labelId="select-columns-label"
              id="select-columns-checkbox"
              multiple
              value={selectedColumns}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {columnNames.map((name) => (
                <MenuItem key={name.label} value={name.value}>
                  <Checkbox checked={selectedColumns.indexOf(name.value) > -1} />
                  <ListItemText primary={name.value} />
                </MenuItem>
              ))
              }
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs='auto'>
          <FormControl sx={{ m: 1, width: 300 }} >
            <InputLabel id="select-job-columns-label">Select Job Title</InputLabel>
            <Select
              labelId="select-job-columns-label"
              id="select-job-columns-checkbox"
              multiple
              value={jobSelectedColumns}
              onChange={handleJob}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              <MenuItem value="all">
                <ListItemText>
                  <Checkbox
                    checked={dashboard?.data?.data.length > 0 && jobSelectedColumns.length === dashboard?.data?.data.length}
                    indeterminate={jobSelectedColumns.length > 0 && jobSelectedColumns.length < dashboard?.data?.data.length}
                  />
                </ListItemText>
                <ListItemText primary="Select All" />

              </MenuItem>

              {dashboard?.data && dashboard?.data?.data.map((job) => (

                <MenuItem key={job.job_title} value={job.job_title}>
                  <Checkbox checked={jobSelectedColumns.indexOf(job.job_title) > -1} />
                  <ListItemText primary={job.job_title} />
                </MenuItem>
              ))
              }
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container>
        <Grid Item xs='auto'>
          <FormControl sx={{ m: 1, minWidth: 120 }} >
            <Button variant="contained" onClick={(e) => { dashboard.refetch() }}>Filter</Button>
          </FormControl>
        </Grid>

        <Grid Item xs='auto'>
          <FormControl sx={{ m: 1, minWidth: 120 }} >
            <Button variant="contained" onClick={(e) => {setFilter({})}}>Reset</Button>
          </FormControl>
        </Grid>

        <Grid Item xs='auto'>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Button variant="contained" onClick={(e) => { exportToCSV(dashboard.data.data, `dashboard-${new Date().toLocaleDateString()}`, selectedColumns) }}>Export to Excel</Button>
          </FormControl>
        </Grid>

        <Grid Item xs='auto'>
          {(value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'Admin')) &&
            <>
              <FormControl sx={{ m: 1 }}>
                <Button variant="contained" onClick={(e) => { setShowGraph(true) }}>Show Graph</Button>
              </FormControl>
            </>
          }
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs='auto'>
          <Paper sx={{ width: '1500px' }}>
            <TableContainer sx={{ marginTop: 4, maxHeight: 600 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow sx={{
                    "& th": {
                      borderBottom: "2px solid black",
                      fontSize: "0.9rem",
                      color: "white",
                      backgroundColor: "#243c80",
                      borderLeft: "1px solid #3b4864",
                      height: '1px'
                    }
                  }}>
                    <TableCell
                      align="left"
                      style={{
                        position: 'sticky',
                        left: 0,
                        zIndex: 800,
                        minWidth: 100,
                        maxWidth: 100
                      }}>Job Code</TableCell>

                    <TableCell
                      align="left"
                      style={{
                        position: 'sticky',
                        left: 100,
                        zIndex: 800,
                        minWidth: 200,
                        maxWidth: 200
                      }}>Job Title</TableCell>

                    {/* <TableCell>Type</TableCell> */}
                    <TableCell style={{ minWidth: 500, maxWidth: 500 }}>Recruiters</TableCell>
                    <TableCell style={{ minWidth: 100, maxWidth: 100 }}>Total</TableCell>
                    <TableCell style={{ minWidth: 100, maxWidth: 100 }}>Screening</TableCell>
                    <TableCell style={{ minWidth: 100, maxWidth: 100 }}>Identified</TableCell>
                    <TableCell style={{ minWidth: 100, maxWidth: 100 }}>Scheduled</TableCell>
                    <TableCell style={{ minWidth: 100, maxWidth: 100 }}>Selected</TableCell>
                    <TableCell style={{ minWidth: 100, maxWidth: 100 }}>Offered</TableCell>
                    <TableCell style={{ minWidth: 100, maxWidth: 100 }}>Joined</TableCell>
                    {
                      selectedColumns && selectedColumns.map((column) => {
                        let cell = columnNames.filter((col) => col.value === column)[0];
                        return <TableCell style={{ minWidth: 150, maxWidth: 150 }}>{cell.label}</TableCell>
                      })
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboard?.data && dashboard?.data.data.map((data, i) => {
                    if (jobSelectedColumns.includes(data.job_title)) {
                      return (
                        <TableRow
                          key={data.job_code}
                          hover
                          sx={{
                              fontSize: "0.5rem",
                              height: '1px'
                          }}
                        >

                          <TableCell
                            align="left"
                            style={{
                              position: 'sticky',
                              left: 0,
                              background: '#539cde ',
                              zIndex: 500,
                              border: "1px solid #ADD8E6",
                              borderTop: 0,
                              borderLeft: 0,
                              minWidth: 100,
                              maxWidth: 100
                            }}>
                            {data.job_code}</TableCell>

                          <TableCell
                            align="left"
                            style={{
                              position: 'sticky',
                              left: 100,
                              zIndex: 500,
                              background: '#ADD8E6 ',
                              border: "1px solid #3b4864",
                              borderTop: 0,
                              borderLeft: 0,
                              minWidth: 100,
                              maxWidth: 100
                            }}>{data.job_title}</TableCell>

                          {/* <TableCell>{data.job_type}</TableCell> */}
                          <TableCell style={{ minWidth: 500, maxWidth: 500, border: "1px solid #3b4864", borderTop: 0, borderLeft: 0, }}>{data.assignedRecruiters.map((recruiter, i, arr) => ((arr.length - 1) !== i) ? recruiter + ',' : recruiter)}</TableCell>
                          <TableCell style={{ border: "1px solid #3b4864", borderTop: 0, borderLeft: 0, minWidth: 100, maxWidth: 100 }}>{data.total}</TableCell>
                          <TableCell style={{ border: "1px solid #3b4864", borderTop: 0, borderLeft: 0, minWidth: 100, maxWidth: 100, 'cursor': data.Screening?.count > 0 ? 'pointer' : '', 'color': data.Screening?.count > 0 ? 'blue' : '' }} onClick={(e) => {

                            setCandidates(data.Screening?.candidates);
                            if (data.Screening?.count > 0) {
                              setOpen(true);
                              setJobDetails({
                                status: 'Screening',
                                jobCode: data.job_code,
                                jobTitle: data.job_title
                              });
                            }
                          }}>{data.Screening?.count}</TableCell>


                          <TableCell style={{ border: "1px solid #3b4864", borderTop: 0, borderLeft: 0, minWidth: 100, maxWidth: 100, 'cursor': data.Identified?.count > 0 ? 'pointer' : '', 'color': data.Identified?.count > 0 ? 'blue' : '' }} onClick={(e) => {
                            setCandidates(data.Identified?.candidates);
                            if (data.Identified?.count > 0) {
                              setOpen(true);
                              setJobDetails({
                                status: 'Identified',
                                jobCode: data.job_code,
                                jobTitle: data.job_title
                              });
                            }
                          }}>{data.Identified?.count}</TableCell>

                          <TableCell style={{ border: "1px solid #3b4864", borderTop: 0, borderLeft: 0, minWidth: 100, maxWidth: 100, 'cursor': data.Scheduled?.count > 0 ? 'pointer' : '', 'color': data.Scheduled?.count > 0 ? 'blue' : '' }} onClick={(e) => {
                            setCandidates(data.Scheduled?.candidates);
                            if (data.Scheduled?.count > 0) {
                              setOpen(true);
                              setJobDetails({
                                status: 'Scheduled',
                                jobCode: data.job_code,
                                jobTitle: data.job_title
                              });
                            }
                          }}>{data.Scheduled?.count}</TableCell>

                          <TableCell style={{ border: "1px solid #3b4864", borderTop: 0, borderLeft: 0, minWidth: 100, maxWidth: 100, 'cursor': data.Selected?.count > 0 ? 'pointer' : '', 'color': data.Selected?.count > 0 ? 'blue' : '' }} onClick={(e) => {
                            setCandidates(data.Selected?.candidates);
                            if (data.Selected?.count > 0) {
                              setOpen(true);
                              setJobDetails({
                                status: 'Selected',
                                jobCode: data.job_code,
                                jobTitle: data.job_title
                              });
                            }
                          }}>{data.Selected?.count}</TableCell>

                          <TableCell style={{ border: "1px solid #3b4864", borderTop: 0, borderLeft: 0, minWidth: 100, maxWidth: 100, 'cursor': data.Offered?.count > 0 ? 'pointer' : '', 'color': data.Offered?.count > 0 ? 'blue' : '' }} onClick={(e) => {
                            setCandidates(data.Offered?.candidates);
                            if (data.Offered?.count > 0) {
                              setOpen(true);
                              setJobDetails({
                                status: 'Offered',
                                jobCode: data.job_code,
                                jobTitle: data.job_title
                              });
                            }
                          }}>{data.Offered?.count}</TableCell>

                          <TableCell style={{ border: "1px solid #3b4864", borderTop: 0, borderLeft: 0, minWidth: 100, maxWidth: 100, 'cursor': data.Joined?.count > 0 ? 'pointer' : '', 'color': data.Joined?.count > 0 ? 'blue' : '' }} onClick={(e) => {
                            setCandidates(data.Joined?.candidates);
                            if (data.Joined?.count > 0) {
                              setOpen(true);
                              setJobDetails({
                                status: 'Joined',
                                jobCode: data.job_code,
                                jobTitle: data.job_title
                              });
                            }
                          }}>{data.Joined?.count}</TableCell>

                          {
                            selectedColumns && selectedColumns.map((col) => {
                              let column = columnNames.filter((el) => el.value === col)[0];
                              if (column.label === 'Hiring Manager') {
                                return <TableCell style={{ borderTop: 0, border: "1px solid #3b4864", borderLeft: 0, minWidth: 150, maxWidth: 150 }}>{data[column.value].map((hiringManager) => hiringManager + ',')}</TableCell>
                              } else if (typeof data[column.label] !== 'object') {
                                return <TableCell style={{ borderTop: 0, border: "1px solid #3b4864", borderLeft: 0, minWidth: 150, maxWidth: 150 }}>
                                  {data[column.value]}
                                </TableCell>
                              } else {
                                return <TableCell style={{ borderTop: 0, border: "1px solid #3b4864", borderLeft: 0, minWidth: 150, maxWidth: 150, 'cursor': data[column.label]?.count > 0 ? 'pointer' : '', 'color': data[column.label]?.count > 0 ? 'blue' : '' }} onClick={(e) => {
                                  setCandidates(data[column.label]?.candidates);
                                  if (data[column.label].count > 0) {
                                    setOpen(true);
                                    setJobDetails({
                                      status: column.label,
                                      jobCode: data.job_code,
                                      jobTitle: data.job_title
                                    });
                                  }
                                }}>{data[column.label].count}</TableCell>
                              }
                            })
                          }

                        </TableRow>
                      )
                    }
                  }

                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {showGraph &&
          <>
            <div className='dashboard__graph'>
              <button className='button_reset' onClick={(e) => { setShowGraph(false) }} style={{ marginLeft: '90%', marginTop: '1%' }}>Close</button>
              <BarChart width={900} height={500} data={graphData} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Name" />
                <YAxis dataKey="Candidates" label={{ value: 'Total Candidates', angle: -90, position: 'insideLeft' }} />
                {/* <Legend /> */}
                <Tooltip />
                <Bar dataKey="Candidates" >
                  {graphData.map((entry, index) => (
                    <Cell cursor="pointer" fill={'#82ca9d'} key={`cell-${index}`} onClick={(e) => { setShowGraph1(true); setgraphCurrentRecruiter(index); setShowGraph(false) }} />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </>
        }

        {showGraph1 &&
          <>
            <div className='dashboard__graph'>
              <button className='button_reset' onClick={(e) => { setShowGraph1(false) }} style={{ marginLeft: '90%', marginTop: '1%' }}>Close</button>
              <BarChart width={900} height={500} data={count} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Name" />
                {/* <Legend /> */}
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </div>
          </>
        }

        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          maxWidth='xl'
          scroll={scroll}
        >

          <DialogTitle id="responsive-dialog-title">
            `Status: {jobDetails?.status} <br />
            {jobDetails?.jobCode} - {jobDetails?.jobTitle}`
          </DialogTitle>
          <DialogContent >
            <TableContainer sx={{ maxHeight: 440 }} dividers={scroll === 'paper'}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                <TableRow sx={{
                    "& th": {
                      borderBottom: "2px solid black",
                      fontSize: "0.9rem",
                      color: "white",
                      backgroundColor: "#243c80",
                      borderLeft: "1px solid #3b4864",
                      height: '1px'
                    }
                  }}>

                    {
                      statusFields.filter((el) => el.Status === jobDetails?.status)[0]?.Fields.map((field) => <StyledTableCell>{field.fieldName}</StyledTableCell>)
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidates && candidates.map((data, i) => {
                    return <tr className='candidateList-block__tablBodyRow' key={data.candidate_name}>
                      {statusFields.filter((el) => el.Status === jobDetails?.status)[0]?.Fields.map((field) => {
                        let value;
                        if (!data[field.fieldValue]) {
                          value = 'N/A';
                        } else {
                          if (typeof data[field.fieldValue] === 'object') {
                            if (data[field.fieldValue] instanceof Array && field.fieldValue === 'interviews') {
                              value = data[field.fieldValue].filter((interview) => {
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
                        return <TableCell style={{ border: "1px solid" }}>{moment(value).isValid() && typeof value !== 'number' ? moment(value).utc().format('DD-MM-YYYY') : value}</TableCell>
                      })}
                    </tr >
                  }
                  )}
                </TableBody>
              </Table>
            </TableContainer>

          </DialogContent>
          <DialogActions>

            <Button onClick={handleClose} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>

    </Box>
  )
}

export default Dashboard