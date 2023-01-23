// import React, { useState, useContext } from 'react';
// import './AddUser.css';
// import { useMsal } from '@azure/msal-react';
// import CloseIcon from '@mui/icons-material/Close';
// import { useMutation, useQueryClient } from 'react-query';
// import { createAppUser, updateAppUser } from '../../backendApis';
// import SpinLoader from '../SpinLoader/SpinLoader';
// import { useAdmin } from '../../helpers/hooks/adminHooks';
// import { UserContext } from '../Routes/Routes';
// import Dialog from '@mui/material/Dialog';
// import DialogContent from '@mui/material/DialogContent';
// import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';
// import { Select, RadioGroup, Radio, InputLabel, MenuItem, FormControlLabel } from '@mui/material';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import { padding } from '@mui/system';




// const AddUser = ({ setIsModalOpen, user, editMode, setEditMode }) => {
//   const value = useContext(UserContext);
//   const { instance, accounts } = useMsal();
//   const [form, setForm] = useState({});
//   const [open, setOpen] = useState();
//   const queryClient = useQueryClient();
//   const { roles } = useAdmin(value.data.role);

//   const { mutate, isLoading } = useMutation('createAppUser', createAppUser, {
//     retry: false, onSuccess: () => {
//       queryClient.invalidateQueries('fetchTenantUsers');
//     },
//     onError: (err) => {
//       alert(err);
//     },
//   });

//   const { mutate: updateUser, isLoading: updateLoading } = useMutation('updateAppUser', updateAppUser, {
//     retry: false, onSuccess: () => {
//       queryClient.invalidateQueries('fetchAppUsers');
//     }, onError: (err) => {
//       alert(err);
//     }
//   });
//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   if (isLoading || updateLoading) {
//     return <SpinLoader />
//   }

//   const handleChange = (e) => {
//     if (editMode) {
//       setForm({
//         ...form,
//         [e.target.name]: e.target.value
//       });
//     } else {
//       setForm({
//         ...form,
//         user_id: user.id,
//         display_name: user.displayName,
//         email: user.mail,
//         [e.target.name]: e.target.value
//       });
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (editMode) {
//       updateUser({ instance, accounts, formData: form, id: user.user_id });
//     } else {
//       mutate({ instance, accounts, formData: form });
//     }
//     setIsModalOpen(false);
//     setEditMode(false);
//   }

//   return (
//     <>
//     <div className='addUser-block' >
//         <div className='overlay'>
//             <form action="" className='addUser-block__form'   onSubmit={(e) => handleSubmit(e)}>
//             <CloseIcon  onClick={() => {
//               setIsModalOpen(false);
//               setEditMode(false);
//               }}/>
//                 <InputLabel >Display Name</InputLabel>
//                 <TextField id="display_name" value={user.displayName} readOnly> Job Title</TextField>
//                 <InputLabel >Email</InputLabel>
//                 <TextField id="email" type="text" size='' value={user.mail} readOnly />
//                 <InputLabel >Role</InputLabel>
//                 <Select  name="role" id="role" defaultValue={user.role} onChange={(e) => handleChange(e)} required>
//                 <MenuItem key="" value=""></MenuItem>
//                     {
//                       roles?.data && roles.data.data.map((role) => <MenuItem key={role.role_id} value={role.role_id}>{role.role}</MenuItem> )
//                     }
//                 </Select>
//                 <input className='addUser-block__submit' type="submit" value={editMode ? 'Update' : 'Add User'} />
//             </form>
//         </div>
//     </div>


//     </>
//   )
// }

// export default AddUser;




import React, { useState, useContext } from 'react';
import './AddUser.css';
import { useMsal } from '@azure/msal-react';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQueryClient } from 'react-query';
import { createAppUser, updateAppUser } from '../../backendApis';
import SpinLoader from '../SpinLoader/SpinLoader';
import { useAdmin } from '../../helpers/hooks/adminHooks';
import { UserContext } from '../Routes/Routes';
import { Button, Card, CardContent, Dialog, DialogContent, Grid, TableCell, TextField, Typography, Box, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { Form } from 'react-router-dom';


const AddUser = ({ setIsModalOpen, user, editMode, setEditMode, isModalOpen }) => {

  setIsModalOpen(true);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const value = useContext(UserContext);
  const { instance, accounts } = useMsal();
  const [form, setForm] = useState({});
  const queryClient = useQueryClient();
  const { roles } = useAdmin(value?.data?.role);

  const { mutate, isLoading } = useMutation('createAppUser', createAppUser, {
    retry: false, onSuccess: () => {
      queryClient.invalidateQueries('fetchTenantUsers');
    },
    onError: (err) => {
      alert(err);
    },
  });

  const { mutate: updateUser, isLoading: updateLoading } = useMutation('updateAppUser', updateAppUser, {
    retry: false, onSuccess: () => {
      queryClient.invalidateQueries('fetchAppUsers');
    }, onError: (err) => {
      alert(err);
    }
  });

  if (isLoading || updateLoading) {
    return <SpinLoader />
  }

  const handleChange = (e) => {

    if (editMode) {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
    } else {
      setForm({
        ...form,
        id: user.id,
        displayName: user.displayName,
        mail: user.mail,
        [e.target.name]: e.target.value
      });
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(form);
    if (editMode) {
      updateUser({ instance, accounts, formData: form, id: user.id });
    } else {
      mutate({ instance, accounts, formData: form });
    }
    setIsModalOpen(false);
    setEditMode(false);
  }

  console.log(user?.roleAssignments[0]?.role?.roleName)
  return (

    <Dialog
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "500%",
            maxWidth: "1200px",
            height: '10'
          },
        },
      }}
      open={isModalOpen}

      onClose={handleClose}>
      <DialogContent>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Box>

            <h3 sx={{ marginTop: "80px" }}>Display Name</h3>  <TextField sx={{ marginTop: '-10px', marginLeft: '250px', width: '750px' }} variant='filled' value={user.displayName ? user.displayName : user.displayName} readOnly></TextField>
            <h3 style={{ marginTop: '9px', marginBottom: '500', marginLeft: '30px' }}>Email</h3>
            <TextField size='sm' sx={{ marginTop: '1px', marginLeft: '250px', width: '750px' }} variant='filled' value={user.mail ? user.mail : user.email} readOnly></TextField>

            <FormControl sx={{ width: '750px', marginLeft: '250px', marginTop: '35px' }}>
              <InputLabel>Role</InputLabel>
              <Select
                name='role'
                id="role"
                value={user?.roleAssignments[0]?.role?.roleName}
                onChange={(e) => handleChange(e)}
              >
                {
                  roles?.data && roles.data.data.map((role) => <MenuItem key={role.roleId} value={role.roleId}>{role.roleName}</MenuItem>)
                }
              </Select>
            </FormControl>
            <Button style={{ textAlign: "center" }} variant="contained" sx={{
              borderRadius: 3, width: 600, height: 40,
              color: 'primary', marginLeft: '250px', marginTop: '20px'
            }} type='submit' name='userAdd' value={editMode ? 'Update' : 'Add User'} >AddUser</Button>

            <Button size="small" sx={{ ml: '270px', marginBottom: '0.85px', marginLeft: '1000px', width: 100, marginTop: '10px' }}
              endIcon={<CloseIcon />} variant="contained" color="primary" type='button' onClick={() => {
                setIsModalOpen(false);
                setEditMode(false);
              }} >Close</Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>

  )
}

export default AddUser;