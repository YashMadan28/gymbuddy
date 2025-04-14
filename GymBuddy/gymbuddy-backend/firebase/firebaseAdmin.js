const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.join(__dirname, '../AKY/gymbuddy-d7838-firebase-admins.json')); 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
};

module.exports = { verifyToken };