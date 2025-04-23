import * as sdk from 'node-appwrite';

// Load environment variables
export const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT
} = process.env;

// Initialize Appwrite Client (FIXED: using appwrite.Client)
const client = new sdk.Client();

client
  .setEndpoint(ENDPOINT!) // Ensure ENDPOINT is defined
  .setProject(PROJECT_ID!) // Ensure PROJECT_ID is defined
  .setKey(API_KEY!); // Set API key for server-side access

// Initialize Appwrite Services (FIXED: using appwrite.*)
export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
