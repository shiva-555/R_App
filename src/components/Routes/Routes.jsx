import React from 'react';
import { useIsAuthenticated } from "@azure/msal-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoutes from '../ProtectedRoutes/ProtectedRoutes';
import Navbar from '../Navbar/Navbar';
import Header from '../Header/Header';
import Login from '../../pages/Login/Login';
import Home from '../../pages/Home/Home';
import Candidates from '../../pages/Candidates/Candidates';
import Candidate from '../../pages/Candidate/Candidate';
import ShceduleInterview from '../../pages/ScheduleInterview/ScheduleInterview';
import Users from '../../pages/Users/Users';
import JobRequisition from '../../pages/JobRequisition/JobRequisition';
import Dashboard from '../../pages/Dashboard/Dashboard';
import SpinLoader from '../SpinLoader/SpinLoader';
import { useUsers } from '../../helpers/hooks/userHooks';
import Remainder from '../../pages/Remainder/Remainder';
import GeneralTemplate from '../../pages/GeneralTemplate/GeneralTemplate';
import Referal from '../../pages/Referral/Referral';

export const UserContext = React.createContext('');

const AppRoutes = () => {
    const isAuthenticated = useIsAuthenticated();
    const { user } = useUsers();
    const role = window.localStorage.getItem('role');

    if (user.isLoading) {
        return <SpinLoader />
    }

    document.body.style.zoom = "80%";

    return (
        <UserContext.Provider value={user.data}>
            <Router>
                {isAuthenticated &&
                    <>
                        <Navbar />
                        <Header />
                    </>
                }
                <Routes>

                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}>
                        <Route path="/" element={<Home />} isAuthorized={true} />


                        {(window.localStorage.getItem('role') === 'HR' || window.localStorage.getItem('role') === 'Recruiter' || window.localStorage.getItem('role') === 'TA Manager' || window.localStorage.getItem('role') === 'Admin' || window.localStorage.getItem('role') === 'HR Manager') &&

                            <>
                                <Route path="/candidates" element={<Candidates />} isAuthorized={true} />
                                <Route path="/candidate/:id" element={<Candidate />} isAuthorized={true} />
                                <Route path='/candidate/:candidate_id/interview' element={<ShceduleInterview />} />
                                {/* <Route path='/candidate/:id' element={<CandidateDisplay />} /> */}
                                {/* <Route path="/interviews" element={<Interviews />}/> */}
                                <Route path='/jobRequisition' element={<JobRequisition />} />
                                {role !== 'HR' &&
                                    <>
                                        <Route path='/dashboard' element={<Dashboard />} />
                                    </>
                                }

                                {/* {(window.localStorage.getItem('role') === 'TA Manager' || window.localStorage.getItem('role') === 'Admin' || window.localStorage.getItem('role') === 'HR Manager') &&

                                    <> */}
                                        <Route path='/admin/users' element={<Users />} />
                                        <Route path='admin/remainder' element={<Remainder />} />
                                        <Route path='admin/templates' element={<GeneralTemplate />} />
                                    {/* </>
                                } */}
                            </>
                        }

                        <Route path='*' element={<Home />} />
                        <Route path="/referral" element={<Referal />} isAuthorized={true} />
                    </Route>

                </Routes>
            </Router>
        </UserContext.Provider>
    )
}

export default AppRoutes;