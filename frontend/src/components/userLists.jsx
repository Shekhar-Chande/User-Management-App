
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import CreateUserForm from '../components/createUserForm';
import EditUserForm from './EditUserForm';

const API_BASE_URL = 'http://localhost:3000/users';

function UserLists() {
    // 💥 Get the dynamic ID from the URL. Assuming the route is something like /users/:userId
    const { userId } = useParams(); 
    
    // 💥 Use the dynamic ID for authentication
    const AUTH_USER_ID = userId || '1'; // Fallback to '1' if userId is undefined
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    
    // For demonstration of the /managed endpoint
    const managerIdToTest = 5; 
    const [managedUsers, setManagedUsers] = useState([]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // GET /users (Now uses dynamic AUTH_USER_ID)
            const response = await fetch(API_BASE_URL, {
                headers: { 'Authorization': AUTH_USER_ID } 
            });
            
            // ... (rest of fetchUsers logic)
            if (response.status === 403) {
                const errBody = await response.json();
                throw new Error(errBody.error);
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    

    const fetchManagedUsers = async () => {
    try {
        // GET /users/managed/:id (Logic handled in backend)
        const response = await fetch(`${API_BASE_URL}/managed/${managerIdToTest}`);
        if (!response.ok) throw new Error('Failed to fetch managed users');
        const data = await response.json();
        setManagedUsers(data);
    } catch (err) {
        console.error("Error fetching managed users:", err);
        setManagedUsers([]);
    }
};

const handleDelete = async (userId) => {
        if (!window.confirm(`Are you sure you want to delete user ID ${userId}?`)) return;

        try {
            // DELETE /users/:id (Requires DELETE permission)
            const response = await fetch(`${API_BASE_URL}/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': AUTH_USER_ID }
            });
            
            if (response.status === 403) {
                const errBody = await response.json();
                alert(errBody.error);
                return;
            }
            if (response.status === 204) {
                fetchUsers(); // Refresh list on success
            } else {
                 throw new Error(`Failed to delete user. Status: ${response.status}`);
            }
        } catch (e) {
            alert(`Error: ${e.message}`);
        }
    };


    useEffect(() => {
        fetchUsers();
        fetchManagedUsers();
    }, [AUTH_USER_ID]); // 💥 ADD AUTH_USER_ID to dependency array to refetch on user change

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1> Users Module CRUD App</h1>
            <p>
                **Dynamic Auth ID:** `{AUTH_USER_ID}` is used for permissions based on the URL. 
            </p>
            
            {/* Pass the dynamic ID to the creation form */}
            <CreateUserForm onUserCreated={fetchUsers} currentUserId={AUTH_USER_ID} /> 

            {/* ... (rest of the component) */}

   {editingUser && (
                <EditUserForm 
                    user={editingUser} 
                    onUserUpdated={() => {
                        fetchUsers(); // Refresh list
                        setEditingUser(null); // Close form
                    }}
                    onCancel={() => setEditingUser(null)} 
                />
            )}

            <h2>User List (GET /users)</h2>
            {error && <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</div>}


            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.roles.join(', ')}</td>
                            <td>{user.groups.join(', ')}</td>
                            <td style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => setEditingUser(user)}>✏️ Edit</button>
                                <button onClick={() => handleDelete(user.id)} style={{ color: 'red' }}>🗑️ Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* ... (Managed Users section) */}
        </div>
    );
}

export default UserLists;


// import CreateUserForm from '../components/createUserForm';
// import EditUserForm from './EditUserForm';

// const API_BASE_URL = 'http://localhost:3000/users';
// // User 1 (ADMIN) for the primary actions (VIEW, DELETE)
// const AUTH_USER_ID = '1'; 

// function UserList() {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [editingUser, setEditingUser] = useState(null);
    
//     // For demonstration of the /managed endpoint
//     const managerIdToTest = 5; 
//     const [managedUsers, setManagedUsers] = useState([]);

//     const fetchUsers = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             // GET /users (Requires VIEW permission)
//             const response = await fetch(API_BASE_URL, {
//                 headers: { 'Authorization': AUTH_USER_ID } 
//             });
            
//             if (response.status === 403) {
//                 const errBody = await response.json();
//                 throw new Error(errBody.error);
//             }
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             setUsers(data);
//         } catch (e) {
//             setError(e.message);
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     const fetchManagedUsers = async () => {
//         try {
//             // GET /users/managed/:id (Logic handled in backend)
//             const response = await fetch(`${API_BASE_URL}/managed/${managerIdToTest}`);
//             if (!response.ok) throw new Error('Failed to fetch managed users');
//             const data = await response.json();
//             setManagedUsers(data);
//         } catch (err) {
//             console.error("Error fetching managed users:", err);
//             setManagedUsers([]);
//         }
//     };

//     const handleDelete = async (userId) => {
//         if (!window.confirm(`Are you sure you want to delete user ID ${userId}?`)) return;

//         try {
//             // DELETE /users/:id (Requires DELETE permission)
//             const response = await fetch(`${API_BASE_URL}/${userId}`, {
//                 method: 'DELETE',
//                 headers: { 'Authorization': AUTH_USER_ID }
//             });
            
//             if (response.status === 403) {
//                 const errBody = await response.json();
//                 alert(errBody.error);
//                 return;
//             }
//             if (response.status === 204) {
//                 fetchUsers(); // Refresh list on success
//             } else {
//                  throw new Error(`Failed to delete user. Status: ${response.status}`);
//             }
//         } catch (e) {
//             alert(`Error: ${e.message}`);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//         fetchManagedUsers();
//     }, []);

//     if (loading) return <div>Loading...</div>;

//     return (
//         <div style={{ padding: '20px' }}>
//             <h1>MERN Users Module CRUD App</h1>
//             <p>
//                 **Admin Auth ID:** `{AUTH_USER_ID}` is used for **VIEW, CREATE, EDIT, DELETE** permissions. 
//                 If you change this ID to `6` (Viewer), all actions except viewing will fail.
//             </p>
            
//             <CreateUserForm onUserCreated={fetchUsers} currentUserId={AUTH_USER_ID} />

//             {/* Render the Edit Form if a user is selected */}
//             {editingUser && (
//                 <EditUserForm 
//                     user={editingUser} 
//                     onUserUpdated={() => {
//                         fetchUsers(); // Refresh list
//                         setEditingUser(null); // Close form
//                     }}
//                     onCancel={() => setEditingUser(null)} 
//                 />
//             )}

//             <h2>User List (GET /users)</h2>
//             {error && <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</div>}
            
//             <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
//                 <thead>
//                     <tr style={{ backgroundColor: '#f2f2f2' }}>
//                         <th>ID</th>
//                         <th>Name</th>
//                         <th>Roles</th>
//                         <th>Groups</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map(user => (
//                         <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
//                             <td>{user.id}</td>
//                             <td>{user.name}</td>
//                             <td>{user.roles.join(', ')}</td>
//                             <td>{user.groups.join(', ')}</td>
//                             <td style={{ display: 'flex', gap: '5px' }}>
//                                 <button onClick={() => setEditingUser(user)}>✏️ Edit</button>
//                                 <button onClick={() => handleDelete(user.id)} style={{ color: 'red' }}>🗑️ Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
            
//             <hr style={{ margin: '30px 0' }}/>

//             {/* Demonstration of GET /users/managed/:id */}
//             <h2>Managed Users (GET /users/managed/{managerIdToTest})</h2>
//             <p>User ID `{managerIdToTest}` (Martines Polok - ADMIN in GROUP_1) manages users in GROUP_1.</p>
//             <ul>
//                 {managedUsers.length > 0 ? (
//                     managedUsers.map(user => (
//                         <li key={user.id}>{user.name} (ID: {user.id}, Groups: {user.groups.join(', ')})</li>
//                     ))
//                 ) : (
//                     <li>No users managed or manager is not an ADMIN.</li>
//                 )}
//             </ul>
//         </div>
//     );
// }

// export default UserList;