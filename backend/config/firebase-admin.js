import admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';

// Because ES imports are hoisted, we must explicitly load dotenv here before Firebase initializes
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') }); // Try backend/.env
dotenv.config({ path: path.join(__dirname, '../../.env') }); // Try root .env

// Check if credentials are provided in env vars. Since Firebase requires a JSON structure, 
// we typically pass the service account JSON as a stringified env variable, or use google application default credentials.
let serviceAccount;
try {
    // If the user appended raw JSON to the path-based GOOGLE_APPLICATION_CREDENTIALS variable
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_APPLICATION_CREDENTIALS.trim().startsWith('{')) {
        serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        // Delete the env var so Firebase does not attempt to read the raw JSON string as a literal file path
        delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    }
} catch (error) {
    console.error("Failed to parse Service Account JSON variables", error);
}

// Initialize Admin SDK
if (!admin.apps.length) {
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin SDK initialized with custom service account JSON.');
    } else {
        // Fallback to Application Default Credentials
        // This works automatically on GKE if workload identity is configured.
        admin.initializeApp();
        console.warn('Firebase Admin SDK initialized using Application Default Credentials. Warning: if running locally without export GOOGLE_APPLICATION_CREDENTIALS, this may fail on protected routes.');
    }
}

export const db = admin.apps.length ? admin.firestore() : null;
export default admin;
