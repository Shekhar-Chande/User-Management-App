const GROUPS = ["GROUP_1", "GROUP_2"];
const ROLES = ["ADMIN", "PERSONAL", "VIEWER"]; // Includes VIEWER for BONUS
const PERMISSIONS = ["CREATE", "VIEW", "EDIT", "DELETE"];

// Modified Roles for BONUS
const ROLE_CONFIGS = [
  { name: "Admin", code: "ADMIN", permissions: ["CREATE", "VIEW", "EDIT", "DELETE"] },
  { name: "Personal", code: "PERSONAL", permissions: [] },
  { name: "Viewer", code: "VIEWER", permissions: ["VIEW"] }
];

// In-Memory Data Store
let users = [
  { id: 1, name: "John Doe", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
  { id: 2, name: "Grabriel Monroe", roles: ["PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
  { id: 3, name: "Alex Xavier", roles: ["PERSONAL"], groups: ["GROUP_2"] },
  { id: 4, name: "Jarvis Khan", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_2"] },
  { id: 5, name: "Martines Polok", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1"] },
  { id: 6, name: "Gabriela Wozniak", roles: ["VIEWER", "PERSONAL"], groups: ["GROUP_1"] }
];

let nextUserId = users.length + 1;

const dataStore = {
    getUsers: () => users,
    getUserById: (id) => users.find(u => u.id === id),
    
    addUser: (user) => {
        const newUser = { id: nextUserId++, ...user };
        users.push(newUser);
        return newUser;
    },
    
    updateUser: (id, updates) => {
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return null;
        
        // Prevent changing the ID
        delete updates.id; 
        
        users[index] = { ...users[index], ...updates };
        return users[index];
    },
    
    deleteUser: (id) => {
        const initialLength = users.length;
        users = users.filter(u => u.id !== id);
        return users.length !== initialLength; // true if deleted
    },
    
    getManagedUsers: (managerId) => {
        const manager = dataStore.getUserById(managerId);
        
        // Check if the manager exists AND has the ADMIN role
        if (!manager || !manager.roles.includes('ADMIN')) {
            return [];
        }

        const managerGroups = new Set(manager.groups);
        
        // Find users who share at least one group with the manager
        const managedUsers = users.filter(user => {
            if (user.id === managerId) return false; // Cannot manage self

            // Check for common group
            return user.groups.some(group => managerGroups.has(group));
        });

        return managedUsers;
    }
};

module.exports = {
    GROUPS,
    ROLES,
    ROLE_CONFIGS,
    dataStore
};