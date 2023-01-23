// import React, {useState} from 'react';
// import './Users.css';
// import {useMsal} from '@azure/msal-react';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import AddUser from '../../components/AddUser/AddUser';
// import {useQuery} from 'react-query';
// import { getAllTenantUsers, getAllGuestUsers, getAllAppUsers } from '../../backendApis';
// import SpinLoader from '../../components/SpinLoader/SpinLoader';
// import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

// const Users = () => {
//     const {instance, accounts} = useMsal();
//     const [user, setUser] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [search, setSearch] = useState({});
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [tab, setTab] = useState('Org');

//     const {data: users, isLoading, refetch} = useQuery('fetchTenantUsers' , () => getAllTenantUsers({instance, accounts, ...search}), {retry: false, enabled: tab === 'Org', 
//     onError: (err) => {
//         alert(err);
//     },
//     refetchOnWindowFocus: false
//     });

//     const {data: guestUsers, isLoading: guestLoading, refetch: refetchGuest} = useQuery('fetchGuestUsers', () => getAllGuestUsers({instance, accounts, ...search}), {retry: false, enabled: tab === 'Guest', 
//     onError: (err) => {
//         alert(err);
//     },
//     refetchOnWindowFocus: false
//     })

//     const {data: appUsers, isLoading: appLoading, refetch: refetchApp} = useQuery('fetchAppUsers', () => getAllAppUsers({instance, accounts, ...search}), {retry: false, enabled: tab === 'App', 
//     onError: (err) => {
//         alert(err);
//     },
//     refetchOnWindowFocus: false
//     })

//     if(isLoading || guestLoading || appLoading) {
//         return <SpinLoader />
//     }
//     console.log(appUsers?.data?.map((a) => a.roleAssignments[0].role.roleName));
//   return (
//     <div className='users-block'>
//         {isModalOpen && <AddUser setIsModalOpen={setIsModalOpen} user={user} editMode={editMode} setEditMode={setEditMode} />}
//         <div className='users-block__tabCont'>
//             <ul className='users-block__tab'>
//                 <li className='users-block__tabItem' style={{'borderBottom': tab === 'Org' ? '1px solid black' : ''}} onClick={(e) => {setSearch({}); setTab('Org')}}>Orginazation Users</li>
//                 <li className='users-block__tabItem' style={{'borderBottom': tab === 'Guest' ? '1px solid black' : ''}} onClick={(e) => {setSearch({}); setTab('Guest')}}>Guest Users</li>
//                 <li className='users-block__tabItem' style={{'borderBottom': tab === 'App' ? '1px solid black' : ''}} onClick={(e) => {setSearch({}); setTab('App')}}>App Users</li>
//             </ul>
//         </div>
//         {
//             tab === 'Org' && 
//             <>
//                 <div className='users-block__searchContainer'>
//                     <p>Search According to email</p>
//                     <div>
//                         <input type="text" name='email' onChange={(e) => setSearch({[e.target.name]: e.target.value})}/>
//                         <button className='users-block__searchbtn' onClick={()=> refetch()}>Search</button>
//                     </div>
//                 </div>
//                 <div className='users-block__tableContainer'>
//                     <table className='users-block__table'>
//                         <thead className='users-block__tableHead'>
//                             <tr className='users-block__tableHeadRow'>
//                                 <th className='users-block__tableHeadElem' >Name</th>
//                                 <th className='users-block__tableHeadElem' >Email</th>
//                                 <th className='users-block__tableHeadElem'></th>
//                             </tr>
//                         </thead>
//                         <tbody className='users-block__tableBody'>
//                             {users?.data && users.data.map((user) => 
//                             <tr className='users-block__tableBodyRow'>
//                                     <td className='users-block__tableBodyElem'>{user.displayName}</td>
//                                     <td className='users-block__tableBodyElem'>{user.mail}</td>
//                                     <td className='users-block__tableBodyElem'>
//                                         <AddCircleOutlineIcon className='users-block__icon' onClick={(e) => {
//                                             setUser(user);
//                                             setIsModalOpen(true);
//                                         }} />
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </>
//         }

//         {
//             tab === 'Guest' && 
//             <>
//                 <div className='users-block__searchContainer'>
//                     <p>Search According to email</p>
//                     <div>
//                         <input type="text" name='email' onChange={(e) => setSearch({[e.target.name]: e.target.value})}/>
//                         <button className='users-block__searchbtn' onClick={()=> refetchGuest()}>Search</button>
//                     </div>
//                 </div>
//                 <div className='users-block__tableContainer'>
//                     <table className='users-block__table'>
//                         <thead className='users-block__tableHead'>
//                             <tr className='users-block__tableHeadRow'>
//                                 <th className='users-block__tableHeadElem' style={{'text-align': 'left', 'width': '30%'}}>Name</th>
//                                 <th className='users-block__tableHeadElem' style={{'text-align': 'left', 'width': '60%'}}>Email</th>
//                                 <th className='users-block__tableHeadElem' style={{'width': '30px', 'text-align': 'right'}}></th>
//                             </tr>
//                         </thead>
//                         <tbody className='users-block__tableBody'>
//                             {guestUsers?.data && guestUsers.data.map((user) => 
//                             <tr className='users-block__tableBodyRow'>
//                                     <td className='users-block__tableBodyElem' style={{'text-align': 'left', 'width': '30%'}}>{user.displayName}</td>
//                                     <td className='users-block__tableBodyElem' style={{'text-align': 'left', 'width': '60%'}}>{user.mail}</td>
//                                     <td className='users-block__tableBodyElem' style={{'width': '30px', 'text-align': 'right'}}>
//                                         <AddCircleOutlineIcon className='users-block__icon' onClick={(e) => {
//                                             setUser(user);
//                                             setIsModalOpen(true);
//                                         }} />
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </>
//         }

