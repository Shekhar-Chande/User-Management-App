const { GROUPS, ROLES } = require('../data/initialData');

const createUserValidation = (req, res, next) => {
  const { name, roles, groups } = req.body;

  // 1. name validation
  if (!name || typeof name !== 'string' || name.length > 100) {
    return res.status(400).json({ error: 'Name is required, must be a string, and max 100 characters.' });
  }

  // 2. roles validation
  if (!Array.isArray(roles) || roles.length === 0 || !roles.every(r => ROLES.includes(r))) {
    return res.status(400).json({ error: 'Roles are required, must have at least one, and only contain predefined roles.' });
  }

  // 3. groups validation
  if (!Array.isArray(groups) || groups.length === 0 || !groups.every(g => GROUPS.includes(g))) {
    return res.status(400).json({ error: 'Groups are required, must have at least one, and only contain predefined groups.' });
  }

  next();
};

const idValidation = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid user ID provided.' });
    }
    req.targetUserId = id; // Attach ID to the request object
    next();
};

module.exports = {
    createUserValidation,
    idValidation
};