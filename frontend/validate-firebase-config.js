// Firebase Config Validator
const config = {
  apiKey: "AIzaSyD8luutSgOGuJ_wZ4XbhNvo8x600Sn7tmU",
  authDomain: "acadamy-a1ba9.firebaseapp.com",
  projectId: "acadamy-a1ba9",
  storageBucket: "acadamy-a1ba9.appspot.com",
  messagingSenderId: "291398983947",
  appId: "1:291398983947:web:3394de61bb67c71aef820e",
  measurementId: "G-TWN6R2DSTQ"
};

console.log("Validating Firebase configuration:");
console.log("- API Key:", config.apiKey ? "Valid " : "Missing ");
console.log("- Auth Domain:", config.authDomain ? "Valid " : "Missing ");
console.log("- Project ID:", config.projectId ? "Valid " : "Missing ");
console.log("- Storage Bucket:", config.storageBucket ? "Valid " : "Missing ");
console.log("- Messaging Sender ID:", config.messagingSenderId ? "Valid " : "Missing ");
console.log("- App ID:", config.appId ? "Valid " : "Missing ");
console.log("- Measurement ID:", config.measurementId ? "Valid " : "Missing ");

// Validate format of values
console.log("\nValidating format:");
console.log("- API Key format:", /^AIza[0-9A-Za-z_-]{35}$/.test(config.apiKey) ? "Valid " : "Invalid format ");
console.log("- Auth Domain format:", /^[a-z0-9-]+\.firebaseapp\.com$/.test(config.authDomain) ? "Valid " : "Invalid format ");
console.log("- Project ID format:", /^[a-z0-9-]+$/.test(config.projectId) ? "Valid " : "Invalid format ");
console.log("- Storage Bucket format:", /^[a-z0-9-]+\.appspot\.com$/.test(config.storageBucket) ? "Valid " : "Invalid format ");
console.log("- App ID format:", /^1:[0-9]+:web:[a-f0-9]+$/.test(config.appId) ? "Valid " : "Invalid format ");
