const express = require('express');
const { 
    getAllUsers, 
    createUser, 
    updateUser, 
    deleteUser, 
    getManagedUsers 
} = require('../controllers/userController');
const { createUserValidation, idValidation } = require('../middleware/validation');
const { permissionGuard } = require('../middleware/permissionGuard'); // BONUS

const router = express.Router();

// POST /users
router.post(
    '/', 
    permissionGuard('CREATE'), // BONUS: Permission Guard
    createUserValidation, 
    createUser
);

// GET /users
router.get(
    '/', 
    permissionGuard('VIEW'), // BONUS: Permission Guard
    getAllUsers
);

// PATCH /users/:id
router.patch(
    '/:id', 
    permissionGuard('EDIT'), // BONUS: Permission Guard
    idValidation, 
    updateUser
);

// DELETE /users/:id
router.delete(
    '/:id', 
    permissionGuard('DELETE'), // BONUS: Permission Guard
    idValidation, 
    deleteUser
);

// GET /users/managed/:id
router.get(
    '/managed/:id', 
    idValidation, 
    getManagedUsers
);

module.exports = router;