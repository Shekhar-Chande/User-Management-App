
import React, { useState } from 'react';

const API_BASE_URL = 'https://user-management-backend-w3b1.onrender.com/users';
// User 1 (ADMIN) has 'EDIT' permission
const AUTH_USER_ID_FOR_EDIT = '1'; 

function EditUserForm({ user, onUserUpdated, onCancel }) {
    // Initialize state with the user's current values
    const [name, setName] = useState(user.name);
    const [roles, setRoles] = useState(user.roles.join(', '));
    const [groups, setGroups] = useState(user.groups.join(', '));
    const [status, setStatus] = useState('');

    const handlePatchSubmit = async (e) => {
        e.preventDefault();
        setStatus('Updating...');

        // Prepare the updates payload
        const updates = {
            name,
            // Convert back to array of strings for the backend
            roles: roles.split(',').map(r => r.trim()).filter(r => r.length > 0),
            groups: groups.split(',').map(g => g.trim()).filter(g => g.length > 0),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${user.id}`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_USER_ID_FOR_EDIT 
                },
                body: JSON.stringify(updates),
            });

            const result = await response.json();

            if (!response.ok) {
                setStatus(`Error: ${result.error || 'Failed to update user.'}`);
                return;
            }

            setStatus(`Success: Updated user ${result.name}`);
            onUserUpdated(); // Notify parent to refresh and close form

        } catch (error) {
            setStatus(`Network error: ${error.message}`);
        }
    };

    return (
        <div style={{ border: '2px solid #007bff', padding: '20px', margin: '20px 0' }}>
            <h3>Edit User ID: {user.id} (Auth ID: {AUTH_USER_ID_FOR_EDIT})</h3>
            <form onSubmit={handlePatchSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Roles (comma-separated):</label>
                    <input type="text" value={roles} onChange={(e) => setRoles(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Groups (comma-separated):</label>
                    <input type="text" value={groups} onChange={(e) => setGroups(e.target.value)} required />
                </div>
                
                <button type="submit">💾 Save Changes</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>❌ Cancel</button>
                <p style={{ color: status.startsWith('Error') ? 'red' : 'green' }}>{status}</p>
            </form>
        </div>
    );
}

export default EditUserForm;
