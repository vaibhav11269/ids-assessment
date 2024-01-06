import React, { useContext, useEffect } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { config } from '../../config/config';
import { enqueueSnackbar } from 'notistack';

const CustomNavbar = () => {
    const user = useContext(UserContext);
    useEffect(() => {
        console.log("user", user)
    }, [])
    const handleLogout = () => {
        localStorage.clear();
        user.updateLoggedInUser({});
        updateLogoutTime();
    }
    const updateLogoutTime = () => {
        let headers = {
            "Content-Type": "application/json",
            "applicationType": "web",
            "authorization": "Bearer " + user.user.token
        }
        axios.put(config.apiEndpoint + "auth/logoutTime", {}, { headers: headers })
            .then(response => {
                enqueueSnackbar(response?.data?.message, { variant: "success" });
            })
            .catch(error => {
                enqueueSnackbar(error?.response?.data?.error, { variant: "error" })
            })
    }
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard">
                    {user?.user?.is_admin ? "Admin Dashboard":"Dashboard"}
                </Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link as={Link} to="/" onClick={handleLogout}>
                        Logout
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default CustomNavbar
