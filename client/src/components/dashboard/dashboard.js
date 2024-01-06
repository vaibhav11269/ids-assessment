import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CustomNavbar from './CustomNavbar.js';
import CustomSidebar from './CustomSidebar.js';
import UserContext from '../../context/UserContext.js';
import ActiveUsers from './ActiveUsers.js';
import TopUsers from './TopUsers.js';
import UserActivity from './UserActivity.js';
import AllUsers from './AllUesrs.js';
import UploadCsv from './UploadFile.js';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [section, setSection] = useState("");

    useEffect(() => {
        if (user.is_admin) setSection("activeUsers");
        else setSection("userActivity");
    }, [])


    return (
        <div>
            <CustomNavbar />
            <Container fluid>
                <Row>
                    <CustomSidebar section={section} setSection={setSection} />
                    <Col md={10} className="ml-sm-auto">
                        <main className='flex flex-col justify-center items-center my-4'>
                            {section === "activeUsers" ?
                                <ActiveUsers />
                                : section === "topUsers" ?
                                    <TopUsers />
                                    : section === "userActivity" ?
                                        <UserActivity />
                                        : section === "allUsers" ?
                                            <AllUsers />
                                            : section === "dataUpload" ?
                                                <UploadCsv />
                                                : <></>
                            }
                        </main>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
