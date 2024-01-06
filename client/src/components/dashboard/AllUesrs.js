import React, { useContext, useEffect, useState } from 'react'
import { OverlayTrigger, Popover, Table, Form } from 'react-bootstrap';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { config } from '../../config/config';
import filter from "../../images/filter.svg"
import { enqueueSnackbar } from 'notistack';

const AllUsers = () => {
    const { user } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        gender: '',
        country: '',
        device: '',
    });
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        console.log("users", users)
        fetchAllUsers();
    }, []);
    const fetchAllUsers = async () => {
        let headers = {
            "Content-Type": "application/json",
            "applicationType": "web",
            "authorization": "Bearer " + user.token
        }
        axios.get(config.apiEndpoint + "users/all", { headers: headers })
            .then(response => {
                setUsers(response.data.users);
            })
            .catch(error => {
                console.error('Error fetching active users data:', error);
            })
    };
    const applyFilters = (flag) => {
        if (!filters.gender && !filters.country && !filters.device && flag) {
            enqueueSnackbar("Choose atleast one parameter", { variant: "error" });
            return;
        }
        let headers = {
            "Content-Type": "application/json",
            "applicationType": "web",
            "authorization": "Bearer " + user.token
        }
        axios.post(config.apiEndpoint + "users/filterUsers", filters, { headers: headers })
            .then(response => {
                setUsers(response.data.users);
                setFilters({
                    gender: '',
                    country: '',
                    device: '',
                })
            })
            .catch(error => {
                console.error('Error fetching active users data:', error);
            })
        setIsPopoverOpen(false);
    };

    const FilterPopover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3" className='text-center'>Filter</Popover.Header>
            <Popover.Body>
                <Form>
                    <Form.Group controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                            as="select"
                            value={filters.gender}
                            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                        >
                            <option value="">All</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter country"
                            value={filters.country}
                            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group controlId="device">
                        <Form.Label>Device</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter device"
                            value={filters.device}
                            onChange={(e) => setFilters({ ...filters, device: e.target.value })}
                        />
                    </Form.Group>
                </Form>
                <div className='flex justify-between'>
                    <button className='bg-gray-600 text-white px-2 py-1 mt-4 rounded-lg'
                        onClick={() => applyFilters(false)}>
                        Reset
                    </button>
                    <button className='bg-gray-600 text-white p-1 mt-4 rounded-lg'
                        onClick={() => applyFilters(true)}>
                        Apply Filters
                    </button>
                </div>
            </Popover.Body>
        </Popover>
    );
    return (
        <div className='w-full'>
            <h2 className='text-center'>Users</h2>
            <div className="flex justify-end mb-2 ">
                <OverlayTrigger trigger="click" placement="bottom"
                    overlay={FilterPopover} show={isPopoverOpen}
                    onToggle={(show) => setIsPopoverOpen(show)} rootClose={true} >
                    <img src={filter} alt='' className='w-8 h-8' />
                </OverlayTrigger>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Country</th>
                        <th>Device</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map((user, i) => (
                        <tr key={user._id}>
                            <td>{i + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.gender}</td>
                            <td>{user.country}</td>
                            <td>{user.device}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default AllUsers
