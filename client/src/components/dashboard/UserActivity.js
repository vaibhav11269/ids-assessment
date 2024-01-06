import React, { useContext, useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { config } from '../../config/config';

const UserActivity = () => {
    const { user } = useContext(UserContext);
    const [topUsers, setTopUsers] = useState([]);
    useEffect(() => {
        console.log("users", user)
        userActivity();
    }, []);
    const userActivity = async () => {
        let headers = {
            "Content-Type": "application/json",
            "applicationType": "web",
            "authorization": "Bearer " + user.token
        }
        axios.get(config.apiEndpoint + "users/users-activity", { headers: headers })
            .then(response => {
                setTopUsers(response.data.formattedUserActivities);
            })
            .catch(error => {
                console.error('Error fetching active users data:', error);
            })
    };
    const formatUsageTime = (milliseconds) => {
        if (!milliseconds) return "";
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        return formattedTime;
    };
    return (
        <div className='w-full'>
            <h2 className='text-center mb-8'>Top Users</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Login Time</th>
                        <th>Logout Time</th>
                        <th>Usage Time</th>
                    </tr>
                </thead>
                <tbody>
                    {topUsers && topUsers.map((user, i) => (
                        <tr key={user.id}>
                            <td>{i + 1}</td>
                            <td>{user.loginTime}</td>
                            <td>{user.logoutTime}</td>
                            <td>{user.logoutTime? formatUsageTime(user.usageTime):"Session still active"}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default UserActivity
