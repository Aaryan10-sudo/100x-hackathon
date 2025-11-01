const authorize = (roles = []) => {
  // roles param can be a single role string (e.g. 'Admin') 
  // or an array of roles (e.g. ['Admin', 'User'])
  if (typeof roles === 'string') {
    roles = [roles];
  }
    return [
    (req, res, next) => {
      // Check if user has any of the required roles
      const userRole = req.user?.role;
      if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }
      next();
    }
  ];
};
module.exports = authorize;