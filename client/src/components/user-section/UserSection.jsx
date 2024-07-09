import { useEffect, useState } from "react";
import Pagination from "../pagination/Pagination";
import Search from "../search/Search";
import UserList from "./user-list/UserList";
import UserAdd from "./user-add/UserAdd";
import UserDetails from "./user-details/UserDetails";

const baseUrl = "http://localhost:3030/jsonstore"

export default function UserSection() {
    const [users, setUsers] = useState([]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(null)

    useEffect(() => {
        (async function getUsers() {
            try {
                const response = await fetch(`${baseUrl}/users`);
                const result = await response.json();
                const data = Object.values(result);

                setUsers(data)
            }

            catch (error){
                alert(error.message)
            }

        })();
    }, [])

    const addUserClickHandler = () => {
        setShowAddUser(true)
    }

    const addUserCloseHandler = () => {
        setShowAddUser(false)
    }

    const addUserSaveHandler = async (e) => {
        e.preventDefault()
        
        const formData = new FormData(e.currentTarget)
        const userData = {
            ...Object.fromEntries(formData),
            createAt: new Date.toISOString(),
            updateAt: new Date.toISOString(),
        };

        const response = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const createdUser = await response.json();
        setUsers(oldUsers => [...oldUsers, createdUser]);
        setShowAddUser(false)
    }


    const userDetailsClickHandler = (userId) => {
        setShowUserDetails(userId);
    }

    return (
        <section className="card users-container">
        
            <Search />
    
            <UserList 
                users={users}
                onUserDetailsClick={userDetailsClickHandler}
            />

            {showAddUser && (
                <UserAdd 
                    onClose={addUserCloseHandler}
                    onSave={addUserSaveHandler}
                />
            )}

            {showUserDetails && (
                <UserDetails 
                    user={users.find(user => user._id === showUserDetails)}
                    onClose={() => setShowUserDetails(null)}
                />
            )}
    
            <button className="btn-add btn" onClick={addUserClickHandler}>Add new user</button>
            
            <Pagination />

        </section>
    );
}