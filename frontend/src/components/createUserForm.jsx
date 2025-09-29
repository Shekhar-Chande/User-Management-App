import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:3000/users';

function CreateUserForm({ onUserCreated, currentUserId }) { 
    const [name, setName] = useState('');
    const [roles, setRoles] = useState('PERSONAL'); // Default to a valid role
    const [groups, setGroups] = useState('GROUP_1'); // Default to a valid group
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Creating...');

        const rolesArray = roles.split(',').map(r => r.trim()).filter(r => r.length > 0);
        const groupsArray = groups.split(',').map(g => g.trim()).filter(g => g.length > 0);

        const newUser = { name, roles: rolesArray, groups: groupsArray };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // *** DYNAMIC CHANGE: Using currentUserId from props ***
                    'Authorization': currentUserId 
                },
                body: JSON.stringify(newUser),
            });

            const result = await response.json();

            if (!response.ok) {
                // Catches DTO validation errors (400) or Permission Guard failure (403)
                setStatus(`Error (Auth ID ${currentUserId}): ${result.error || 'Failed to create user.'}`);
                return;
            }

            setStatus(`Success: Created user ${result.name} (ID: ${result.id})`);
            
            setName('');
            setRoles('PERSONAL');
            setGroups('GROUP_1');
            onUserCreated(); // Refresh user list

        } catch (error) {
            setStatus(`Network error: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid green', padding: '15px', marginBottom: '20px' }}>
            {/* Displaying the dynamic Auth ID */}
            <h3>Create New User (Auth ID: {currentUserId})</h3> 
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} 
                       placeholder="Name (Max 100)" required />
                <input type="text" value={roles} onChange={(e) => setRoles(e.target.value)} 
                       placeholder="Roles (e.g., PERSONAL, ADMIN)" required />
                <input type="text" value={groups} onChange={(e) => setGroups(e.target.value)} 
                       placeholder="Groups (e.g., GROUP_1, GROUP_2)" required />
            </div>
            <button type="submit">➕ Create User</button>
            <p style={{ color: status.startsWith('Error') ? 'red' : 'green' }}>{status}</p>
        </form>
    );
}
export default CreateUserForm;
