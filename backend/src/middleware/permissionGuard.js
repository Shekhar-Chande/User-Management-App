const { dataStore, ROLE_CONFIGS } = require('../data/initialData');

const permissionGuard = (requiredPermission) => {
    return (req, res, next) => {
        // User ID is identified from the Authorization header
        const userIdHeader = req.header('Authorization');
        const userId = parseInt(userIdHeader, 10);

        if (isNaN(userId)) {
            return res.status(401).json({ error: 'Authorization header (User ID) is missing or invalid.' });
        }

        const user = dataStore.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // 1. Collect all unique permissions the user has
        const userPermissions = new Set();
        user.roles.forEach(roleCode => {
            const config = ROLE_CONFIGS.find(rc => rc.code === roleCode);
            if (config) {
                config.permissions.forEach(p => userPermissions.add(p));
            }
        });

        // 2. Check if the required permission is present
        if (userPermissions.has(requiredPermission)) {
            next();
        } else {
            // ❌ Not Allowed Request
            return res.status(403).json({ 
                error: 'ERROR: Not allowed to perform action due to insufficient permissions.' 
            });
        }
    };
};

module.exports = {
    permissionGuard
};