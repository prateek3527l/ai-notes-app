const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Format: "Bearer TOKEN"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // attach user id to request
    next(); // ✅ allow request to continue
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
