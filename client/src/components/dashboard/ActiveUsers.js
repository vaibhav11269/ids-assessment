import React, { useContext, useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { config } from '../../config/config';

const ActiveUsers = () => {
    const { user } = useContext(UserContext);
    const [activeUsers, setActiveUsers] = useState({
        daily: 0,
        weekly: 0,
        monthly: 0,
    });
    useEffect(() => {
        console.log("users", user)
        fetchActiveUsers();
    }, []);
    const fetchActiveUsers = async () => {
        let curToken = user.token
        let headers = {
            "Content-Type": "application/json",
            "applicationType": "web",
            "authorization": "Bearer " + user.token
        }
        axios.get(config.apiEndpoint + "users/active-users-count", { headers: headers })
            .then(response => {
                let data = response.data;
                setActiveUsers({
                    daily: data.daily,
                    weekly: data.weekly,
                    monthly: data.monthly
                })
            })
            .catch(error => {
                console.error('Error fetching active users data:', error);
            })
    };
    return (
        <div className='w-full'>
            <h2 className='text-center mb-8'>Active Users Count</h2>
            <div className="flex flex-col md:flex-row justify-around items-center gap-y-8">
                <Card className='w-[20vw] text-center rounded-lg'>
                    <Card.Body className='bg-[#ffe6e6] rounded-lg'>
                        <Card.Title>Daily</Card.Title>
                        <Card.Text>{activeUsers.daily}</Card.Text>
                    </Card.Body>
                </Card>
                <Card className='w-[20vw] text-center rounded-lg'>
                    <Card.Body className='bg-[#ffe6e6] rounded-lg'>
                        <Card.Title>Weekly</Card.Title>
                        <Card.Text>{activeUsers.weekly}</Card.Text>
                    </Card.Body>
                </Card>
                <Card className='w-[20vw] text-center rounded-lg'>
                    <Card.Body className='bg-[#ffe6e6] rounded-lg'>
                        <Card.Title>Monthly</Card.Title>
                        <Card.Text>{activeUsers.monthly}</Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default ActiveUsers