//         {
//             tab === 'App' && 
//             <>
//                 <div className='users-block__searchContainer'>
//                     <p>Search According to email</p>
//                     <div>
//                         <input type="text" name='email' onChange={(e) => setSearch({[e.target.name]: e.target.value})}/>
//                         <button className='users-block__searchbtn' onClick={()=> refetchApp()}>Search</button>
//                     </div>
//                 </div>
//                 <div className='users-block__tableContainer'>
//                     <table className='users-block__table'>
//                         <thead className='users-block__tableHead'>
//                             <tr className='users-block__tableHeadRow'>
//                                 <th className='users-block__tableHeadElem' >Name</th>
//                                 <th className='users-block__tableHeadElem' >Email</th>
//                                 <th className='users-block__tableHeadElem' >Role</th>
//                                 <th className='users-block__tableHeadElem' ></th>
//                             </tr>
//                         </thead>
//                         <tbody className='users-block__tableBody'>
//                             {appUsers?.data && appUsers.data.map((user) => 
//                             <tr className='users-block__tableBodyRow'>
//                                 <td className='users-block__tableBodyElem'>{user.displayName}</td>
//                                 <td className='users-block__tableBodyElem'>{user.email}</td>
//                                 <td className='users-block__tableBodyElem'>{user?.roleAssignments.map((role, i, arr) => arr.length - 1 !== i ? role.role.roleName + ',' : role.role.roleName)}</td>
//                                 <td className='users-block__tableBodyElem'><ModeEditOutlineOutlinedIcon className='users-block__icon' onClick={(e) => {
//                                     setUser(user);
//                                     setIsModalOpen(true);
//                                     setEditMode(true);
//                                 }} /></td>
//                             </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </>
//         }

//     </div>
//   )
// }

// export default Users;


import React, { useState } from 'react';
// import './Users.css';
import { useMsal } from '@azure/msal-react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddUser from '../../components/AddUser/AddUser';
import { useQuery } from 'react-query';
import { getAllTenantUsers, getAllGuestUsers, getAllAppUsers } from '../../backendApis';
import { useUsers } from '../../helpers/hooks/userHooks';

import SpinLoader from '../../components/SpinLoader/SpinLoader';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Box from '@mui/material/Box';
import { Button, Card, CardContent, Dialog, DialogContent, Grid, TableCell, TextField, Typography } from '@mui/material';
import { lightGreen } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';


