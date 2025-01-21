const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "your-firebase-app-id.appspot.com", // Your Firebase storage bucket
});

const bucket = admin.storage().bucket();
module.exports = bucket;
