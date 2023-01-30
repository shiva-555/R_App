// import { ButtonGroup } from '@mui/material';
// import { padding } from '@mui/system';
import { blue } from '@mui/material/colors';
import React, { useState, useRef, useEffect } from 'react'
import ReactQuill from 'react-quill';
import { useAdmin, EmailRemainder } from '../../helpers/hooks/adminHooks';
import JoditEditor from "jodit-react";
import { Button } from '@mui/material';




const TextEditor = ({ template, templateData, label }) => {

  const [message, setMessage] = useState('');
  const [form, setForm] = useState({});
  const { createEmailRemainder, updateEmailRemainder } = EmailRemainder();
  const { roles } = useAdmin();
  const [roleName, setRoleName] = useState();
  const [otherEmail, setOtherEmail] = useState();
  const [subjectValue, setSubjectValue] = useState();
  const [templateStatus, setTemplateStatus] = useState();
  const editor = useRef(null);
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/,
  }
  useEffect(() => {
    // const getRoles = roles?.data?.data.map(obj1 => [obj1.role, obj1.role_id == template.sent_to]);
    // const temp = getRoles.filter(getRoleName);
    // function getRoleName(getRoles) {
    //   if (getRoles[1] === true) {
    //     setRoleName(getRoles[0]);
    //   }
    // }
    if (!template) {
      // console.log(templateData?.sent_to_others);
      setForm({
        candidateStatusId: templateData?.status,
        roleId: templateData?.role,
        duraiton: templateData?.duration,
        templateType: templateData?.templateType,
      });
    } else {
      setMessage(template.body);
      setOtherEmail(template.sentTo);
      setSubjectValue(template.subject);
      setTemplateStatus(template.status);
    }
  }, [template, templateData]);

  const handleInput = event => {
    setOtherEmail(event.target.value);
  };

  const handleSubject = event => {
    setSubjectValue(event.target.value);
  };

  const handleStatus = event => {
    event.preventDefault();
    console.log(template?.status);
    if (template?.status === 'Active') {
      updateEmailRemainder.mutate({ id: template.templateId, formData: { status: 'InActive' } },
      {
        onSuccess: (data) => {
          alert('success')
        }
      },
      {
        onError: (data) => {
          alert('error')
        }
      });
    } else {
      updateEmailRemainder.mutate({ id: template.templateId, formData: { status: 'Active' } },
      {
        onSuccess: (data) => {
          alert('success')
        }
      },
      {
        onError: (data) => {
          alert('error')
        }
      });
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message) form.body = message;
    if (otherEmail) form.senTo = otherEmail;
    if (subjectValue) form.subject = subjectValue;

    console.log(template);
    console.log(templateData);
    if (!template) {

      if (templateData?.templateType === 'general') {
        createEmailRemainder.mutate(form,
          {
            onSuccess: (data) => {
              alert('success')
            }
          },
          {
            onError: (data) => {
              alert('error')
            }
          }
        );
        console.log('creating General Templte');
      }
      else if (templateData?.templateType === 'isReminder') {
        createEmailRemainder.mutate(form,
          {
            onSuccess: (data) => {
              alert('success')
            }
          },
          {
            onError: (data) => {
              alert('error')
            }
          });

        console.log('creating Reminder Templte');

      }
    } else {
      if (template?.templateType === 'general') {
        updateEmailRemainder.mutate({ id: template.templateId, formData: form },
          {
            onSuccess: (data) => {
              alert('success')
            }
          },
          {
            onError: (data) => {
              alert('error')
            }
          });
        console.log('updating general');
      } else if (template?.templateType === 'isReminder') {
        updateEmailRemainder.mutate({ id: template.templateId, formData: form },
          {
            onSuccess: (data) => {
              alert('success')
            }
          },
          {
            onError: (data) => {
              alert('error')
            }
          });
        console.log('updating reminder');

      }
    }

    if (templateData?.templateType === 'isReminder') {
      alert("Please Set the Duration");
    }
  }


  return (
    <div>
      {
        label === 'Others' &&
        <>
          <p style={{ margin: '1% 0% 0% 0%' }}> To: </p>
          <input className="width" type="text" name="sentTo" defaultValue={template ? template.sentTo : ''} onChange={(e) => handleInput(e)} placeholder="Enter Email Address" style={{ width: '500px', background: 'rgb(252, 255, 102)' }} />
        </>
      }

      <input name="subject" defaultValue={template?.subject} onChange={(e) => handleSubject(e)} style={{ width: '500px' }} placeholder="Enter Subject here" />

      <button name='status' style={{ width: 'auto', padding: '6px 20px', background: 'dodgerblue', color: 'white', border: '1px solid #ddd', cursor: 'pointer' }} onClick={(e) => handleStatus(e)}>{template ? template.status : 'InActive'}</button>
 
      {/* <ReactQuill value={message} onChange={(message) => setMessage(message)} placeholder="Write Something" theme="snow" style={{ background: 'rgb(244, 255, 143)', height: '100% ', margin: '1% 0% 0% 0%' }} /> */}
      <JoditEditor
        ref={editor}
        value={message}
        config={config}
        tabIndex={1}
        onBlur={(e) => setMessage(e)}
      />
      <button className='submitBtn' style={{ margin: '1% 0% 0% 85%' }} onClick={(e) => handleSubmit(e)}>Compose</button>

    </div>
  )
}

export default TextEditor