const Users = () => {

    const [tab, setValue] = useState('Org');
    const { instance, accounts } = useMsal();
    const [user, setUser] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [search, setSearch] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [open, setOpen] = useState();



    const { data: users, isLoading, refetch } = useQuery('fetchTenantUsers', () => getAllTenantUsers({ instance, accounts, ...search }), {
        retry: false, enabled: tab === 'Org',
        onError: (err) => {
            alert(err);
        },
        refetchOnWindowFocus: false
    });

    const { data: guestUsers, isLoading: guestLoading, refetch: refetchGuest } = useQuery('fetchGuestUsers', () => getAllGuestUsers({ instance, accounts, ...search }), {
        retry: false, enabled: tab === 'Guest',
        onError: (err) => {
            alert(err);
        },
        refetchOnWindowFocus: false
    })

    const { data: appUsers, isLoading: appLoading, refetch: refetchApp } = useQuery('fetchAppUsers', () => getAllAppUsers({ instance, accounts, ...search }), {
        retry: false, enabled: tab === 'App',
        onError: (err) => {
            alert(err);
        },
        refetchOnWindowFocus: false
    })


    if (isLoading || guestLoading || appLoading) {
        return <SpinLoader />
    }


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>
            {isModalOpen && <AddUser setIsModalOpen={setIsModalOpen} user={user} isModalOpen={isModalOpen} editMode={editMode} setEditMode={setEditMode} />}
            <Box m={20} sx={{ width: 1200, height: 100, bgcolor: 'background.paper' }}>
                <div style={{ margin: '20px' }}>
                    <Button variant="contained" sx={{ borderRadius: 3, width: '320px' }}
                        onClick={(e) => { setValue('Org') }}> Orginazation Users </Button>
                    <Button variant="contained" sx={{ borderRadius: 3, width: '320px' }} style={{ marginLeft: '20px' }}
                        onClick={(e) => { setValue('Guest') }}> Guest Users </Button>
                    <Button variant="contained" sx={{ borderRadius: 3, width: '320px' }} style={{ marginLeft: '20px' }} onClick={(e) => { setValue('App') }}> App Users </Button>
                </div>
                {(tab === 'Org') &&
                    <>
                        <Box>
                            <h3 style={{ marginLeft: '20px' }}>Search According to email</h3>
                            <TextField sx={{ marginLeft: '30px', marginTop: '10px' }}
                                type='email'
                                name="email"
                                size='small'
                                onChange={(e) => setSearch({ [e.target.name]: e.target.value })}
                            />
                            <Button variant="contained" sx={{ borderRadius: 3, width: '120px', height: 40, marginTop: '10px' }} style={{ padding: "10px", marginBottom: '20px', marginLeft: '20px' }} onClick={() => refetch()}>Search</Button>
                        </Box>
                        <div style={{ height: 'auto' }}>
                            <Paper>
                                <Box m={1} sx={{ overflow: 'hidden' }}>
                                    <TableContainer sx={{ marginTop: 4, maxHeight: 900, height: 600 }}>
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
                                                    <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Name</TableCell>
                                                    <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Email</TableCell>
                                                    <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Edit</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {users?.data && users.data.map((user, i) => {
                                                    return (<TableRow>
                                                        <TableCell> {user.displayName}</TableCell>
                                                        <TableCell> {user.mail}</TableCell>
                                                        <TableCell>
                                                            <AddCircleOutlineIcon onClick={(e) => {
                                                                setUser(user);
                                                                setIsModalOpen(true);
                                                                setEditMode(true)
                                                            }} />
                                                        </TableCell>
                                                    </TableRow>)
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Paper>
                        </div>
                    </>
                }

                {(tab == 'Guest') &&

                    <>
                        <Box>
                            <h3 style={{ marginLeft: '20px' }}>Search According to email</h3>
                            <TextField sx={{ marginLeft: '30px', marginTop: '10px' }}
                                type='email'
                                name="email"
                                size='small'
                                onChange={(e) => setSearch({ [e.target.name]: e.target.value })}
                            />
                            <Button variant="contained" sx={{ borderRadius: 3, width: '120px', height: 40, marginTop: '10px' }} style={{ padding: "10px", marginBottom: '20px', marginLeft: '20px' }} onClick={() => refetch()}>Search</Button>
                        </Box>
                        <div style={{ height: 'auto' }}>
                            <Paper>
                                <Box m={1} sx={{ overflow: 'hidden' }}>
                                    <TableContainer sx={{ marginTop: 4, maxHeight: 900, height: 600 }}>
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
                                                    <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Name</TableCell>
                                                    <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Email</TableCell>
                                                    <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Edit</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {guestUsers?.data && guestUsers.data.map((user) => {
                                                    return (<TableRow>
                                                        <TableCell>{user.displayName}</TableCell>
                                                        <TableCell>{user.mail}</TableCell>
                                                        <TableCell>
                                                            <AddCircleOutlineIcon onClick={(e) => {
                                                                setUser(user);
                                                                setIsModalOpen(true);
                                                                setEditMode(true)
                                                            }} />

                                                        </TableCell>
                                                    </TableRow>)
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Paper>
                        </div>
                    </>
                }
                {(tab == 'App') &&
                    <>
                        <Box>
                            <h3 style={{ marginLeft: '20px' }}>Search According to email</h3>
                            <TextField sx={{ marginLeft: '30px', marginTop: '10px' }}
                                type='email'
                                name="email"
                                size='small'
                                onChange={(e) => setSearch({ [e.target.name]: e.target.value })}
                            />
                            <Button variant="contained" sx={{ borderRadius: 3, width: '120px', height: 40, marginTop: '10px' }} style={{ padding: "10px", marginBottom: '20px', marginLeft: '20px' }} onClick={() => refetch()}>Search</Button>
                        </Box>
                        <div style={{ height: 'auto' }}>
                            <Paper>
                                <Box m={1} sx={{ overflow: 'hidden' }}>
                                    <TableContainer sx={{ marginTop: 4, maxHeight: 900, height: 600 }}>
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
                                                    <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Name</TableCell>
                                                    <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Email</TableCell>
                                                    <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Role</TableCell>
                                                    <TableCell style={{ fontWeight: 700, fontSize: "18px" }}>Edit</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {appUsers?.data && appUsers.data.map((user) => {

                                                    return (<TableRow>
                                                        <TableCell> {user.displayName}</TableCell>
                                                        <TableCell> {user.email}</TableCell>
                                                        <TableCell> {user?.roleAssignments.map((role, i, arr) => arr.length - 1 !== i ? role.role.roleName + ',' : role.role.roleName)}</TableCell>
                                                        <TableCell>

                                                            <AddCircleOutlineIcon onClick={(e) => {
                                                                setUser(user);
                                                                setIsModalOpen(true);
                                                                setEditMode(true)
                                                            }} />
                                                        </TableCell>
                                                    </TableRow>)
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Paper>
                        </div>
                    </>

                }

            </Box>

        </>
    )
}

export default Users;