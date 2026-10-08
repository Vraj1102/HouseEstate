import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load variables from client/.env
dotenv.config({ path: "client/.env" });

const required = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

for (const name of required) {
  if (!process.env[name]) {
    console.error(`Missing environment variable: ${name}`);
    process.exit(1);
  }
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const content = `import { initializeApp } from "firebase/app";

const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};

export const app = initializeApp(firebaseConfig);
`;

const filePath = path.resolve("client/src/firebase.js");

fs.writeFileSync(filePath, content);

console.log("Firebase configuration generated successfully.");