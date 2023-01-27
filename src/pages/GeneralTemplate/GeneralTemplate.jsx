import React, { useState, useRef, useEffect } from 'react'
import './GeneralTemplate.css'
import { useMetaData } from '../../helpers/hooks/metaDataHooks';
import { useAdmin, EmailRemainder } from '../../helpers/hooks/adminHooks';
import 'react-quill/dist/quill.snow.css';
import Select from '../../components/Select/Select';
import TextEditor from '../../components/TextEditor/TextEditor';
import { border, color, width } from '@mui/system';



function GeneralTemplate() {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [duration, setDuration] = useState(null);
  const status = useRef();
  const { candidateStatuses } = useMetaData();
  const { useGetGeneralTemplate } = EmailRemainder();
  const emailTemplates = useGetGeneralTemplate(selectedStatus);
  const { roles } = useAdmin();
  const [columnNames, setColumnNames] = useState(null);
  // const columnNames = roles?.data?.data.map((role) => ({ label: role.role, value: role.role_id }));
  const [selectedColumns, setSelectedColumns] = useState([]);
  // const t = getEmailRemainder?.data?.data?.map(getEmailRemainder => getEmailRemainder.sent_to = selectedColumns.map(selectedColumns => selectedColumns.value))[0];


  useEffect(() => {
    if (roles?.data) {
      let temp = roles?.data?.data.map((role) => ({ label: role.roleName, value: role.roleId }));
      if (temp) {
        temp.push({ label: 'Others', value: '' });
        setColumnNames(temp);
      }
    }

    if (emailTemplates.data) {
      if (columnNames) {
        let arr = columnNames?.filter((column) => emailTemplates?.data?.data.some((template) => template.roleId === column.value));
        // console.log(arr);
        if (arr) {
          setSelectedColumns(arr)
        }
        // setSelectedColumns((prev) =>  [...prev, arr.length > 0 && arr])
      }
    }

  }, [JSON.stringify(emailTemplates?.data?.data), status?.current?.value]);

  const selectChange = (e) => {
    setSelectedStatus(status.current.value)
  }

  return (
    <>
      <div className='template-block'>
        <div className="row-1">
        <div className="row1-inline"
                //  ref={templateForm} onSubmit={(e) => handleSubmit(e)}
                >
                  <div className="select-status">
                    <select ref={status} onChange={(e) => selectChange(e)} id='select_status'>
                      <option value="">Select Status</option>
                      {candidateStatuses?.data && candidateStatuses.data.data.map((status) =>
                        <option name="status" key={status.metaDataId} value={status.metaDataId}>{status.displayText.status}</option>
                      )}
                    </select>
                  </div>
                  <div className='select_col'>
                    <Select
                      options={columnNames}
                      selectedColumns={selectedColumns}
                      setSelectedColumns={setSelectedColumns}
                    />
                  </div>
          </div>
          <div className='row2-inline'>
            <div className='textArea'>
              {/* {
                                t.map((template) =>
                                        <TextEditor 
                                        template={template} 
                                        />
                                        // <>
                                        //     <span></span>
                                        // </>
                                    )} */}
              {
                selectedColumns && selectedColumns.map((column) => {
                  // console.log(duration)
                  // let template = emailTemplates?.data?.data.filter((template) => template.sent_to === column.value);
                  if (emailTemplates?.data?.data) {
                    let template;
                    if (column.value) {
                      template = emailTemplates?.data?.data.filter((template) => template.roleId === column.value);
                    } else {
                      template = emailTemplates?.data?.data.filter((template) => template.roleId === null);
                    }

                    if (template?.length > 0) {
                      return (
                        <>
                          <h2>{column.label}</h2>
                          <TextEditor template={template[0]}/>
                        </>
                      )
                    }
                    else {
                      if (column) {
                        let data = {
                          status: selectedStatus,
                          role: column?.value ? column.value : null,
                          templateType: 'general'
                        }
                        return (
                          <>
                            <h3 style={{ margin: '1% 0% 0% 0%' }}>{column?.label}</h3>
                            <TextEditor templateData={data} label={column?.label} />
                          </>
                        )
                      }
                    }
                  }
                })
              }
            </div>

            <div className='placeholders'>
                        <label style={{ fontSize: '14px' }}>Placeholders</label>
                        <table style={{ marginTop: '10px', border: "1px solid", width: 'auto', fontSize: '14px', background: 'rgb(252, 255, 102)' }}>


                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Name</td>
                                <td style={{ border: "1px solid" }}>{`{candidateName}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Email</td>
                                <td style={{ border: "1px solid" }}>{`{candidateEmail}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Designation</td>
                                <td style={{ border: "1px solid" }}>{`{jobTitle}`}</td>
                            </tr>


                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate offer  Date</td>
                                <td style={{ border: "1px solid" }}>{`{offerDate}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Joining Date</td>
                                <td style={{ border: "1px solid" }}>{`{joiningDate}`}</td>
                            </tr>


                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Selected/ Rejected Date</td>
                                <td style={{ border: "1px solid" }}>{`{selectedRejectedDate}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Onboarding Candidate Designation</td>
                                <td style={{ border: "1px solid" }}>{`{joiningDetails.offeredDesgination}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Reporting Manager</td>
                                <td style={{ border: "1px solid" }}>{`{reportingManager}}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Tentative DOJ</td>
                                <td style={{ border: "1px solid" }}>{`{tentativeDateOfJoining}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Recruiter</td>
                                <td style={{ border: "1px solid" }}>{`{}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Department</td>
                                <td style={{ border: "1px solid" }}>{`{joiningDetails.department}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Cost Center</td>
                                <td style={{ border: "1px solid" }}>{`{joiningDetails.costCenter}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Division</td>
                                <td style={{ border: "1px solid" }}>{`{joiningDetails.division}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Device</td>
                                <td style={{ border: "1px solid" }}>{`{joiningDetails.device}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Simcard</td>
                                <td style={{ border: "1px solid" }}>{`{joiningDetails.simcard}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Ceipal Access</td>
                                <td style={{ border: "1px solid" }}>{`{joiningDetails.ceipalAccess}`}</td>
                            </tr>

                            <tr style={{ border: "1px solid" }}>
                                <td style={{ border: "1px solid" }}>Candidate Zoom Access</td>
                                <td style={{ border: "1px solid" }}>{`{joiningDetails.zoomAccess}`}</td>
                            </tr>

                        </table>
                    </div>
          </div>

        </div >
      </div >
    </>
  )
}

export default GeneralTemplate