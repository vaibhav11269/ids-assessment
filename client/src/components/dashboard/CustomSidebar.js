import React, { useContext } from 'react'
import { Col, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import UserContext from '../../context/UserContext'

const CustomSidebar = ({ section, setSection }) => {
    const { user } = useContext(UserContext);
    const handleSectionClick = (value) => {
        console.log("values", value);
        setSection(value);
    }
    return (
        <Col md={2} className="bg-light sidebar md:min-h-[90vh] p-0">
            {user?.is_admin ?
                <div className='flex sm:flex-row md:flex-col gap-4'>
                    <div name="activeUsers" className={`text-lg font-semibold text-center p-2 hover:bg-gray-300 rounded cursor-pointer ${section === "activeUsers" ? "bg-gray-300" : ""}`} onClick={() => handleSectionClick("activeUsers")}>Active Users</div>
                    <div name="topUsers" className={`text-lg font-semibold text-center p-2 hover:bg-gray-300 rounded cursor-pointer ${section === "topUsers" ? "bg-gray-300" : ""}`} onClick={() => handleSectionClick("topUsers")}>Top Users</div>
                    <div name="allUsers" className={`text-lg font-semibold text-center p-2 hover:bg-gray-300 rounded cursor-pointer ${section === "allUsers" ? "bg-gray-300" : ""}`} onClick={() => handleSectionClick("allUsers")}>All Users</div>
                </div>
                : <div className='flex flex-col gap-4'>
                    <div name="userActivity" className={`text-lg font-semibold text-center py-2 hover:bg-gray-300 rounded cursor-pointer ${section === "userActivity" ? "bg-gray-300" : ""}`} onClick={() => handleSectionClick("userActivity")}>Your Activity</div>
                </div>}
        </Col>
    )
}

export default CustomSidebar
