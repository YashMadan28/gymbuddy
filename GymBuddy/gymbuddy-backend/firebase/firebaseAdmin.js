import { initializeApp, credential as _credential, storage, auth } from 'firebase-admin';
import { join } from 'path';
const serviceAccount = require(join(__dirname, '../AKY/gymbuddy-d7838-firebase-admins.json')); 

initializeApp({
    credential: _credential.cert(serviceAccount),
    storageBucket: "gymbuddy-d7838.firebasestorage.app"
});

const bucket = storage().bucket();

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decodedToken = await auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
};

export default { verifyToken };