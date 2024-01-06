import { useState } from "react";
import UserContext from "./UserContext";

const UserState = (props) => {
    const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {});
    const updateLoggedInUser = (newUser) => {
        setUser(newUser);
    }
    return (
        <UserContext.Provider value={{ user, updateLoggedInUser }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserState;