import React, {useContext, useState, useEffect} from 'react';
import './Home.css';
import moment from 'moment';
import { UserContext } from '../../components/Routes/Routes';
import SpinLoader from '../../components/SpinLoader/SpinLoader';
import { useJobs } from './../../helpers/hooks/jobsHooks';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';

function SimpleDialog(props) {
  const { onClose, selectedValue, open, roles } = props;

  const handleClose = () => {
    if (!selectedValue) alert('First Select Any Role to continue.');
    else onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select A Role To Continue</DialogTitle>
      <List sx={{ pt: 0 }}>
        {roles.map((role) => (
          <ListItem button onClick={() => handleListItemClick(role.roleName)} key={role.roleName}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={role.roleName} />
          </ListItem>
        ))}

        <ListItem autoFocus button onClick={() => handleListItemClick('selectRole')}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Proceed with this role." />
        </ListItem>
      </List>
    </Dialog>
  );
}

export function SimpleDialogDemo({ roles, setIsRoleSelected }) {
  const [open, setOpen] = React.useState(true);
  const [selectedValue, setSelectedValue] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    window.localStorage.setItem('role', value);
    setIsRoleSelected(true);
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        roles={roles}
      />
    </div>
  );
}

const Home = () => {
  const [greeting, setGreeting] = useState('');
  const [description, setDescription] = useState('');
  const value = useContext(UserContext);
  const { jobs } = useJobs();

  const user = value?.data;
  console.log(user);
  const [isRoleSelected, setIsRoleSelected] = useState(window.localStorage.getItem('role')); 
  let roles;

  // if ((!user.data && window.localStorage.getItem('user') !== null)) user.data = JSON.parse(window.localStorage.getItem('user'));

  if ((user.roleAssignments && user.roleAssignments.length > 0)) {
    roles = user.roleAssignments.map((assignment) => assignment.role);
  }

  useEffect(() => {
    const currentHour = moment().format("HH");
  
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreeting("Good Afternoon");
    }   else if (currentHour >= 17 && currentHour < 22) {
      setGreeting("Good Evening");
    } else if (currentHour >= 22 && currentHour < 5) {
      setGreeting("Good Night");
    } else {
      setGreeting("Hello")
    }
  }, []);

  if (jobs.isLoading) {
    return <SpinLoader />
  }

  return (
    <>
      {
        !isRoleSelected ? <SimpleDialogDemo roles={roles} setIsRoleSelected={setIsRoleSelected} /> :
        <div className='home-block' style={{margin:"60px"}}>
        <div className='home-block__container'>
          <h1 className='home-block__greeting'>{greeting} - {value.data.display_name}</h1>
          <div className='home-block__profile'>
            <p className='home-block__header'>Profile</p>
            <div className='home-block__name'>
              <p className='home-block__holder'>Name</p>
              <p className='home-block__input'>{value.data.display_name}</p>
            </div>
            <div className='home-block__email'>
              <p className='home-block__holder'>Email</p>
              <p className='home-block__input'>{value.data.email}</p>
            </div>  
          </div>
        </div>
      </div>
      }
    </>
  )
}

export default Home;