const { dataStore } = require('../data/initialData');

// GET /users (VIEW)
exports.getAllUsers = (req, res) => {
  const users = dataStore.getUsers();
  res.status(200).json(users);
};

// POST /users (CREATE)
exports.createUser = (req, res) => {
  // Validation handled by middleware
  const newUser = dataStore.addUser(req.body);
  res.status(201).json(newUser);
};

// PATCH /users/:id (EDIT)
exports.updateUser = (req, res) => {
  const userId = req.targetUserId; // from idValidation middleware
  const updates = req.body;
  
  const updatedUser = dataStore.updateUser(userId, updates);
  
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found.' });
  }
  
  res.status(200).json(updatedUser);
};

// DELETE /users/:id (DELETE)
exports.deleteUser = (req, res) => {
  const userId = req.targetUserId; // from idValidation middleware
  const wasDeleted = dataStore.deleteUser(userId);
  
  if (!wasDeleted) {
    return res.status(404).json({ error: 'User not found.' });
  }
  
  res.status(204).send(); // 204 No Content
};

// GET /users/managed/:id (Custom Endpoint)
exports.getManagedUsers = (req, res) => {
    const managerId = req.targetUserId; // from idValidation middleware
    
    const manager = dataStore.getUserById(managerId);
    if (!manager) {
        return res.status(404).json({ error: 'Manager user not found.' });
    }
    
    const managedUsers = dataStore.getManagedUsers(managerId);
    
    res.status(200).json(managedUsers);
};